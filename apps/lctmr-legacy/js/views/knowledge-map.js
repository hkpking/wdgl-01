/**
 * @file knowledge-map.js
 * @description 知识图谱视图 - 管理知识图谱的展示和交互
 * @version 1.0.0
 * @author LCTMR Team
 */

import { KnowledgeGraphManager } from '../components/knowledge-graph.js';
import { getGraphDataByType, defaultGraphData, autoLayout } from '../config/knowledge-graph-data.js';
import { learningProgress } from '../services/learning-progress.js';

export const KnowledgeMapView = {
    graphManager: null,
    currentGraphType: 'default',

    /**
     * 初始化知识图谱视图
     */
    async init() {
        
        // 绑定切换事件
        this.bindEvents();
        
        // 监听学习完成事件
        this.listenToLearningEvents();
    },

    /**
     * 显示知识图谱
     */
    async show(graphType = 'process-management') {
        try {
            
            this.currentGraphType = graphType;
            
            // 获取容器
            const container = document.getElementById('knowledge-map-container');
            if (!container) {
                console.error('❌ 知识图谱容器不存在');
                return;
            }

            // 清空容器
            container.innerHTML = '';

            // 获取图谱数据
            let graphData = getGraphDataByType(graphType);
            
            // 根据图谱类型选择布局算法
            const layoutType = graphType === 'spiderweb' ? 'spider' : 
                              graphType === 'programming' ? 'radial' : 
                              'hierarchical';
            
            // 自动布局
            graphData = autoLayout(graphData, {
                width: window.innerWidth,
                height: window.innerHeight,
                nodeSpacing: 150,
                layoutType: layoutType  // 使用对应的布局算法
            });

            // 创建图谱管理器
            if (this.graphManager) {
                this.graphManager.destroy();
            }
            
            this.graphManager = new KnowledgeGraphManager({
                width: window.innerWidth,
                height: window.innerHeight
            });

            // 初始化图谱
            await this.graphManager.initialize(container, graphData);

            // 添加统计面板
            this.addStatsPanel(container);

            // 添加图例
            this.addLegend(container);

        } catch (error) {
            console.error('显示知识图谱失败:', error);
        }
    },

    /**
     * 隐藏知识图谱
     */
    hide() {
        if (this.graphManager) {
            this.graphManager.destroy();
            this.graphManager = null;
        }
    },

    /**
     * 添加统计面板
     */
    addStatsPanel(container) {
        const statsPanel = document.createElement('div');
        statsPanel.className = 'graph-stats';
        statsPanel.innerHTML = `
            <div class="graph-stats-item">
                <span class="graph-stats-icon">📚</span>
                <span>总节点: <span class="graph-stats-value" id="totalNodes">0</span></span>
            </div>
            <div class="graph-stats-item">
                <span class="graph-stats-icon">✅</span>
                <span>已完成: <span class="graph-stats-value" id="completedNodes">0</span></span>
            </div>
            <div class="graph-stats-item">
                <span class="graph-stats-icon">🔓</span>
                <span>可学习: <span class="graph-stats-value" id="unlockedNodes">0</span></span>
            </div>
            <div class="graph-stats-item">
                <span class="graph-stats-icon">⭐</span>
                <span>总积分: <span class="graph-stats-value" id="totalPoints">0</span></span>
            </div>
        `;
        
        container.querySelector('.knowledge-graph-wrapper').appendChild(statsPanel);
        
        // 更新统计数据
        this.updateStats();
    },

    /**
     * 添加图例
     */
    addLegend(container) {
        const legend = document.createElement('div');
        legend.className = 'graph-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-dot start"></div>
                <span>起始节点</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot major"></div>
                <span>重要知识</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot test"></div>
                <span>测试节点</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot normal"></div>
                <span>普通节点</span>
            </div>
            <div class="legend-item">
                <div class="legend-dot locked"></div>
                <span>未解锁</span>
            </div>
        `;
        
        container.querySelector('.knowledge-graph-wrapper').appendChild(legend);
    },

    /**
     * 更新统计数据
     */
    updateStats() {
        if (!this.graphManager) return;

        const totalNodes = this.graphManager.state.nodes.size;
        const completedNodes = this.graphManager.state.completedNodes.size;
        const unlockedNodes = this.graphManager.state.unlockedNodes.size;
        
        // 计算总积分
        let totalPoints = 0;
        this.graphManager.state.completedNodes.forEach(nodeId => {
            const node = this.graphManager.state.nodes.get(nodeId);
            if (node) {
                totalPoints += node.points || 0;
            }
        });

        // 更新显示
        const totalNodesEl = document.getElementById('totalNodes');
        const completedNodesEl = document.getElementById('completedNodes');
        const unlockedNodesEl = document.getElementById('unlockedNodes');
        const totalPointsEl = document.getElementById('totalPoints');

        if (totalNodesEl) totalNodesEl.textContent = totalNodes;
        if (completedNodesEl) completedNodesEl.textContent = completedNodes;
        if (unlockedNodesEl) unlockedNodesEl.textContent = unlockedNodes - completedNodes;
        if (totalPointsEl) totalPointsEl.textContent = totalPoints;
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 监听图谱类型切换
        document.addEventListener('changeGraphType', (e) => {
            this.show(e.detail.type);
        });
    },

    /**
     * 监听学习事件
     */
    listenToLearningEvents() {
        // 监听开始学习事件
        window.addEventListener('startLearning', async (e) => {
            const { nodeId, blockId, title } = e.detail;

            // 触发显示学习内容
            this.showLearningContent(blockId, nodeId);
        });

        // 监听学习完成事件
        window.addEventListener('learningCompleted', async (e) => {
            const { blockId, nodeId } = e.detail;

            // 更新图谱节点状态
            if (this.graphManager && nodeId) {
                await this.graphManager.completeNode(nodeId);
                this.updateStats();
            }
        });
    },

    /**
     * 显示学习内容
     */
    async showLearningContent(blockId, nodeId) {
        try {
            // 这里可以集成到现有的课程学习系统
            // 隐藏知识图谱视图
            const mapView = document.getElementById('knowledge-map-view');
            if (mapView) {
                mapView.classList.remove('active');
            }

            // 显示课程视图
            const courseView = document.getElementById('course-view');
            if (courseView) {
                courseView.classList.add('active');
                
                // 触发加载对应的学习内容
                const event = new CustomEvent('loadLearningBlock', {
                    detail: { blockId, nodeId }
                });
                window.dispatchEvent(event);
            }
        } catch (error) {
            console.error('显示学习内容失败:', error);
        }
    },

    /**
     * 切换图谱类型
     */
    changeGraphType(type) {
        const event = new CustomEvent('changeGraphType', {
            detail: { type }
        });
        document.dispatchEvent(event);
    },

    /**
     * 销毁视图
     */
    destroy() {
        if (this.graphManager) {
            this.graphManager.destroy();
            this.graphManager = null;
        }
    }
};

export default KnowledgeMapView;

