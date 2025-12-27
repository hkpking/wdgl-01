/**
 * @file knowledge-graph.js
 * @description 知识图谱可视化组件 - 类似流放之路2的天赋盘
 * @version 1.0.0
 * @author LCTMR Team
 */

import { learningProgress } from '../services/learning-progress.js';

/**
 * 知识节点类
 */
class KnowledgeNode {
    constructor(config) {
        this.id = config.id;
        this.title = config.title;
        this.description = config.description;
        this.type = config.type || 'normal'; // normal, major, start, test
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.radius = this.getRadius();
        this.dependencies = config.dependencies || []; // 前置节点ID数组
        this.dependencyLogic = config.dependencyLogic || 'AND'; // AND | OR | CUSTOM
        this.minDependencies = config.minDependencies || null; // 至少需要完成的依赖数量
        this.status = 'locked'; // locked, unlocked, completed
        this.blockId = config.blockId; // 关联的学习内容块ID
        this.points = config.points || 10; // 完成后获得的积分
        this.color = this.getColor();
        this.alternativePaths = config.alternativePaths || []; // 可选的依赖路径组
    }

    getRadius() {
        switch (this.type) {
            case 'start': return 40;
            case 'major': return 35;
            case 'test': return 30;
            default: return 25;
        }
    }

    getColor() {
        switch (this.type) {
            case 'start': return '#10b981'; // 绿色
            case 'major': return '#f59e0b'; // 橙色
            case 'test': return '#8b5cf6'; // 紫色
            default: return '#3b82f6'; // 蓝色
        }
    }

    isUnlockable(completedNodes) {
        // 如果是起始节点，直接可以解锁
        if (this.type === 'start' || this.dependencies.length === 0) {
            return true;
        }

        // 支持多种解锁逻辑
        switch (this.dependencyLogic) {
            case 'OR':
                // 只要完成任意一个依赖即可解锁
                return this.dependencies.some(depId => completedNodes.has(depId));
            
            case 'CUSTOM':
                // 需要完成指定数量的依赖
                if (this.minDependencies !== null) {
                    const completedCount = this.dependencies.filter(depId => 
                        completedNodes.has(depId)
                    ).length;
                    return completedCount >= this.minDependencies;
                }
                // 如果没有指定最小数量，回退到AND逻辑
                return this.dependencies.every(depId => completedNodes.has(depId));
            
            case 'PATHS':
                // 支持多条可选路径，完成任意一条路径即可
                if (this.alternativePaths.length > 0) {
                    return this.alternativePaths.some(path => {
                        return path.every(depId => completedNodes.has(depId));
                    });
                }
                // 如果没有定义路径，回退到AND逻辑
                return this.dependencies.every(depId => completedNodes.has(depId));
            
            case 'AND':
            default:
                // 默认：需要完成所有依赖
                return this.dependencies.every(depId => completedNodes.has(depId));
        }
    }

    /**
     * 获取解锁提示信息
     */
    getUnlockHint(completedNodes) {
        if (this.status === 'completed') {
            return '已完成';
        }
        if (this.status === 'unlocked') {
            return '可以学习';
        }

        // 根据解锁逻辑提供不同的提示
        switch (this.dependencyLogic) {
            case 'OR': {
                const remaining = this.dependencies.filter(depId => !completedNodes.has(depId));
                return `需要完成以下任意一个：${remaining.length}个未完成`;
            }
            case 'CUSTOM': {
                const completedCount = this.dependencies.filter(depId => 
                    completedNodes.has(depId)
                ).length;
                const required = this.minDependencies || this.dependencies.length;
                return `需要完成${required}个前置条件（已完成${completedCount}个）`;
            }
            case 'PATHS': {
                return `需要完成其中一条学习路径`;
            }
            case 'AND':
            default: {
                const remaining = this.dependencies.filter(depId => !completedNodes.has(depId));
                return `需要完成所有前置条件（还有${remaining.length}个）`;
            }
        }
    }
}

/**
 * 知识图谱管理器
 */
export class KnowledgeGraphManager {
    constructor(options = {}) {
        this.config = {
            width: 1200,
            height: 800,
            minZoom: 0.5,
            maxZoom: 2,
            nodeSpacing: 150,
            snapToGrid: true,
            gridSize: 20,
            avoidCrossing: true,        // 启用避免交叉
            useBezierPath: true,        // 使用贝塞尔曲线
            edgeBundling: true,         // 启用边捆绑
            routingPadding: 30,         // 路由填充距离
            useForceLayout: true,       // 启用力导向布局
            forceStrength: 0.5,         // 力的强度
            repulsionStrength: 3000,    // 节点排斥力
            attractionStrength: 0.01,   // 连线吸引力
            crossingPenalty: 100,       // 交叉惩罚
            maxIterations: 500,         // 最大迭代次数
            ...options
        };

        this.state = {
            nodes: new Map(),
            edges: [],
            completedNodes: new Set(),
            unlockedNodes: new Set(),
            selectedNode: null,
            selectedEdge: null,
            hoveredEdge: null,
            camera: {
                x: 0,
                y: 0,
                zoom: 1
            },
            isDragging: false,
            dragStart: { x: 0, y: 0 },
            isDraggingNode: false,
            draggingNode: null,
            dragOffset: { x: 0, y: 0 },
            isInitialized: false,
            layoutMode: 'view', // 'view' | 'edit'
            edgeEditMode: false, // 边编辑模式
            connectingFrom: null, // 连线起点
            tempEdgeTo: null // 临时连线终点
        };

        // 编辑历史记录
        this.editHistory = {
            past: [],
            future: []
        };

        this.canvas = null;
        this.ctx = null;
        this.container = null;
        this.animationFrame = null;

    }

    /**
     * 初始化知识图谱
     */
    async initialize(container, graphData) {
        try {
            this.container = container;
            
            // 创建Canvas
            this.createCanvas();
            
            // 加载图谱数据
            this.loadGraphData(graphData);
            
            // 尝试加载保存的自定义布局
            this.currentGraphType = graphData.metadata?.id || 'default';
            const hasCustomLayout = this.loadLayout(this.currentGraphType);
            
            // 加载学习进度
            await this.loadProgress();
            
            // 绑定事件
            this.bindEvents();
            
            // 开始渲染循环
            this.startRenderLoop();
            
            // 居中显示起始节点
            this.centerOnStartNode();
            
            this.state.isInitialized = true;
            this.updateStats();
            
            return true;
        } catch (error) {
            console.error('初始化知识图谱失败:', error);
            return false;
        }
    }

    /**
     * 创建Canvas元素
     */
    createCanvas() {
        const wrapper = document.createElement('div');
        wrapper.className = 'knowledge-graph-wrapper';
        wrapper.innerHTML = `
            <!-- 顶部统计信息 -->
            <div class="graph-stats" id="graphStats">
                <div style="display: flex; gap: 20px; align-items: center;">
                    <span>节点数: <strong id="nodeCount">0</strong></span>
                    <span>连线数: <strong id="edgeCount">0</strong></span>
                    <span>状态: <strong id="graphStatus">就绪</strong></span>
                </div>
            </div>
            
            <!-- 主要内容区域 -->
            <div class="graph-main-content">
                <!-- 组件面板 -->
                <div class="component-panel">
                    <h3>组件工具</h3>
                    <div class="component-tools">
                        <div class="component-item" data-type="node" draggable="true">
                            <div class="component-icon">⭕</div>
                            <span>节点</span>
                        </div>
                        <div class="component-item" data-type="edge" draggable="true">
                            <div class="component-icon">➖</div>
                            <span>连线</span>
                        </div>
                    </div>
                </div>
                
                <!-- 画布区域 -->
                <div style="flex: 1; position: relative;">
                    <canvas id="knowledgeGraphCanvas"></canvas>
                    
                    <!-- 控制面板 -->
                    <div class="graph-controls">
                        <button class="graph-btn" id="zoomIn" title="放大">
                            <span class="icon">🔍+</span>
                        </button>
                        <button class="graph-btn" id="zoomOut" title="缩小">
                            <span class="icon">🔍-</span>
                        </button>
                        <button class="graph-btn" id="centerView" title="居中">
                            <span class="icon">🎯</span>
                        </button>
                        <button class="graph-btn" id="clearCanvas" title="清空画布">
                            <span class="icon">🗑️</span>
                        </button>
                        <button class="graph-btn" id="saveGraph" title="保存图谱">
                            <span class="icon">💾</span>
                        </button>
                        <button class="graph-btn" id="loadGraph" title="加载图谱">
                            <span class="icon">📁</span>
                        </button>
                        <button class="graph-btn" id="deleteSelected" title="删除选中">
                            <span class="icon">❌</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="node-detail-panel" id="nodeDetailPanel">
                <h3 id="nodeTitle"></h3>
                <p id="nodeDescription"></p>
                <div class="node-meta">
                    <span id="nodeType"></span>
                    <span id="nodePoints"></span>
                </div>
                <div class="node-status" id="nodeStatus"></div>
                <button class="start-learning-btn" id="startLearningBtn">开始学习</button>
            </div>
        `;
        
        this.container.appendChild(wrapper);
        
        this.canvas = document.getElementById('knowledgeGraphCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置Canvas大小
        this.resizeCanvas();
    }

    /**
     * 调整Canvas大小
     */
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.config.width = rect.width;
        this.config.height = rect.height;
    }

    /**
     * 加载图谱数据
     */
    loadGraphData(graphData) {
        // 清空现有数据
        this.state.nodes.clear();
        this.state.edges = [];

        // 加载节点
        graphData.nodes.forEach(nodeConfig => {
            const node = new KnowledgeNode(nodeConfig);
            this.state.nodes.set(node.id, node);
        });

        // 加载边（连接关系）
        this.state.nodes.forEach(node => {
            node.dependencies.forEach(depId => {
                this.state.edges.push({
                    from: depId,
                    to: node.id
                });
            });
        });

    }

    /**
     * 加载学习进度
     */
    async loadProgress() {
        try {
            // 从学习进度服务加载每个节点的完成状态
            for (const [nodeId, node] of this.state.nodes) {
                if (node.blockId) {
                    const progress = await learningProgress.getProgress(node.blockId);
                    if (progress && progress.isComplete) {
                        this.state.completedNodes.add(nodeId);
                        node.status = 'completed';
                    }
                }
            }

            // 更新节点解锁状态
            this.updateUnlockStatus();
            
        } catch (error) {
            console.error('加载学习进度失败:', error);
        }
    }

    /**
     * 更新节点解锁状态
     */
    updateUnlockStatus() {
        this.state.unlockedNodes.clear();
        
        this.state.nodes.forEach(node => {
            if (node.status === 'completed') {
                this.state.unlockedNodes.add(node.id);
            } else if (node.isUnlockable(this.state.completedNodes)) {
                node.status = 'unlocked';
                this.state.unlockedNodes.add(node.id);
            } else {
                node.status = 'locked';
            }
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // Canvas事件
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));

        // 基础控制按钮事件
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoom(0.8));
        document.getElementById('centerView')?.addEventListener('click', () => this.centerOnStartNode());
        document.getElementById('clearCanvas')?.addEventListener('click', () => this.clearCanvas());
        document.getElementById('saveGraph')?.addEventListener('click', () => this.saveGraph());
        document.getElementById('loadGraph')?.addEventListener('click', () => this.loadGraph());
        document.getElementById('deleteSelected')?.addEventListener('click', () => this.deleteSelected());
        
        // 绑定拖拽事件
        this.bindDragEvents();

        // 窗口调整事件
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.render();
        });
    }

    /**
     * 鼠标按下事件
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查是否点击了节点
        const clickedNode = this.getNodeAtPosition(x, y);
        
        if (clickedNode && this.state.layoutMode === 'edit') {
            // 编辑模式：拖拽节点
            this.state.isDraggingNode = true;
            this.state.draggingNode = clickedNode;
            const worldPos = this.screenToWorld(x, y);
            this.state.dragOffset = {
                x: worldPos.x - clickedNode.x,
                y: worldPos.y - clickedNode.y
            };
            this.canvas.style.cursor = 'grabbing';
            e.preventDefault();
        } else {
            // 普通模式：拖拽视图
            this.state.isDragging = true;
            this.state.dragStart = {
                x: e.clientX - this.state.camera.x,
                y: e.clientY - this.state.camera.y
            };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    /**
     * 鼠标移动事件
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.state.isDraggingNode && this.state.draggingNode) {
            // 拖拽节点
            const worldPos = this.screenToWorld(x, y);
            let newX = worldPos.x - this.state.dragOffset.x;
            let newY = worldPos.y - this.state.dragOffset.y;
            
            // 网格对齐
            if (this.config.snapToGrid) {
                const gridSize = this.config.gridSize || 20;
                newX = Math.round(newX / gridSize) * gridSize;
                newY = Math.round(newY / gridSize) * gridSize;
            }
            
            // 检测对齐到其他节点
            const snapResult = this.snapToNodes(newX, newY);
            if (snapResult.snapped) {
                newX = snapResult.x;
                newY = snapResult.y;
                this.showSnapIndicator(newX, newY);
            }
            
            this.state.draggingNode.x = newX;
            this.state.draggingNode.y = newY;
        } else if (this.state.isDragging) {
            // 拖拽视图
            this.state.camera.x = e.clientX - this.state.dragStart.x;
            this.state.camera.y = e.clientY - this.state.dragStart.y;
        } else if (this.state.edgeEditMode && this.state.connectingFrom) {
            // 连线模式：更新临时连线终点
            const worldPos = this.screenToWorld(x, y);
            this.state.tempEdgeTo = worldPos;
        } else {
            // 更新鼠标悬停状态
            this.updateHoverState(x, y);
        }
    }

    /**
     * 鼠标松开事件
     */
    handleMouseUp(e) {
        if (this.state.isDraggingNode) {
            this.state.isDraggingNode = false;
            this.state.draggingNode = null;
            this.state.dragOffset = { x: 0, y: 0 };
            this.canvas.style.cursor = this.state.layoutMode === 'edit' ? 'grab' : 'default';
        }
        
        if (this.state.isDragging) {
            this.state.isDragging = false;
            this.canvas.style.cursor = this.state.layoutMode === 'edit' ? 'grab' : 'default';
        }
    }

    /**
     * 鼠标滚轮事件（缩放）
     */
    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(delta, e.offsetX, e.offsetY);
    }

    /**
     * 点击事件（选择节点或边）
     */
    handleClick(e) {
        // 如果在拖拽节点，不处理点击事件
        if (this.state.isDraggingNode) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedNode = this.getNodeAtPosition(x, y);
        
        if (this.state.edgeCreationMode) {
            // 连线创建模式
            if (clickedNode) {
                this.handleNodeClickInEdgeMode(clickedNode);
            } else {
                // 取消连线创建
                this.cancelConnecting();
            }
        } else {
            // 普通模式
            if (clickedNode) {
                this.selectNode(clickedNode);
                this.deselectEdge();
            } else {
                // 检查是否点击了边
                const clickedEdge = this.getEdgeAtPosition(x, y);
                if (clickedEdge) {
                    this.selectEdge(clickedEdge);
                    this.deselectNode();
                } else {
                    this.deselectNode();
                    this.deselectEdge();
                }
            }
        }
    }

    /**
     * 更新悬停状态
     */
    updateHoverState(x, y) {
        const hoveredNode = this.getNodeAtPosition(x, y);
        const shouldShowPointer = hoveredNode && this.state.layoutMode === 'edit';
        this.canvas.style.cursor = shouldShowPointer ? 'grab' : 'default';
    }

    /**
     * 切换编辑模式
     */
    toggleEditMode() {
        this.state.layoutMode = this.state.layoutMode === 'view' ? 'edit' : 'view';
        
        const editBtn = document.getElementById('toggleEditMode');
        const saveBtn = document.getElementById('saveLayout');
        
        if (this.state.layoutMode === 'edit') {
            editBtn.classList.add('active');
            saveBtn.style.display = 'block';
            this.canvas.style.cursor = 'grab';
            this.showNotification('已进入编辑模式，可以拖拽节点调整布局', 'info');
        } else {
            editBtn.classList.remove('active');
            saveBtn.style.display = 'none';
            this.canvas.style.cursor = 'default';
            this.showNotification('已退出编辑模式', 'info');
        }
    }

    /**
     * 切换线条交叉避免
     */
    toggleCrossingAvoidance() {
        this.config.avoidCrossing = !this.config.avoidCrossing;
        
        const btn = document.getElementById('toggleCrossing');
        
        if (this.config.avoidCrossing) {
            btn.classList.add('active');
            this.showNotification('已启用线条交叉避免', 'success');
        } else {
            btn.classList.remove('active');
            this.showNotification('已关闭线条交叉避免', 'info');
        }
        
    }

    /**
     * 切换边编辑模式
     */
    toggleEdgeEditMode() {
        this.state.edgeEditMode = !this.state.edgeEditMode;
        
        const btn = document.getElementById('toggleEdgeEdit');
        
        if (this.state.edgeEditMode) {
            btn.classList.add('active');
            this.canvas.style.cursor = 'crosshair';
            this.showNotification('已进入连线编辑模式\n点击节点开始连线，点击边可删除', 'info');
        } else {
            btn.classList.remove('active');
            this.canvas.style.cursor = 'default';
            this.cancelConnecting();
            this.showNotification('已退出连线编辑模式', 'info');
        }
        
    }

    /**
     * 在边编辑模式下处理节点点击
     */
    handleNodeClickInEdgeMode(node) {
        if (!this.state.connectingFrom) {
            // 开始连线
            this.state.connectingFrom = node;
            this.showNotification(`从 "${node.title}" 开始连线，点击目标节点`, 'info');
        } else {
            // 完成连线
            if (this.state.connectingFrom.id !== node.id) {
                this.createEdge(this.state.connectingFrom, node);
            } else {
                this.showNotification('不能连接到自身', 'error');
            }
            this.cancelConnecting();
        }
    }

    /**
     * 取消连线
     */
    cancelConnecting() {
        this.state.connectingFrom = null;
        this.state.tempEdgeTo = null;
    }

    /**
     * 创建新边
     */
    createEdge(fromNode, toNode) {
        // 检查边是否已存在
        const exists = this.state.edges.some(
            edge => edge.from === fromNode.id && edge.to === toNode.id
        );
        
        if (exists) {
            this.showNotification('连线已存在', 'error');
            return;
        }
        
        // 保存到历史记录
        this.saveToHistory();
        
        // 创建新边
        const newEdge = {
            from: fromNode.id,
            to: toNode.id
        };
        
        this.state.edges.push(newEdge);
        
        this.showNotification(`已添加连线: ${fromNode.title} → ${toNode.title}`, 'success');
    }

    /**
     * 选择边
     */
    selectEdge(edge) {
        this.state.selectedEdge = edge;
        
        // 显示删除按钮
        const deleteBtn = document.getElementById('deleteEdge');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
        }
        
        const fromNode = this.state.nodes.get(edge.from);
        const toNode = this.state.nodes.get(edge.to);
        
        if (fromNode && toNode) {
        }
    }

    /**
     * 取消选择边
     */
    deselectEdge() {
        this.state.selectedEdge = null;
        
        // 隐藏删除按钮
        const deleteBtn = document.getElementById('deleteEdge');
        if (deleteBtn) {
            deleteBtn.style.display = 'none';
        }
    }

    /**
     * 删除选中的边
     */
    deleteSelectedEdge() {
        if (!this.state.selectedEdge) {
            this.showNotification('请先选择要删除的连线', 'error');
            return;
        }
        
        // 保存到历史记录
        this.saveToHistory();
        
        // 删除边
        const edge = this.state.selectedEdge;
        const index = this.state.edges.findIndex(
            e => e.from === edge.from && e.to === edge.to
        );
        
        if (index !== -1) {
            this.state.edges.splice(index, 1);
            
            const fromNode = this.state.nodes.get(edge.from);
            const toNode = this.state.nodes.get(edge.to);
            
            if (fromNode && toNode) {
                this.showNotification(`已删除连线: ${fromNode.title} → ${toNode.title}`, 'success');
            }
            
            this.deselectEdge();
        }
    }

    /**
     * 保存操作到历史记录
     */
    saveToHistory() {
        const state = {
            edges: JSON.parse(JSON.stringify(this.state.edges))
        };
        
        this.editHistory.past.push(state);
        this.editHistory.future = []; // 清空重做历史
        
        // 限制历史记录数量
        if (this.editHistory.past.length > 50) {
            this.editHistory.past.shift();
        }
        
        // 更新撤销/重做按钮状态
        this.updateUndoRedoButtons();
    }

    /**
     * 撤销操作
     */
    undo() {
        if (this.editHistory.past.length === 0) {
            this.showNotification('没有可撤销的操作', 'info');
            return;
        }
        
        // 保存当前状态到future
        const currentState = {
            edges: JSON.parse(JSON.stringify(this.state.edges))
        };
        this.editHistory.future.push(currentState);
        
        // 恢复previous状态
        const previousState = this.editHistory.past.pop();
        this.state.edges = JSON.parse(JSON.stringify(previousState.edges));
        
        this.showNotification('已撤销', 'success');
        this.updateUndoRedoButtons();
    }

    /**
     * 重做操作
     */
    redo() {
        if (this.editHistory.future.length === 0) {
            this.showNotification('没有可重做的操作', 'info');
            return;
        }
        
        // 保存当前状态到past
        const currentState = {
            edges: JSON.parse(JSON.stringify(this.state.edges))
        };
        this.editHistory.past.push(currentState);
        
        // 恢复future状态
        const nextState = this.editHistory.future.pop();
        this.state.edges = JSON.parse(JSON.stringify(nextState.edges));
        
        this.showNotification('已重做', 'success');
        this.updateUndoRedoButtons();
    }

    /**
     * 更新撤销/重做按钮状态
     */
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undo');
        const redoBtn = document.getElementById('redo');
        
        if (undoBtn) {
            undoBtn.disabled = this.editHistory.past.length === 0;
            undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
        }
        
        if (redoBtn) {
            redoBtn.disabled = this.editHistory.future.length === 0;
            redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
        }
    }

    /**
     * 优化布局以消除交叉
     */
    async optimizeLayoutToCrossing() {
        this.showNotification('正在优化布局，消除线条交叉...', 'info');
        
        const optimizeBtn = document.getElementById('optimizeLayout');
        if (optimizeBtn) {
            optimizeBtn.disabled = true;
            optimizeBtn.style.opacity = '0.5';
        }
        
        try {
            // 检查节点是否存在
            const nodes = Array.from(this.state.nodes.values());
            if (nodes.length === 0) {
                this.showNotification('没有节点可以优化', 'error');
                return;
            }
            
            // 保存原始位置
            const originalPositions = new Map();
            nodes.forEach(node => {
                originalPositions.set(node.id, { x: node.x, y: node.y });
            });
            
            // 计算当前交叉数量
            const initialCrossings = this.countAllCrossings();
            
            // 使用简化的优化算法
            await this.simpleLayoutOptimization();
            
            // 验证节点是否还在
            const nodesAfter = Array.from(this.state.nodes.values());
            const validNodes = nodesAfter.filter(node => 
                !isNaN(node.x) && !isNaN(node.y) && 
                isFinite(node.x) && isFinite(node.y)
            );
            
            if (validNodes.length !== nodes.length) {
                console.error(`❌ 优化后节点丢失: ${nodes.length} → ${validNodes.length}`);
                // 恢复原始位置
                nodes.forEach(node => {
                    const original = originalPositions.get(node.id);
                    if (original) {
                        node.x = original.x;
                        node.y = original.y;
                    }
                });
                this.render();
                this.showNotification('优化失败，已恢复原始位置', 'error');
                return;
            }
            
            // 计算优化后的交叉数量
            const finalCrossings = this.countAllCrossings();
            const improvement = initialCrossings - finalCrossings;
            
            
            if (improvement > 0) {
                this.showNotification(`优化完成！减少了${improvement}个交叉点`, 'success');
            } else if (finalCrossings === 0) {
                this.showNotification('完美！已消除所有交叉', 'success');
            } else {
                this.showNotification('已尽力优化，建议手动调整节点位置', 'info');
            }
        } catch (error) {
            console.error('布局优化失败:', error);
            this.showNotification('优化失败，请重试', 'error');
        } finally {
            if (optimizeBtn) {
                optimizeBtn.disabled = false;
                optimizeBtn.style.opacity = '1';
            }
        }
    }

    /**
     * 力导向布局优化算法
     */
    async forceDirectedLayoutOptimization() {
        const nodes = Array.from(this.state.nodes.values());
        const edges = this.state.edges;
        
        // 保存原始位置（用于恢复）
        const originalPositions = new Map();
        nodes.forEach(node => {
            originalPositions.set(node.id, { x: node.x, y: node.y });
        });
        
        // 初始化节点速度
        nodes.forEach(node => {
            node.vx = 0;
            node.vy = 0;
            
            // 确保节点有有效的初始位置
            if (isNaN(node.x) || isNaN(node.y)) {
                console.warn(`⚠️ 节点 ${node.id} 位置无效，重置为原点`);
                node.x = 0;
                node.y = 0;
            }
        });
        
        const maxIterations = this.config.maxIterations;
        const dampening = 0.9; // 阻尼系数
        
        try {
            for (let iteration = 0; iteration < maxIterations; iteration++) {
                // 计算所有力
                this.calculateForces(nodes, edges);
                
                // 更新节点位置
                let maxDisplacement = 0;
                nodes.forEach(node => {
                    // 检查速度是否有效
                    if (isNaN(node.vx) || isNaN(node.vy)) {
                        console.warn(`⚠️ 节点 ${node.id} 速度无效，重置为0`);
                        node.vx = 0;
                        node.vy = 0;
                        return;
                    }
                    
                    // 限制速度大小（防止爆炸）
                    const maxSpeed = 50;
                    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                    if (speed > maxSpeed) {
                        node.vx = (node.vx / speed) * maxSpeed;
                        node.vy = (node.vy / speed) * maxSpeed;
                    }
                    
                    // 应用速度
                    node.x += node.vx;
                    node.y += node.vy;
                    
                    // 检查位置是否有效
                    if (isNaN(node.x) || isNaN(node.y)) {
                        console.error(`❌ 节点 ${node.id} 位置变为NaN，恢复原始位置`);
                        const original = originalPositions.get(node.id);
                        node.x = original.x;
                        node.y = original.y;
                        node.vx = 0;
                        node.vy = 0;
                        return;
                    }
                    
                    // 计算位移
                    const displacement = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                    maxDisplacement = Math.max(maxDisplacement, displacement);
                    
                    // 应用阻尼
                    node.vx *= dampening;
                    node.vy *= dampening;
                });
                
                // 每50次迭代渲染一次，显示动画效果
                if (iteration % 50 === 0) {
                    await new Promise(resolve => {
                        requestAnimationFrame(() => {
                            this.render();
                            resolve();
                        });
                    });
                }
                
                // 如果移动很小，提前结束
                if (maxDisplacement < 0.1) {
                    break;
                }
            }
        } catch (error) {
            console.error('❌ 力导向优化出错，恢复原始位置:', error);
            // 恢复所有节点的原始位置
            nodes.forEach(node => {
                const original = originalPositions.get(node.id);
                if (original) {
                    node.x = original.x;
                    node.y = original.y;
                }
            });
            throw error;
        } finally {
            // 清理临时属性
            nodes.forEach(node => {
                delete node.vx;
                delete node.vy;
            });
            
            // 最后渲染一次
            this.render();
        }
    }

    /**
     * 计算所有力
     */
    calculateForces(nodes, edges) {
        // 1. 节点间排斥力（防止重叠）
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                this.applyRepulsionForce(nodes[i], nodes[j]);
            }
        }
        
        // 2. 连线吸引力（保持连接的节点靠近）
        edges.forEach(edge => {
            const fromNode = this.state.nodes.get(edge.from);
            const toNode = this.state.nodes.get(edge.to);
            if (fromNode && toNode) {
                this.applyAttractionForce(fromNode, toNode);
            }
        });
        
        // 3. 交叉惩罚力（推开交叉的边）
        this.applyCrossingPenaltyForces(edges);
        
        // 4. 中心引力（防止节点飞出屏幕）
        nodes.forEach(node => {
            this.applyCenterGravity(node);
        });
    }

    /**
     * 应用排斥力
     */
    applyRepulsionForce(node1, node2) {
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distSq = dx * dx + dy * dy;
        
        // 避免除零和过近的节点
        if (distSq < 1) {
            // 节点几乎重叠，随机推开
            const randomAngle = Math.random() * Math.PI * 2;
            node1.vx -= Math.cos(randomAngle) * 10;
            node1.vy -= Math.sin(randomAngle) * 10;
            node2.vx += Math.cos(randomAngle) * 10;
            node2.vy += Math.sin(randomAngle) * 10;
            return;
        }
        
        const dist = Math.sqrt(distSq);
        const minDist = (node1.radius + node2.radius) * 3; // 最小距离
        
        if (dist < minDist) {
            // 限制力的大小，防止爆炸
            const force = Math.min(this.config.repulsionStrength / distSq, 1000);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            // 检查力是否有效
            if (!isNaN(fx) && !isNaN(fy) && isFinite(fx) && isFinite(fy)) {
                node1.vx -= fx;
                node1.vy -= fy;
                node2.vx += fx;
                node2.vy += fy;
            }
        }
    }

    /**
     * 应用吸引力
     */
    applyAttractionForce(node1, node2) {
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 0.01) return;
        
        const idealDist = this.config.nodeSpacing;
        const force = (dist - idealDist) * this.config.attractionStrength;
        
        // 限制力的大小
        const limitedForce = Math.max(-100, Math.min(100, force));
        
        const fx = (dx / dist) * limitedForce;
        const fy = (dy / dist) * limitedForce;
        
        // 检查力是否有效
        if (!isNaN(fx) && !isNaN(fy) && isFinite(fx) && isFinite(fy)) {
            node1.vx += fx;
            node1.vy += fy;
            node2.vx -= fx;
            node2.vy -= fy;
        }
    }

    /**
     * 应用交叉惩罚力
     */
    applyCrossingPenaltyForces(edges) {
        for (let i = 0; i < edges.length; i++) {
            for (let j = i + 1; j < edges.length; j++) {
                const edge1 = edges[i];
                const edge2 = edges[j];
                
                const from1 = this.state.nodes.get(edge1.from);
                const to1 = this.state.nodes.get(edge1.to);
                const from2 = this.state.nodes.get(edge2.from);
                const to2 = this.state.nodes.get(edge2.to);
                
                if (!from1 || !to1 || !from2 || !to2) continue;
                
                // 检查是否相交
                const line1 = { x1: from1.x, y1: from1.y, x2: to1.x, y2: to1.y };
                const line2 = { x1: from2.x, y1: from2.y, x2: to2.x, y2: to2.y };
                
                if (this.doLinesIntersect(line1, line2)) {
                    // 计算交点
                    const intersection = this.getLineIntersection(line1, line2);
                    
                    if (intersection) {
                        // 对交叉的边施加推开的力
                        this.pushApartCrossingEdges(from1, to1, from2, to2, intersection);
                    }
                }
            }
        }
    }

    /**
     * 推开交叉的边
     */
    pushApartCrossingEdges(from1, to1, from2, to2, intersection) {
        const force = this.config.crossingPenalty;
        
        // 计算每个节点应该移动的方向
        // 让两条边互相垂直地推开
        
        const dx1 = to1.x - from1.x;
        const dy1 = to1.y - from1.y;
        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        
        const dx2 = to2.x - from2.x;
        const dy2 = to2.y - from2.y;
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        if (len1 < 0.01 || len2 < 0.01) return;
        
        // 垂直方向
        const perp1x = -dy1 / len1;
        const perp1y = dx1 / len1;
        
        // 检查方向是否有效
        if (isNaN(perp1x) || isNaN(perp1y)) return;
        
        // 推开edge1的节点
        from1.vx = (from1.vx || 0) + perp1x * force;
        from1.vy = (from1.vy || 0) + perp1y * force;
        to1.vx = (to1.vx || 0) + perp1x * force;
        to1.vy = (to1.vy || 0) + perp1y * force;
        
        // 推开edge2的节点（反方向）
        from2.vx = (from2.vx || 0) - perp1x * force;
        from2.vy = (from2.vy || 0) - perp1y * force;
        to2.vx = (to2.vx || 0) - perp1x * force;
        to2.vy = (to2.vy || 0) - perp1y * force;
    }

    /**
     * 应用中心引力
     */
    applyCenterGravity(node) {
        const centerX = 0;
        const centerY = 0;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 500) { // 距离中心太远时才应用
            const force = 0.01;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
        }
    }

    /**
     * 计算所有交叉数量
     */
    countAllCrossings() {
        let count = 0;
        const edges = this.state.edges;
        
        for (let i = 0; i < edges.length; i++) {
            for (let j = i + 1; j < edges.length; j++) {
                const edge1 = edges[i];
                const edge2 = edges[j];
                
                // 跳过共享节点的边
                if (edge1.from === edge2.from || edge1.from === edge2.to ||
                    edge1.to === edge2.from || edge1.to === edge2.to) {
                    continue;
                }
                
                const from1 = this.state.nodes.get(edge1.from);
                const to1 = this.state.nodes.get(edge1.to);
                const from2 = this.state.nodes.get(edge2.from);
                const to2 = this.state.nodes.get(edge2.to);
                
                if (!from1 || !to1 || !from2 || !to2) continue;
                
                const line1 = { x1: from1.x, y1: from1.y, x2: to1.x, y2: to1.y };
                const line2 = { x1: from2.x, y1: from2.y, x2: to2.x, y2: to2.y };
                
                if (this.doLinesIntersect(line1, line2)) {
                    count++;
                }
            }
        }
        
        return count;
    }

    /**
     * 简化的布局优化算法（更安全）
     */
    async simpleLayoutOptimization() {
        const nodes = Array.from(this.state.nodes.values());
        const edges = this.state.edges;
        
        
        // 检查节点有效性
        nodes.forEach(node => {
            if (isNaN(node.x) || isNaN(node.y)) {
                console.warn(`节点${node.id}位置无效，重置为(0,0)`);
                node.x = 0;
                node.y = 0;
            }
        });
        
        // 简单的迭代优化
        const maxIterations = 100;
        const stepSize = 2; // 较小的步长
        
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            let hasMoved = false;
            
            // 为每个节点计算移动方向
            nodes.forEach(node => {
                let fx = 0, fy = 0;
                
                // 1. 排斥力：远离其他节点
                nodes.forEach(other => {
                    if (other === node) return;
                    
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100 && dist > 0.1) { // 距离太近时推开
                        const force = 100 / (dist * dist);
                        fx += (dx / dist) * force;
                        fy += (dy / dist) * force;
                    }
                });
                
                // 2. 吸引力：拉近连接的节点
                edges.forEach(edge => {
                    const other = edge.from === node.id ? 
                        this.state.nodes.get(edge.to) : 
                        edge.to === node.id ? 
                        this.state.nodes.get(edge.from) : null;
                    
                    if (!other) return;
                    
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 150 && dist < 500) { // 距离太远时拉近
                        const force = (dist - 150) * 0.1;
                        fx += (dx / dist) * force;
                        fy += (dy / dist) * force;
                    }
                });
                
                // 3. 交叉惩罚：推开交叉的边
                edges.forEach(edge1 => {
                    if (edge1.from !== node.id && edge1.to !== node.id) return;
                    
                    const from1 = this.state.nodes.get(edge1.from);
                    const to1 = this.state.nodes.get(edge1.to);
                    
                    edges.forEach(edge2 => {
                        if (edge1 === edge2) return;
                        if (edge2.from === node.id || edge2.to === node.id) return;
                        
                        const from2 = this.state.nodes.get(edge2.from);
                        const to2 = this.state.nodes.get(edge2.to);
                        
                        if (!from1 || !to1 || !from2 || !to2) return;
                        
                        const line1 = { x1: from1.x, y1: from1.y, x2: to1.x, y2: to1.y };
                        const line2 = { x1: from2.x, y1: from2.y, x2: to2.x, y2: to2.y };
                        
                        if (this.doLinesIntersect(line1, line2)) {
                            // 简单的推开力
                            const dx = to1.x - from1.x;
                            const dy = to1.y - from1.y;
                            const len = Math.sqrt(dx * dx + dy * dy);
                            
                            if (len > 0.1) {
                                const perpX = -dy / len;
                                const perpY = dx / len;
                                fx += perpX * 10;
                                fy += perpY * 10;
                            }
                        }
                    });
                });
                
                // 限制力的大小
                const forceMagnitude = Math.sqrt(fx * fx + fy * fy);
                if (forceMagnitude > 5) {
                    fx = (fx / forceMagnitude) * 5;
                    fy = (fy / forceMagnitude) * 5;
                }
                
                // 应用力
                if (Math.abs(fx) > 0.1 || Math.abs(fy) > 0.1) {
                    node.x += fx * stepSize;
                    node.y += fy * stepSize;
                    hasMoved = true;
                }
            });
            
            // 每20次迭代渲染一次
            if (iteration % 20 === 0) {
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        this.render();
                        resolve();
                    });
                });
            }
            
            // 如果没有移动，提前结束
            if (!hasMoved) {
                break;
            }
        }
        
    }

    /**
     * 高级布局优化（多种算法组合）
     */
    async advancedLayoutOptimization() {
        this.showNotification('开始高级优化，使用多种算法...', 'info');
        
        const btn = document.getElementById('advancedOptimize');
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        }
        
        try {
            // 保存原始位置
            const nodes = Array.from(this.state.nodes.values());
            const originalPositions = new Map();
            nodes.forEach(node => {
                originalPositions.set(node.id, { x: node.x, y: node.y });
            });
            
            const initialCrossings = this.countAllCrossings();
            
            // 1. 分层布局优化
            await this.hierarchicalLayoutOptimization();
            
            // 2. 圆形布局优化
            await this.circularLayoutOptimization();
            
            // 3. 力导向精细调整
            await this.forceDirectedFineTuning();
            
            // 4. 交叉消除专项优化
            await this.crossingEliminationOptimization();
            
            // 验证结果
            const finalCrossings = this.countAllCrossings();
            const improvement = initialCrossings - finalCrossings;
            
            
            if (improvement > 0) {
                this.showNotification(`高级优化完成！减少了${improvement}个交叉点`, 'success');
            } else if (finalCrossings === 0) {
                this.showNotification('完美！已消除所有交叉', 'success');
            } else {
                this.showNotification('高级优化完成，建议尝试其他布局策略', 'info');
            }
            
        } catch (error) {
            console.error('高级优化失败:', error);
            this.showNotification('高级优化失败', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        }
    }

    /**
     * 分层布局优化
     */
    async hierarchicalLayoutOptimization() {
        const nodes = Array.from(this.state.nodes.values());
        const edges = this.state.edges;
        
        // 分析图的层级结构
        const layers = this.analyzeGraphLayers();
        
        // 为每个层级分配位置
        layers.forEach((layerNodes, layerIndex) => {
            const layerWidth = 400;
            const nodeSpacing = Math.min(150, layerWidth / (layerNodes.length + 1));
            
            layerNodes.forEach((node, nodeIndex) => {
                node.x = (layerIndex - layers.length / 2) * 300;
                node.y = (nodeIndex - layerNodes.length / 2) * nodeSpacing;
            });
        });
        
        await this.renderWithDelay(500);
    }

    /**
     * 圆形布局优化
     */
    async circularLayoutOptimization() {
        const nodes = Array.from(this.state.nodes.values());
        
        // 按连接度排序
        const nodeConnections = new Map();
        nodes.forEach(node => {
            const connections = this.state.edges.filter(edge => 
                edge.from === node.id || edge.to === node.id
            ).length;
            nodeConnections.set(node.id, connections);
        });
        
        const sortedNodes = nodes.sort((a, b) => 
            nodeConnections.get(b.id) - nodeConnections.get(a.id)
        );
        
        // 核心节点放在中心
        const coreNodes = sortedNodes.slice(0, Math.min(3, nodes.length));
        const peripheralNodes = sortedNodes.slice(coreNodes.length);
        
        // 放置核心节点
        if (coreNodes.length === 1) {
            coreNodes[0].x = 0;
            coreNodes[0].y = 0;
        } else if (coreNodes.length === 2) {
            coreNodes[0].x = -100;
            coreNodes[0].y = 0;
            coreNodes[1].x = 100;
            coreNodes[1].y = 0;
        } else {
            const angle = 0;
            coreNodes.forEach((node, index) => {
                const nodeAngle = angle + (index * 2 * Math.PI) / coreNodes.length;
                node.x = 80 * Math.cos(nodeAngle);
                node.y = 80 * Math.sin(nodeAngle);
            });
        }
        
        // 放置外围节点
        const radius = 200;
        peripheralNodes.forEach((node, index) => {
            const angle = (index * 2 * Math.PI) / peripheralNodes.length;
            node.x = radius * Math.cos(angle);
            node.y = radius * Math.sin(angle);
        });
        
        await this.renderWithDelay(500);
    }

    /**
     * 力导向精细调整
     */
    async forceDirectedFineTuning() {
        const nodes = Array.from(this.state.nodes.values());
        const edges = this.state.edges;
        
        // 精细化的力导向调整
        for (let iteration = 0; iteration < 200; iteration++) {
            let totalForce = 0;
            
            nodes.forEach(node => {
                let fx = 0, fy = 0;
                
                // 更强的排斥力
                nodes.forEach(other => {
                    if (other === node) return;
                    
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 80) {
                        const force = 2000 / (dist * dist);
                        fx += (dx / dist) * force;
                        fy += (dy / dist) * force;
                    }
                });
                
                // 连线吸引力
                edges.forEach(edge => {
                    const other = edge.from === node.id ? 
                        this.state.nodes.get(edge.to) : 
                        edge.to === node.id ? 
                        this.state.nodes.get(edge.from) : null;
                    
                    if (!other) return;
                    
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 120) {
                        const force = (dist - 120) * 0.2;
                        fx += (dx / dist) * force;
                        fy += (dy / dist) * force;
                    }
                });
                
                // 应用力
                const forceMagnitude = Math.sqrt(fx * fx + fy * fy);
                if (forceMagnitude > 2) {
                    fx = (fx / forceMagnitude) * 2;
                    fy = (fy / forceMagnitude) * 2;
                }
                
                if (Math.abs(fx) > 0.01 || Math.abs(fy) > 0.01) {
                    node.x += fx;
                    node.y += fy;
                    totalForce += Math.sqrt(fx * fx + fy * fy);
                }
            });
            
            // 每20次迭代渲染一次
            if (iteration % 20 === 0) {
                await this.renderWithDelay(50);
            }
            
            // 收敛检测
            if (totalForce < 0.1) {
                break;
            }
        }
    }

    /**
     * 交叉消除专项优化
     */
    async crossingEliminationOptimization() {
        const edges = this.state.edges;
        
        // 多次迭代消除交叉
        for (let round = 0; round < 5; round++) {
            const crossings = this.findCrossingPairs();
            
            if (crossings.length === 0) break;
            
            // 处理每个交叉
            crossings.forEach(crossing => {
                this.resolveCrossing(crossing);
            });
            
            await this.renderWithDelay(200);
        }
    }

    /**
     * 分析图的层级结构
     */
    analyzeGraphLayers() {
        const nodes = Array.from(this.state.nodes.values());
        const edges = this.state.edges;
        const layers = [];
        const visited = new Set();
        
        // 找到起始节点（入度为0的节点）
        const inDegree = new Map();
        nodes.forEach(node => inDegree.set(node.id, 0));
        
        edges.forEach(edge => {
            const count = inDegree.get(edge.to) || 0;
            inDegree.set(edge.to, count + 1);
        });
        
        const startNodes = nodes.filter(node => inDegree.get(node.id) === 0);
        
        // BFS分层
        let currentLayer = startNodes.length > 0 ? startNodes : [nodes[0]];
        let layerIndex = 0;
        
        while (currentLayer.length > 0) {
            layers[layerIndex] = [...currentLayer];
            currentLayer.forEach(node => visited.add(node.id));
            
            // 找到下一层节点
            const nextLayer = [];
            currentLayer.forEach(node => {
                edges.forEach(edge => {
                    if (edge.from === node.id) {
                        const targetNode = nodes.find(n => n.id === edge.to);
                        if (targetNode && !visited.has(targetNode.id)) {
                            nextLayer.push(targetNode);
                        }
                    }
                });
            });
            
            currentLayer = [...new Set(nextLayer)];
            layerIndex++;
        }
        
        return layers;
    }

    /**
     * 查找交叉的边对
     */
    findCrossingPairs() {
        const crossings = [];
        const edges = this.state.edges;
        
        for (let i = 0; i < edges.length; i++) {
            for (let j = i + 1; j < edges.length; j++) {
                const edge1 = edges[i];
                const edge2 = edges[j];
                
                // 跳过共享节点的边
                if (edge1.from === edge2.from || edge1.from === edge2.to ||
                    edge1.to === edge2.from || edge1.to === edge2.to) {
                    continue;
                }
                
                const from1 = this.state.nodes.get(edge1.from);
                const to1 = this.state.nodes.get(edge1.to);
                const from2 = this.state.nodes.get(edge2.from);
                const to2 = this.state.nodes.get(edge2.to);
                
                if (!from1 || !to1 || !from2 || !to2) continue;
                
                const line1 = { x1: from1.x, y1: from1.y, x2: to1.x, y2: to1.y };
                const line2 = { x1: from2.x, y1: from2.y, x2: to2.x, y2: to2.y };
                
                if (this.doLinesIntersect(line1, line2)) {
                    const intersection = this.getLineIntersection(line1, line2);
                    crossings.push({
                        edge1: { edge: edge1, from: from1, to: to1 },
                        edge2: { edge: edge2, from: from2, to: to2 },
                        intersection
                    });
                }
            }
        }
        
        return crossings;
    }

    /**
     * 解决单个交叉
     */
    resolveCrossing(crossing) {
        const { edge1, edge2 } = crossing;
        
        // 计算两条边的中点
        const mid1 = {
            x: (edge1.from.x + edge1.to.x) / 2,
            y: (edge1.from.y + edge1.to.y) / 2
        };
        
        const mid2 = {
            x: (edge2.from.x + edge2.to.x) / 2,
            y: (edge2.from.y + edge2.to.y) / 2
        };
        
        // 计算推开方向
        const dx = mid2.x - mid1.x;
        const dy = mid2.y - mid1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 0.1) return;
        
        const pushDistance = 50;
        const pushX = (dx / dist) * pushDistance;
        const pushY = (dy / dist) * pushDistance;
        
        // 推开edge1的节点
        edge1.from.x -= pushX;
        edge1.from.y -= pushY;
        edge1.to.x -= pushX;
        edge1.to.y -= pushY;
        
        // 推开edge2的节点
        edge2.from.x += pushX;
        edge2.from.y += pushY;
        edge2.to.x += pushX;
        edge2.to.y += pushY;
    }

    /**
     * 带延迟的渲染
     */
    async renderWithDelay(delay) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.render();
                setTimeout(resolve, delay);
            });
        });
    }

    /**
     * 启用智能线条路由
     */
    enableSmartRouting() {
        this.config.smartRouting = !this.config.smartRouting;
        this.showNotification(
            this.config.smartRouting ? '智能路由已启用' : '智能路由已禁用', 
            this.config.smartRouting ? 'success' : 'info'
        );
        
        // 更新按钮状态
        const btn = document.getElementById('smartRouting');
        if (btn) {
            btn.classList.toggle('active', this.config.smartRouting);
        }
        
        this.render();
    }

    /**
     * 更新统计信息
     */
    updateStats() {
        const nodeCountEl = document.getElementById('nodeCount');
        const edgeCountEl = document.getElementById('edgeCount');
        const statusEl = document.getElementById('graphStatus');
        
        if (nodeCountEl) {
            nodeCountEl.textContent = this.state.nodes.size;
        }
        
        if (edgeCountEl) {
            edgeCountEl.textContent = this.state.edges.length;
        }
        
        if (statusEl) {
            if (this.state.edgeCreationMode) {
                statusEl.textContent = '连线模式';
                statusEl.style.color = '#3b82f6';
            } else if (this.state.selectedNode || this.state.selectedEdge) {
                statusEl.textContent = '已选择';
                statusEl.style.color = '#10b981';
            } else {
                statusEl.textContent = '就绪';
                statusEl.style.color = '#6b7280';
            }
        }
    }

    /**
     * 绘制智能路由路径
     */
    drawSmartRoutedPath(x1, y1, x2, y2, fromNode, toNode) {
        // 使用A*算法寻找最佳路径
        const path = this.findOptimalPath(x1, y1, x2, y2, fromNode, toNode);
        
        if (path && path.length > 2) {
            // 绘制多段路径
            this.ctx.beginPath();
            this.ctx.moveTo(path[0].x, path[0].y);
            
            for (let i = 1; i < path.length; i++) {
                this.ctx.lineTo(path[i].x, path[i].y);
            }
            
            this.ctx.stroke();
        } else {
            // 回退到无交叉路径
            this.drawNoCrossingPath(x1, y1, x2, y2, fromNode, toNode);
        }
    }

    /**
     * 使用A*算法寻找最优路径
     */
    findOptimalPath(x1, y1, x2, y2, fromNode, toNode) {
        const gridSize = this.config.routingGrid;
        
        // 创建网格
        const startX = Math.min(x1, x2) - gridSize;
        const startY = Math.min(y1, y2) - gridSize;
        const endX = Math.max(x1, x2) + gridSize;
        const endY = Math.max(y1, y2) + gridSize;
        
        const cols = Math.ceil((endX - startX) / gridSize);
        const rows = Math.ceil((endY - startY) / gridSize);
        
        // 计算起点和终点在网格中的位置
        const start = {
            x: Math.floor((x1 - startX) / gridSize),
            y: Math.floor((y1 - startY) / gridSize)
        };
        
        const end = {
            x: Math.floor((x2 - startX) / gridSize),
            y: Math.floor((y2 - startY) / gridSize)
        };
        
        // 标记障碍物（其他节点）
        const obstacles = new Set();
        Array.from(this.state.nodes.values()).forEach(node => {
            if (node === fromNode || node === toNode) return;
            
            const nodeX = Math.floor((node.x - startX) / gridSize);
            const nodeY = Math.floor((node.y - startY) / gridSize);
            const radius = Math.ceil(node.radius / gridSize) + 1;
            
            // 标记节点周围的网格为障碍物
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    const obstacleX = nodeX + dx;
                    const obstacleY = nodeY + dy;
                    if (obstacleX >= 0 && obstacleX < cols && obstacleY >= 0 && obstacleY < rows) {
                        obstacles.add(`${obstacleX},${obstacleY}`);
                    }
                }
            }
        });
        
        // 简化的A*算法
        const path = this.aStarPathfinding(start, end, obstacles, cols, rows);
        
        if (path) {
            // 转换回实际坐标
            return path.map(point => ({
                x: startX + point.x * gridSize,
                y: startY + point.y * gridSize
            }));
        }
        
        return null;
    }

    /**
     * 简化的A*路径寻找算法
     */
    aStarPathfinding(start, end, obstacles, cols, rows) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const startKey = `${start.x},${start.y}`;
        const endKey = `${end.x},${end.y}`;
        
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(start, end));
        
        while (openSet.length > 0) {
            // 找到fScore最小的节点
            let current = openSet[0];
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                const node = openSet[i];
                const nodeKey = `${node.x},${node.y}`;
                const currentKey = `${current.x},${current.y}`;
                
                if (fScore.get(nodeKey) < fScore.get(currentKey)) {
                    current = node;
                    currentIndex = i;
                }
            }
            
            openSet.splice(currentIndex, 1);
            
            // 到达终点
            if (`${current.x},${current.y}` === endKey) {
                return this.reconstructPath(cameFrom, current);
            }
            
            // 检查相邻节点
            const neighbors = this.getNeighbors(current, cols, rows);
            
            neighbors.forEach(neighbor => {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                const currentKey = `${current.x},${current.y}`;
                
                // 跳过障碍物
                if (obstacles.has(neighborKey)) return;
                
                const tentativeGScore = gScore.get(currentKey) + 1;
                
                if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, end));
                    
                    if (!openSet.some(node => `${node.x},${node.y}` === neighborKey)) {
                        openSet.push(neighbor);
                    }
                }
            });
        }
        
        return null; // 没有找到路径
    }

    /**
     * 启发式函数（曼哈顿距离）
     */
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    /**
     * 获取相邻节点
     */
    getNeighbors(node, cols, rows) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 },
            { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        directions.forEach(dir => {
            const neighbor = {
                x: node.x + dir.x,
                y: node.y + dir.y
            };
            
            if (neighbor.x >= 0 && neighbor.x < cols && neighbor.y >= 0 && neighbor.y < rows) {
                neighbors.push(neighbor);
            }
        });
        
        return neighbors;
    }

    /**
     * 重构路径
     */
    reconstructPath(cameFrom, current) {
        const path = [current];
        
        while (cameFrom.has(`${current.x},${current.y}`)) {
            current = cameFrom.get(`${current.x},${current.y}`);
            path.unshift(current);
        }
        
        return path;
    }

    /**
     * 绑定拖拽事件
     */
    bindDragEvents() {
        // 组件面板拖拽
        const componentItems = document.querySelectorAll('.component-item');
        componentItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
                e.dataTransfer.effectAllowed = 'copy';
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
            });
        });
        
        // 画布拖拽接收
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('text/plain');
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 转换为画布坐标
            const canvasX = (x - this.state.offsetX) / this.state.scale;
            const canvasY = (y - this.state.offsetY) / this.state.scale;
            
            if (componentType === 'node') {
                this.createNodeAt(canvasX, canvasY);
            } else if (componentType === 'edge') {
                this.startEdgeCreation(canvasX, canvasY);
            }
        });
    }

    /**
     * 在指定位置创建节点
     */
    createNodeAt(x, y) {
        const nodeId = `node_${Date.now()}`;
        const node = {
            id: nodeId,
            title: `节点${this.state.nodes.size + 1}`,
            type: 'basic',
            x: x,
            y: y,
            radius: 25,
            status: 'locked',
            points: 0,
            dependencies: [],
            dependencyLogic: 'AND'
        };
        
        this.state.nodes.set(nodeId, node);
        this.render();
        this.updateStats();
        this.showNotification('节点已创建', 'success');
    }

    /**
     * 开始连线创建
     */
    startEdgeCreation(x, y) {
        this.state.edgeCreationMode = true;
        this.state.tempEdgeStart = { x, y };
        this.showNotification('点击两个节点创建连线', 'info');
    }

    /**
     * 清空画布
     */
    clearCanvas() {
        if (confirm('确定要清空整个画布吗？')) {
            this.state.nodes.clear();
            this.state.edges = [];
            this.state.selectedNode = null;
            this.state.selectedEdge = null;
            this.render();
            this.updateStats();
            this.showNotification('画布已清空', 'info');
        }
    }

    /**
     * 保存图谱
     */
    saveGraph() {
        const graphData = {
            nodes: Array.from(this.state.nodes.entries()),
            edges: this.state.edges,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(graphData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `knowledge-graph-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('图谱已保存', 'success');
    }

    /**
     * 加载图谱
     */
    loadGraph() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const graphData = JSON.parse(e.target.result);
                        this.state.nodes = new Map(graphData.nodes);
                        this.state.edges = graphData.edges || [];
                        this.state.selectedNode = null;
                        this.state.selectedEdge = null;
                        this.render();
                        this.updateStats();
                        this.showNotification('图谱已加载', 'success');
                    } catch (error) {
                        this.showNotification('文件格式错误', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    /**
     * 删除选中元素
     */
    deleteSelected() {
        if (this.state.selectedNode) {
            // 删除节点及其相关连线
            const nodeId = this.state.selectedNode.id;
            this.state.nodes.delete(nodeId);
            this.state.edges = this.state.edges.filter(edge => 
                edge.from !== nodeId && edge.to !== nodeId
            );
            this.state.selectedNode = null;
            this.render();
            this.updateStats();
            this.showNotification('节点已删除', 'success');
        } else if (this.state.selectedEdge) {
            // 删除连线
            const edgeIndex = this.state.edges.indexOf(this.state.selectedEdge);
            if (edgeIndex > -1) {
                this.state.edges.splice(edgeIndex, 1);
            }
            this.state.selectedEdge = null;
            this.render();
            this.updateStats();
            this.showNotification('连线已删除', 'success');
        } else {
            this.showNotification('请先选择要删除的元素', 'error');
        }
    }

    /**
     * 保存布局（包括连线）
     */
    saveLayout() {
        try {
            const layoutData = {
                graphType: this.currentGraphType,
                nodes: Array.from(this.state.nodes.values()).map(node => ({
                    id: node.id,
                    x: node.x,
                    y: node.y
                })),
                edges: this.state.edges.map(edge => ({
                    from: edge.from,
                    to: edge.to
                })),
                timestamp: Date.now()
            };

            const layoutKey = `custom_layout_${this.currentGraphType}`;
            localStorage.setItem(layoutKey, JSON.stringify(layoutData));
            
            this.showNotification('布局和连线已保存！', 'success');
        } catch (error) {
            console.error('保存布局失败:', error);
            this.showNotification('保存布局失败', 'error');
        }
    }

    /**
     * 加载保存的布局（包括连线）
     */
    loadLayout(graphType) {
        try {
            const layoutKey = `custom_layout_${graphType}`;
            const savedLayout = localStorage.getItem(layoutKey);
            
            if (savedLayout) {
                const layoutData = JSON.parse(savedLayout);
                
                // 应用保存的节点坐标
                if (layoutData.nodes) {
                    layoutData.nodes.forEach(savedNode => {
                        const node = this.state.nodes.get(savedNode.id);
                        if (node) {
                            node.x = savedNode.x;
                            node.y = savedNode.y;
                        }
                    });
                }
                
                // 应用保存的连线
                if (layoutData.edges) {
                    this.state.edges = layoutData.edges.map(edge => ({
                        from: edge.from,
                        to: edge.to
                    }));
                }
                
                return true;
            }
        } catch (error) {
            console.error('加载布局失败:', error);
        }
        return false;
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `graph-notification ${type}`;
        notification.textContent = message;
        
        // 添加到画布容器
        const wrapper = document.querySelector('.knowledge-graph-wrapper');
        wrapper.appendChild(notification);
        
        // 3秒后移除
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * 节点对齐检测
     */
    snapToNodes(x, y) {
        const snapDistance = 30; // 对齐距离
        let nearestX = x;
        let nearestY = y;
        let snapped = false;
        
        this.state.nodes.forEach(node => {
            if (node === this.state.draggingNode) return;
            
            // 检查X轴对齐
            if (Math.abs(node.x - x) < snapDistance) {
                nearestX = node.x;
                snapped = true;
            }
            
            // 检查Y轴对齐
            if (Math.abs(node.y - y) < snapDistance) {
                nearestY = node.y;
                snapped = true;
            }
        });
        
        return { snapped, x: nearestX, y: nearestY };
    }

    /**
     * 检测两条线段是否相交（优化版本）
     * @param {Object} line1 - 第一条线段 {x1, y1, x2, y2}
     * @param {Object} line2 - 第二条线段 {x1, y1, x2, y2}
     * @param {boolean} excludeEndpoints - 是否排除端点接触
     * @returns {boolean} - 是否相交
     */
    doLinesIntersect(line1, line2, excludeEndpoints = true) {
        const { x1, y1, x2, y2 } = line1;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2;
        
        // 快速边界框检查
        const minX1 = Math.min(x1, x2);
        const maxX1 = Math.max(x1, x2);
        const minY1 = Math.min(y1, y2);
        const maxY1 = Math.max(y1, y2);
        
        const minX2 = Math.min(x3, x4);
        const maxX2 = Math.max(x3, x4);
        const minY2 = Math.min(y3, y4);
        const maxY2 = Math.max(y3, y4);
        
        // 边界框不重叠，肯定不相交
        if (maxX1 < minX2 || maxX2 < minX1 || maxY1 < minY2 || maxY2 < minY1) {
            return false;
        }
        
        // CCW算法
        const ccw = (px, py, qx, qy, rx, ry) => {
            const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
            if (Math.abs(val) < 0.0001) return 0; // 共线
            return val > 0 ? 1 : 2; // 1: 逆时针, 2: 顺时针
        };
        
        const o1 = ccw(x1, y1, x2, y2, x3, y3);
        const o2 = ccw(x1, y1, x2, y2, x4, y4);
        const o3 = ccw(x3, y3, x4, y4, x1, y1);
        const o4 = ccw(x3, y3, x4, y4, x2, y2);
        
        // 一般情况：方向不同则相交
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }
        
        if (excludeEndpoints) {
            return false;
        }
        
        // 特殊情况：共线时检查是否有重叠
        const onSegment = (px, py, qx, qy, rx, ry) => {
            return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
                   qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
        };
        
        if (o1 === 0 && onSegment(x1, y1, x3, y3, x2, y2)) return true;
        if (o2 === 0 && onSegment(x1, y1, x4, y4, x2, y2)) return true;
        if (o3 === 0 && onSegment(x3, y3, x1, y1, x4, y4)) return true;
        if (o4 === 0 && onSegment(x3, y3, x2, y2, x4, y4)) return true;
        
        return false;
    }

    /**
     * 获取线段与线段的交点
     */
    getLineIntersection(line1, line2) {
        const { x1, y1, x2, y2 } = line1;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2;
        
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        
        if (Math.abs(denom) < 0.0001) {
            return null; // 平行或重合
        }
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }
        
        return null;
    }

    /**
     * 检测边是否与其他边相交
     */
    detectEdgeCrossings(fromNode, toNode) {
        const testLine = {
            x1: fromNode.x,
            y1: fromNode.y,
            x2: toNode.x,
            y2: toNode.y
        };
        
        const crossings = [];
        
        this.state.edges.forEach(edge => {
            // 跳过自身相关的边
            if (edge.from === fromNode.id || edge.to === toNode.id ||
                edge.from === toNode.id || edge.to === fromNode.id) {
                return;
            }
            
            const edgeFrom = this.state.nodes.get(edge.from);
            const edgeTo = this.state.nodes.get(edge.to);
            
            if (!edgeFrom || !edgeTo) return;
            
            const existingLine = {
                x1: edgeFrom.x,
                y1: edgeFrom.y,
                x2: edgeTo.x,
                y2: edgeTo.y
            };
            
            if (this.doLinesIntersect(testLine, existingLine)) {
                const intersection = this.getLineIntersection(testLine, existingLine);
                if (intersection) {
                    crossings.push({
                        edge,
                        intersection,
                        fromNode: edgeFrom,
                        toNode: edgeTo
                    });
                }
            }
        });
        
        return crossings;
    }

    /**
     * 显示对齐指示器
     */
    showSnapIndicator(x, y) {
        // 移除旧的指示器
        const oldIndicators = document.querySelectorAll('.grid-snap-indicator');
        oldIndicators.forEach(indicator => indicator.remove());
        
        // 创建新的指示器
        const indicator = document.createElement('div');
        indicator.className = 'grid-snap-indicator';
        
        // 转换世界坐标到屏幕坐标
        const screenPos = this.worldToScreen(x, y);
        
        // 设置位置
        indicator.style.left = `${screenPos.x - 2}px`;
        indicator.style.top = `${screenPos.y - 2}px`;
        
        // 添加到容器
        const wrapper = document.querySelector('.knowledge-graph-wrapper');
        wrapper.appendChild(indicator);
        
        // 动画结束后移除
        setTimeout(() => {
            indicator.remove();
        }, 500);
    }

    /**
     * 获取指定位置的节点
     */
    getNodeAtPosition(screenX, screenY) {
        const worldPos = this.screenToWorld(screenX, screenY);
        
        for (const node of this.state.nodes.values()) {
            const dx = worldPos.x - node.x;
            const dy = worldPos.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= node.radius) {
                return node;
            }
        }
        
        return null;
    }

    /**
     * 获取指定位置的边
     */
    getEdgeAtPosition(screenX, screenY) {
        const worldPos = this.screenToWorld(screenX, screenY);
        const threshold = 10 / this.state.camera.zoom; // 点击阈值
        
        for (const edge of this.state.edges) {
            const fromNode = this.state.nodes.get(edge.from);
            const toNode = this.state.nodes.get(edge.to);
            
            if (!fromNode || !toNode) continue;
            
            // 计算点到线段的距离
            const distance = this.pointToLineDistance(
                worldPos.x, worldPos.y,
                fromNode.x, fromNode.y,
                toNode.x, toNode.y
            );
            
            if (distance <= threshold) {
                return edge;
            }
        }
        
        return null;
    }

    /**
     * 计算点到线段的距离
     */
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 屏幕坐标转世界坐标
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.state.camera.x) / this.state.camera.zoom,
            y: (screenY - this.state.camera.y) / this.state.camera.zoom
        };
    }

    /**
     * 世界坐标转屏幕坐标
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.state.camera.zoom + this.state.camera.x,
            y: worldY * this.state.camera.zoom + this.state.camera.y
        };
    }

    /**
     * 缩放
     */
    zoom(factor, centerX, centerY) {
        const oldZoom = this.state.camera.zoom;
        const newZoom = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, oldZoom * factor));
        
        if (centerX !== undefined && centerY !== undefined) {
            // 以鼠标位置为中心缩放
            const worldPos = this.screenToWorld(centerX, centerY);
            this.state.camera.zoom = newZoom;
            const newScreenPos = this.worldToScreen(worldPos.x, worldPos.y);
            this.state.camera.x += centerX - newScreenPos.x;
            this.state.camera.y += centerY - newScreenPos.y;
        } else {
            // 以画布中心缩放
            this.state.camera.zoom = newZoom;
        }
    }

    /**
     * 选择节点
     */
    selectNode(node) {
        this.state.selectedNode = node;
        this.showNodeDetail(node);
    }

    /**
     * 取消选择节点
     */
    deselectNode() {
        this.state.selectedNode = null;
        this.hideNodeDetail();
    }

    /**
     * 显示节点详情
     */
    showNodeDetail(node) {
        const panel = document.getElementById('nodeDetailPanel');
        const title = document.getElementById('nodeTitle');
        const description = document.getElementById('nodeDescription');
        const type = document.getElementById('nodeType');
        const points = document.getElementById('nodePoints');
        const status = document.getElementById('nodeStatus');
        const btn = document.getElementById('startLearningBtn');

        if (!panel) return;

        title.textContent = node.title;
        description.textContent = node.description;
        type.textContent = `类型：${this.getTypeLabel(node.type)}`;
        points.textContent = `积分：${node.points}`;

        // 获取解锁提示
        const unlockHint = node.getUnlockHint(this.state.completedNodes);

        // 设置状态显示
        switch (node.status) {
            case 'completed':
                status.textContent = '✅ 已完成';
                status.className = 'node-status completed';
                btn.style.display = 'none';
                break;
            case 'unlocked':
                status.textContent = '🔓 可学习';
                status.className = 'node-status unlocked';
                btn.style.display = 'block';
                btn.disabled = false;
                break;
            case 'locked':
                status.innerHTML = `🔒 未解锁<br><small class="text-xs text-gray-400 mt-1">${unlockHint}</small>`;
                status.className = 'node-status locked';
                btn.style.display = 'block';
                btn.disabled = true;
                break;
        }

        // 显示依赖信息
        if (node.dependencies && node.dependencies.length > 0 && node.status === 'locked') {
            this.showDependencyInfo(node, panel);
        }

        panel.classList.add('show');
    }

    /**
     * 显示依赖信息
     */
    showDependencyInfo(node, panel) {
        // 移除旧的依赖信息
        const oldDepInfo = panel.querySelector('.dependency-info');
        if (oldDepInfo) {
            oldDepInfo.remove();
        }

        const depInfo = document.createElement('div');
        depInfo.className = 'dependency-info';
        depInfo.innerHTML = '<h4 class="text-sm font-bold mt-4 mb-2">前置要求：</h4>';
        
        const depList = document.createElement('div');
        depList.className = 'dependency-list space-y-1';
        
        node.dependencies.forEach(depId => {
            const depNode = this.state.nodes.get(depId);
            if (depNode) {
                const isCompleted = this.state.completedNodes.has(depId);
                const depItem = document.createElement('div');
                depItem.className = `dependency-item ${isCompleted ? 'completed' : 'pending'}`;
                depItem.innerHTML = `
                    <span class="dep-status">${isCompleted ? '✓' : '○'}</span>
                    <span class="dep-title">${depNode.title}</span>
                `;
                depList.appendChild(depItem);
            }
        });
        
        depInfo.appendChild(depList);
        
        // 插入到按钮之前
        const btn = document.getElementById('startLearningBtn');
        btn.parentNode.insertBefore(depInfo, btn);
    }

    /**
     * 隐藏节点详情
     */
    hideNodeDetail() {
        const panel = document.getElementById('nodeDetailPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    /**
     * 获取类型标签
     */
    getTypeLabel(type) {
        const labels = {
            'start': '起始节点',
            'major': '重要知识点',
            'test': '测试节点',
            'normal': '普通节点'
        };
        return labels[type] || '普通节点';
    }

    /**
     * 开始学习
     */
    startLearning() {
        const node = this.state.selectedNode;
        if (!node || node.status !== 'unlocked') {
            return;
        }

        // 触发学习事件
        const event = new CustomEvent('startLearning', {
            detail: {
                nodeId: node.id,
                blockId: node.blockId,
                title: node.title
            }
        });
        window.dispatchEvent(event);

    }

    /**
     * 居中显示起始节点
     */
    centerOnStartNode() {
        const startNode = Array.from(this.state.nodes.values()).find(n => n.type === 'start');
        if (startNode) {
            this.state.camera.x = this.config.width / 2 - startNode.x * this.state.camera.zoom;
            this.state.camera.y = this.config.height / 2 - startNode.y * this.state.camera.zoom;
        }
    }

    /**
     * 重置进度
     */
    async resetProgress() {
        if (!confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
            return;
        }

        try {
            // 清除所有节点的完成状态
            for (const node of this.state.nodes.values()) {
                if (node.blockId) {
                    await learningProgress.deleteProgress(node.blockId);
                }
            }

            this.state.completedNodes.clear();
            this.updateUnlockStatus();

            alert('学习进度已重置！');
        } catch (error) {
            console.error('重置进度失败:', error);
            alert('重置进度失败，请稍后重试');
        }
    }

    /**
     * 标记节点为完成
     */
    async completeNode(nodeId) {
        const node = this.state.nodes.get(nodeId);
        if (!node) return;

        this.state.completedNodes.add(nodeId);
        node.status = 'completed';
        this.updateUnlockStatus();

        
        // 检查是否有新解锁的节点
        this.checkNewUnlocks();
    }

    /**
     * 检查新解锁的节点
     */
    checkNewUnlocks() {
        const newUnlocks = [];
        
        this.state.nodes.forEach(node => {
            if (node.status === 'unlocked' && !this.state.unlockedNodes.has(node.id)) {
                newUnlocks.push(node);
                this.state.unlockedNodes.add(node.id);
            }
        });

        if (newUnlocks.length > 0) {
            this.showUnlockNotification(newUnlocks);
        }
    }

    /**
     * 显示解锁通知
     */
    showUnlockNotification(nodes) {
        const message = nodes.length === 1
            ? `🎉 解锁新知识点：${nodes[0].title}`
            : `🎉 解锁了 ${nodes.length} 个新知识点！`;
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * 开始渲染循环
     */
    startRenderLoop() {
        const loop = () => {
            this.render();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * 停止渲染循环
     */
    stopRenderLoop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * 渲染图谱
     */
    render() {
        if (!this.ctx) return;

        // 清空画布
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);

        // 绘制背景
        this.drawBackground();

        // 保存当前状态
        this.ctx.save();

        // 应用相机变换
        this.ctx.translate(this.state.camera.x, this.state.camera.y);
        this.ctx.scale(this.state.camera.zoom, this.state.camera.zoom);

        // 绘制网格背景（仅在编辑模式）
        if (this.state.layoutMode === 'edit' && this.config.snapToGrid) {
            this.drawGrid();
        }

        // 绘制连接线
        this.drawEdges();

        // 绘制节点
        this.drawNodes();

        // 恢复状态
        this.ctx.restore();
    }

    /**
     * 绘制网格背景
     */
    drawGrid() {
        const gridSize = this.config.gridSize;
        const canvasWidth = this.config.width / this.state.camera.zoom;
        const canvasHeight = this.config.height / this.state.camera.zoom;
        
        // 计算网格范围
        const startX = -this.state.camera.x / this.state.camera.zoom;
        const startY = -this.state.camera.y / this.state.camera.zoom;
        const endX = startX + canvasWidth;
        const endY = startY + canvasHeight;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 绘制垂直线
        for (let x = Math.floor(startX / gridSize) * gridSize; x <= endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
        
        // 绘制水平线
        for (let y = Math.floor(startY / gridSize) * gridSize; y <= endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        // 渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);

        // 网格线
        this.drawGrid();
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        const gridSize = 50;
        const offsetX = this.state.camera.x % (gridSize * this.state.camera.zoom);
        const offsetY = this.state.camera.y % (gridSize * this.state.camera.zoom);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // 垂直线
        for (let x = offsetX; x < this.config.width; x += gridSize * this.state.camera.zoom) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.height);
            this.ctx.stroke();
        }

        // 水平线
        for (let y = offsetY; y < this.config.height; y += gridSize * this.state.camera.zoom) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * 绘制连接线
     */
    drawEdges() {
        // 按层级分组边，避免交叉
        const edgesByLayer = this.groupEdgesByLayer();
        
        edgesByLayer.forEach((layerEdges, layerIndex) => {
            layerEdges.forEach((edge, edgeIndex) => {
                const fromNode = this.state.nodes.get(edge.from);
                const toNode = this.state.nodes.get(edge.to);

                if (!fromNode || !toNode) return;

                // 检查是否是选中的边
                const isSelected = this.state.selectedEdge === edge;
                const isHovered = this.state.hoveredEdge === edge;

                // 确定线条颜色和样式
                let strokeStyle = 'rgba(255, 255, 255, 0.2)';
                let lineWidth = 2;

                if (isSelected) {
                    strokeStyle = 'rgba(245, 158, 11, 0.9)'; // 橙色高亮
                    lineWidth = 4;
                } else if (isHovered) {
                    strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    lineWidth = 3;
                } else if (fromNode.status === 'completed') {
                    strokeStyle = 'rgba(16, 185, 129, 0.5)';
                    lineWidth = 3;
                }

                this.ctx.strokeStyle = strokeStyle;
                this.ctx.lineWidth = lineWidth;
                this.ctx.lineCap = 'round';

                // 计算偏移，避免重叠
                const offset = this.calculateEdgeOffset(layerEdges, edgeIndex, fromNode, toNode);
                
                // 绘制优化的连接线（传递节点信息）
                this.drawOptimizedLine(fromNode.x, fromNode.y, toNode.x, toNode.y, offset, fromNode, toNode);
            });
        });

        // 绘制临时连线
        if (this.state.edgeEditMode && this.state.connectingFrom && this.state.tempEdgeTo) {
            this.drawTemporaryEdge();
        }
    }

    /**
     * 绘制临时连线
     */
    drawTemporaryEdge() {
        const from = this.state.connectingFrom;
        const to = this.state.tempEdgeTo;
        
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'; // 蓝色虚线
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]); // 重置虚线
    }

    /**
     * 按层级分组边，减少交叉
     */
    groupEdgesByLayer() {
        const edgesByLayer = new Map();
        
        this.state.edges.forEach(edge => {
            const fromNode = this.state.nodes.get(edge.from);
            const toNode = this.state.nodes.get(edge.to);
            
            if (!fromNode || !toNode) return;
            
            // 计算边的层级（从哪个层级到哪个层级）
            const fromLayer = this.getNodeLayer(fromNode);
            const toLayer = this.getNodeLayer(toNode);
            const layerKey = `${fromLayer}-${toLayer}`;
            
            if (!edgesByLayer.has(layerKey)) {
                edgesByLayer.set(layerKey, []);
            }
            edgesByLayer.get(layerKey).push(edge);
        });
        
        // 按层级排序
        const sortedLayers = Array.from(edgesByLayer.entries())
            .sort(([a], [b]) => {
                const [aFrom, aTo] = a.split('-').map(Number);
                const [bFrom, bTo] = b.split('-').map(Number);
                return (aFrom + aTo) - (bFrom + bTo);
            });
        
        return new Map(sortedLayers);
    }

    /**
     * 获取节点层级
     */
    getNodeLayer(node) {
        // 基于距离中心的距离估算层级
        const distance = Math.sqrt(node.x * node.x + node.y * node.y);
        return Math.round(distance / 180); // 假设每层间距180
    }

    /**
     * 计算边的偏移，避免重叠
     */
    calculateEdgeOffset(layerEdges, edgeIndex, fromNode, toNode) {
        const totalEdges = layerEdges.length;
        if (totalEdges === 1) return 0;
        
        // 计算边的角度
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        
        // 为每条边分配不同的偏移
        const maxOffset = 20; // 最大偏移距离
        const offsetStep = (maxOffset * 2) / totalEdges;
        const offset = -maxOffset + edgeIndex * offsetStep;
        
        // 垂直于边的方向偏移
        const perpAngle = angle + Math.PI / 2;
        return {
            x: Math.cos(perpAngle) * offset,
            y: Math.sin(perpAngle) * offset
        };
    }

    /**
     * 绘制优化的连接线（无交叉版本）
     */
    drawOptimizedLine(x1, y1, x2, y2, offset, fromNode, toNode) {
        if (offset) {
            // 应用偏移
            x1 += offset.x;
            y1 += offset.y;
            x2 += offset.x;
            y2 += offset.y;
        }

        // 选择绘制方式
        if (this.config.smartRouting && fromNode && toNode) {
            this.drawSmartRoutedPath(x1, y1, x2, y2, fromNode, toNode);
        } else if (this.config.avoidCrossing && fromNode && toNode) {
            this.drawNoCrossingPath(x1, y1, x2, y2, fromNode, toNode);
        } else {
            // 原始绘制逻辑
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                // 距离很近，绘制直线
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            } else {
                // 距离较远，绘制曲线
                const curveOffset = distance * 0.15;
                const angle = Math.atan2(dy, dx);
                const perpAngle = angle + Math.PI / 2;
                
                const cx = (x1 + x2) / 2 + Math.cos(perpAngle) * curveOffset;
                const cy = (y1 + y2) / 2 + Math.sin(perpAngle) * curveOffset;

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.quadraticCurveTo(cx, cy, x2, y2);
                this.ctx.stroke();
            }
        }

        // 绘制箭头
        const arrowAngle = Math.atan2(y2 - y1, x2 - x1);
        this.drawArrow(x2, y2, arrowAngle);
    }

    /**
     * 绘制无交叉路径
     */
    drawNoCrossingPath(x1, y1, x2, y2, fromNode, toNode) {
        // 检测是否有交叉
        const crossings = this.detectEdgeCrossings(fromNode, toNode);
        
        if (crossings.length === 0) {
            // 没有交叉，使用简单曲线
            this.drawSimpleBezierCurve(x1, y1, x2, y2);
        } else {
            // 有交叉，使用边捆绑技术
            if (this.config.edgeBundling) {
                this.drawBundledPath(x1, y1, x2, y2, fromNode, toNode, crossings);
            } else {
                // 使用避障路径
                this.drawAvoidancePath(x1, y1, x2, y2, fromNode, toNode, crossings);
            }
        }
    }

    /**
     * 绘制捆绑路径（Edge Bundling）
     */
    drawBundledPath(x1, y1, x2, y2, fromNode, toNode, crossings) {
        // 计算中心点作为捆绑点
        const bundlePoint = this.calculateBundlePoint(fromNode, toNode);
        
        if (bundlePoint) {
            // 通过捆绑点绘制路径
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            
            // 使用三次贝塞尔曲线连接到捆绑点
            const cp1x = x1 + (bundlePoint.x - x1) * 0.3;
            const cp1y = y1 + (bundlePoint.y - y1) * 0.3;
            const cp2x = x1 + (bundlePoint.x - x1) * 0.7;
            const cp2y = y1 + (bundlePoint.y - y1) * 0.7;
            
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, bundlePoint.x, bundlePoint.y);
            
            // 从捆绑点连接到目标
            const cp3x = bundlePoint.x + (x2 - bundlePoint.x) * 0.3;
            const cp3y = bundlePoint.y + (y2 - bundlePoint.y) * 0.3;
            const cp4x = bundlePoint.x + (x2 - bundlePoint.x) * 0.7;
            const cp4y = bundlePoint.y + (y2 - bundlePoint.y) * 0.7;
            
            this.ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, x2, y2);
            this.ctx.stroke();
        } else {
            // 回退到避障路径
            this.drawAvoidancePath(x1, y1, x2, y2, fromNode, toNode, crossings);
        }
    }

    /**
     * 计算捆绑点
     */
    calculateBundlePoint(fromNode, toNode) {
        // 获取两个节点的层级
        const fromLayer = this.getNodeLayer(fromNode);
        const toLayer = this.getNodeLayer(toNode);
        
        // 如果是同层或相邻层，不使用捆绑
        if (Math.abs(fromLayer - toLayer) <= 1) {
            return null;
        }
        
        // 计算中间层级
        const midLayer = Math.floor((fromLayer + toLayer) / 2);
        
        // 在中间层级找到一个合适的捆绑点
        // 使用极坐标系统计算
        const fromAngle = Math.atan2(fromNode.y, fromNode.x);
        const toAngle = Math.atan2(toNode.y, toNode.x);
        const avgAngle = (fromAngle + toAngle) / 2;
        
        const radius = midLayer * this.config.nodeSpacing;
        
        return {
            x: radius * Math.cos(avgAngle),
            y: radius * Math.sin(avgAngle)
        };
    }

    /**
     * 绘制简单贝塞尔曲线
     */
    drawSimpleBezierCurve(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 50) {
            // 直线
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else {
            // 三次贝塞尔曲线
            const angle = Math.atan2(dy, dx);
            const controlDist = distance * 0.3;
            
            const cp1x = x1 + Math.cos(angle) * controlDist;
            const cp1y = y1 + Math.sin(angle) * controlDist;
            const cp2x = x2 - Math.cos(angle) * controlDist;
            const cp2y = y2 - Math.sin(angle) * controlDist;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
            this.ctx.stroke();
        }
    }

    /**
     * 绘制避障路径
     */
    drawAvoidancePath(x1, y1, x2, y2, fromNode, toNode, crossings) {
        // 计算避障方向
        const avoidanceDir = this.calculateAvoidanceDirection(x1, y1, x2, y2, crossings);
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // 根据避障方向计算控制点
        const perpAngle = angle + Math.PI / 2;
        const controlDist = distance * 0.35;
        const avoidanceDist = this.config.routingPadding * avoidanceDir;
        
        // 使用三次贝塞尔曲线，通过控制点避开交叉点
        const cp1x = x1 + Math.cos(angle) * controlDist * 0.5 + Math.cos(perpAngle) * avoidanceDist;
        const cp1y = y1 + Math.sin(angle) * controlDist * 0.5 + Math.sin(perpAngle) * avoidanceDist;
        
        const cp2x = x2 - Math.cos(angle) * controlDist * 0.5 + Math.cos(perpAngle) * avoidanceDist;
        const cp2y = y2 - Math.sin(angle) * controlDist * 0.5 + Math.sin(perpAngle) * avoidanceDist;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
        this.ctx.stroke();
    }

    /**
     * 计算避障方向
     */
    calculateAvoidanceDirection(x1, y1, x2, y2, crossings) {
        if (crossings.length === 0) return 1;
        
        // 计算线段的中点
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // 计算所有交叉点的平均位置
        let avgCrossingX = 0;
        let avgCrossingY = 0;
        crossings.forEach(crossing => {
            avgCrossingX += crossing.intersection.x;
            avgCrossingY += crossing.intersection.y;
        });
        avgCrossingX /= crossings.length;
        avgCrossingY /= crossings.length;
        
        // 计算避障方向（向交叉点的反方向）
        const dx = x2 - x1;
        const dy = y2 - y1;
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;
        
        // 判断交叉点在线段的哪一侧
        const crossVector = {
            x: avgCrossingX - midX,
            y: avgCrossingY - midY
        };
        
        const perpVector = {
            x: Math.cos(perpAngle),
            y: Math.sin(perpAngle)
        };
        
        // 叉积判断方向
        const cross = crossVector.x * perpVector.y - crossVector.y * perpVector.x;
        
        // 返回避障方向（1或-1）
        return cross > 0 ? -1 : 1;
    }

    /**
     * 绘制曲线（保留原方法作为备用）
     */
    drawCurvedLine(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 控制点偏移
        const offset = distance * 0.2;
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;
        
        const cx = (x1 + x2) / 2 + Math.cos(perpAngle) * offset;
        const cy = (y1 + y2) / 2 + Math.sin(perpAngle) * offset;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(cx, cy, x2, y2);
        this.ctx.stroke();

        // 绘制箭头
        this.drawArrow(x2, y2, Math.atan2(y2 - cy, x2 - cx));
    }

    /**
     * 绘制箭头
     */
    drawArrow(x, y, angle) {
        const arrowSize = 8;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-arrowSize, -arrowSize / 2);
        this.ctx.lineTo(-arrowSize, arrowSize / 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * 绘制节点
     */
    drawNodes() {
        this.state.nodes.forEach(node => {
            this.drawNode(node);
        });
    }

    /**
     * 绘制单个节点
     */
    drawNode(node) {
        const isSelected = this.state.selectedNode === node;
        const isDragging = this.state.draggingNode === node;
        const isEditMode = this.state.layoutMode === 'edit';
        
        // 拖拽状态：添加阴影效果
        if (isDragging) {
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        
        // 节点外圈（选中效果）
        if (isSelected) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // 编辑模式：显示可拖拽指示
        if (isEditMode && !isDragging) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        // 节点主体
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // 根据状态设置颜色
        switch (node.status) {
            case 'completed':
                this.ctx.fillStyle = node.color;
                this.ctx.globalAlpha = 1;
                break;
            case 'unlocked':
                this.ctx.fillStyle = node.color;
                this.ctx.globalAlpha = 0.7;
                break;
            case 'locked':
                this.ctx.fillStyle = '#475569';
                this.ctx.globalAlpha = 0.5;
                break;
        }

        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        // 节点边框
        if (isDragging) {
            this.ctx.strokeStyle = '#fbbf24'; // 拖拽时显示黄色边框
            this.ctx.lineWidth = 3;
        } else {
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
        }
        this.ctx.stroke();

        // 恢复阴影效果
        if (isDragging) {
            this.ctx.restore();
        }

        // 绘制状态图标
        this.drawNodeIcon(node);

        // 绘制节点标题
        this.drawNodeLabel(node);
        
        // 编辑模式：在节点上显示拖拽图标
        if (isEditMode && !isDragging) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('⋮⋮', node.x, node.y + node.radius + 15);
        }
    }

    /**
     * 绘制节点图标
     */
    drawNodeIcon(node) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${node.radius / 2}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        let icon = '';
        switch (node.status) {
            case 'completed':
                icon = '✓';
                break;
            case 'unlocked':
                icon = node.type === 'test' ? '?' : '○';
                break;
            case 'locked':
                icon = '🔒';
                break;
        }

        this.ctx.fillText(icon, node.x, node.y);
    }

    /**
     * 绘制节点标签
     */
    drawNodeLabel(node) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        // 绘制阴影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        
        this.ctx.fillText(node.title, node.x, node.y + node.radius + 10);
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }

    /**
     * 销毁管理器
     */
    destroy() {
        this.stopRenderLoop();
        
        // 移除事件监听
        if (this.canvas) {
            this.canvas.remove();
        }
        
        // 清空数据
        this.state.nodes.clear();
        this.state.edges = [];
        this.state.completedNodes.clear();
        this.state.unlockedNodes.clear();
        
    }
}

export default KnowledgeGraphManager;

