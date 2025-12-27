INSERT INTO lctmr_blocks (id, section_id, title, sort_order, content_markdown, video_url, quiz_question, quiz_options, correct_answer_index, created_at, document_url, content_html, content_format) VALUES ('7cc4fca9-eb7d-4832-8af2-247273817f54', 'bfc065ab-2881-4c50-a1d6-938a051941e7', '123', 0, '', '', '', NULL, NULL, '2025-10-09 19:48:30.746116+08', '', '<!-- 最终修复版交互式学习HTML - 可直接复制到内容块中 -->
<div id="interactiveLearning" style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- 头部 -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">📚 交互式学习：流程管理基础</h2>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">通过对话式学习，逐步了解流程管理的核心概念</p>
    </div>
    
    <!-- 进度条 -->
    <div style="padding: 20px 20px 0 20px;">
        <div style="width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
            <div id="learningProgressBar" style="height: 100%; background: linear-gradient(90deg, #4f46e5, #7c3aed); width: 20%; transition: width 0.3s ease;"></div>
        </div>
        <div style="text-align: center; margin: 10px 0; color: #6b7280; font-size: 14px;">
            <span id="learningStepCounter">步骤 1 / 5</span>
        </div>
    </div>
    
    <!-- 学习内容 -->
    <div style="padding: 20px; min-height: 400px;">
        
        <!-- 步骤1：什么是流程 -->
        <div class="learn-step" data-step="1" style="display: block;">
            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🤔 什么是流程？</h3>
            <div style="line-height: 1.8; color: #374151;">
                <p>让我们从一个简单的问题开始：<strong>什么是流程？</strong></p>
                
                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0369a1; margin-top: 0;">💡 流程的定义</h4>
                    <p><strong>流程是一系列相互关联的活动，按照特定的顺序执行，以实现特定的目标或结果。</strong></p>
                </div>
                
                <p>想象一下您每天早上起床的过程：</p>
                <ul>
                    <li>闹钟响起</li>
                    <li>起床</li>
                    <li>洗漱</li>
                    <li>吃早餐</li>
                    <li>出门上班</li>
                </ul>
                <p>这就是一个典型的<strong>日常流程</strong>！</p>
            </div>
        </div>

        <!-- 步骤2：流程的特征 -->
        <div class="learn-step" data-step="2" style="display: none;">
            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🔍 流程的基本特征</h3>
            <div style="line-height: 1.8; color: #374151;">
                <p>每个有效的流程都具有以下基本特征：</p>
                
                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0369a1; margin-top: 0;">📋 流程的核心特征</h4>
                    <ol>
                        <li><strong>目标明确</strong>：每个流程都有明确的输出或结果</li>
                        <li><strong>步骤有序</strong>：活动按照逻辑顺序执行</li>
                        <li><strong>可重复</strong>：流程可以反复执行</li>
                        <li><strong>可测量</strong>：可以用指标来衡量流程的效果</li>
                    </ol>
                </div>
                
                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <h5 style="color: #92400e; margin-top: 0;">🌰 实际例子：咖啡制作流程</h5>
                    <p><strong>目标</strong>：制作一杯美味的咖啡</p>
                    <p><strong>步骤</strong>：研磨咖啡豆 → 加热水 → 冲泡 → 过滤 → 装杯</p>
                </div>
            </div>
        </div>

        <!-- 步骤3：什么是流程管理 -->
        <div class="learn-step" data-step="3" style="display: none;">
            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">⚙️ 什么是流程管理？</h3>
            <div style="line-height: 1.8; color: #374151;">
                <p>现在您已经了解了什么是流程，接下来让我们学习<strong>流程管理</strong>。</p>
                
                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0369a1; margin-top: 0;">🎯 流程管理的定义</h4>
                    <p><strong>流程管理是对组织内各种业务流程进行规划、设计、执行、监控和优化的系统性管理活动。</strong></p>
                </div>
                
                <p>流程管理的核心目标：</p>
                <ul>
                    <li><strong>提高效率</strong>：消除不必要的步骤，减少浪费</li>
                    <li><strong>保证质量</strong>：确保每个步骤都按照标准执行</li>
                    <li><strong>降低成本</strong>：通过优化流程减少资源消耗</li>
                    <li><strong>增强一致性</strong>：确保每次执行都得到相同的结果</li>
                </ul>
            </div>
        </div>

        <!-- 步骤4：什么是业务流程 -->
        <div class="learn-step" data-step="4" style="display: none;">
            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🏢 什么是业务流程？</h3>
            <div style="line-height: 1.8; color: #374151;">
                <p>在组织中，我们经常听到<strong>业务流程</strong>这个术语。</p>
                
                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0369a1; margin-top: 0;">💼 业务流程的定义</h4>
                    <p><strong>业务流程是为了实现特定业务目标而设计的一系列标准化活动，通常跨越多个部门或功能区域。</strong></p>
                </div>
                
                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <h5 style="color: #92400e; margin-top: 0;">📦 客户服务流程示例</h5>
                    <p><strong>涉及部门</strong>：客服部、技术部、财务部</p>
                    <ol>
                        <li>客户提交问题</li>
                        <li>客服部门初步处理</li>
                        <li>技术部门提供解决方案</li>
                        <li>财务部门处理退款（如需要）</li>
                        <li>客户满意度调查</li>
                    </ol>
                </div>
            </div>
        </div>

        <!-- 步骤5：总结 -->
        <div class="learn-step" data-step="5" style="display: none;">
            <h3 style="color: #1f2937; border-left: 4px solid #4f46e5; padding-left: 15px; margin-bottom: 20px;">🎉 学习总结</h3>
            <div style="line-height: 1.8; color: #374151;">
                <p>恭喜您完成了流程管理基础学习！让我们回顾一下今天学到的内容：</p>
                
                <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #0369a1; margin-top: 0;">📚 知识要点回顾</h4>
                    <ul>
                        <li><strong>流程</strong>：一系列相互关联的活动，按照特定顺序执行</li>
                        <li><strong>流程管理</strong>：对业务流程进行规划、设计、执行、监控和优化</li>
                        <li><strong>业务流程</strong>：跨部门的标准化活动，以实现业务目标</li>
                    </ul>
                </div>
                
                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <h5 style="color: #92400e; margin-top: 0;">🤔 思考题</h5>
                    <ol>
                        <li>您的工作中有哪些常见的流程？</li>
                        <li>这些流程是否还有改进的空间？</li>
                        <li>如何衡量一个流程的效果？</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 导航按钮 -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <button id="learnPrevBtn" disabled style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; opacity: 0.5;">← 上一步</button>
        <button id="learnNextBtn" style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">下一步 →</button>
    </div>
</div>

<script>
(function() {
    var currentStep = 1;
    var totalSteps = 5;

    function changeStep(direction) {
        currentStep += direction;
        
        if (currentStep < 1) currentStep = 1;
        if (currentStep > totalSteps) currentStep = totalSteps;
        
        updateDisplay();
        
        if (currentStep === totalSteps && direction === 1) {
            setTimeout(function() {
                alert(''🎉 恭喜您完成了流程管理基础学习！'');
            }, 500);
        }
    }

    function updateDisplay() {
        // 更新步骤显示
        var steps = document.querySelectorAll(''#interactiveLearning .learn-step'');
        for (var i = 0; i < steps.length; i++) {
            steps[i].style.display = ''none'';
        }
        var currentStepEl = document.querySelector(''#interactiveLearning .learn-step[data-step="'' + currentStep + ''"]'');
        if (currentStepEl) {
            currentStepEl.style.display = ''block'';
        }
        
        // 更新进度条
        var progress = (currentStep / totalSteps) * 100;
        var progressBar = document.getElementById(''learningProgressBar'');
        if (progressBar) {
            progressBar.style.width = progress + ''%'';
        }
        
        // 更新步骤计数器
        var counter = document.getElementById(''learningStepCounter'');
        if (counter) {
            counter.textContent = ''步骤 '' + currentStep + '' / '' + totalSteps;
        }
        
        // 更新按钮
        var prevBtn = document.getElementById(''learnPrevBtn'');
        var nextBtn = document.getElementById(''learnNextBtn'');
        
        if (prevBtn) {
            prevBtn.disabled = currentStep === 1;
            prevBtn.style.opacity = currentStep === 1 ? ''0.5'' : ''1'';
            prevBtn.style.cursor = currentStep === 1 ? ''not-allowed'' : ''pointer'';
        }
        
        if (nextBtn) {
            if (currentStep === totalSteps) {
                nextBtn.textContent = ''完成学习 ✓'';
                nextBtn.style.background = ''#10b981'';
            } else {
                nextBtn.textContent = ''下一步 →'';
                nextBtn.style.background = ''#4f46e5'';
            }
        }
    }

    // 绑定按钮事件
    document.getElementById(''learnPrevBtn'').addEventListener(''click'', function() {
        changeStep(-1);
    });
    
    document.getElementById(''learnNextBtn'').addEventListener(''click'', function() {
        changeStep(1);
    });

    // 初始化
    updateDisplay();
})();
</script>', 'html');
INSERT INTO lctmr_blocks (id, section_id, title, sort_order, content_markdown, video_url, quiz_question, quiz_options, correct_answer_index, created_at, document_url, content_html, content_format) VALUES ('717de790-a699-44ed-9275-4cc97878b61f', '851efde3-e8e1-48ea-9bdc-656ed9b0fce5', '流程的定义', 0, '', '', '', NULL, NULL, '2025-10-11 15:52:05.384437+08', '', '<script type="application/json" data-conversation>
{
  "title": "流程管理基础概念详解",
  "conversations": [
    {
      "id": 1,
      "type": "text",
      "content": "嗨！今天我们来聊聊流程管理的基础概念，这是企业规范运作的重要基石哦！"
    },
    {
      "id": 2,
      "type": "text",
      "content": "流程就像做菜的食谱，通过一系列有序活动，将输入转化为有价值的输出。"
    },
    {
      "id": 3,
      "type": "text",
      "content": "它承载着公司政策、质量管理、内控等要求，是企业管理的核心支撑体系。"
    },
    {
      "id": 4,
      "type": "text",
      "content": "记住：流程不是政策，但必须遵从政策；流程也不等于IT，IT只是固化关键动作。"
    },
    {
      "id": 5,
      "type": "test",
      "question": "关于流程的描述，以下哪项最准确？",
      "options": [
        "流程就是公司的政策文件",
        "流程是通过有序活动将输入转化为有价值输出的业务运作规则",
        "流程等同于IT系统",
        "流程只是形式化的文档"
      ],
      "correctAnswer": 1,
      "explanation": "完全正确！流程是通过可重复、有逻辑顺序的活动，将输入转换为明确、可度量、有价值输出的业务运作规则。"
    },
    {
      "id": 6,
      "type": "text",
      "content": "流程文件有六种类型：手册、程序、规范、指导书、模板和检查表，各司其职。"
    },
    {
      "id": 7,
      "type": "text",
      "content": "程序文件是流程的骨架，描述必须执行的活动和要求，包括流程图和说明。"
    },
    {
      "id": 8,
      "type": "text",
      "content": "规范文件是程序的补充，详述必须遵从的要求；指导书则提供建议性的方法。"
    },
    {
      "id": 9,
      "type": "text",
      "content": "模板确保输出一致性，检查表保证工作质量，它们都是流程执行的重要工具。"
    },
    {
      "id": 10,
      "type": "test",
      "question": "以下哪种流程文件描述的是必须执行的活动和要求？",
      "options": [
        "操作指导书",
        "模板文件",
        "程序文件",
        "检查表"
      ],
      "correctAnswer": 2,
      "explanation": "答对了！程序文件是流程基本要素的定义文件，描述且仅描述流程中必须执行的活动和必须遵循的要求。"
    },
    {
      "id": 11,
      "type": "text",
      "content": "流程分为六个层级：从L1流程分类到L6任务，层层细化，便于管理和执行。"
    },
    {
      "id": 12,
      "type": "text",
      "content": "L1流程分类体现公司价值链，L3流程是执行核心，L5活动落实到具体角色。"
    },
    {
      "id": 13,
      "type": "text",
      "content": "流程管理是持续改进的过程，包括规划、设计、执行、监控、评估到废止的全生命周期。"
    },
    {
      "id": 14,
      "type": "text",
      "content": "掌握这些基础概念，你就能更好地理解和参与企业的流程管理工作啦！"
    }
  ]
}
</script>
<div class="conversation-learning-container">
    <p>正在加载对话学习内容...</p>
</div>', 'html');
INSERT INTO lctmr_blocks (id, section_id, title, sort_order, content_markdown, video_url, quiz_question, quiz_options, correct_answer_index, created_at, document_url, content_html, content_format) VALUES ('292a589d-5587-47b6-8c86-9881f5a38465', '851efde3-e8e1-48ea-9bdc-656ed9b0fce5', '流程管理的定义', 1, '', '', '', NULL, NULL, '2025-10-11 16:24:39.954765+08', '', '<script type="application/json" data-conversation>
{
  "title": "流程管理基础概念详解",
  "conversations": [
    {
      "id": 1,
      "type": "text",
      "content": "嗨！今天我们来聊聊流程管理的基础概念，这是企业规范运作的重要基石哦！"
    },
    {
      "id": 2,
      "type": "text",
      "content": "流程就像做菜的食谱，通过一系列有序活动，将输入转化为有价值的输出。"
    },
    {
      "id": 3,
      "type": "text",
      "content": "它承载着公司政策、质量管理、内控等要求，是企业管理的核心支撑体系。"
    },
    {
      "id": 4,
      "type": "text",
      "content": "记住：流程不是政策，但必须遵从政策；流程也不等于IT，IT只是固化关键动作。"
    },
    {
      "id": 5,
      "type": "test",
      "question": "关于流程的描述，以下哪项最准确？",
      "options": [
        "流程就是公司的政策文件",
        "流程是通过有序活动将输入转化为有价值输出的业务运作规则",
        "流程等同于IT系统",
        "流程只是形式化的文档"
      ],
      "correctAnswer": 1,
      "explanation": "完全正确！流程是通过可重复、有逻辑顺序的活动，将输入转换为明确、可度量、有价值输出的业务运作规则。"
    },
    {
      "id": 6,
      "type": "text",
      "content": "流程文件有六种类型：手册、程序、规范、指导书、模板和检查表，各司其职。"
    },
    {
      "id": 7,
      "type": "text",
      "content": "程序文件是流程的骨架，描述必须执行的活动和要求，包括流程图和说明。"
    },
    {
      "id": 8,
      "type": "text",
      "content": "规范文件是程序的补充，详述必须遵从的要求；指导书则提供建议性的方法。"
    },
    {
      "id": 9,
      "type": "text",
      "content": "模板确保输出一致性，检查表保证工作质量，它们都是流程执行的重要工具。"
    },
    {
      "id": 10,
      "type": "test",
      "question": "以下哪种流程文件描述的是必须执行的活动和要求？",
      "options": [
        "操作指导书",
        "模板文件",
        "程序文件",
        "检查表"
      ],
      "correctAnswer": 2,
      "explanation": "答对了！程序文件是流程基本要素的定义文件，描述且仅描述流程中必须执行的活动和必须遵循的要求。"
    },
    {
      "id": 11,
      "type": "text",
      "content": "流程分为六个层级：从L1流程分类到L6任务，层层细化，便于管理和执行。"
    },
    {
      "id": 12,
      "type": "text",
      "content": "L1流程分类体现公司价值链，L3流程是执行核心，L5活动落实到具体角色。"
    },
    {
      "id": 13,
      "type": "text",
      "content": "流程管理是持续改进的过程，包括规划、设计、执行、监控、评估到废止的全生命周期。"
    },
    {
      "id": 14,
      "type": "text",
      "content": "掌握这些基础概念，你就能更好地理解和参与企业的流程管理工作啦！"
    }
  ]
}
</script>
<div class="conversation-learning-container">
    <p>正在加载对话学习内容...</p>
</div>', 'html');
