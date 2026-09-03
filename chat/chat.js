(function () {
    'use strict';

    const app = document.getElementById('chat-app');
    if (!app) return;

    /* =========================
       数据
    ========================= */

    const KEY = {
        chars: 'wuyo_chars',
        chats: 'wuyo_chats',
        settings: 'wuyo_chat_settings'
    };

    const load = (key, fallback) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch {
            return fallback;
        }
    };

    const save = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    let characters = load(KEY.chars, []);
    let chats = load(KEY.chats, {});
    let settings = load(KEY.settings, {});

    let current = null;

    /* =========================
       工具
    ========================= */

    const $ = id => document.getElementById(id);

    const id = () =>
        'char_' + Date.now() + Math.random().toString(16).slice(2);

    const time = () => {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' +
               String(d.getMinutes()).padStart(2, '0');
    };

    const safe = text => {
        const div = document.createElement('div');
        div.textContent = text ?? '';
        return div.innerHTML;
    };

    /* =========================
       页面
    ========================= */

    app.innerHTML = `
        <div class="chat-main">

            <header class="chat-header">
                <button id="chat-back">‹</button>
                <h2 id="chat-title">Chats</h2>
                <button id="chat-add">＋</button>
            </header>

            <main id="chat-content"></main>

            <nav class="chat-nav">
                <button data-page="chats">Chats</button>
                <button data-page="contacts">Contacts</button>
                <button data-page="moments">Moments</button>
                <button data-page="me">Me</button>
            </nav>

        </div>

        <section id="chat-room" class="chat-room">
            <header class="chat-room-head">
                <button id="room-back">‹</button>
                <strong id="room-name"></strong>
                <button id="room-more">•••</button>
            </header>

            <div id="messages"></div>

            <footer class="chat-input">
                <input id="message-input" placeholder="Message">
                <button id="send">↑</button>
            </footer>
        </section>

        <div id="chat-modal" class="chat-modal"></div>
    `;

    const content = $('chat-content');
    const room = $('chat-room');
    const messagesBox = $('messages');
    const modal = $('chat-modal');

    /* =========================
       聊天记录
    ========================= */

    function getChat(name) {
        if (!chats[name]) chats[name] = [];
        return chats[name];
    }

    function addMessage(name, from, text) {
        getChat(name).push({
            from,
            text,
            time: time()
        });

        save(KEY.chats, chats);
    }

    /* =========================
       Chats
    ========================= */

    function renderChats() {
        $('chat-title').textContent = 'Chats';

        if (!characters.length) {
            content.innerHTML = `
                <div class="chat-empty">
                    No chats
                </div>
            `;
            return;
        }

        content.innerHTML = characters.map(c => {
            const list = getChat(c.name);
            const last = list[list.length - 1];

            return `
                <div class="chat-item" data-id="${c.id}">
                    <div class="chat-avatar"
                         style="${c.avatar ? `background-image:url('${c.avatar}')` : ''}">
                    </div>

                    <div class="chat-info">
                        <strong>${safe(c.name)}</strong>
                        <span>${safe(last?.text || 'Start chatting')}</span>
                    </div>

                    <small>${last?.time || ''}</small>
                </div>
            `;
        }).join('');

        content.querySelectorAll('.chat-item').forEach(el => {
            el.onclick = () => {
                const c = characters.find(x => x.id === el.dataset.id);
                if (c) openChat(c);
            };
        });
    }

    /* =========================
       Contacts
    ========================= */

    function renderContacts() {
        $('chat-title').textContent = 'Contacts';

        content.innerHTML = `
            <button class="add-contact" id="add-contact">
                Add Friend
            </button>

            ${characters.map(c => `
                <div class="chat-item" data-id="${c.id}">
                    <div class="chat-avatar"
                         style="${c.avatar ? `background-image:url('${c.avatar}')` : ''}">
                    </div>

                    <div class="chat-info">
                        <strong>${safe(c.nickname || c.name)}</strong>
                        <span>${safe(c.note || c.name)}</span>
                    </div>
                </div>
            `).join('')}
        `;

        $('add-contact').onclick = () => characterEditor();

        content.querySelectorAll('.chat-item').forEach(el => {
            el.onclick = () => {
                const c = characters.find(x => x.id === el.dataset.id);
                if (c) openChat(c);
            };
        });
    }

    /* =========================
       Me
    ========================= */

    function renderMe() {
        $('chat-title').textContent = 'Me';

        content.innerHTML = `
            <div class="me-page">

                <div class="me-avatar"></div>

                <h2>User</h2>

                <button id="wallet-btn">Wallet</button>
                <button id="mask-btn">User Mask</button>
                <button id="beautify-btn">Chat Beautify</button>

            </div>
        `;

        $('wallet-btn').onclick = () => {
            alert('Wallet module');
        };

        $('mask-btn').onclick = () => {
            alert('User Mask module');
        };

        $('beautify-btn').onclick = () => {
            alert('Beautify module');
        };
    }

    /* =========================
       Moments
    ========================= */

    function renderMoments() {
        $('chat-title').textContent = 'Moments';

        content.innerHTML = `
            <div class="moments-page">

                <button id="moment-add">
                    New Moment
                </button>

                <div class="moment-empty">
                    No moments
                </div>

            </div>
        `;

        $('moment-add').onclick = () => {
            alert('Moment module');
        };
    }

    /* =========================
       打开聊天
    ========================= */

    function openChat(character) {
        current = character;

        $('room-name').textContent =
            character.nickname || character.name;

        room.classList.add('active');

        renderMessages();
    }

    /* =========================
       消息
    ========================= */

    function renderMessages() {
        if (!current) return;

        messagesBox.innerHTML =
            getChat(current.name).map(m => `
                <div class="message ${m.from}">
                    <div class="bubble">
                        ${safe(m.text)}
                    </div>
                    <small>${m.time || ''}</small>
                </div>
            `).join('');

        messagesBox.scrollTop =
            messagesBox.scrollHeight;
    }

    function sendMessage() {
        const input = $('message-input');
        const text = input.value.trim();

        if (!text || !current) return;

        addMessage(current.name, 'user', text);

        input.value = '';

        renderMessages();
        renderChats();
    }

    /* =========================
       角色编辑
    ========================= */

    function characterEditor(character = null) {
        modal.innerHTML = `
            <div class="editor">

                <header>
                    <strong>${character ? 'Edit Character' : 'New Character'}</strong>
                    <button id="modal-close">×</button>
                </header>

                <input id="c-name"
                    placeholder="Name"
                    value="${safe(character?.name || '')}">

                <input id="c-nickname"
                    placeholder="Nickname"
                    value="${safe(character?.nickname || '')}">

                <input id="c-wechat"
                    placeholder="WeChat ID"
                    value="${safe(character?.wechat || '')}">

                <input id="c-phone"
                    placeholder="Phone"
                    value="${safe(character?.phone || '')}">

                <textarea id="c-persona"
                    placeholder="Persona">${safe(character?.persona || '')}</textarea>

                <button id="c-save">Save</button>
            </div>
        `;

        modal.classList.add('active');

        $('modal-close').onclick = closeModal;

        $('c-save').onclick = () => {
            const name = $('c-name').value.trim();

            if (!name) {
                alert('Please enter a name');
                return;
            }

            const data = {
                id: character?.id || id(),
                name,
                nickname: $('c-nickname').value.trim(),
                wechat: $('c-wechat').value.trim(),
                phone: $('c-phone').value.trim(),
                persona: $('c-persona').value.trim(),
                avatar: character?.avatar || ''
            };

            if (character) {
                characters = characters.map(c =>
                    c.id === character.id ? data : c
                );
            } else {
                characters.push(data);
            }

            save(KEY.chars, characters);

            closeModal();
            renderChats();
        };
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.innerHTML = '';
    }

    /* =========================
       Chat 设置
    ========================= */

    function chatSettings() {
        if (!current) return;

        modal.innerHTML = `
            <div class="editor">

                <header>
                    <strong>Chat Settings</strong>
                    <button id="modal-close">×</button>
                </header>

                <button data-setting="time">
                    Time Awareness
                </button>

                <button data-setting="location">
                    Location Mode
                </button>

                <button data-setting="active">
                    Active Messages
                </button>

                <button data-setting="activity">
                    Free Activity
                </button>

                <button data-setting="translation">
                    Translation
                </button>

                <button data-setting="voice">
                    Voice
                </button>

                <button data-setting="memory">
                    Memory
                </button>

                <button data-setting="background">
                    Chat Background
                </button>

            </div>
        `;

        $('modal-close').onclick = closeModal;

        modal.querySelectorAll('[data-setting]').forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.setting;

                settings[current.id] =
                    settings[current.id] || {};

                settings[current.id][key] =
                    !settings[current.id][key];

                save(KEY.settings, settings);

                btn.textContent =
                    btn.textContent +
                    (settings[current.id][key]
                        ? '  ON'
                        : '  OFF');
            };
        });
    }

    /* =========================
       导航
    ========================= */

    app.querySelectorAll('.chat-nav button').forEach(btn => {
        btn.onclick = () => {
            const page = btn.dataset.page;

            if (page === 'chats') renderChats();
            if (page === 'contacts') renderContacts();
            if (page === 'moments') renderMoments();
            if (page === 'me') renderMe();
        };
    });

    /* =========================
       按钮
    ========================= */

    $('chat-add').onclick = () => characterEditor();

    $('chat-back').onclick = () => {
        if (typeof window.closeApp === 'function') {
            window.closeApp('chat');
        }
    };

    $('room-back').onclick = () => {
        room.classList.remove('active');
        current = null;
        renderChats();
    };

    $('room-more').onclick = chatSettings;

    $('send').onclick = sendMessage;

    $('message-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    modal.onclick = e => {
        if (e.target === modal) closeModal();
    };

    /* =========================
       AI
    ========================= */

    window.wuyoChatAI = async function () {
        if (!current) return;

        const config = load('wuyo_config', {});

        const api = config.api || config;

        if (!api.url || !api.key) {
            alert('Please configure API first.');
            return;
        }

        addMessage(
            current.name,
            'system',
            'Thinking...'
        );

        renderMessages();

        /*
         * AI 请求模块之后独立扩展。
         * 这里故意不让 API 逻辑塞满 chat.js。
         */
    };

    /* =========================
       对外接口
    ========================= */

    window.wuyoChat = {
        characters,
        openChat,
        renderChats,
        renderContacts,
        renderMoments,
        renderMe,
        characterEditor,
        chatSettings,
        getChat,
        addMessage
    };

    /* =========================
       启动
    ========================= */

    room.classList.remove('active');
    modal.classList.remove('active');

    renderChats();

})();