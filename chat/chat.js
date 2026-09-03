(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    container.innerHTML = `
        <!-- 全局顶部返回按钮 (关闭整个 Chat App) -->
        <div class="chat-system-close" onclick="window.closeApp('chat')">
            <i data-lucide="chevron-left"></i>
        </div>

        <!-- 主 Tab 容器 (Chats, Contacts, Moments, Me) -->
        <div id="chat-main-tabs" class="chat-tabs-container">
            <!-- 1. Chats 页面（只保留 1 个测试联系人） -->
            <div id="chat-tab-chats" class="chat-page active">
                <header class="chat-header">
                    <h1 class="chat-title">Chats</h1>
                    <button class="chat-icon-btn"><i data-lucide="plus"></i></button>
                </header>
                <div class="chat-search-wrap">
                    <div class="chat-search"><i data-lucide="search"></i><span>Search...</span></div>
                </div>
                <div class="chat-list">
                    <div class="chat-list-item chat-target-item" data-name="Test User" data-time="Now">
                        <div class="chat-avatar"></div>
                        <div class="chat-item-content">
                            <div class="chat-item-top"><span class="chat-name">Test User</span><span class="chat-time">Now</span></div>
                            <div class="chat-item-bottom"><span class="chat-msg">测试聊天记录</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Contacts 页面 -->
            <div id="chat-tab-contacts" class="chat-page">
                <header class="chat-header">
                    <h1 class="chat-title">Contacts</h1>
                    <button class="chat-icon-btn"><i data-lucide="plus"></i></button>
                </header>
                <div class="chat-search-wrap">
                    <div class="chat-search"><i data-lucide="search"></i><span>Search...</span></div>
                </div>
                <div class="chat-contacts-special">
                    <div class="chat-list-item">
                        <div class="chat-avatar-small flex-center"><i data-lucide="user-plus"></i></div>
                        <div class="chat-item-content"><span class="chat-name">New Friends</span></div>
                    </div>
                    <div class="chat-list-item">
                        <div class="chat-avatar-small flex-center"><i data-lucide="users"></i></div>
                        <div class="chat-item-content"><span class="chat-name">Groups</span></div>
                    </div>
                </div>
                <div class="chat-contacts-list">
                    <div class="chat-letter-divider">T</div>
                    <div class="chat-list-item chat-target-item" data-name="Test User"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Test User</span></div></div>
                </div>
            </div>

            <!-- 3. Moments 页面 -->
            <div id="chat-tab-moments" class="chat-page">
                <header class="chat-header">
                    <h1 class="chat-title">Moments</h1>
                    <button class="chat-icon-btn"><i data-lucide="camera"></i></button>
                </header>
                <div class="chat-moments-cover">
                    <div class="chat-moments-avatar"></div>
                </div>
                <div class="chat-moments-feed"></div>
            </div>

            <!-- 4. Me 页面 -->
            <div id="chat-tab-me" class="chat-page">
                <div class="chat-me-header">
                    <div class="chat-me-info">
                        <div class="chat-me-avatar"></div>
                        <div class="chat-me-text">
                            <h2 class="chat-me-name">John Doe</h2>
                            <span class="chat-me-id">ID: johndoe_99</span>
                        </div>
                    </div>
                    <i data-lucide="qr-code" class="chat-me-qr"></i>
                </div>
                <div class="chat-me-menu">
                    <div class="chat-menu-item"><i data-lucide="user"></i><span>Profile</span></div>
                    <div class="chat-menu-item"><i data-lucide="star"></i><span>Favorites</span></div>
                    <div class="chat-menu-item"><i data-lucide="settings"></i><span>Settings</span></div>
                    <div class="chat-menu-item"><i data-lucide="info"></i><span>About</span></div>
                </div>
            </div>

            <!-- 底部导航栏 -->
            <nav class="chat-bottom-bar">
                <div class="chat-nav-item active" data-target="chat-tab-chats">
                    <i data-lucide="message-square"></i><span>Chats</span>
                </div>
                <div class="chat-nav-item" data-target="chat-tab-contacts">
                    <i data-lucide="users"></i><span>Contacts</span>
                </div>
                <div class="chat-nav-item" data-target="chat-tab-moments">
                    <i data-lucide="aperture"></i><span>Moments</span>
                </div>
                <div class="chat-nav-item" data-target="chat-tab-me">
                    <i data-lucide="user-circle"></i><span>Me</span>
                </div>
            </nav>
        </div>

        <!-- 独立私聊页面（无头像，只有名字） -->
        <div id="chat-room-page" class="chat-room-container">
            <header class="chat-room-header">
                <button class="chat-room-back" id="room-back-btn">
                    <i data-lucide="chevron-left"></i>
                </button>
                <div class="chat-room-title-area">
                    <span class="chat-room-name" id="room-target-name">Chat</span>
                </div>
                <div class="chat-room-placeholder"></div>
            </header>
            <div class="chat-room-body" id="room-messages-body"></div>
            <div class="chat-room-footer">
                <div class="chat-room-input-box">
                    <input type="text" id="room-input" placeholder="Message..." />
                </div>
                <button class="chat-room-send-btn" id="room-send-btn" disabled title="仅发送">
                    <i data-lucide="arrow-up"></i>
                </button>
                <button class="chat-room-ai-btn" id="room-ai-btn" disabled title="发送并请求AI回复">
                    <i data-lucide="sparkles"></i>
                </button>
            </div>
        </div>
    `;

    lucide.createIcons({ root: container });

    // ============================================
    // 1. Tab 切换逻辑
    // ============================================
    const navItems = container.querySelectorAll('.chat-nav-item');
    const pages = container.querySelectorAll('.chat-page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ============================================
    // 2. 消息收发逻辑
    // ============================================
    const STORAGE_KEY = 'wuyo_chat_messages';
    const roomBody = document.getElementById('room-messages-body');
    const roomInput = document.getElementById('room-input');
    const sendBtn = document.getElementById('room-send-btn');
    const aiBtn = document.getElementById('room-ai-btn');
    let currentContact = null;

    const defaultMessages = {
        'Test User': [
            { from: 'them', text: '这是测试联系人，可以在这里试发送消息。', time: '10:24' }
        ]
    };

    function loadAllMessages() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }

    function saveAllMessages(all) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }

    function getMessages(name) {
        const all = loadAllMessages();
        if (!all[name]) {
            all[name] = defaultMessages[name] || [];
            saveAllMessages(all);
        }
        return all[name];
    }

    function addMessage(name, msg) {
        const all = loadAllMessages();
        if (!all[name]) all[name] = [];
        all[name].push(msg);
        saveAllMessages(all);
    }

    function renderMessages(name) {
        const list = getMessages(name);
        roomBody.innerHTML = list.map(m => {
            if (m.from === 'system') {
                return `<div class="msg-system">${m.text}</div>`;
            }
            return `
                <div class="msg-row ${m.from === 'me' ? 'me' : 'them'}">
                    <div class="msg-bubble">${m.text}</div>
                </div>
            `;
        }).join('');
        roomBody.scrollTop = roomBody.scrollHeight;
    }

    function getNowTime() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    function getApiKey() {
        try {
            const raw = localStorage.getItem('wuyo_config');
            if (!raw) return null;
            const cfg = JSON.parse(raw);
            return (cfg && cfg.api && cfg.api.key) ? cfg.api.key : null;
        } catch (e) {
            return null;
        }
    }

    function clearInputState() {
        roomInput.value = '';
        sendBtn.disabled = true;
        aiBtn.disabled = true;
    }

    function sendPlainMessage() {
        const text = roomInput.value.trim();
        if (!text || !currentContact) return;

        addMessage(currentContact, { from: 'me', text, time: getNowTime() });
        renderMessages(currentContact);
        clearInputState();
    }

    function sendAiMessage() {
        const text = roomInput.value.trim();
        if (!text || !currentContact) return;

        addMessage(currentContact, { from: 'me', text, time: getNowTime() });

        const apiKey = getApiKey();
        if (!apiKey) {
            addMessage(currentContact, { from: 'system', text: '⚠️ 尚未配置 API，无法获取 AI 回复' });
        } else {
            addMessage(currentContact, { from: 'system', text: 'AI 接口已配置，但回复逻辑尚未开发' });
        }

        renderMessages(currentContact);
        clearInputState();
    }

    roomInput.addEventListener('input', () => {
        const hasText = roomInput.value.trim().length > 0;
        sendBtn.disabled = !hasText;
        aiBtn.disabled = !hasText;
    });

    roomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendPlainMessage();
        }
    });

    sendBtn.addEventListener('click', sendPlainMessage);
    aiBtn.addEventListener('click', sendAiMessage);

    // ============================================
    // 3. 点击联系人进入私聊页面
    // ============================================
    const mainTabs = document.getElementById('chat-main-tabs');
    const roomPage = document.getElementById('chat-room-page');
    const roomNameEl = document.getElementById('room-target-name');
    const backBtn = document.getElementById('room-back-btn');
    const chatItems = container.querySelectorAll('.chat-target-item');

    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const contactName = item.getAttribute('data-name');
            roomNameEl.textContent = contactName;
            currentContact = contactName;
            renderMessages(contactName);

            mainTabs.style.display = 'none';
            roomPage.style.display = 'flex';
        });
    });

    // ============================================
    // 4. 返回按钮
    // ============================================
    backBtn.addEventListener('click', () => {
        roomPage.style.display = 'none';
        mainTabs.style.display = 'block';
    });

})();
