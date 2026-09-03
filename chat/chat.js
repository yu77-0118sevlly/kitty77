(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 动态注入内部结构
    container.innerHTML = `
        <!-- 全局顶部返回按钮 (模拟系统级操作) -->
        <div class="chat-system-close" onclick="window.closeApp('chat')">
            <i data-lucide="chevron-left"></i>
        </div>

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
                <div class="chat-list-item">
                    <div class="chat-avatar"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-top"><span class="chat-name">Alex Chen</span><span class="chat-time">Now</span></div>
                        <div class="chat-item-bottom"><span class="chat-msg">Are we still on for tmrw?</span></div>
                    </div>
                </div>
                <div class="chat-list-item">
                    <div class="chat-avatar"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-top"><span class="chat-name">Design Team</span><span class="chat-time">2h</span></div>
                        <div class="chat-item-bottom"><span class="chat-msg">Figma link updated.</span></div>
                    </div>
                </div>
                <div class="chat-list-item">
                    <div class="chat-avatar"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-top"><span class="chat-name">Sarah</span><span class="chat-time">5h</span></div>
                        <div class="chat-item-bottom"><span class="chat-msg">Thanks!</span></div>
                    </div>
                </div>
                <div class="chat-list-item">
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
                <div class="chat-feed-item">
                    <div class="chat-feed-avatar"></div>
                    <div class="chat-feed-content">
                        <div class="chat-feed-name">Sarah</div>
                        <div class="chat-feed-text">Finally finished reading this book.</div>
                        <div class="chat-feed-footer">
                            <span class="chat-feed-time">5 hours ago</span>
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
                <div class="chat-menu-item">
                    <i data-lucide="user"></i>
                    <span>Profile</span>
                </div>
                <div class="chat-menu-item">
                    <i data-lucide="star"></i>
                    <span>Favorites</span>
                </div>
                <div class="chat-menu-item">
                    <i data-lucide="settings"></i>
                    <span>Settings</span>
                </div>
                <div class="chat-menu-item">
                    <i data-lucide="info"></i>
                    <span>About</span>
                </div>
            </div>
        </div>

        <!-- 底部导航栏 -->
        <nav class="chat-bottom-bar">
            <div class="chat-nav-item active" data-target="chat-tab-chats">
                <i data-lucide="message-square"></i>
                <span>Chats</span>
            </div>
            <div class="chat-nav-item" data-target="chat-tab-contacts">
                <i data-lucide="users"></i>
                <span>Contacts</span>
            </div>
            <div class="chat-nav-item" data-target="chat-tab-moments">
                <i data-lucide="aperture"></i>
                <span>Moments</span>
            </div>
            <div class="chat-nav-item" data-target="chat-tab-me">
                <i data-lucide="user-circle"></i>
                <span>Me</span>
            </div>
        </nav>
    `;

    // 渲染 Lucide 图标
    lucide.createIcons({ root: container });

    // 处理 Tab 切换逻辑
    const navItems = container.querySelectorAll('.chat-nav-item');
    const pages = container.querySelectorAll('.chat-page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除所有的 active 状态
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            // 为当前点击的项添加 active
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

})();

