(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 1. 初始化 DOM
    container.innerHTML = `
        <div class="chat-page root active" id="chat-page-list">
            <header class="chat-header">
                <div style="width:32px;"></div>
                <span class="chat-header-title">Chats</span>
                <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
            </header>
            <div class="chat-search-bar">
                <i data-lucide="search"></i>
                <input type="text" class="chat-search-input" placeholder="Search">
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
                    <span class="chat-status" id="chat-status-text">Online</span>
                </div>
                <button class="chat-icon-btn" id="chat-btn-settings"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-input-area">
                <button class="chat-ext-btn"><i data-lucide="mic"></i></button>
                <textarea class="chat-input" id="chat-textarea" placeholder="Message..." rows="1"></textarea>
                <button class="chat-ext-btn" id="chat-ext-ai" title="AI Reply"><i data-lucide="bot"></i></button>
                <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
                <button class="chat-send-btn" id="chat-send-btn">Send</button>
            </div>
            
            <div class="chat-context-menu" id="chat-context-menu">
                <div class="ctx-item" id="ctx-btn-copy"><i data-lucide="copy"></i>Copy</div>
                <div class="ctx-item" id="ctx-btn-reply"><i data-lucide="reply"></i>Reply</div>
                <div class="ctx-item" id="ctx-btn-delete"><i data-lucide="trash-2"></i>Delete</div>
            </div>

            <div class="chat-drawer-overlay" id="chat-drawer">
                <div class="chat-drawer">
                    <button class="drawer-btn" id="drawer-btn-profile">Profile</button>
                    <button class="drawer-btn" id="drawer-btn-memory">Memory</button>
                    <button class="drawer-btn" id="drawer-btn-clear" style="font-weight:600;">Clear History</button>
                    <button class="drawer-btn cancel" id="drawer-btn-cancel">Cancel</button>
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
        let name = 'AI'; let avatar = ''; let desc = 'Ready to chat...';
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
        if(history.length === 0) { msgList.innerHTML = `<div class="chat-empty">No messages yet.</div>`; return; }

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
        e.stopPropagation(); if(selectedMsgIndex !== null && currentChatId) navigator.clipboard.writeText(globalChatData[currentChatId][selectedMsgIndex].content).then(() => alert('Copied'));
        ctxMenu.classList.remove('show');
    });
    document.getElementById('ctx-btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) { if(confirm('Delete message?')) { globalChatData[currentChatId].splice(selectedMsgIndex, 1); localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderMessages(); } }
        ctxMenu.classList.remove('show');
    });

    const drawer = document.getElementById('chat-drawer');
    document.getElementById('chat-btn-settings').addEventListener('click', () => drawer.classList.add('show'));
    document.getElementById('drawer-btn-cancel').addEventListener('click', () => drawer.classList.remove('show'));
    document.getElementById('drawer-btn-clear').addEventListener('click', () => {
        if(confirm('Clear history? Cannot be undone!')) { globalChatData[currentChatId] = []; localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderMessages(); drawer.classList.remove('show'); }
    });

    document.getElementById('drawer-btn-memory').addEventListener('click', () => {
        drawer.classList.remove('show'); container.style.display = 'none'; window.openApp('memory');
        setTimeout(() => { if(window.openMemory) window.openMemory(currentChatId, document.getElementById('chat-char-name').textContent); }, 100);
    });

    document.getElementById('drawer-btn-profile').addEventListener('click', () => {
        drawer.classList.remove('show');
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
        if (personaStr) { const persona = JSON.parse(personaStr); finalPrompt += `[SYSTEM: USER]\n${persona.name||'Unknown'}\n${persona.info||'Unknown'}\n\n`; }
        const charInfo = getSystemDefaultChar();
        finalPrompt += `[SYSTEM: CHAR]\n${charInfo.name}\n${charInfo.desc}\n\n`;
        const now = new Date(); finalPrompt += `[SYSTEM: TIME]\n${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${formatTime(now.getTime())}\n\n`;
        return finalPrompt.trim();
    };

    const triggerAiReply = async () => {
        if(!currentChatId) return;
        const apiConfigStr = localStorage.getItem('wuyo_settings_api');
        if(!apiConfigStr) return alert("Please configure API in Settings first!");
        const apiConfig = JSON.parse(apiConfigStr);
        if(!apiConfig.chat || !apiConfig.chat.url || !apiConfig.chat.key) return alert("API config incomplete.");

        statusText.textContent = 'Typing...'; statusText.style.color = '#1C1C1E';
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
            statusText.textContent = 'Online'; statusText.style.color = '#8E8E93';
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderChatList(); 
        } catch (error) {
            statusText.textContent = 'Offline'; aiMsgObj.content = `[Error: ${error.message}]`; currentBubble.innerHTML = aiMsgObj.content;
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
