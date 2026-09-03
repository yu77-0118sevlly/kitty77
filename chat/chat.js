(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 1. 初始化聊天室 UI
    container.innerHTML = `
        <div class="chat-container">
            <header class="chat-header">
                <button class="chat-icon-btn" onclick="window.closeApp('chat')"><i data-lucide="chevron-left"></i></button>
                <div class="chat-title-area">
                    <span class="chat-title" id="chat-char-name">AI 伙伴</span>
                    <span class="chat-status" id="chat-status-text">在线</span>
                </div>
                <button class="chat-icon-btn"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-input-area">
                <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
                <textarea class="chat-input" id="chat-textarea" placeholder="发消息..." rows="1"></textarea>
                <button class="chat-send-btn" id="chat-send-btn"><i data-lucide="send"></i></button>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    // 2. 全局变量与配置
    let chatHistory = JSON.parse(localStorage.getItem('wuyo_chat_history')) || [];
    const msgList = document.getElementById('chat-message-list');
    const inputArea = document.getElementById('chat-textarea');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('chat-status-text');

    // 读取 Char 名字
    const configStr = localStorage.getItem('wuyo_config');
    if(configStr) {
        const config = JSON.parse(configStr);
        if(config.texts && config.texts.aiTitle) document.getElementById('chat-char-name').textContent = config.texts.aiTitle;
    }

    // 格式化时间 (例如：17:43)
    const formatTime = (ts) => {
        const d = new Date(ts);
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    // 3. 渲染历史消息
    const renderMessages = () => {
        msgList.innerHTML = '';
        if(chatHistory.length === 0) {
            msgList.innerHTML = `<div class="chat-empty">暂无消息，打个招呼吧</div>`;
            return;
        }

        let lastTime = 0;
        chatHistory.forEach(msg => {
            // 如果间隔超过 5 分钟，显示时间戳
            if (msg.time - lastTime > 5 * 60 * 1000) {
                const timeEl = document.createElement('div');
                timeEl.className = 'chat-timestamp';
                timeEl.textContent = formatTime(msg.time);
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

    const scrollToBottom = () => {
        setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50);
    };

    renderMessages();

    // 4. 输入框自适应
    inputArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        if(this.value.trim() !== '') sendBtn.classList.add('active');
        else sendBtn.classList.remove('active');
    });

    // 5. 显示“对方正在输入”动画
    const showTypingIndicator = () => {
        statusText.textContent = '对方正在输入...';
        statusText.style.color = '#1C1C1E';
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-bubble-wrapper left';
        wrapper.id = 'typing-indicator-bubble';
        wrapper.innerHTML = `
            <div class="chat-bubble ai">
                <div class="typing-indicator">
                    <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
                </div>
            </div>`;
        msgList.appendChild(wrapper);
        scrollToBottom();
    };

    const hideTypingIndicator = () => {
        statusText.textContent = '在线';
        statusText.style.color = '#34C759';
        const indicator = document.getElementById('typing-indicator-bubble');
        if(indicator) indicator.remove();
    };

    // 6. 发送消息
    const sendMessage = () => {
        const text = inputArea.value.trim();
        if(!text) return;
        
        chatHistory.push({ role: 'user', content: text, time: Date.now() });
        localStorage.setItem('wuyo_chat_history', JSON.stringify(chatHistory));
        
        inputArea.value = '';
        inputArea.style.height = 'auto';
        sendBtn.classList.remove('active');
        renderMessages();

        // 模拟真实 API 思考延迟
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            // 这里留好接口：将来替换成 await fetch(...)
            chatHistory.push({ 
                role: 'assistant', 
                content: '（此处以后将接入 API，并自动读取您的内设世界书规则进行回复。UI 已经完美支持多行文本、时间戳和排版啦！）', 
                time: Date.now() 
            });
            localStorage.setItem('wuyo_chat_history', JSON.stringify(chatHistory));
            renderMessages();
        }, 2000);
    };

    sendBtn.addEventListener('click', sendMessage);
    inputArea.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
})();
