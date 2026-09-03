(function () {

    const container = document.getElementById('chat-app');

    if (!container) return;


    /* =====================================================
       Chat HTML
    ===================================================== */

    container.innerHTML = `

        <!-- 全局返回按钮 -->
        <div class="chat-system-close" id="chat-system-close">
            <i data-lucide="chevron-left"></i>
        </div>


        <!-- ================= 主 Chat ================= -->

        <div id="chat-main-tabs" class="chat-tabs-container">


            <!-- Chats -->

            <div id="chat-tab-chats" class="chat-page active">

                <header class="chat-header">

                    <h1 class="chat-title">
                        Chats
                    </h1>

                    <button
                        class="chat-icon-btn"
                        id="chat-add-btn"
                    >
                        <i data-lucide="plus"></i>
                    </button>

                </header>


                <div class="chat-search-wrap">

                    <div class="chat-search">

                        <i data-lucide="search"></i>

                        <span>
                            Search...
                        </span>

                    </div>

                </div>


                <div
                    class="chat-list"
                    id="chat-list"
                >

                    <div
                        class="chat-list-item chat-target-item"
                        data-name="Test User"
                    >

                        <div class="chat-avatar"></div>

                        <div class="chat-item-content">

                            <div class="chat-item-top">

                                <span class="chat-name">
                                    Test User
                                </span>

                                <span
                                    class="chat-time"
                                    id="test-user-time"
                                >
                                    —
                                </span>

                            </div>


                            <div class="chat-item-bottom">

                                <span
                                    class="chat-msg"
                                    id="test-user-last-message"
                                >
                                    开始聊天
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>



            <!-- Contacts -->

            <div
                id="chat-tab-contacts"
                class="chat-page"
            >

                <header class="chat-header">

                    <h1 class="chat-title">
                        Contacts
                    </h1>

                    <button class="chat-icon-btn">

                        <i data-lucide="plus"></i>

                    </button>

                </header>


                <div class="chat-search-wrap">

                    <div class="chat-search">

                        <i data-lucide="search"></i>

                        <span>
                            Search...
                        </span>

                    </div>

                </div>


                <div class="chat-contacts-special">


                    <div class="chat-list-item">

                        <div class="chat-avatar-small flex-center">

                            <i data-lucide="user-plus"></i>

                        </div>

                        <div class="chat-item-content">

                            <span class="chat-name">
                                New Friends
                            </span>

                        </div>

                    </div>


                    <div class="chat-list-item">

                        <div class="chat-avatar-small flex-center">

                            <i data-lucide="users"></i>

                        </div>

                        <div class="chat-item-content">

                            <span class="chat-name">
                                Groups
                            </span>

                        </div>

                    </div>


                </div>


                <div class="chat-contacts-list">

                    <div class="chat-letter-divider">
                        T
                    </div>


                    <div
                        class="chat-list-item chat-target-item"
                        data-name="Test User"
                    >

                        <div class="chat-avatar-small"></div>

                        <div class="chat-item-content">

                            <span class="chat-name">
                                Test User
                            </span>

                        </div>

                    </div>

                </div>

            </div>



            <!-- Moments -->

            <div
                id="chat-tab-moments"
                class="chat-page"
            >

                <header class="chat-header">

                    <h1 class="chat-title">
                        Moments
                    </h1>

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

            <div
                id="chat-tab-me"
                class="chat-page"
            >

                <div class="chat-me-header">

                    <div class="chat-me-info">

                        <div class="chat-me-avatar"></div>

                        <div class="chat-me-text">

                            <h2 class="chat-me-name">
                                User
                            </h2>

                            <span class="chat-me-id">
                                ID: user
                            </span>

                        </div>

                    </div>


                    <i
                        data-lucide="qr-code"
                        class="chat-me-qr"
                    ></i>

                </div>


                <div class="chat-me-menu">

                    <div class="chat-menu-item">

                        <i data-lucide="user"></i>

                        <span>
                            Profile
                        </span>

                    </div>


                    <div class="chat-menu-item">

                        <i data-lucide="star"></i>

                        <span>
                            Favorites
                        </span>

                    </div>


                    <div class="chat-menu-item">

                        <i data-lucide="settings"></i>

                        <span>
                            Settings
                        </span>

                    </div>


                    <div class="chat-menu-item">

                        <i data-lucide="info"></i>

                        <span>
                            About
                        </span>

                    </div>

                </div>

            </div>



            <!-- 底部导航 -->

            <nav class="chat-bottom-bar">


                <div
                    class="chat-nav-item active"
                    data-target="chat-tab-chats"
                >

                    <i data-lucide="message-square"></i>

                    <span>
                        Chats
                    </span>

                </div>


                <div
                    class="chat-nav-item"
                    data-target="chat-tab-contacts"
                >

                    <i data-lucide="users"></i>

                    <span>
                        Contacts
                    </span>

                </div>


                <div
                    class="chat-nav-item"
                    data-target="chat-tab-moments"
                >

                    <i data-lucide="aperture"></i>

                    <span>
                        Moments
                    </span>

                </div>


                <div
                    class="chat-nav-item"
                    data-target="chat-tab-me"
                >

                    <i data-lucide="user-circle"></i>

                    <span>
                        Me
                    </span>

                </div>


            </nav>

        </div>



        <!-- ================= 私聊房间 ================= -->

        <div
            id="chat-room-page"
            class="chat-room-container"
        >


            <!-- 顶部 -->

            <header class="chat-room-header">


                <button
                    class="chat-room-back"
                    id="room-back-btn"
                >

                    <i data-lucide="chevron-left"></i>

                </button>


                <div class="chat-room-title-area">

                    <span
                        class="chat-room-name"
                        id="room-target-name"
                    >
                        Chat
                    </span>

                </div>


                <div class="chat-room-placeholder"></div>


            </header>



            <!-- 消息区域 -->

            <div
                class="chat-room-body"
                id="room-messages-body"
            ></div>



            <!-- 输入区域 -->

            <div class="chat-room-footer">


                <div class="chat-room-input-box">

                    <input
                        type="text"
                        id="room-input"
                        placeholder="Message..."
                        autocomplete="off"
                        enterkeyhint="send"
                    />

                </div>


                <!-- 普通发送 -->

                <button
                    class="chat-room-send-btn"
                    id="room-send-btn"
                    disabled
                    title="发送"
                >

                    <i data-lucide="arrow-up"></i>

                </button>


                <!-- AI 回复 -->

                <button
                    class="chat-room-ai-btn"
                    id="room-ai-btn"
                    disabled
                    title="发送并请求 AI 回复"
                >

                    <i data-lucide="sparkles"></i>

                </button>


            </div>


        </div>

    `;


    /* =====================================================
       Lucide
    ===================================================== */

    if (window.lucide) {

        lucide.createIcons({
            root: container
        });

    }



    /* =====================================================
       元素
    ===================================================== */

    const mainTabs =
        document.getElementById('chat-main-tabs');

    const roomPage =
        document.getElementById('chat-room-page');

    const roomBody =
        document.getElementById('room-messages-body');

    const roomInput =
        document.getElementById('room-input');

    const sendBtn =
        document.getElementById('room-send-btn');

    const aiBtn =
        document.getElementById('room-ai-btn');

    const backBtn =
        document.getElementById('room-back-btn');

    const roomNameEl =
        document.getElementById('room-target-name');

    const closeBtn =
        document.getElementById('chat-system-close');



    /* =====================================================
       Storage
    ===================================================== */

    const STORAGE_KEY =
        'wuyo_chat_messages';


    let currentContact = null;



    const defaultMessages = {

        'Test User': [

            {
                from: 'them',
                text: '你好，这里是测试聊天。',
                time: getNowTime()
            }

        ]

    };



    /* =====================================================
       时间
    ===================================================== */

    function getNowTime() {

        const now = new Date();

        return (
            String(now.getHours()).padStart(2, '0')
            +
            ':'
            +
            String(now.getMinutes()).padStart(2, '0')
        );

    }



    /* =====================================================
       读取全部聊天
    ===================================================== */

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



    /* =====================================================
       保存全部聊天
    ===================================================== */

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



    /* =====================================================
       获取某个角色的聊天
    ===================================================== */

    function getMessages(name) {

        const all =
            loadAllMessages();


        if (!all[name]) {

            all[name] =
                defaultMessages[name]
                ? [...defaultMessages[name]]
                : [];

            saveAllMessages(all);

        }


        return all[name];

    }



    /* =====================================================
       添加消息
    ===================================================== */

    function addMessage(name, message) {

        const all =
            loadAllMessages();


        if (!all[name]) {

            all[name] = [];

        }


        all[name].push(message);


        saveAllMessages(all);

    }



    /* =====================================================
       删除 AI 思考提示
    ===================================================== */

    function removeThinkingMessage(name) {

        const all =
            loadAllMessages();


        if (!all[name]) return;


        all[name] =
            all[name].filter(
                message =>
                    !message.thinking
            );


        saveAllMessages(all);

    }



    /* =====================================================
       HTML 安全处理
    ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement('div');

        div.textContent =
            text == null ? '' : String(text);

        return div.innerHTML;

    }



    /* =====================================================
       渲染聊天
    ===================================================== */

    function renderMessages(name) {

        const list =
            getMessages(name);


        roomBody.innerHTML =
            list.map(message => {


                /* 系统消息 */

                if (
                    message.from === 'system'
                ) {

                    return `
                        <div class="msg-system">
                            ${escapeHTML(message.text)}
                        </div>
                    `;

                }


                /* 正常消息 */

                return `

                    <div
                        class="msg-row ${
                            message.from === 'me'
                            ? 'me'
                            : 'them'
                        }"
                    >

                        <div class="msg-bubble">

                            ${escapeHTML(message.text)}

                        </div>

                    </div>

                `;

            }).join('');


        requestAnimationFrame(() => {

            roomBody.scrollTop =
                roomBody.scrollHeight;

        });


        updateChatPreview(
            name,
            list
        );

    }



    /* =====================================================
       更新 Chats 列表最后一条消息
    ===================================================== */

    function updateChatPreview(
        name,
        list
    ) {

        if (
            name !== 'Test User'
        ) return;


        const last =
            [...list]
                .reverse()
                .find(
                    m =>
                        m.from === 'me' ||
                        m.from === 'them'
                );


        const textEl =
            document.getElementById(
                'test-user-last-message'
            );


        const timeEl =
            document.getElementById(
                'test-user-time'
            );


        if (last) {

            if (textEl) {

                textEl.textContent =
                    last.text;

            }


            if (timeEl) {

                timeEl.textContent =
                    last.time || '—';

            }

        }

    }



    /* =====================================================
       API 配置读取
       兼容多个可能的保存结构
    ===================================================== */

    function getApiConfig() {

        try {

            const raw =
                localStorage.getItem(
                    'wuyo_config'
                );


            if (!raw) {

                return {
                    url: null,
                    key: null,
                    model: null,
                    temperature: 0.8
                };

            }


            const config =
                JSON.parse(raw);


            const api =
                config.api ||
                config.apiConfig ||
                config;


            return {

                url:
                    api.url ||
                    api.apiUrl ||
                    api.baseUrl ||
                    null,

                key:
                    api.key ||
                    api.apiKey ||
                    null,

                model:
                    api.model ||
                    api.modelName ||
                    null,

                temperature:
                    typeof api.temperature === 'number'
                    ? api.temperature
                    : 0.8

            };


        } catch (error) {

            console.error(
                '读取 API 设置失败:',
                error
            );


            return {
                url: null,
                key: null,
                model: null,
                temperature: 0.8
            };

        }

    }



    /* =====================================================
       普通发送
    ===================================================== */

    function sendPlainMessage() {

        const text =
            roomInput.value.trim();


        if (
            !text ||
            !currentContact
        ) return;


        addMessage(
            currentContact,
            {
                from: 'me',
                text: text,
                time: getNowTime()
            }
        );


        renderMessages(
            currentContact
        );


        clearInputState();

    }



    /* =====================================================
       AI 回复
    ===================================================== */

    async function sendAiMessage() {

        const text =
            roomInput.value.trim();


        if (
            !text ||
            !currentContact
        ) return;


        /* -----------------------------------------
           先保存 User 消息
        ----------------------------------------- */

        addMessage(
            currentContact,
            {
                from: 'me',
                text: text,
                time: getNowTime()
            }
        );


        clearInputState();


        /* -----------------------------------------
           检查 API
        ----------------------------------------- */

        const api =
            getApiConfig();


        if (
            !api.url ||
            !api.key
        ) {

            addMessage(
                currentContact,
                {
                    from: 'system',
                    text:
                        '未配置 API，请前往「设置 → API 设置」填写 API URL 和 API Key。'
                }
            );


            renderMessages(
                currentContact
            );


            return;

        }



        /* -----------------------------------------
           显示思考
        ----------------------------------------- */

        addMessage(
            currentContact,
            {
                from: 'system',
                text: '正在思考…',
                thinking: true
            }
        );


        renderMessages(
            currentContact
        );



        try {


            /* -----------------------------------------
               获取聊天历史
            ----------------------------------------- */

            const history =
                getMessages(
                    currentContact
                )
                .filter(
                    message =>
                        (
                            message.from === 'me' ||
                            message.from === 'them'
                        )
                        &&
                        !message.thinking
                )
                .map(
                    message => ({

                        role:
                            message.from === 'me'
                            ? 'user'
                            : 'assistant',

                        content:
                            message.text

                    })
                );



            /* -----------------------------------------
               模型
            ----------------------------------------- */

            const model =
                api.model ||
                'gpt-4o-mini';



            /* -----------------------------------------
               URL
            ----------------------------------------- */

            let apiUrl =
                String(api.url)
                    .trim()
                    .replace(/\/+$/, '');


            /*
             * 如果用户填写的是完整
             * /chat/completions
             * 就不要重复添加
             */

            if (
                !apiUrl.endsWith(
                    '/chat/completions'
                )
            ) {

                apiUrl +=
                    '/chat/completions';

            }



            /* -----------------------------------------
               请求 API
            ----------------------------------------- */

            const response =
                await fetch(
                    apiUrl,
                    {

                        method: 'POST',

                        headers: {

                            'Content-Type':
                                'application/json',

                            'Authorization':
                                `Bearer ${api.key}`

                        },

                        body:
                            JSON.stringify({

                                model:
                                    model,

                                messages:
                                    history,

                                temperature:
                                    Math.max(
                                        0,
                                        Math.min(
                                            2,
                                            Number(
                                                api.temperature
                                            ) || 0.8
                                        )
                                    )

                            })

                        }

                    );



            /* -----------------------------------------
               API 错误
            ----------------------------------------- */

            if (!response.ok) {


                let errorMessage =
                    `HTTP ${response.status}`;


                try {

                    const errorData =
                        await response.json();


                    errorMessage =
                        errorData?.error?.message ||
                        errorData?.message ||
                        errorMessage;

                } catch (error) {

                    /* 无 JSON 错误信息 */

                }


                removeThinkingMessage(
                    currentContact
                );


                addMessage(
                    currentContact,
                    {
                        from: 'system',
                        text:
                            `API 请求失败：${errorMessage}`
                    }
                );


                renderMessages(
                    currentContact
                );


                return;

            }



            /* -----------------------------------------
               读取结果
            ----------------------------------------- */

            const data =
                await response.json();


            const reply =
                data?.choices?.[0]?.message?.content;



            /* -----------------------------------------
               没有回复
            ----------------------------------------- */

            if (!reply) {

                removeThinkingMessage(
                    currentContact
                );


                addMessage(
                    currentContact,
                    {
                        from: 'system',
                        text:
                            'API 已连接，但没有返回有效的 AI 回复。'
                    }
                );


                renderMessages(
                    currentContact
                );


                return;

            }



            /* -----------------------------------------
               保存 AI 回复
            ----------------------------------------- */

            removeThinkingMessage(
                currentContact
            );


            addMessage(
                currentContact,
                {
                    from: 'them',
                    text:
                        String(reply).trim(),
                    time:
                        getNowTime()
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


            removeThinkingMessage(
                currentContact
            );


            let message =
                '无法连接 API';


            if (
                error &&
                error.message
            ) {

                message =
                    error.message;

            }


            addMessage(
                currentContact,
                {
                    from: 'system',
                    text:
                        `AI 请求失败：${message}`
                }
            );


            renderMessages(
                currentContact
            );

        }

    }



    /* =====================================================
       输入框状态
    ===================================================== */

    function updateInputButtons() {

        const hasText =
            roomInput.value.trim().length > 0;


        sendBtn.disabled =
            !hasText;


        aiBtn.disabled =
            !hasText;

    }



    function clearInputState() {

        roomInput.value = '';

        updateInputButtons();

    }



    /* =====================================================
       输入框事件
    ===================================================== */

    roomInput.addEventListener(
        'input',
        updateInputButtons
    );


    roomInput.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key === 'Enter'
            ) {

                event.preventDefault();


                if (
                    roomInput.value.trim()
                ) {

                    sendPlainMessage();

                }

            }

        }
    );



    /* =====================================================
       发送按钮
    ===================================================== */

    sendBtn.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            sendPlainMessage();

        }
    );



    /* =====================================================
       AI 按钮
    ===================================================== */

    aiBtn.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            sendAiMessage();

        }
    );



    /* =====================================================
       Tab 切换
    ===================================================== */

    const navItems =
        container.querySelectorAll(
            '.chat-nav-item'
        );


    const pages =
        container.querySelectorAll(
            '.chat-page'
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                'click',
                function () {


                    navItems.forEach(
                        nav =>
                            nav.classList.remove(
                                'active'
                            )
                    );


                    pages.forEach(
                        page =>
                            page.classList.remove(
                                'active'
                            )
                    );


                    item.classList.add(
                        'active'
                    );


                    const target =
                        item.getAttribute(
                            'data-target'
                        );


                    const page =
                        document.getElementById(
                            target
                        );


                    if (page) {

                        page.classList.add(
                            'active'
                        );

                    }

                }
            );

        }
    );



    /* =====================================================
       打开聊天
    ===================================================== */

    const chatItems =
        container.querySelectorAll(
            '.chat-target-item'
        );


    chatItems.forEach(
        item => {

            item.addEventListener(
                'click',
                function () {


                    const contactName =
                        item.getAttribute(
                            'data-name'
                        );


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


                    /*
                     * 让输入框自动获得焦点
                     */

                    setTimeout(
                        function () {

                            roomInput.focus();

                        },
                        150
                    );

                }
            );

        }
    );



    /* =====================================================
       私聊返回
    ===================================================== */

    backBtn.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            roomPage.style.display =
                'none';


            mainTabs.style.display =
                'block';


            currentContact =
                null;


            clearInputState();

        }
    );



    /* =====================================================
       Chat 总返回
    ===================================================== */

    closeBtn.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                typeof window.closeApp ===
                'function'
            ) {

                window.closeApp(
                    'chat'
                );

            }

        }
    );



    /* =====================================================
       初始化
    ===================================================== */

    updateInputButtons();


    /*
     * 初始化 Chats 预览
     */

    updateChatPreview(
        'Test User',
        getMessages('Test User')
    );


})();