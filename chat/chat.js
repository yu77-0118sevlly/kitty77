(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // ==========================================
    // 1. 初始化 DOM：双层架构 (列表页 + 详情页)
    // ==========================================
    container.innerHTML = `
        <!-- 页面 1：聊天列表页 -->
        <div class="chat-page root active" id="chat-page-list">
            <header class="chat-header">
                <div style="width:32px;"></div>
                <span class="chat-header-title">微信 (Chat)</span>
                <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
            </header>
            <div class="chat-search-bar">
                <input type="text" class="chat-search-input" placeholder="🔍 搜索">
            </div>
            <div class="chat-list-container" id="chat-list-render-area">
                <!-- 列表项将在这里动态生成 -->
            </div>
        </div>

        <!-- 页面 2：聊天详情页 -->
        <div class="chat-page" id="chat-page-detail">
            <header class="chat-header">
                <button class="chat-icon-btn" id="chat-back-to-list"><i data-lucide="chevron-left"></i></button>
                <div class="chat-title-area">
                    <span class="chat-title" id="chat-char-name">AI 伙伴</span>
                    <span class="chat-status" id="chat-status-text">在线</span>
                </div>
                <button class="chat-icon-btn"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-input-area">
                <button class="chat-ext-btn"><i data-lucide="mic"></i></button>
                <textarea class="chat-input" id="chat-textarea" placeholder="发消息..." rows="1"></textarea>
                <button class="chat-ext-btn" id="chat-ext-smile"><i data-lucide="smile"></i></button>
                <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
                <button class="chat-send-btn" id="chat-send-btn">发送</button>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    // ==========================================
    // 2. 核心状态与数据管理 (支持多角色预留)
    // ==========================================
    let currentChatId = null; // 当前正在聊天的角色 ID
    
    // 全局所有角色的聊天记录池：{ 'char_default': [{role: 'user', content: 'hi', time: 123}], 'char_2': [] }
    let globalChatData = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {};
    
    // 获取/创建默认角色信息 (从美化配置中拉取)
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

    // 格式化时间 (例如：17:43)
    const formatTime = (ts) => {
        const d = new Date(ts);
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    // ==========================================
    // 3. 渲染聊天列表 (Chat List)
    // ==========================================
    const renderChatList = () => {
        const listArea = document.getElementById('chat-list-render-area');
        const defaultChar = getSystemDefaultChar();
        
        // 保证默认角色的数据池存在
        if(!globalChatData[defaultChar.id]) globalChatData[defaultChar.id] = [];
        
        const history = globalChatData[defaultChar.id];
        let lastMsg = defaultChar.desc;
        let lastTime = '';
        if(history.length > 0) {
            const lastObj = history[history.length - 1];
            lastMsg = lastObj.content;
            lastTime = formatTime(lastObj.time);
        }

        const avatarStyle = defaultChar.avatar ? `background-image: url(${defaultChar.avatar});` : `display:flex; justify-content:center; align-items:center;`;
        const avatarInner = defaultChar.avatar ? '' : `<i data-lucide="bot" style="color:#8E8E93; width:24px; height:24px;"></i>`;

        listArea.innerHTML = `
            <div class="chat-list-item" onclick="window.openChatDetail('${defaultChar.id}')">
                <div class="chat-list-avatar" style="${avatarStyle}">
                    ${avatarInner}
                    <!-- <div class="chat-list-unread">1</div> 预留未读红点 -->
                </div>
                <div class="chat-list-info">
                    <div class="chat-list-top">
                        <span class="chat-list-name">${defaultChar.name}</span>
                        <span class="chat-list-time">${lastTime}</span>
                    </div>
                    <span class="chat-list-msg">${lastMsg}</span>
                </div>
            </div>
        `;
        lucide.createIcons({ root: listArea });
    };

    // ==========================================
    // 4. 页面导航系统
    // ==========================================
    window.openChatDetail = (charId) => {
        currentChatId = charId;
        const charInfo = getSystemDefaultChar(); // 后续这里可以根据 charId 查找具体角色
        
        document.getElementById('chat-char-name').textContent = charInfo.name;
        document.getElementById('chat-page-detail').classList.add('active');
        
        renderMessages();
    };

    document.getElementById('chat-back-to-list').addEventListener('click', () => {
        document.getElementById('chat-page-detail').classList.remove('active');
        currentChatId = null;
        renderChatList(); // 返回时刷新列表的最后一条消息
    });

    // ==========================================
    // 5. 渲染具体消息 (Chat Detail)
    // ==========================================
    const msgList = document.getElementById('chat-message-list');
    const inputArea = document.getElementById('chat-textarea');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('chat-status-text');

    const scrollToBottom = () => { setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); };

    const renderMessages = () => {
        if(!currentChatId) return;
        msgList.innerHTML = '';
        const history = globalChatData[currentChatId];

        if(history.length === 0) {
            msgList.innerHTML = `<div class="chat-empty">暂无消息，打个招呼吧</div>`;
            return;
        }

        let lastTime = 0;
        history.forEach(msg => {
            if (msg.time - lastTime > 5 * 60 * 1000) {
                const timeEl = document.createElement('div');
                timeEl.className = 'chat-timestamp'; timeEl.textContent = formatTime(msg.time);
                msgList.appendChild(timeEl);
            }
            lastTime = msg.time;

            const isUser = msg.role === 'user';
            const wrapper = document.createElement('div');
            wrapper.className = `chat-bubble-wrapper ${isUser ? 'right' : 'left'}`;
            wrapper.innerHTML = `<div class="chat-bubble ${isUser ? 'user' : 'ai'}">${msg.content.replace(/\n/g, '<br>')}</div>`;
            msgList.appendChild(wrapper);
        });
        scrollToBottom();
    };

    // ==========================================
    // 6. 输入框动态控制与发送交互
    // ==========================================
    inputArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        const hasText = this.value.trim() !== '';
        if(hasText) {
            sendBtn.classList.add('active');
            document.getElementById('chat-ext-plus').style.display = 'none'; // 隐藏加号
        } else {
            sendBtn.classList.remove('active');
            document.getElementById('chat-ext-plus').style.display = 'flex'; // 显示加号
        }
    });

    const showTypingIndicator = () => {
        statusText.textContent = '对方正在输入...'; statusText.style.color = '#1C1C1E';
        const wrapper = document.createElement('div'); wrapper.className = 'chat-bubble-wrapper left'; wrapper.id = 'typing-indicator-bubble';
        wrapper.innerHTML = `<div class="chat-bubble ai"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
        msgList.appendChild(wrapper); scrollToBottom();
    };

    const hideTypingIndicator = () => {
        statusText.textContent = '在线'; statusText.style.color = '#34C759';
        const indicator = document.getElementById('typing-indicator-bubble');
        if(indicator) indicator.remove();
    };

    const sendMessage = () => {
        const text = inputArea.value.trim();
        if(!text || !currentChatId) return;
        
        globalChatData[currentChatId].push({ role: 'user', content: text, time: Date.now() });
        localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
        
        inputArea.value = ''; inputArea.style.height = 'auto';
        sendBtn.classList.remove('active'); document.getElementById('chat-ext-plus').style.display = 'flex';
        renderMessages();

        // 模拟 AI 回复系统 (后续对接 API 和世界书)
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            globalChatData[currentChatId].push({ 
                role: 'assistant', 
                content: '好的，我已经收到您的消息。目前我正在为您搭建底层的多角色架构，马上就可以接入真实的 API 啦！', 
                time: Date.now() 
            });
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            renderMessages();
        }, 1500);
    };

    sendBtn.addEventListener('click', sendMessage);
    inputArea.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // 初始启动时渲染列表
    renderChatList();

})();
