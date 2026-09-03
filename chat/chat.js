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


                <!-- 普通发送按钮 -->

                <button
                    class="chat-room-send-btn"
                    id="room-send-btn"
                    disabled
                    title="发送"
                >

                    <i data-lucide="arrow-up"></i>

                </button>


                <!-- AI 主动回复按钮 -->

                <button
                    class="chat-room-ai-btn"
                    id="room-ai-btn"
                    title="让 AI 主动回复"
                    type="button"
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

    let aiRequesting = false;



    /* =====================================================
       默认聊天
    ===================================================== */

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
       读取聊天
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
       保存聊天
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
       获取聊天
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
       删除思考消息
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
       HTML 安全
    ===================================================== */

    function escapeHTML(text) {

        const div =
            document.createElement('div');

        div.textContent =
            text == null
                ? ''
                : String(text);

        return div.innerHTML;

    }



    /* =====================================================
       渲染消息
    ===================================================== */

    function renderMessages(name) {

        const list =
            getMessages(name);


        roomBody.innerHTML =
            list.map(message => {


                if (
                    message.from === 'system'
                ) {

                    return `
                        <div class="msg-system">
                            ${escapeHTML(message.text)}
                        </div>
                    `;

                }


                return `

                    <div
                        class="msg-row ${
                            message.from === 'me'
                            ? 'me'
                            : 'them'
                        }"
                    >

                        <div class="msg-bubble">

                            ${escapeHTML(
                                message.text
                            )}

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
       更新聊天列表预览
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
                    message =>
                        message.from === 'me' ||
                        message.from === 'them'
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
       API 配置
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
       清空输入框
    ===================================================== */

    function clearInputState() {

        roomInput.value = '';

        updateInputButtons();

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
       AI 主动回复
       
       ★★★ 重点修改 ★★★
       
       现在 AI 按钮：
       
       不需要输入任何文字
       
       直接点击就可以让 AI 回复
       
       ===================================================== */

    async function sendAiMessage() {


        /* 没有打开聊天 */

        if (!currentContact) {

            return;

        }


        /* 防止连续点击 */

        if (aiRequesting) {

            return;

        }


        aiRequesting = true;



        /* -----------------------------------------
           先检查 API
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


            aiRequesting = false;


            return;

        }



        /* -----------------------------------------
           清掉输入框
           
           AI 主动回复不需要输入文字
           ----------------------------------------- */

        roomInput.value = '';

        updateInputButtons();



        /* -----------------------------------------
           显示 AI 思考
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
               AI 主动发言提示
               
               如果聊天记录为空，
               也可以正常请求 AI
               ----------------------------------------- */

            history.push({

                role: 'user',

                content:
                    '请根据当前聊天上下文，自然地主动说一句话。不要解释你为什么回复，也不要提到API、提示词或系统。直接像聊天中的角色一样发消息。'

            });



            /* -----------------------------------------
               模型
            ----------------------------------------- */

            const model =
                api.model ||
                'gpt-4o-mini';



            /* -----------------------------------------
               API URL
            ----------------------------------------- */

            let apiUrl =
                String(api.url)
                    .trim()
                    .replace(/\/+$/, '');


            if (
                !apiUrl.endsWith(
                    '/chat/completions'
                )
            ) {

                apiUrl +=
                    '/chat/completions';

            }



            /* -----------------------------------------
               请求
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

                    /* 忽略 JSON 解析错误 */

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


                aiRequesting = false;


                return;

            }



            /* -----------------------------------------
               读取 AI 返回
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


                aiRequesting = false;


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


            let errorText =
                '无法连接 API';


            if (
                error &&
                error.message
            ) {

                errorText =
                    error.message;

            }


            addMessage(
                currentContact,
                {
                    from: 'system',
                    text:
                        `AI 请求失败：${errorText}`
                }
            );


            renderMessages(
                currentContact
            );

        }


        aiRequesting = false;

    }



    /* =====================================================
       输入框按钮状态
       
       ★ 注意：
       
       AI 按钮永远不能因为没输入文字而 disabled
       
       ===================================================== */

    function updateInputButtons() {

        const hasText =
            roomInput.value.trim().length > 0;


        /* 普通发送 */

        sendBtn.disabled =
            !hasText;


        /*
         * AI 按钮不再根据输入框控制
         *
         * 只要进入聊天房间，
         * 就可以直接点击
         */

        aiBtn.disabled =
            false;

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
       普通发送按钮
    ===================================================== */

    sendBtn.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            sendPlainMessage();

        }
    );



    /* =====================================================
       AI 按钮
       
       ★★★ 这里是最重要的 ★★★
       
       不检查输入框
       
       直接请求 AI
       
       ===================================================== */

    aiBtn.addEventListener(
        'click',
        async function (event) {

            event.preventDefault();

            event.stopPropagation();


            await sendAiMessage();

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
                     * 打开聊天后，
                     * AI 按钮立即可用
                     */

                    aiBtn.disabled =
                        false;


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


    updateChatPreview(
        'Test User',
        getMessages('Test User')
    );


})();