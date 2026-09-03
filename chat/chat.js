(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 动态注入内部结构（含隐藏的私聊房间页面）
    container.innerHTML = `
        <!-- 全局顶部返回按钮 (模拟系统级操作：关闭整个 Chat App) -->
        <div class="chat-system-close" onclick="window.closeApp('chat')">
            <i data-lucide="chevron-left"></i>
        </div>

        <!-- 主 Tab 容器 (Chats, Contacts, Moments, Me) -->
        <div id="chat-main-tabs" class="chat-tabs-container">
            <!-- 1. Chats 页面 -->
            <div id="chat-tab-chats" class="chat-page active">
                <header class="chat-header">
                    <h1 class="chat-title">Chats</h1>
                    <button class="chat-icon-btn"><i data-lucide="plus"></i></button>
                </header>
                <div class="chat-search-wrap">
                    <div class="chat-search"><i data-lucide="search"></i><span>Search...</span></div>
                </div>
                <div class="chat-list">
                    <div class="chat-list-item chat-target-item" data-name="Alex Chen" data-time="Now">
                        <div class="chat-avatar"></div>
                        <div class="chat-item-content">
                            <div class="chat-item-top"><span class="chat-name">Alex Chen</span><span class="chat-time">Now</span></div>
                            <div class="chat-item-bottom"><span class="chat-msg">Are we still on for tmrw?</span></div>
                        </div>
                    </div>
                    <div class="chat-list-item chat-target-item" data-name="Design Team" data-time="2h">
                        <div class="chat-avatar"></div>
                        <div class="chat-item-content">
                            <div class="chat-item-top"><span class="chat-name">Design Team</span><span class="chat-time">2h</span></div>
                            <div class="chat-item-bottom"><span class="chat-msg">Figma link updated.</span></div>
                        </div>
                    </div>
                    <div class="chat-list-item chat-target-item" data-name="Sarah" data-time="5h">
                        <div class="chat-avatar"></div>
                        <div class="chat-item-content">
                            <div class="chat-item-top"><span class="chat-name">Sarah</span><span class="chat-time">5h</span></div>
                            <div class="chat-item-bottom"><span class="chat-msg">Thanks!</span></div>
                        </div>
                    </div>
                    <div class="chat-list-item chat-target-item" data-name="Mom" data-time="Yesterday">
                        <div class="chat-avatar"></div>
                        <div class="chat-item-content">
                            <div class="chat-item-top"><span class="chat-name">Mom</span><span class="chat-time">Yesterday</span></div>
                            <div class="chat-item-bottom"><span class="chat-msg">Call me when you are free.</span></div>
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
                    <div class="chat-letter-divider">A</div>
                    <div class="chat-list-item"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Alice Wonderland</span></div></div>
                    <div class="chat-list-item"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Alex Chen</span></div></div>
                    <div class="chat-letter-divider">B</div>
                    <div class="chat-list-item"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Ben Studio</span></div></div>
                    <div class="chat-list-item"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Brian</span></div></div>
                    <div class="chat-letter-divider">C</div>
                    <div class="chat-list-item"><div class="chat-avatar-small"></div><div class="chat-item-content"><span class="chat-name">Chris M.</span></div></div>
                </div>
                <div class="chat-index-bar">
                    <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>.</span><span>.</span><span>.</span>
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
                <div class="chat-moments-feed">
                    <div class="chat-feed-item">
                        <div class="chat-feed-avatar"></div>
                        <div class="chat-feed-content">
                            <div class="chat-feed-name">Alex Chen</div>
                            <div class="chat-feed-text">Minimalist architecture in Tokyo.<br>Such a quiet vibe.</div>
                            <div class="chat-feed-images">
                                <div class="chat-feed-img"></div>
                                <div class="chat-feed-img"></div>
                            </div>
                            <div class="chat-feed-footer">
                                <span class="chat-feed-time">2 hours ago</span>
                                <div class="chat-feed-actions">
                                    <i data-lucide="heart"></i>
                                    <i data-lucide="message-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

        <!-- 🟢 独立私聊页面 (默认隐藏，点击列表项时切入) -->
        <div id="chat-room-page" class="chat-room-container">
            <header class="chat-room-header">
                <button class="chat-room-back" id="room-back-btn">
                    <i data-lucide="chevron-left"></i>
                </button>
                <div class="chat-room-title-area">
                    <div class="chat-room-avatar-mini"></div>
                    <span class="chat-room-name" id="room-target-name">Chat</span>
                </div>
                <div class="chat-room-placeholder"></div>
            </header>
            <div class="chat-room-body">
                <!-- 预留消息展示区 -->
            </div>
            <div class="chat-room-footer">
                <div class="chat-room-input-box">
                    <span>Message...</span>
                </div>
            </div>
        </div>
    `;

    // 渲染 Lucide 图标
    lucide.createIcons({ root: container });

    // 1. Tab 切换逻辑
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

    // 2. 🟢 点击聊天列表项进入私聊页面逻辑
    const mainTabs = document.getElementById('chat-main-tabs');
    const roomPage = document.getElementById('chat-room-page');
    const roomNameEl = document.getElementById('room-target-name');
    const backBtn = document.getElementById('room-back-btn');
    const chatItems = container.querySelectorAll('.chat-target-item');

    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const contactName = item.getAttribute('data-name');
            // 设置聊天对象的昵称
            roomNameEl.textContent = contactName;

            // 隐藏主 Tab，显示聊天室页面
            mainTabs.style.display = 'none';
            roomPage.style.display = 'flex';
        });
    });

    // 3. 🟢 点击返回按钮回到列表
    backBtn.addEventListener('click', () => {
        roomPage.style.display = 'none';
        mainTabs.style.display = 'block';
    });

})();
