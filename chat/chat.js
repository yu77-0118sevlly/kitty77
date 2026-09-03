(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 1. 初始化 DOM：中文界面，独立设置页，英文底栏
    container.innerHTML = `
        <div class="chat-page root active" id="chat-page-list">
            <header class="chat-header">
                <div style="width:32px;"></div>
                <span class="chat-header-title">微信</span>
                <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
            </header>
            <div class="chat-search-bar">
                <i data-lucide="search"></i>
                <input type="text" class="chat-search-input" placeholder="搜索">
            </div>
            <div class="chat-list-container" id="chat-list-render-area"></div>
            
            <div class="wechat-bottom-nav">
                <div class="wechat-nav-item active"><i data-lucide="message-square"></i><span>Chats</span></div>
                <div class="wechat-nav-item" id="nav-btn-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
                <div class="wechat-nav-item"><i data-lucide="compass"></i><span>Moments</span></div>
                <div class="wechat-nav-item"><i data-lucide="user"></i><span>Me</span></div>
            </div>
        </div>

        <div class="chat-page" id="chat-page-detail">
            <header class="chat-header">
                <button class="chat-icon-btn" id="chat-back-to-list"><i data-lucide="chevron-left"></i></button>
                <div class="chat-title-area">
                    <span class="chat-title" id="chat-char-name">AI</span>
                    <span class="chat-status" id="chat-status-text">在线</span>
                </div>
                <button class="chat-icon-btn" id="chat-btn-settings"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-input-area">
                <button class="chat-ext-btn"><i data-lucide="mic"></i></button>
                <textarea class="chat-input" id="chat-textarea" placeholder="发消息..." rows="1"></textarea>
                <button class="chat-ext-btn" id="chat-ext-ai" title="强制 AI 回复"><i data-lucide="bot"></i></button>
                <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
                <button class="chat-send-btn" id="chat-send-btn">发送</button>
            </div>
            
            <div class="chat-context-menu" id="chat-context-menu">
                <div class="ctx-item" id="ctx-btn-copy"><i data-lucide="copy"></i>复制</div>
                <div class="ctx-item" id="ctx-btn-reply"><i data-lucide="reply"></i>回复</div>
                <div class="ctx-item" id="ctx-btn-delete"><i data-lucide="trash-2"></i>删除</div>
            </div>
        </div>

        <!-- 💥 全新的独立设置页面 -->
        <div class="chat-page" id="chat-page-settings">
            <header class="chat-header">
                <button class="chat-icon-btn" id="chat-settings-back"><i data-lucide="chevron-left"></i></button>
                <span class="chat-header-title">聊天设置</span>
                <div style="width:32px;"></div>
            </header>
            <div style="flex:1; overflow-y:auto;">
                <div class="settings-list-group">
                    <div class="settings-list-item" id="settings-btn-profile">
                        <span>角色主页</span><i data-lucide="chevron-right"></i>
                    </div>
                    <div class="settings-list-item" id="settings-btn-memory">
                        <span>AI 长期记忆</span><i data-lucide="chevron-right"></i>
                    </div>
                </div>
                <div class="settings-list-group">
                    <div class="settings-list-item danger" id="settings-btn-clear">
                        清空聊天记录
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    // 底栏跳转
    document.getElementById('nav-btn-contacts').addEventListener('click', () => {
        container.style.display = 'none'; window.openApp('contacts');
    });

    let currentChatId = null; 
    let globalChatData = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {};
    let selectedMsgIndex = null;
    
    const getSystemDefaultChar = () => {
        const configStr = localStorage.getItem('wuyo_config');
        let name = 'AI 伙伴'; let avatar = ''; let desc = '随时准备与你交流…';
        if(configStr) {
            const config = JSON.parse(configStr);
            if(config.texts) {
                if(config.texts.aiTitle) name = config.texts.aiTitle;
                if(config.texts.aiAvatar) avatar = config.texts.aiAvatar;
                if(config.texts.aiSubtitle) desc = config.texts.aiSubtitle;
            }
        }
        return { id: 'char_default', name, avatar, desc };
    };
    const formatTime = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };

    const renderChatList = () => {
        const listArea = document.getElementById('chat-list-render-area');
        const defaultChar = getSystemDefaultChar();
        if(!globalChatData[defaultChar.id]) globalChatData[defaultChar.id] = [];
        const history = globalChatData[defaultChar.id];
        let lastMsg = defaultChar.desc; let lastTime = '';
        if(history.length > 0) { const lastObj = history[history.length - 1]; lastMsg = lastObj.content; lastTime = formatTime(lastObj.time); }

        const avatarStyle = defaultChar.avatar ? `background-image: url(${defaultChar.avatar});` : ``;
        const avatarInner = defaultChar.avatar ? '' : `<i data-lucide="bot"></i>`;

        listArea.innerHTML = `<div class="chat-list-item" onclick="window.openChatDetail('${defaultChar.id}')"><div class="chat-list-avatar" style="${avatarStyle}">${avatarInner}</div><div class="chat-list-info"><div class="chat-list-top"><span class="chat-list-name">${defaultChar.name}</span><span class="chat-list-time">${lastTime}</span></div><span class="chat-list-msg">${lastMsg}</span></div></div>`;
        lucide.createIcons({ root: listArea });
    };

    window.openChatDetail = (charId) => {
        currentChatId = charId; document.getElementById('chat-char-name').textContent = getSystemDefaultChar().name;
        document.getElementById('chat-page-detail').classList.add('active'); renderMessages();
    };

    document.getElementById('chat-back-to-list').addEventListener('click', () => {
        document.getElementById('chat-page-detail').classList.remove('active'); currentChatId = null; renderChatList(); 
    });

    const msgList = document.getElementById('chat-message-list');
    const inputArea = document.getElementById('chat-textarea');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('chat-status-text');
    const ctxMenu = document.getElementById('chat-context-menu');
    
    let pressTimer = null;
    msgList.addEventListener('scroll', () => ctxMenu.classList.remove('show')); msgList.addEventListener('click', () => ctxMenu.classList.remove('show'));
    const scrollToBottom = () => { setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); };

    const renderMessages = () => {
        if(!currentChatId) return; msgList.innerHTML = '';
        const history = globalChatData[currentChatId];
        if(history.length === 0) { msgList.innerHTML = `<div class="chat-empty">暂无消息，打个招呼吧</div>`; return; }

        let lastTime = 0;
        history.forEach((msg, index) => {
            if (msg.time - lastTime > 5 * 60 * 1000) {
                const timeEl = document.createElement('div'); timeEl.className = 'chat-timestamp'; timeEl.textContent = formatTime(msg.time); msgList.appendChild(timeEl);
            }
            lastTime = msg.time;
            const isUser = msg.role === 'user';
            const wrapper = document.createElement('div'); wrapper.className = `chat-bubble-wrapper ${isUser ? 'right' : 'left'}`;
            const bubble = document.createElement('div'); bubble.className = `chat-bubble ${isUser ? 'user' : 'ai'}`; bubble.innerHTML = msg.content.replace(/\n/g, '<br>');
            
            bubble.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    selectedMsgIndex = index; const touch = e.touches[0];
                    ctxMenu.style.left = `${Math.max(60, Math.min(touch.clientX, window.innerWidth - 60))}px`; ctxMenu.style.top = `${Math.max(50, touch.clientY - 60)}px`; ctxMenu.classList.add('show');
                }, 600);
            });
            bubble.addEventListener('touchend', () => clearTimeout(pressTimer)); bubble.addEventListener('touchmove', () => clearTimeout(pressTimer));
            wrapper.appendChild(bubble); msgList.appendChild(wrapper);
        });
        scrollToBottom();
    };

    document.getElementById('ctx-btn-copy').addEventListener('click', (e) => {
        e.stopPropagation(); if(selectedMsgIndex !== null && currentChatId) navigator.clipboard.writeText(globalChatData[currentChatId][selectedMsgIndex].content).then(() => alert('已复制'));
        ctxMenu.classList.remove('show');
    });
    document.getElementById('ctx-btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) { if(confirm('确定删除这条消息？')) { globalChatData[currentChatId].splice(selectedMsgIndex, 1); localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderMessages(); } }
        ctxMenu.classList.remove('show');
    });

    // 💥 独立设置页面的跳转逻辑
    document.getElementById('chat-btn-settings').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.add('active');
    });
    document.getElementById('chat-settings-back').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
    });

    document.getElementById('settings-btn-clear').addEventListener('click', () => {
        if(confirm('清空聊天记录？不可恢复！')) {
            globalChatData[currentChatId] = []; localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            renderMessages(); document.getElementById('chat-page-settings').classList.remove('active');
        }
    });

    document.getElementById('settings-btn-memory').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
        container.style.display = 'none'; window.openApp('memory');
        setTimeout(() => { if(window.openMemory) window.openMemory(currentChatId, document.getElementById('chat-char-name').textContent, 'chat'); }, 100);
    });

    document.getElementById('settings-btn-profile').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
        if(window.openRoleProfile) { container.style.display = 'none'; window.openApp('contacts'); window.openRoleProfile(currentChatId); }
    });

    inputArea.addEventListener('input', function() {
        this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        if(this.value.trim() !== '') { sendBtn.classList.add('active'); document.getElementById('chat-ext-ai').style.display = 'none'; document.getElementById('chat-ext-plus').style.display = 'none'; } 
        else { sendBtn.classList.remove('active'); document.getElementById('chat-ext-ai').style.display = 'flex'; document.getElementById('chat-ext-plus').style.display = 'flex'; }
    });

    const buildSystemPrompt = () => {
        let finalPrompt = "";
        if (window.getAllActiveWorldbookContext) finalPrompt += window.getAllActiveWorldbookContext() + "\n\n";
        if (window.getMemoryContext) finalPrompt += window.getMemoryContext(currentChatId) + "\n\n";
        const personaStr = localStorage.getItem('wuyo_settings_persona');
        if (personaStr) { const persona = JSON.parse(personaStr); finalPrompt += `[SYSTEM: USER]\n${persona.name||'未知'}\n${persona.info||'未知'}\n\n`; }
        const charInfo = getSystemDefaultChar();
        finalPrompt += `[SYSTEM: CHAR]\n${charInfo.name}\n${charInfo.desc}\n\n`;
        const now = new Date(); finalPrompt += `[SYSTEM: TIME]\n${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${formatTime(now.getTime())}\n\n`;
        return finalPrompt.trim();
    };

    const triggerAiReply = async () => {
        if(!currentChatId) return;
        const apiConfigStr = localStorage.getItem('wuyo_settings_api');
        if(!apiConfigStr) return alert("请先在设置中配置 API！");
        const apiConfig = JSON.parse(apiConfigStr);
        if(!apiConfig.chat || !apiConfig.chat.url || !apiConfig.chat.key) return alert("API 配置不完整！");

        statusText.textContent = '对方正在输入...'; statusText.style.color = '#1C1C1E';
        const aiMsgObj = { role: 'assistant', content: '', time: Date.now() };
        globalChatData[currentChatId].push(aiMsgObj); renderMessages(); 
        
        const bubbles = msgList.querySelectorAll('.chat-bubble.ai'); const currentBubble = bubbles[bubbles.length - 1];
        const historyContext = globalChatData[currentChatId].slice(-21, -1).map(m => ({ role: m.role, content: m.content }));
        const apiMessages = [{ role: 'system', content: buildSystemPrompt() }, ...historyContext];

        try {
            const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
            const response = await fetch(cleanUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                body: JSON.stringify({ model: apiConfig.chat.model, messages: apiMessages, temperature: parseFloat(apiConfig.chat.temp) || 0.7, stream: true })
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            const reader = response.body.getReader(); const decoder = new TextDecoder('utf-8'); let done = false;
            while(!done) {
                const {value, done: readerDone} = await reader.read(); done = readerDone;
                if(value) {
                    const chunk = decoder.decode(value, {stream: true}); const lines = chunk.split('\n');
                    for(let line of lines) {
                        if(line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if(data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                    aiMsgObj.content += data.choices[0].delta.content; currentBubble.innerHTML = aiMsgObj.content.replace(/\n/g, '<br>'); scrollToBottom();
                                }
                            } catch(e) { }
                        }
                    }
                }
            }
            statusText.textContent = '在线'; statusText.style.color = '#8E8E93';
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderChatList(); 
        } catch (error) {
            statusText.textContent = '未连接'; aiMsgObj.content = `[错误: ${error.message}]`; currentBubble.innerHTML = aiMsgObj.content;
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
        }
    };

    const sendUserMessage = () => {
        const text = inputArea.value.trim(); if(!text || !currentChatId) return;
        globalChatData[currentChatId].push({ role: 'user', content: text, time: Date.now() }); localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
        inputArea.value = ''; inputArea.style.height = 'auto'; sendBtn.classList.remove('active'); 
        document.getElementById('chat-ext-ai').style.display = 'flex'; document.getElementById('chat-ext-plus').style.display = 'flex';
        renderMessages(); triggerAiReply(); 
    };

    sendBtn.addEventListener('click', sendUserMessage);
    inputArea.addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUserMessage(); } });
    document.getElementById('chat-ext-ai').addEventListener('click', triggerAiReply);
    renderChatList();
})();
