(function(){

const container = document.getElementById('chat-app');

if(!container) return;


/* =====================================================
   角色系统样式
   ===================================================== */

const STYLE = `

/* ===== 角色弹窗最外层 ===== */

.character-mask{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,.32);
    z-index:9999;

    display:none;
    align-items:flex-end;

    overflow:hidden;
}


/* ===== 角色编辑页面 ===== */

.character-panel{
    position:relative;

    width:100%;
    max-height:94%;

    background:#f7f7f7;

    border-radius:24px 24px 0 0;

    overflow-y:auto;
    overflow-x:hidden;

    padding:18px;

    box-sizing:border-box;

    -webkit-overflow-scrolling:touch;
}


/* ===== 顶部 ===== */

.character-top{
    display:flex;
    align-items:center;
    justify-content:space-between;

    margin-bottom:15px;
}

.character-title{
    font-size:20px;
    font-weight:700;
    color:#222;
}

.character-close{
    border:0;

    width:34px;
    height:34px;

    border-radius:50%;

    background:#e9e9e9;

    font-size:20px;
    line-height:34px;

    padding:0;

    color:#444;
}


/* ===== 头像 ===== */

.character-avatar-preview{
    width:82px;
    height:82px;

    margin:0 auto 14px;

    border-radius:22px;

    background:#ddd;

    background-position:center;
    background-size:cover;
    background-repeat:no-repeat;
}


/* ===== 上传按钮 ===== */

.character-upload{
    display:block;

    width:100%;

    box-sizing:border-box;

    text-align:center;

    background:#fff;

    border-radius:13px;

    padding:11px;

    margin-bottom:13px;

    color:#555;

    font-size:14px;
}


/* ===== 输入区域 ===== */

.character-field{
    margin-bottom:11px;
}

.character-field label{
    display:block;

    font-size:12px;

    color:#777;

    margin:0 0 5px 4px;
}

.character-field input,
.character-field textarea{

    width:100%;

    box-sizing:border-box;

    border:0;

    background:#fff;

    border-radius:13px;

    padding:11px;

    font-size:15px;

    outline:none;

    color:#222;

}

.character-field textarea{

    min-height:78px;

    resize:none;

}


/* ===== 保存 ===== */

.character-save{

    width:100%;

    border:0;

    border-radius:14px;

    padding:13px;

    background:#222;

    color:#fff;

    font-size:15px;

}


/* ===== 删除 ===== */

.character-delete{

    width:100%;

    border:0;

    border-radius:14px;

    padding:11px;

    background:#eee;

    color:#c44;

    font-size:14px;

    margin-top:8px;

}


/* ===== 导入角色 ===== */

.character-import{

    width:100%;

    border:0;

    border-radius:14px;

    padding:11px;

    background:#e9e9e9;

    color:#444;

    font-size:14px;

    margin-bottom:10px;

}


/* ===== 联系人角色 ===== */

.character-item{

    display:flex;

    align-items:center;

    gap:11px;

    padding:11px 13px;

    background:#fff;

    margin:7px 10px;

    border-radius:17px;

    box-sizing:border-box;
}

.character-item-avatar{

    width:52px;
    height:52px;

    border-radius:16px;

    background:#ddd;

    background-position:center;
    background-size:cover;
    background-repeat:no-repeat;

    flex:none;
}

.character-item-info{

    flex:1;

    min-width:0;

}

.character-item-name{

    font-size:15px;

    font-weight:600;

    color:#222;

}

.character-item-note{

    font-size:12px;

    color:#999;

    margin-top:4px;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}

.character-edit{

    border:0;

    background:#eee;

    border-radius:10px;

    padding:7px 9px;

    color:#555;

    flex:none;

}

`;

const style = document.createElement('style');

style.textContent = STYLE;

document.head.appendChild(style);


/* =====================================================
   清空 Chat 原来的 HTML
   ===================================================== */

container.innerHTML = `

<div
    class="chat-system-close"
    id="chat-system-close"
>
    <i data-lucide="chevron-left"></i>
</div>


<!-- =================================================
     Chat 主页面
     ================================================= -->

<div
    id="chat-main-tabs"
    class="chat-tabs-container"
>


    <!-- ================= Chats ================= -->

    <div
        id="chat-tab-chats"
        class="chat-page active"
    >

        <header class="chat-header">

            <h1 class="chat-title">
                Chats
            </h1>

            <button
                class="chat-icon-btn"
                id="chat-add-btn"
                type="button"
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
        ></div>

    </div>


    <!-- ================= Contacts ================= -->

    <div
        id="chat-tab-contacts"
        class="chat-page"
    >

        <header class="chat-header">

            <h1 class="chat-title">
                Contacts
            </h1>

            <button
                class="chat-icon-btn"
                id="contact-add-btn"
                type="button"
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
            class="chat-contacts-list"
            id="character-list"
        ></div>

    </div>


    <!-- ================= Moments ================= -->

    <div
        id="chat-tab-moments"
        class="chat-page"
    >

        <header class="chat-header">

            <h1 class="chat-title">
                Moments
            </h1>

        </header>


        <div class="chat-moments-feed"></div>

    </div>


    <!-- ================= Me ================= -->

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


    <!-- ================= 底部导航 ================= -->

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


<!-- =================================================
     私聊页面
     ================================================= -->

<div
    id="chat-room-page"
    class="chat-room-container"
>

    <header class="chat-room-header">

        <button
            class="chat-room-back"
            id="room-back-btn"
            type="button"
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


    <div
        class="chat-room-body"
        id="room-messages-body"
    ></div>


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


        <button
            class="chat-room-send-btn"
            id="room-send-btn"
            disabled
            type="button"
        >

            <i data-lucide="arrow-up"></i>

        </button>


        <button
            class="chat-room-ai-btn"
            id="room-ai-btn"
            type="button"
            title="让 AI 主动回复"
        >

            <i data-lucide="sparkles"></i>

        </button>

    </div>

</div>

`;


// 初始化图标

if(window.lucide){

    lucide.createIcons({
        root:container
    });

}
/* =====================================================
   获取页面元素
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

const charList =
    document.getElementById('character-list');

const chatList =
    document.getElementById('chat-list');


/* =====================================================
   Storage
   ===================================================== */

const CHAR_KEY =
    'wuyo_characters';

const MSG_KEY =
    'wuyo_chat_messages';


let currentContact = null;

let currentCharacter = null;

let aiRequesting = false;


/* =====================================================
   基础工具
   ===================================================== */

function getChars(){

    try{

        return JSON.parse(
            localStorage.getItem(CHAR_KEY) || '[]'
        );

    }catch(error){

        console.error(
            '读取角色失败:',
            error
        );

        return [];

    }

}


function saveChars(chars){

    try{

        localStorage.setItem(
            CHAR_KEY,
            JSON.stringify(chars)
        );

    }catch(error){

        console.error(
            '保存角色失败:',
            error
        );

    }

}


function loadMessages(){

    try{

        return JSON.parse(
            localStorage.getItem(MSG_KEY) || '{}'
        );

    }catch(error){

        console.error(
            '读取聊天记录失败:',
            error
        );

        return {};

    }

}


function saveMessages(messages){

    try{

        localStorage.setItem(
            MSG_KEY,
            JSON.stringify(messages)
        );

    }catch(error){

        console.error(
            '保存聊天记录失败:',
            error
        );

    }

}


/* =====================================================
   时间
   ===================================================== */

function now(){

    const d =
        new Date();

    return (
        String(
            d.getHours()
        ).padStart(2,'0')
        +
        ':'
        +
        String(
            d.getMinutes()
        ).padStart(2,'0')
    );

}


/* =====================================================
   HTML 安全
   ===================================================== */

function esc(text){

    const div =
        document.createElement('div');

    div.textContent =
        text == null
            ? ''
            : String(text);

    return div.innerHTML;

}


/* =====================================================
   获取聊天记录
   ===================================================== */

function getMessages(name){

    const all =
        loadMessages();


    if(!all[name]){

        all[name] = [];

        saveMessages(all);

    }


    return all[name];

}


/* =====================================================
   添加消息
   ===================================================== */

function addMessage(
    name,
    message
){

    const all =
        loadMessages();


    if(!all[name]){

        all[name] = [];

    }


    all[name].push(
        message
    );


    saveMessages(all);

}


/* =====================================================
   删除 AI 思考状态
   ===================================================== */

function removeThinking(name){

    const all =
        loadMessages();


    if(!all[name]){

        return;

    }


    all[name] =
        all[name].filter(
            message =>
                !message.thinking
        );


    saveMessages(all);

}


/* =====================================================
   渲染聊天消息
   ===================================================== */

function renderMessages(name){

    const list =
        getMessages(name);


    roomBody.innerHTML =
        list.map(
            message => {

                /* 系统消息 */

                if(
                    message.from ===
                    'system'
                ){

                    return `

                        <div class="msg-system">

                            ${esc(
                                message.text
                            )}

                        </div>

                    `;

                }


                /* 普通消息 */

                return `

                    <div
                        class="msg-row ${
                            message.from === 'me'
                                ? 'me'
                                : 'them'
                        }"
                    >

                        <div class="msg-bubble">

                            ${esc(
                                message.text
                            )}

                        </div>

                    </div>

                `;

            }
        ).join('');


    /* 自动滚动到底部 */

    requestAnimationFrame(
        () => {

            roomBody.scrollTop =
                roomBody.scrollHeight;

        }
    );

}


/* =====================================================
   打开角色聊天
   ===================================================== */

function openChat(character){

    if(!character){

        return;

    }


    currentCharacter =
        character;

    currentContact =
        character.name;


    roomNameEl.textContent =
        character.name;


    renderMessages(
        character.name
    );


    /*
     * ★ 关键修复
     *
     * 进入聊天房间时，
     * 主页面完全隐藏
     */

    mainTabs.style.display =
        'none';


    roomPage.style.display =
        'flex';


    roomPage.style.position =
        'absolute';

    roomPage.style.inset =
        '0';

    roomPage.style.zIndex =
        '50';


    aiBtn.disabled =
        false;


    setTimeout(
        () => {

            roomInput.focus();

        },
        100
    );

}


/* =====================================================
   API 配置
   ===================================================== */

function getApiConfig(){

    try{

        const raw =
            localStorage.getItem(
                'wuyo_config'
            );


        if(!raw){

            return {};

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

    }catch(error){

        console.error(
            '读取 API 设置失败:',
            error
        );

        return {};

    }

}


/* =====================================================
   输入框状态
   ===================================================== */

function updateInput(){

    const hasText =
        roomInput.value.trim().length > 0;


    sendBtn.disabled =
        !hasText;


    /*
     * AI 按钮永远可以点击
     */

    aiBtn.disabled =
        false;

}


/* =====================================================
   普通发送
   ===================================================== */

function sendPlain(){

    const text =
        roomInput.value.trim();


    if(
        !text ||
        !currentContact
    ){

        return;

    }


    addMessage(
        currentContact,
        {

            from:'me',

            text:text,

            time:now()

        }
    );


    roomInput.value =
        '';


    updateInput();


    renderMessages(
        currentContact
    );


    renderChats();

}
/* =====================================================
   创建 / 编辑角色弹窗
   ===================================================== */

const characterMask =
    document.createElement('div');

characterMask.className =
    'character-mask';

characterMask.innerHTML = `

<div class="character-panel">

    <div class="character-top">

        <div
            class="character-title"
            id="character-title"
        >
            创建角色
        </div>

        <button
            class="character-close"
            id="character-close"
            type="button"
        >
            ×
        </button>

    </div>


    <!-- 头像预览 -->

    <div
        class="character-avatar-preview"
        id="char-avatar-preview"
    ></div>


    <!-- 头像 -->

    <label class="character-upload">

        📷 选择头像

        <input
            id="char-avatar"
            type="file"
            accept="image/*"
            hidden
        >

    </label>


    <!-- 导入角色 -->

    <button
        class="character-import"
        id="character-import"
        type="button"
    >
        📁 导入角色文件（JSON / TXT）
    </button>

    <input
        id="character-file"
        type="file"
        accept=".json,.txt,application/json,text/plain"
        hidden
    >


    <!-- 姓名 -->

    <div class="character-field">

        <label>
            姓名
        </label>

        <input
            id="char-name"
            type="text"
            placeholder="角色姓名"
        >

    </div>


    <!-- 备注 -->

    <div class="character-field">

        <label>
            备注
        </label>

        <input
            id="char-note"
            type="text"
            placeholder="例如：我的朋友"
        >

    </div>


    <!-- 身份 -->

    <div class="character-field">

        <label>
            身份
        </label>

        <input
            id="char-identity"
            type="text"
            placeholder="例如：学生 / 医生 / 骑士"
        >

    </div>


    <!-- 年龄 -->

    <div class="character-field">

        <label>
            年龄
        </label>

        <input
            id="char-age"
            type="text"
            placeholder="例如：22"
        >

    </div>


    <!-- 人设 -->

    <div class="character-field">

        <label>
            人设
        </label>

        <textarea
            id="char-persona"
            placeholder="性格、说话方式、背景、习惯……"
        ></textarea>

    </div>


    <!-- 外观 -->

    <div class="character-field">

        <label>
            外观描述
        </label>

        <textarea
            id="char-appearance"
            placeholder="发型、眼睛、身材、服装等……"
        ></textarea>

    </div>


    <!-- 锁脸 -->

    <div class="character-field">

        <label>
            锁脸照片
        </label>

        <label class="character-upload">

            🔒 导入锁脸照片

            <input
                id="char-face"
                type="file"
                accept="image/*"
                hidden
            >

        </label>

    </div>


    <!-- 保存 -->

    <button
        class="character-save"
        id="char-save"
        type="button"
    >
        保存角色
    </button>


    <!-- 删除 -->

    <button
        class="character-delete"
        id="char-delete"
        type="button"
    >
        删除角色
    </button>

</div>

`;


/*
 * ★ 不放进 chat-main-tabs
 *
 * 直接挂到 chat-app 最外层，
 * 防止角色页面跟 Chats / Contacts
 * 发生层级重叠。
 */

container.appendChild(
    characterMask
);


/* =====================================================
   编辑状态
   ===================================================== */

let editingId = null;

let avatarData = '';

let faceData = '';


/* =====================================================
   快捷获取元素
   ===================================================== */

const $ = id =>
    document.getElementById(id);


/* =====================================================
   重置角色编辑器
   ===================================================== */

function resetEditor(){

    editingId = null;

    avatarData = '';

    faceData = '';


    $('char-name').value = '';

    $('char-note').value = '';

    $('char-identity').value = '';

    $('char-age').value = '';

    $('char-persona').value = '';

    $('char-appearance').value = '';


    $('char-avatar-preview')
        .style
        .backgroundImage = '';


    $('character-title')
        .textContent =
        '创建角色';


    $('char-delete')
        .style
        .display = 'none';


    /*
     * 清除之前选择过的文件
     */

    $('char-avatar').value = '';

    $('char-face').value = '';

    $('character-file').value = '';

}


/* =====================================================
   打开创建 / 编辑页面
   ===================================================== */

function openEditor(id){

    resetEditor();


    /*
     * 创建新角色
     */

    if(!id){

        characterMask.style.display =
            'flex';

        return;

    }


    /*
     * 编辑已有角色
     */

    const character =
        getChars().find(
            item => item.id === id
        );


    if(!character){

        return;

    }


    editingId =
        character.id;


    avatarData =
        character.avatar || '';


    faceData =
        character.face || '';


    $('char-name').value =
        character.name || '';


    $('char-note').value =
        character.note || '';


    $('char-identity').value =
        character.identity || '';


    $('char-age').value =
        character.age || '';


    $('char-persona').value =
        character.persona || '';


    $('char-appearance').value =
        character.appearance || '';


    if(avatarData){

        $('char-avatar-preview')
            .style
            .backgroundImage =
                `url("${avatarData}")`;

    }


    $('character-title')
        .textContent =
        '编辑角色';


    $('char-delete')
        .style
        .display = 'block';


    characterMask.style.display =
        'flex';

}


/* =====================================================
   关闭角色页面
   ===================================================== */

$('character-close').onclick =
    function(event){

        event.preventDefault();

        event.stopPropagation();

        characterMask.style.display =
            'none';

    };


/*
 * 点击黑色背景也可以关闭
 */

characterMask.onclick =
    function(event){

        if(
            event.target ===
            characterMask
        ){

            characterMask.style.display =
                'none';

        }

    };


/* =====================================================
   图片读取
   ===================================================== */

function readImage(
    file,
    callback
){

    if(!file){

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(){

            callback(
                reader.result
            );

        };


    reader.readAsDataURL(
        file
    );

}


/* =====================================================
   选择头像
   ===================================================== */

$('char-avatar').onchange =
    function(event){

        const file =
            event.target.files[0];


        if(!file){

            return;

        }


        readImage(
            file,
            function(data){

                avatarData =
                    data;


                $('char-avatar-preview')
                    .style
                    .backgroundImage =
                        `url("${data}")`;

            }
        );

    };


/* =====================================================
   选择锁脸照片
   ===================================================== */

$('char-face').onchange =
    function(event){

        const file =
            event.target.files[0];


        if(!file){

            return;

        }


        readImage(
            file,
            function(data){

                faceData =
                    data;

            }
        );

    };


/* =====================================================
   保存角色
   ===================================================== */

$('char-save').onclick =
    function(event){

        event.preventDefault();

        event.stopPropagation();


        const name =
            $('char-name')
                .value
                .trim();


        /*
         * 姓名不能为空
         */

        if(!name){

            alert(
                '请先填写角色姓名'
            );

            $('char-name').focus();

            return;

        }


        const character = {

            id:
                editingId ||
                'char_' +
                Date.now(),

            name:

                name,

            note:

                $('char-note')
                    .value
                    .trim(),

            identity:

                $('char-identity')
                    .value
                    .trim(),

            age:

                $('char-age')
                    .value
                    .trim(),

            persona:

                $('char-persona')
                    .value
                    .trim(),

            appearance:

                $('char-appearance')
                    .value
                    .trim(),

            avatar:

                avatarData,

            face:

                faceData

        };


        let characters =
            getChars();


        /*
         * 编辑
         */

        if(editingId){

            characters =
                characters.map(
                    item =>
                        item.id === editingId
                            ? character
                            : item
                );

        }


        /*
         * 新建
         */

        else{

            characters.push(
                character
            );

        }


        saveChars(
            characters
        );


        /*
         * 关闭弹窗
         */

        characterMask.style.display =
            'none';


        /*
         * 重新渲染两个列表
         */

        renderContacts();

        renderChats();

    };
    /* =====================================================
   删除角色
   ===================================================== */

$('char-delete').onclick =
    function(event){

        event.preventDefault();
        event.stopPropagation();

        if(!editingId){

            return;

        }

        const character =
            getChars().find(
                item => item.id === editingId
            );

        if(!character){

            return;

        }

        const ok =
            confirm(
                `确定要删除「${character.name}」吗？\n聊天记录也会一起删除。`
            );

        if(!ok){

            return;

        }

        /*
         * 删除角色
         */

        const characters =
            getChars().filter(
                item =>
                    item.id !== editingId
            );

        saveChars(
            characters
        );


        /*
         * 删除这个角色的聊天记录
         */

        const messages =
            loadMessages();

        delete messages[
            character.name
        ];

        saveMessages(
            messages
        );


        /*
         * 如果当前正在和这个角色聊天，
         * 退回 Chats 页面
         */

        if(
            currentContact ===
            character.name
        ){

            currentContact = null;

            currentCharacter = null;

            roomPage.style.display =
                'none';

            mainTabs.style.display =
                'block';

        }


        /*
         * 关闭编辑页面
         */

        characterMask.style.display =
            'none';


        /*
         * 刷新列表
         */

        renderContacts();

        renderChats();

    };


/* =====================================================
   导入角色文件
   ===================================================== */

const importButton =
    document.createElement('button');

importButton.type =
    'button';

importButton.className =
    'character-import';

importButton.textContent =
    '📁 导入角色文件';


/*
 * 放到头像选择下面
 */

const avatarInput =
    $('char-avatar');

const avatarLabel =
    avatarInput.closest(
        '.character-upload'
    );

if(avatarLabel){

    avatarLabel.after(
        importButton
    );

}


/* =====================================================
   隐藏文件选择器
   ===================================================== */

const characterFile =
    document.createElement('input');

characterFile.type =
    'file';

characterFile.accept =
    '.json,.txt,application/json,text/plain';

characterFile.hidden =
    true;

container.appendChild(
    characterFile
);


/* =====================================================
   点击导入
   ===================================================== */

importButton.onclick =
    function(event){

        event.preventDefault();

        event.stopPropagation();

        characterFile.click();

    };


/* =====================================================
   读取角色文件
   ===================================================== */

characterFile.onchange =
    async function(event){

        const file =
            event.target.files[0];


        if(!file){

            return;

        }


        try{

            const text =
                await file.text();


            let data = {};


            /*
             * JSON
             */

            if(
                file.name
                    .toLowerCase()
                    .endsWith('.json')
            ){

                data =
                    JSON.parse(
                        text
                    );

            }


            /*
             * TXT
             */

            else{

                data = {

                    persona:
                        text

                };

            }


            /*
             * 尽可能兼容不同角色卡字段
             */

            const name =
                data.name ||
                data.character_name ||
                data.char_name ||
                data.title ||
                data.data?.name ||
                data.data?.character_name ||
                '';


            const note =
                data.note ||
                data.remark ||
                data.description_short ||
                data.data?.note ||
                '';


            const identity =
                data.identity ||
                data.role ||
                data.job ||
                data.data?.identity ||
                '';


            const age =
                data.age ||
                data.data?.age ||
                '';


            const persona =
                data.persona ||
                data.personality ||
                data.description ||
                data.char_persona ||
                data.data?.persona ||
                data.data?.personality ||
                '';


            const appearance =
                data.appearance ||
                data.looks ||
                data.physical_description ||
                data.data?.appearance ||
                '';


            /*
             * 写入表单
             */

            $('char-name').value =
                name;


            $('char-note').value =
                note;


            $('char-identity').value =
                identity;


            $('char-age').value =
                age;


            $('char-persona').value =
                typeof persona === 'string'
                    ? persona
                    : JSON.stringify(
                        persona,
                        null,
                        2
                    );


            $('char-appearance').value =
                appearance;


            /*
             * 如果角色卡里面有头像
             */

            if(
                data.avatar
            ){

                avatarData =
                    data.avatar;

            }

            else if(
                data.data?.avatar
            ){

                avatarData =
                    data.data.avatar;

            }


            /*
             * 如果有锁脸照片
             */

            if(
                data.face
            ){

                faceData =
                    data.face;

            }

            else if(
                data.data?.face
            ){

                faceData =
                    data.data.face;

            }


            /*
             * 更新头像预览
             */

            $('char-avatar-preview')
                .style
                .backgroundImage =
                    avatarData
                        ? `url("${avatarData}")`
                        : '';


            alert(
                '角色资料已经导入啦～💕\n检查一下内容，然后点击「保存角色」。'
            );

        }

        catch(error){

            console.error(
                '角色文件导入失败:',
                error
            );


            alert(
                '角色文件读取失败。\n请确认文件是有效的 JSON 或 TXT。'
            );

        }


        /*
         * 允许再次选择同一个文件
         */

        characterFile.value =
            '';

    };


/* =====================================================
   联系人列表
   ===================================================== */

function renderContacts(){

    const characters =
        getChars();


    /*
     * 没有角色
     */

    if(
        characters.length === 0
    ){

        charList.innerHTML = `

            <div class="chat-letter-divider">
                Characters
            </div>

            <div
                class="chat-list-item"
                id="character-add-empty"
            >

                <div
                    class="chat-avatar-small flex-center"
                >
                    ＋
                </div>

                <div class="chat-item-content">

                    <span class="chat-name">
                        创建新角色
                    </span>

                </div>

            </div>

        `;

    }


    /*
     * 有角色
     */

    else{

        charList.innerHTML = `

            <div class="chat-letter-divider">
                Characters
            </div>

            ${
                characters.map(
                    character => `

                    <div
                        class="character-item"
                        data-id="${character.id}"
                    >

                        <div
                            class="character-item-avatar"
                            style="${
                                character.avatar
                                    ? `background-image:url("${character.avatar}")`
                                    : ''
                            }"
                        ></div>

                        <div
                            class="character-item-info"
                        >

                            <div
                                class="character-item-name"
                            >
                                ${esc(character.name)}
                            </div>

                            <div
                                class="character-item-note"
                            >
                                ${esc(
                                    character.note ||
                                    character.identity ||
                                    '暂无备注'
                                )}
                            </div>

                        </div>

                        <button
                            class="character-edit"
                            data-edit="${character.id}"
                            type="button"
                        >
                            编辑
                        </button>

                    </div>

                    `
                ).join('')
            }


            <div
                class="chat-list-item"
                id="character-add-item"
            >

                <div
                    class="chat-avatar-small flex-center"
                >
                    ＋
                </div>

                <div class="chat-item-content">

                    <span class="chat-name">
                        创建新角色
                    </span>

                </div>

            </div>

        `;

    }


    /*
     * 创建角色按钮
     */

    const addButton =
        document.getElementById(
            'character-add-item'
        );


    const emptyButton =
        document.getElementById(
            'character-add-empty'
        );


    if(addButton){

        addButton.onclick =
            function(){

                openEditor();

            };

    }


    if(emptyButton){

        emptyButton.onclick =
            function(){

                openEditor();

            };

    }


    /*
     * 点击角色 → 进入聊天
     */

    charList
        .querySelectorAll(
            '.character-item'
        )
        .forEach(
            item => {

                item.onclick =
                    function(event){

                        /*
                         * 点击编辑按钮时，
                         * 不打开聊天
                         */

                        if(
                            event.target.closest(
                                '[data-edit]'
                            )
                        ){

                            return;

                        }


                        const character =
                            characters.find(
                                c =>
                                    c.id ===
                                    item.dataset.id
                            );


                        if(character){

                            openChat(
                                character
                            );

                        }

                    };

            }
        );


    /*
     * 编辑按钮
     */

    charList
        .querySelectorAll(
            '[data-edit]'
        )
        .forEach(
            button => {

                button.onclick =
                    function(event){

                        event.preventDefault();

                        event.stopPropagation();


                        openEditor(
                            button.dataset.edit
                        );

                    };

            }
        );

}


/* =====================================================
   Chats 列表
   ===================================================== */

function renderChats(){

    const characters =
        getChars();


    /*
     * 没有角色
     */

    if(
        characters.length === 0
    ){

        chatList.innerHTML = `

            <div
                class="chat-list-item"
            >

                <div class="chat-avatar"></div>

                <div
                    class="chat-item-content"
                >

                    <div
                        class="chat-item-top"
                    >

                        <span class="chat-name">
                            暂无角色
                        </span>

                    </div>

                    <div
                        class="chat-item-bottom"
                    >

                        <span class="chat-msg">
                            请先创建一个角色
                        </span>

                    </div>

                </div>

            </div>

        `;

        return;

    }


    /*
     * 有角色
     */

    chatList.innerHTML =
        characters.map(
            character => {

                const messages =
                    getMessages(
                        character.name
                    );


                const last =
                    [...messages]
                        .reverse()
                        .find(
                            message =>
                                message.from === 'me' ||
                                message.from === 'them'
                        );


                return `

                    <div
                        class="chat-list-item"
                        data-chat-id="${character.id}"
                    >

                        <div
                            class="chat-avatar"
                            style="${
                                character.avatar
                                    ? `
                                        background-image:
                                        url("${character.avatar}");
                                        background-size:
                                        cover;
                                        background-position:
                                        center;
                                    `
                                    : ''
                            }"
                        ></div>


                        <div
                            class="chat-item-content"
                        >

                            <div
                                class="chat-item-top"
                            >

                                <span
                                    class="chat-name"
                                >
                                    ${esc(
                                        character.name
                                    )}
                                </span>

                                <span
                                    class="chat-time"
                                >
                                    ${
                                        last?.time ||
                                        '—'
                                    }
                                </span>

                            </div>


                            <div
                                class="chat-item-bottom"
                            >

                                <span
                                    class="chat-msg"
                                >
                                    ${esc(
                                        last?.text ||
                                        '开始聊天'
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                `;

            }
        ).join('');


    /*
     * 点击 Chats 中的角色
     */

    chatList
        .querySelectorAll(
            '[data-chat-id]'
        )
        .forEach(
            item => {

                item.onclick =
                    function(){

                        const character =
                            characters.find(
                                c =>
                                    c.id ===
                                    item.dataset.chatId
                            );


                        if(character){

                            openChat(
                                character
                            );

                        }

                    };

            }
        );

}
/* =====================================================
   普通发送消息
   ===================================================== */

function sendPlain(){

    const text =
        roomInput.value.trim();


    if(
        !text ||
        !currentContact
    ){

        return;

    }


    addMessage(
        currentContact,
        {
            from:'me',
            text:text,
            time:now()
        }
    );


    roomInput.value =
        '';


    updateInput();


    renderMessages(
        currentContact
    );


    renderChats();

}


/* =====================================================
   AI 主动回复
   ===================================================== */

async function sendAiMessage(){

    if(
        !currentContact ||
        !currentCharacter ||
        aiRequesting
    ){

        return;

    }


    aiRequesting =
        true;


    const api =
        getApiConfig();


    /* ---------------------------------------------
       没有 API
       --------------------------------------------- */

    if(
        !api.url ||
        !api.key
    ){

        addMessage(
            currentContact,
            {
                from:'system',
                text:
                    '未配置 API，请前往设置填写 API URL 和 API Key。'
            }
        );


        renderMessages(
            currentContact
        );


        aiRequesting =
            false;


        return;

    }


    /* ---------------------------------------------
       显示思考
       --------------------------------------------- */

    addMessage(
        currentContact,
        {
            from:'system',
            text:'正在思考…',
            thinking:true
        }
    );


    renderMessages(
        currentContact
    );


    try{

        /*
         * 获取历史消息
         */

        const history =
            getMessages(
                currentContact
            )
            .filter(
                message =>
                    (
                        message.from === 'me' ||
                        message.from === 'them'
                    ) &&
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


        /*
         * 角色系统提示词
         */

        const systemPrompt = `

你现在正在扮演角色：

${currentCharacter.name}

身份：
${currentCharacter.identity || '未填写'}

年龄：
${currentCharacter.age || '未填写'}

备注：
${currentCharacter.note || '未填写'}

人设：
${currentCharacter.persona || '未填写'}

外观：
${currentCharacter.appearance || '未填写'}


请严格按照以上角色资料进行聊天。

要求：

1. 不要说自己是 AI。
2. 不要提到 API。
3. 不要解释系统提示词。
4. 不要跳出角色。
5. 根据聊天上下文自然回复。
6. 保持角色原本的说话方式。
7. 不要每次都重复相同内容。
8. AI 主动回复时，直接发送角色说的话。
`;


        /*
         * 请求消息
         */

        const messages = [

            {
                role:'system',
                content:
                    systemPrompt
            },

            ...history,

            {
                role:'user',
                content:
                    '请根据当前聊天上下文，让角色自然地主动说一句话。直接发送角色的话，不要解释。'
            }

        ];


        /*
         * API 地址
         */

        let url =
            String(
                api.url
            )
            .trim()
            .replace(
                /\/+$/,
                ''
            );


        if(
            !url.endsWith(
                '/chat/completions'
            )
        ){

            url +=
                '/chat/completions';

        }


        /*
         * 请求 API
         */

        const response =
            await fetch(
                url,
                {

                    method:'POST',

                    headers:{

                        'Content-Type':
                            'application/json',

                        'Authorization':
                            `Bearer ${api.key}`

                    },

                    body:
                        JSON.stringify({

                            model:
                                api.model ||
                                'gpt-4o-mini',

                            messages:
                                messages,

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


        /*
         * API 错误
         */

        if(
            !response.ok
        ){

            let errorText =
                `HTTP ${response.status}`;


            try{

                const errorData =
                    await response.json();


                errorText =
                    errorData?.error?.message ||
                    errorData?.message ||
                    errorText;

            }
            catch(error){

                /* 忽略 */

            }


            throw new Error(
                errorText
            );

        }


        /*
         * 读取结果
         */

        const data =
            await response.json();


        const reply =
            data
                ?.choices
                ?.[0]
                ?.message
                ?.content;


        /*
         * 删除思考
         */

        removeThinking(
            currentContact
        );


        /*
         * 没有回复
         */

        if(!reply){

            throw new Error(
                'API 没有返回有效回复'
            );

        }


        /*
         * 保存 AI 回复
         */

        addMessage(
            currentContact,
            {

                from:'them',

                text:
                    String(
                        reply
                    ).trim(),

                time:
                    now()

            }
        );


        /*
         * 更新聊天
         */

        renderMessages(
            currentContact
        );


        renderChats();

    }
    catch(error){

        console.error(
            'AI 请求失败:',
            error
        );


        removeThinking(
            currentContact
        );


        addMessage(
            currentContact,
            {

                from:'system',

                text:
                    `AI 请求失败：${
                        error?.message ||
                        '无法连接 API'
                    }`

            }
        );


        renderMessages(
            currentContact
        );

    }


    aiRequesting =
        false;

}


/* =====================================================
   输入框状态
   ===================================================== */

function updateInput(){

    const hasText =
        roomInput.value
            .trim()
            .length > 0;


    sendBtn.disabled =
        !hasText;


    /*
     * AI 按钮不依赖输入框
     */

    aiBtn.disabled =
        false;

}


/* =====================================================
   输入框
   ===================================================== */

roomInput.addEventListener(
    'input',
    updateInput
);


roomInput.addEventListener(
    'keydown',
    function(event){

        if(
            event.key ===
            'Enter'
        ){

            event.preventDefault();


            if(
                roomInput.value.trim()
            ){

                sendPlain();

            }

        }

    }
);


/* =====================================================
   发送按钮
   ===================================================== */

sendBtn.addEventListener(
    'click',
    function(event){

        event.preventDefault();

        event.stopPropagation();

        sendPlain();

    }
);


/* =====================================================
   AI 按钮
   ===================================================== */

aiBtn.addEventListener(
    'click',
    function(event){

        event.preventDefault();

        event.stopPropagation();

        sendAiMessage();

    }
);


/* =====================================================
   创建角色按钮
   ===================================================== */

const chatAddButton =
    document.getElementById(
        'chat-add-btn'
    );


const contactAddButton =
    document.getElementById(
        'contact-add-btn'
    );


if(chatAddButton){

    chatAddButton.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            openEditor();

        };

}


if(contactAddButton){

    contactAddButton.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            openEditor();

        };

}


/* =====================================================
   底部导航
   ===================================================== */

container
    .querySelectorAll(
        '.chat-nav-item'
    )
    .forEach(
        item => {

            item.onclick =
                function(event){

                    event.preventDefault();

                    event.stopPropagation();


                    /*
                     * 切换 active
                     */

                    container
                        .querySelectorAll(
                            '.chat-nav-item'
                        )
                        .forEach(
                            nav =>
                                nav.classList.remove(
                                    'active'
                                )
                        );


                    /*
                     * 隐藏所有页面
                     */

                    container
                        .querySelectorAll(
                            '.chat-page'
                        )
                        .forEach(
                            page =>
                                page.classList.remove(
                                    'active'
                                )
                        );


                    /*
                     * 当前按钮 active
                     */

                    item.classList.add(
                        'active'
                    );


                    /*
                     * 找到目标页面
                     */

                    const target =
                        item.dataset.target;


                    const page =
                        document.getElementById(
                            target
                        );


                    if(page){

                        page.classList.add(
                            'active'
                        );

                    }


                    /*
                     * Contacts 每次打开都刷新
                     */

                    if(
                        target ===
                        'chat-tab-contacts'
                    ){

                        renderContacts();

                    }


                    /*
                     * Chats 每次打开都刷新
                     */

                    if(
                        target ===
                        'chat-tab-chats'
                    ){

                        renderChats();

                    }

                };

        }
    );


/* =====================================================
   私聊返回
   ===================================================== */

backBtn.onclick =
    function(event){

        event.preventDefault();

        event.stopPropagation();


        /*
         * 隐藏聊天房间
         */

        roomPage.style.display =
            'none';


        /*
         * 显示主页面
         */

        mainTabs.style.display =
            'block';


        /*
         * 清除当前角色
         */

        currentContact =
            null;

        currentCharacter =
            null;


        /*
         * 清空输入框
         */

        roomInput.value =
            '';


        updateInput();


        /*
         * 刷新聊天列表
         */

        renderChats();

    };


/* =====================================================
   Chat 总返回
   ===================================================== */

closeBtn.onclick =
    function(event){

        event.preventDefault();

        event.stopPropagation();


        if(
            typeof window.closeApp ===
            'function'
        ){

            window.closeApp(
                'chat'
            );

        }

    };


/* =====================================================
   ★★★ 最重要的防重叠 CSS ★★★
   ===================================================== */

const finalStyle =
    document.createElement(
        'style'
    );


finalStyle.textContent = `

/* Chat 应用本身 */

#chat-app{

    position:
        relative;

    width:
        100%;

    height:
        100%;

    overflow:
        hidden;

}


/* 主页面 */

#chat-main-tabs{

    position:
        absolute;

    inset:
        0;

    width:
        100%;

    height:
        100%;

    overflow:
        hidden;

}


/* 每个 Tab */

#chat-main-tabs
.chat-page{

    position:
        absolute;

    inset:
        0;

    width:
        100%;

    height:
        100%;

    overflow-y:
        auto;

    overflow-x:
        hidden;

    box-sizing:
        border-box;

    display:
        none;

}


/* 只有 active 才显示 */

#chat-main-tabs
.chat-page.active{

    display:
        block;

}


/* 底部导航固定在主页面 */

#chat-main-tabs
.chat-bottom-bar{

    position:
        absolute;

    left:
        0;

    right:
        0;

    bottom:
        0;

    z-index:
        20;

}


/* Chats 列表给底部留空间 */

#chat-tab-chats
.chat-list{

    padding-bottom:
        90px;

}


/* Contacts 列表给底部留空间 */

#chat-tab-contacts
.chat-contacts-list{

    padding-bottom:
        90px;

}


/* 私聊页面 */

#chat-room-page{

    position:
        absolute !important;

    inset:
        0 !important;

    width:
        100% !important;

    height:
        100% !important;

    z-index:
        50 !important;

    display:
        none;

    flex-direction:
        column;

    overflow:
        hidden;

    box-sizing:
        border-box;

    background:
        #f7f7f7;

}


/* 聊天消息 */

#chat-room-page
.chat-room-body{

    flex:
        1;

    min-height:
        0;

    overflow-y:
        auto;

    overflow-x:
        hidden;

}


/* 输入栏 */

#chat-room-page
.chat-room-footer{

    flex:
        0 0 auto;

}


/* 角色弹窗 */

#chat-app
.character-mask{

    position:
        absolute !important;

    inset:
        0 !important;

    z-index:
        100 !important;

    display:
        none;

    align-items:
        flex-end;

    box-sizing:
        border-box;

}


/* 角色面板 */

#chat-app
.character-panel{

    position:
        relative;

    z-index:
        101;

    width:
        100%;

    max-height:
        94%;

    overflow-y:
        auto;

    box-sizing:
        border-box;

}


/* 防止角色列表被横向撑开 */

#chat-tab-contacts{

    overflow-x:
        hidden;

}


/* 角色列表 */

#character-list{

    width:
        100%;

    box-sizing:
        border-box;

    padding-bottom:
        90px;

}


/* 防止聊天内容溢出 */

#room-messages-body{

    min-width:
        0;

}


/* 防止长文字撑破 */

#room-messages-body
.msg-bubble{

    max-width:
        78%;

    overflow-wrap:
        anywhere;

    word-break:
        break-word;

}

`;


document.head.appendChild(
    finalStyle
);


/* =====================================================
   初始状态
   ===================================================== */

/*
 * 默认显示 Chats
 */

mainTabs.style.display =
    'block';


roomPage.style.display =
    'none';


characterMask.style.display =
    'none';


/*
 * 默认打开 Chats
 */

container
    .querySelectorAll(
        '.chat-page'
    )
    .forEach(
        page =>
            page.classList.remove(
                'active'
            )
    );


const chatsPage =
    document.getElementById(
        'chat-tab-chats'
    );


if(chatsPage){

    chatsPage.classList.add(
        'active'
    );

}


/*
 * 默认按钮
 */

container
    .querySelectorAll(
        '.chat-nav-item'
    )
    .forEach(
        item =>
            item.classList.remove(
                'active'
            )
    );


const chatsNav =
    container.querySelector(
        '[data-target="chat-tab-chats"]'
    );


if(chatsNav){

    chatsNav.classList.add(
        'active'
    );

}


/* =====================================================
   最终刷新
   ===================================================== */

renderContacts();

renderChats();

updateInput();


/* =====================================================
   Lucide 最后再刷新一次
   ===================================================== */

if(
    window.lucide
){

    lucide.createIcons({
        root:
            container
    });

}

})();