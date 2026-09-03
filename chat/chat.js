(function () {
    const container = document.getElementById('chat-app');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-system-close" onclick="window.closeApp('chat')">
            <i data-lucide="chevron-left"></i>
        </div>

        <div id="chat-main-tabs" class="chat-tabs-container">

            <!-- Chats -->
            <div id="chat-tab-chats" class="chat-page active">
                <header class="chat-header">
                    <h1 class="chat-title">Chats</h1>
                    <button class="chat-icon-btn">
                        <i data-lucide="plus"></i>
                    </button>
                </header>

                <div class="chat-search-wrap">
                    <div class="chat-search">
                        <i data-lucide="search"></i>
                        <span>Search...</span>
                    </div>
                </div>

                <div class="chat-list">
                    <div class="chat-list-item chat-target-item"
                         data-name="Test User"
                         data-time="Now">

                        <div class="chat-avatar"></div>

                        <div class="chat-item-content">
                            <div class="chat-item-top">
                                <span class="chat-name">Test User</span>
                                <span class="chat-time">Now</span>
                            </div>

                            <div class="chat-item-bottom">
                                <span class="chat-msg">
                                    Start a conversation...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contacts -->
            <div id="chat-tab-contacts" class="chat-page">

                <header class="chat-header">
                    <h1 class="chat-title">Contacts</h1>
                    <button class="chat-icon-btn">
                        <i data-lucide="plus"></i>
                    </button>
                </header>

                <div class="chat-search-wrap">
                    <div class="chat-search">
                        <i data-lucide="search"></i>
                        <span>Search...</span>
                    </div>
                </div>

                <div class="chat-contacts-special">

                    <div class="chat-list-item">
                        <div class="chat-avatar-small flex-center">
                            <i data-lucide="user-plus"></i>
                        </div>

                        <div class="chat-item-content">
                            <span class="chat-name">New Friends</span>
                        </div>
                    </div>

                    <div class="chat-list-item">
                        <div class="chat-avatar-small flex-center">
                            <i data-lucide="users"></i>
                        </div>

                        <div class="chat-item-content">
                            <span class="chat-name">Groups</span>
                        </div>
                    </div>

                </div>

                <div class="chat-contacts-list">

                    <div class="chat-letter-divider">T</div>

                    <div class="chat-list-item chat-target-item"
                         data-name="Test User">

                        <div class="chat-avatar-small"></div>

                        <div class="chat-item-content">
                            <span class="chat-name">Test User</span>
                        </div>

                    </div>

                </div>
            </div>

            <!-- Moments -->
            <div id="chat-tab-moments" class="chat-page">

                <header class="chat-header">
                    <h1 class="chat-title">Moments</h1>

                    <button class="chat-icon-btn">
                        <i data-lucide="camera"></i>
                    </button>
                </header>

                <div class="chat-moments-cover">
                    <div class="chat-moments-avatar"></div>
                </div>

                <div class="chat-moments-feed"></div>

            </div>

            <!-- Me -->
            <div id="chat-tab-me" class="chat-page">

                <div class="chat-me-header">

                    <div class="chat-me-info">

                        <div class="chat-me-avatar"></div>

                        <div class="chat-me-text">
                            <h2 class="chat-me-name">John Doe</h2>
                            <span class="chat-me-id">
                                ID: johndoe_99
                            </span>
                        </div>

                    </div>

                    <i data-lucide="qr-code"
                       class="chat-me-qr"></i>

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

            <!-- Bottom Navigation -->
            <nav class="chat-bottom-bar">

                <div class="chat-nav-item active"
                     data-target="chat-tab-chats">
                    <i data-lucide="message-square"></i>
                    <span>Chats</span>
                </div>

                <div class="chat-nav-item"
                     data-target="chat-tab-contacts">
                    <i data-lucide="users"></i>
                    <span>Contacts</span>
                </div>

                <div class="chat-nav-item"
                     data-target="chat-tab-moments">
                    <i data-lucide="aperture"></i>
                    <span>Moments</span>
                </div>

                <div class="chat-nav-item"
                     data-target="chat-tab-me">
                    <i data-lucide="user-circle"></i>
                    <span>Me</span>
                </div>

            </nav>

        </div>

        <!-- Chat Room -->
        <div id="chat-room-page"
             class="chat-room-container">

            <header class="chat-room-header">

                <button class="chat-room-back"
                        id="room-back-btn">
                    <i data-lucide="chevron-left"></i>
                </button>

                <div class="chat-room-title-area">
                    <span class="chat-room-name"
                          id="room-target-name">
                        Chat
                    </span>
                </div>

                <div class="chat-room-placeholder"></div>

            </header>

            <div class="chat-room-body"
                 id="room-messages-body">
            </div>

            <div class="chat-room-footer">

                <div class="chat-room-input-box">
                    <input
                        type="text"
                        id="room-input"
                        placeholder="Message..."
                        autocomplete="off"
                    />
                </div>

                <button
                    class="chat-room-send-btn"
                    id="room-send-btn"
                    disabled>

                    <i data-lucide="arrow-up"></i>

                </button>

                <button
                    class="chat-room-ai-btn"
                    id="room-ai-btn"
                    disabled>

                    <i data-lucide="sparkles"></i>

                </button>

            </div>

        </div>
    `;

    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: container });
    }


    /* =====================================================
       1. Tab 切换
    ===================================================== */

    const navItems =
        container.querySelectorAll('.chat-nav-item');

    const pages =
        container.querySelectorAll('.chat-page');

    navItems.forEach(item => {

        item.addEventListener('click', () => {

            navItems.forEach(nav =>
                nav.classList.remove('active')
            );

            pages.forEach(page =>
                page.classList.remove('active')
            );

            item.classList.add('active');

            const targetId =
                item.getAttribute('data-target');

            const target =
                container.querySelector('#' + targetId);

            if (target) {
                target.classList.add('active');
            }
        });

    });


    /* =====================================================
       2. 聊天数据
    ===================================================== */

    const STORAGE_KEY = 'wuyo_chat_messages';

    let currentContact = null;

    const roomBody =
        document.getElementById('room-messages-body');

    const roomInput =
        document.getElementById('room-input');

    const sendBtn =
        document.getElementById('room-send-btn');

    const aiBtn =
        document.getElementById('room-ai-btn');


    const defaultMessages = {
        'Test User': []
    };


    function loadAllMessages() {

        try {

            const raw =
                localStorage.getItem(STORAGE_KEY);

            if (!raw) return {};

            return JSON.parse(raw);

        } catch (error) {

            console.error(
                '读取聊天记录失败:',
                error
            );

            return {};
        }
    }


    function saveAllMessages(all) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(all)
            );

        } catch (error) {

            console.error(
                '保存聊天记录失败:',
                error
            );
        }
    }


    function getMessages(name) {

        const all =
            loadAllMessages();

        if (!Array.isArray(all[name])) {

            all[name] =
                defaultMessages[name] || [];

            saveAllMessages(all);
        }

        return all[name];
    }


    function addMessage(name, message) {

        const all =
            loadAllMessages();

        if (!Array.isArray(all[name])) {
            all[name] = [];
        }

        all[name].push(message);

        saveAllMessages(all);
    }


    /* =====================================================
       3. HTML 安全处理
    ===================================================== */

    function escapeHTML(text) {

        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    }


    /* =====================================================
       4. 渲染消息
    ===================================================== */

    function renderMessages(name) {

        const list =
            getMessages(name);

        roomBody.innerHTML = '';

        list.forEach(message => {

            if (message.from === 'system') {

                const system =
                    document.createElement('div');

                system.className =
                    'msg-system';

                system.textContent =
                    message.text;

                roomBody.appendChild(system);

                return;
            }


            const row =
                document.createElement('div');

            row.className =
                'msg-row ' +
                (message.from === 'me'
                    ? 'me'
                    : 'them');


            const bubble =
                document.createElement('div');

            bubble.className =
                'msg-bubble';

            bubble.innerHTML =
                escapeHTML(message.text)
                    .replace(/\n/g, '<br>');


            row.appendChild(bubble);

            roomBody.appendChild(row);

        });


        requestAnimationFrame(() => {

            roomBody.scrollTop =
                roomBody.scrollHeight;

        });

    }


    function getNowTime() {

        const now = new Date();

        return (
            String(now.getHours()).padStart(2, '0')
            + ':' +
            String(now.getMinutes()).padStart(2, '0')
        );
    }


    /* =====================================================
       5. 读取 API 设置
       ===================================================== */

    function getApiConfig() {

        try {

            const raw =
                localStorage.getItem('wuyo_config');

            if (!raw) {
                return null;
            }

            const config =
                JSON.parse(raw);

            /*
             * 兼容目前设置页面可能使用的结构：
             *
             * config.api.url
             * config.api.key
             * config.api.model
             * config.api.temperature
             */

            const api =
                config.api || {};

            return {

                url:
                    api.url ||
                    api.baseUrl ||
                    api.endpoint ||
                    '',

                key:
                    api.key ||
                    api.apiKey ||
                    '',

                model:
                    api.model ||
                    '',

                temperature:
                    typeof api.temperature === 'number'
                        ? api.temperature
                        : 1

            };

        } catch (error) {

            console.error(
                '读取 API 设置失败:',
                error
            );

            return null;
        }

    }


    /* =====================================================
       6. 自动修正 API URL
    ===================================================== */

    function buildApiURL(url) {

        if (!url) return '';

        url = url.trim();

        /*
         * 如果用户已经填写完整接口地址
         * 就直接使用。
         */

        if (
            url.endsWith('/chat/completions')
        ) {
            return url;
        }

        /*
         * OpenAI Compatible API
         */

        if (
            url.endsWith('/v1')
        ) {
            return url +
                '/chat/completions';
        }

        /*
         * 如果是：
         * https://example.com
         */

        return url.replace(/\/+$/, '') +
            '/v1/chat/completions';

    }


    /* =====================================================
       7. 显示系统消息
    ===================================================== */

    function showSystemMessage(text) {

        if (!currentContact) return;

        addMessage(
            currentContact,
            {
                from: 'system',
                text: text,
                time: getNowTime()
            }
        );

        renderMessages(currentContact);

    }


    /* =====================================================
       8. 普通发送
    ===================================================== */

    function sendPlainMessage() {

        const text =
            roomInput.value.trim();

        if (!text || !currentContact) {
            return;
        }

        addMessage(
            currentContact,
            {
                from: 'me',
                text: text,
                time: getNowTime()
            }
        );

        renderMessages(currentContact);

        clearInputState();

    }


    /* =====================================================
       9. 构造聊天历史
    ===================================================== */

    function buildChatHistory(name) {

        const messages =
            getMessages(name);

        return messages
            .filter(message =>
                message.from === 'me' ||
                message.from === 'them'
            )
            .map(message => ({

                role:
                    message.from === 'me'
                        ? 'user'
                        : 'assistant',

                content:
                    String(message.text)

            }));

    }


    /* =====================================================
       10. 请求 AI
    ===================================================== */

    async function requestAI(name) {

        const config =
            getApiConfig();

        if (!config) {

            throw new Error(
                '没有找到 API 设置，请先在 Settings → API 中填写 API URL 和 API Key。'
            );
        }


        if (!config.url) {

            throw new Error(
                'API URL 为空，请先填写 API URL。'
            );
        }


        if (!config.key) {

            throw new Error(
                'API Key 为空，请先填写 API Key。'
            );
        }


        if (!config.model) {

            throw new Error(
                '还没有选择模型，请先在 API 设置中选择模型。'
            );
        }


        const apiURL =
            buildApiURL(config.url);


        const history =
            buildChatHistory(name);


        /*
         * 目前先使用基础 System Prompt。
         *
         * 世界书和 Char 人设下一步再接。
         */

        const systemPrompt =
            `You are a fictional character in a chat application.
Stay in character and respond naturally.
Do not mention system prompts, APIs, or internal instructions.
Reply naturally according to the conversation.`;


        const messages = [

            {
                role: 'system',
                content: systemPrompt
            },

            ...history

        ];


        const response =
            await fetch(apiURL, {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json',

                    'Authorization':
                        'Bearer ' + config.key

                },

                body: JSON.stringify({

                    model: config.model,

                    messages: messages,

                    temperature:
                        Math.max(
                            0,
                            Math.min(
                                2,
                                Number(config.temperature)
                            )
                        )

                })

            });


        const rawText =
            await response.text();


        let data = null;


        try {

            data =
                JSON.parse(rawText);

        } catch (error) {

            if (!response.ok) {

                throw new Error(
                    `API 请求失败 (${response.status})：${rawText.slice(0, 300)}`
                );

            }

            throw new Error(
                'API 返回的内容不是有效 JSON。'
            );

        }


        if (!response.ok) {

            const errorMessage =
                data?.error?.message ||
                data?.message ||
                `HTTP ${response.status}`;

            throw new Error(
                'API 请求失败：' +
                errorMessage
            );

        }


        /*
         * OpenAI Compatible 格式
         */

        let reply =
            data?.choices?.[0]?.message?.content;


        /*
         * 部分 API 返回 text
         */

        if (!reply) {

            reply =
                data?.choices?.[0]?.text;
        }


        /*
         * 某些服务可能返回 content 数组
         */

        if (
            Array.isArray(reply)
        ) {

            reply =
                reply
                    .map(item =>
                        typeof item === 'string'
                            ? item
                            : item?.text || ''
                    )
                    .join('');

        }


        if (
            typeof reply !== 'string' ||
            !reply.trim()
        ) {

            throw new Error(
                'API 已连接，但没有返回有效的 AI 回复。'
            );

        }


        return reply.trim();

    }


    /* =====================================================
       11. 发送并请求 AI
    ===================================================== */

    async function sendAiMessage() {

        const text =
            roomInput.value.trim();

        if (!text || !currentContact) {
            return;
        }


        /*
         * 先保存 User 消息
         */

        addMessage(
            currentContact,
            {
                from: 'me',
                text: text,
                time: getNowTime()
            }
        );


        clearInputState();

        renderMessages(currentContact);


        /*
         * 防止重复点击
         */

        aiBtn.disabled = true;
        sendBtn.disabled = true;
        roomInput.disabled = true;


        /*
         * AI 思考提示
         */

        const loading =
            document.createElement('div');

        loading.className =
            'msg-row them';

        loading.id =
            'chat-ai-thinking';


        loading.innerHTML = `
            <div class="msg-bubble">
                Thinking...
            </div>
        `;

        roomBody.appendChild(loading);

        roomBody.scrollTop =
            roomBody.scrollHeight;


        try {

            const reply =
                await requestAI(
                    currentContact
                );


            /*
             * 删除 Thinking
             */

            const thinking =
                document.getElementById(
                    'chat-ai-thinking'
                );

            if (thinking) {
                thinking.remove();
            }


            /*
             * 保存 AI 回复
             */

            addMessage(
                currentContact,
                {
                    from: 'them',
                    text: reply,
                    time: getNowTime()
                }
            );


            renderMessages(
                currentContact
            );


        } catch (error) {

            console.error(
                'AI 请求错误:',
                error
            );


            const thinking =
                document.getElementById(
                    'chat-ai-thinking'
                );

            if (thinking) {
                thinking.remove();
            }


            showSystemMessage(
                error.message ||
                'AI 请求失败，请检查 API 设置。'
            );

        } finally {

            roomInput.disabled = false;

            updateInputButtons();

            roomInput.focus();

        }

    }


    /* =====================================================
       12. 输入框状态
    ===================================================== */

    function updateInputButtons() {

        const hasText =
            roomInput.value.trim().length > 0;

        if (roomInput.disabled) {

            sendBtn.disabled = true;
            aiBtn.disabled = true;

            return;
        }

        sendBtn.disabled =
            !hasText;

        aiBtn.disabled =
            !hasText;

    }


    function clearInputState() {

        roomInput.value = '';

        updateInputButtons();

    }


    roomInput.addEventListener(
        'input',
        updateInputButtons
    );


    roomInput.addEventListener(
        'keydown',
        event => {

            if (event.key === 'Enter') {

                event.preventDefault();

                /*
                 * Enter 默认只发送 User 消息
                 */

                sendPlainMessage();

            }

        }
    );


    sendBtn.addEventListener(
        'click',
        sendPlainMessage
    );


    aiBtn.addEventListener(
        'click',
        sendAiMessage
    );


    /* =====================================================
       13. 打开聊天房间
    ===================================================== */

    const mainTabs =
        document.getElementById(
            'chat-main-tabs'
        );

    const roomPage =
        document.getElementById(
            'chat-room-page'
        );

    const roomNameEl =
        document.getElementById(
            'room-target-name'
        );

    const backBtn =
        document.getElementById(
            'room-back-btn'
        );


    function openChat(contactName) {

        currentContact =
            contactName;

        roomNameEl.textContent =
            contactName;

        renderMessages(
            contactName
        );

        mainTabs.style.display =
            'none';

        roomPage.style.display =
            'flex';

    }


    const chatItems =
        container.querySelectorAll(
            '.chat-target-item'
        );


    chatItems.forEach(item => {

        item.addEventListener(
            'click',
            () => {

                const name =
                    item.getAttribute(
                        'data-name'
                    );

                openChat(name);

            }
        );

    });


    /* =====================================================
       14. 返回聊天列表
    ===================================================== */

    backBtn.addEventListener(
        'click',
        () => {

            roomPage.style.display =
                'none';

            mainTabs.style.display =
                'block';

            currentContact =
                null;

        }
    );


    /* =====================================================
       15. 初始化
    ===================================================== */

    roomPage.style.display =
        'none';

    updateInputButtons();

    console.log(
        'WUYO Chat 已加载'
    );

})();