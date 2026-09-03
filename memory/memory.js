(function() {
    const container = document.getElementById('memory-app');
    if (!container) return;

    container.innerHTML = `
        <div class="mem-page root active" id="mem-page-list">
            <header class="mem-header">
                <button class="mem-icon-btn" id="mem-main-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-main-title">AI Memory</span>
                <button class="mem-icon-btn" id="mem-btn-add"><i data-lucide="plus"></i></button>
            </header>
            <div class="mem-body" id="mem-list-area"></div>
        </div>

        <div class="mem-page" id="mem-page-editor">
            <header class="mem-header">
                <button class="mem-icon-btn" id="mem-btn-back"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-edit-title">New Memory</span>
                <button class="mem-text-btn" id="mem-btn-save">Save</button>
            </header>
            <div class="mem-body">
                <textarea class="mem-textarea" id="mem-input" placeholder="Enter important events or rules..."></textarea>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    let currentRole = null;
    let memories = JSON.parse(localStorage.getItem('wuyo_memories')) || {};
    let editingId = null;
    let sourceApp = 'chat'; 

    const formatTime = (ts) => { const d = new Date(ts); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; };

    const renderList = () => {
        const listArea = document.getElementById('mem-list-area');
        
        // 💥 构建置顶的「AI 智能记忆总结」入口
        let html = `
            <div class="mem-summary-bar" id="btn-ai-summarize">
                <div style="display:flex; align-items:center; gap:8px;">
                    <i data-lucide="sparkles"></i>
                    <span>AI 智能提炼聊天总结</span>
                </div>
                <i data-lucide="chevron-right"></i>
            </div>
        `;

        if(!currentRole || !memories[currentRole] || memories[currentRole].length === 0) {
            html += `<div style="text-align:center; padding:40px 16px; color:#8E8E93; font-size:14px;">暂无长期记忆。<br>点击上方按钮可让 AI 自动总结聊天记录，或手动添加。</div>`;
        } else {
            memories[currentRole].forEach(mem => {
                html += `<div class="mem-item"><div class="mem-item-text">${mem.text.replace(/\n/g, '<br>')}</div><div class="mem-item-bottom"><span class="mem-item-time">${formatTime(mem.time)}</span><div class="mem-actions"><span class="mem-action-btn" onclick="window.editMemory('${mem.id}')"><i data-lucide="edit-2" style="width:14px;"></i>编辑</span><span class="mem-action-btn danger" onclick="window.deleteMemory('${mem.id}')"><i data-lucide="trash-2" style="width:14px;"></i>删除</span></div></div></div>`;
            });
        }
        listArea.innerHTML = html; 
        lucide.createIcons({ root: listArea });

        // 绑定一键总结事件
        document.getElementById('btn-ai-summarize').addEventListener('click', window.runAiMemorySummary);
    };

    window.openMemory = (roleId, roleName, source) => {
        currentRole = roleId;
        sourceApp = source || 'chat'; 
        document.getElementById('mem-main-title').textContent = roleName ? `${roleName}的记忆库` : 'AI Memory';
        document.getElementById('mem-page-list').classList.add('active');
        renderList();
    };

    document.getElementById('mem-main-back-btn').addEventListener('click', () => {
        container.style.display = 'none';
        const sourceContainer = document.getElementById(sourceApp + '-app');
        if (sourceContainer) sourceContainer.style.display = 'block';
        else document.getElementById('home-screen').style.display = 'flex';
    });

    document.getElementById('mem-btn-add').addEventListener('click', () => { editingId = null; document.getElementById('mem-input').value = ''; document.getElementById('mem-edit-title').textContent = '新建记忆'; document.getElementById('mem-page-editor').classList.add('active'); });
    window.editMemory = (id) => { editingId = id; const mem = memories[currentRole].find(m => m.id === id); if(mem) { document.getElementById('mem-input').value = mem.text; document.getElementById('mem-edit-title').textContent = '编辑记忆'; document.getElementById('mem-page-editor').classList.add('active'); } };
    window.deleteMemory = (id) => { if(confirm('确定删除这条记忆吗？')) { memories[currentRole] = memories[currentRole].filter(m => m.id !== id); localStorage.setItem('wuyo_memories', JSON.stringify(memories)); renderList(); } };

    document.getElementById('mem-btn-save').addEventListener('click', () => {
        const text = document.getElementById('mem-input').value.trim(); if(!text) return alert("内容不能为空！");
        if(!memories[currentRole]) memories[currentRole] = [];
        if(editingId) { const mem = memories[currentRole].find(m => m.id === editingId); if(mem) { mem.text = text; mem.time = Date.now(); } } 
        else { memories[currentRole].unshift({ id: 'mem_'+Date.now(), text: text, time: Date.now() }); }
        localStorage.setItem('wuyo_memories', JSON.stringify(memories)); document.getElementById('mem-page-editor').classList.remove('active'); renderList();
    });

    document.getElementById('mem-btn-back').addEventListener('click', () => { document.getElementById('mem-page-editor').classList.remove('active'); });

    // ==========================================
    // 💥 核心功能：AI 自动阅读聊天记录并提炼成记忆
    // ==========================================
    window.runAiMemorySummary = async () => {
        const apiConfigStr = localStorage.getItem('wuyo_settings_api');
        if(!apiConfigStr) return alert("请先在设置中配置 API！");
        const apiConfig = JSON.parse(apiConfigStr);
        if(!apiConfig.chat || !apiConfig.chat.url || !apiConfig.chat.key) return alert("API 配置不完整！");

        // 读取当前角色的聊天记录
        const globalChat = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {};
        const chatHistory = globalChat[currentRole] || [];
        if(chatHistory.length === 0) return alert("当前没有聊天记录，无法进行总结！");

        const btn = document.getElementById('btn-ai-summarize');
        btn.innerHTML = `<div style="display:flex; align-items:center; gap:8px;"><i data-lucide="loader-2" class="animate-spin"></i><span>AI 正在提炼核心记忆中...</span></div>`;

        // 拼接发给 API 的提炼 Prompt
        const transcript = chatHistory.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
        const summaryPrompt = [
            { role: 'system', content: '你是一个高效的记忆总结助手。请分析以下 User 与 AI 的聊天对话，提取出关键的事实、双方约定的事情、User 的喜好或重要事件。请用简练的陈述句分条列出，不要废话。' },
            { role: 'user', content: transcript }
        ];

        try {
            const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
            const response = await fetch(cleanUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                body: JSON.stringify({ model: apiConfig.chat.model, messages: summaryPrompt, temperature: 0.3 })
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const resultText = data.choices[0].message.content.trim();

            if(resultText) {
                if(!memories[currentRole]) memories[currentRole] = [];
                memories[currentRole].unshift({ id: 'mem_'+Date.now(), text: `【AI 自动总结】\n${resultText}`, time: Date.now() });
                localStorage.setItem('wuyo_memories', JSON.stringify(memories));
                renderList();
                alert("记忆提炼成功！已自动写入长期记忆库。");
            }
        } catch(error) {
            alert(`总结失败: ${error.message}`);
            renderList();
        }
    };

    window.getMemoryContext = (roleId) => {
        if(!roleId || !memories[roleId] || memories[roleId].length === 0) return '';
        const memText = memories[roleId].map(m => `- ${m.text}`).join('\n');
        return `[SYSTEM: LONG-TERM MEMORY]\n以下是 User 与你之间发生的核心记忆，请你永远记住并基于此进行交流：\n${memText}`;
    };
})();
