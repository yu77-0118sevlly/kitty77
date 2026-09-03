(function(){

'use strict';


/* =========================================================
   WUYO CHAT SYSTEM
   完整整合版
   PART 1 / DATA CORE
   ========================================================= */


/* =========================================================
   1. 获取 Chat 容器
   ========================================================= */

const container =
    document.getElementById('chat-app');

if(!container){

    console.error(
        'WUYO CHAT：找不到 #chat-app'
    );

    return;

}


/* =========================================================
   2. 全局版本
   ========================================================= */

const WUYO_VERSION =
    '3.0.0';


/* =========================================================
   3. Storage Key
   ========================================================= */

const STORAGE = {

    characters:
        'wuyo_characters',

    messages:
        'wuyo_chat_messages',

    userMask:
        'wuyo_user_mask',

    accounts:
        'wuyo_accounts',

    currentAccount:
        'wuyo_current_account',

    moments:
        'wuyo_moments',

    friendships:
        'wuyo_friendships',

    wallet:
        'wuyo_wallet',

    bankCards:
        'wuyo_bank_cards',

    familyCards:
        'wuyo_family_cards',

    bills:
        'wuyo_bills',

    beauty:
        'wuyo_chat_beauty',

    worldBooks:
        'wuyo_world_books',

    activity:
        'wuyo_character_activity',

    diaries:
        'wuyo_character_diaries',

    thoughts:
        'wuyo_character_thoughts',

    settings:
        'wuyo_chat_settings'

};


/* =========================================================
   4. 默认 User
   ========================================================= */

const DEFAULT_USER_MASK = {

    id:
        'user_default',

    nickname:
        'User',

    wechatId:
        'user',

    phone:
        '',

    idCard:
        '',

    signature:
        '',

    gender:
        '',

    avatar:
        '',

    face:
        '',

    createdAt:
        Date.now()

};


/* =========================================================
   5. 默认钱包
   ========================================================= */

const DEFAULT_WALLET = {

    balance:
        0,

    totalIncome:
        0,

    totalExpense:
        0,

    currency:
        'CNY'

};


/* =========================================================
   6. 安全读取 JSON
   ========================================================= */

function readJSON(
    key,
    fallback
){

    try{

        const raw =
            localStorage.getItem(key);

        if(
            raw === null ||
            raw === undefined ||
            raw === ''
        ){

            return fallback;

        }

        return JSON.parse(raw);

    }
    catch(error){

        console.error(
            'WUYO Storage Read Error:',
            key,
            error
        );

        return fallback;

    }

}


/* =========================================================
   7. 安全保存 JSON
   ========================================================= */

function writeJSON(
    key,
    value
){

    try{

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    }
    catch(error){

        console.error(
            'WUYO Storage Write Error:',
            key,
            error
        );

        return false;

    }

}


/* =========================================================
   8. 删除 Storage
   ========================================================= */

function removeStorage(
    key
){

    try{

        localStorage.removeItem(
            key
        );

    }
    catch(error){

        console.error(
            'WUYO Storage Remove Error:',
            key,
            error
        );

    }

}


/* =========================================================
   9. ID 生成器
   ========================================================= */

function uid(
    prefix = 'id'
){

    return (
        prefix +
        '_' +
        Date.now().toString(36) +
        '_' +
        Math.random()
            .toString(36)
            .slice(2,10)
    );

}


/* =========================================================
   10. HTML 转义
   ========================================================= */

function escapeHTML(
    value
){

    const div =
        document.createElement(
            'div'
        );

    div.textContent =
        value == null
            ? ''
            : String(value);

    return div.innerHTML;

}


/* =========================================================
   11. 当前时间
   ========================================================= */

function getNowDate(){

    return new Date();

}


function getTimeString(
    date = new Date()
){

    return (
        String(
            date.getHours()
        ).padStart(2,'0')
        +
        ':'
        +
        String(
            date.getMinutes()
        ).padStart(2,'0')
    );

}


function getDateString(
    date = new Date()
){

    return (
        date.getFullYear()
        +
        '-'
        +
        String(
            date.getMonth() + 1
        ).padStart(2,'0')
        +
        '-'
        +
        String(
            date.getDate()
        ).padStart(2,'0')
    );

}


function getDateTimeString(
    date = new Date()
){

    return (
        getDateString(date)
        +
        ' '
        +
        getTimeString(date)
    );

}


/* =========================================================
   12. 数字安全处理
   ========================================================= */

function numberValue(
    value,
    fallback = 0
){

    const n =
        Number(value);

    return Number.isFinite(n)
        ? n
        : fallback;

}


/* =========================================================
   13. 获取角色
   ========================================================= */

function getCharacters(){

    const list =
        readJSON(
            STORAGE.characters,
            []
        );

    return Array.isArray(list)
        ? list
        : [];

}


/* =========================================================
   14. 保存角色
   ========================================================= */

function saveCharacters(
    characters
){

    if(
        !Array.isArray(
            characters
        )
    ){

        return false;

    }

    return writeJSON(
        STORAGE.characters,
        characters
    );

}


/* =========================================================
   15. 获取角色
   ========================================================= */

function getCharacter(
    id
){

    return getCharacters()
        .find(
            character =>
                character.id === id
        ) || null;

}


/* =========================================================
   16. 根据名字寻找角色
   ========================================================= */

function getCharacterByName(
    name
){

    return getCharacters()
        .find(
            character =>
                character.name === name
        ) || null;

}


/* =========================================================
   17. 创建角色默认数据
   ========================================================= */

function createCharacterData(
    data = {}
){

    return {

        id:
            data.id ||
            uid('char'),

        name:
            String(
                data.name || ''
            ).trim(),

        nickname:
            String(
                data.nickname ||
                data.nickName ||
                data.name ||
                ''
            ).trim(),

        note:
            String(
                data.note || ''
            ).trim(),

        identity:
            String(
                data.identity || ''
            ).trim(),

        age:
            String(
                data.age || ''
            ).trim(),

        persona:
            String(
                data.persona || ''
            ),

        appearance:
            String(
                data.appearance || ''
            ),

        wechatId:
            String(
                data.wechatId ||
                data.wechat_id ||
                ''
            ).trim(),

        phone:
            String(
                data.phone || ''
            ).trim(),

        idCard:
            String(
                data.idCard ||
                data.id_card ||
                ''
            ).trim(),

        gender:
            String(
                data.gender || ''
            ).trim(),

        signature:
            String(
                data.signature || ''
            ).trim(),

        avatar:
            data.avatar || '',

        face:
            data.face || '',

        location:
            data.location || '',

        latitude:
            data.latitude ?? null,

        longitude:
            data.longitude ?? null,

        timezone:
            data.timezone || '',

        weather:
            data.weather || null,

        worldBookIds:
            Array.isArray(
                data.worldBookIds
            )
                ? data.worldBookIds
                : [],

        createdAt:
            data.createdAt ||
            Date.now(),

        settings: {

            timeAwareness:
                Boolean(
                    data.settings?.timeAwareness
                ),

            remoteMode:
                Boolean(
                    data.settings?.remoteMode
                ),

            proactiveMessages:
                Boolean(
                    data.settings?.proactiveMessages
                ),

            proactiveInterval:
                numberValue(
                    data.settings?.proactiveInterval,
                    60
                ),

            proactiveIntervalUnit:
                data.settings?.proactiveIntervalUnit ||
                'minutes',

            minReplies:
                Math.max(
                    1,
                    numberValue(
                        data.settings?.minReplies,
                        1
                    )
                ),

            maxReplies:
                Math.max(
                    1,
                    numberValue(
                        data.settings?.maxReplies,
                        3
                    )
                ),

            freeActivity:
                Boolean(
                    data.settings?.freeActivity
                ),

            diaryPush:
                Boolean(
                    data.settings?.diaryPush
                ),

            thoughtView:
                Boolean(
                    data.settings?.thoughtView
                ),

            npcMoments:
                Boolean(
                    data.settings?.npcMoments
                ),

            autoAddFriends:
                Boolean(
                    data.settings?.autoAddFriends
                ),

            reversePhone:
                Boolean(
                    data.settings?.reversePhone
                ),

            offlineInvitation:
                Boolean(
                    data.settings?.offlineInvitation
                ),

            autoTranslation:
                Boolean(
                    data.settings?.autoTranslation
                ),

            translationLanguages:
                Array.isArray(
                    data.settings?.translationLanguages
                )
                    ? data.settings.translationLanguages
                    : [],

            voice:
                Boolean(
                    data.settings?.voice
                ),

            voiceFrequency:
                numberValue(
                    data.settings?.voiceFrequency,
                    30
                ),

            offline:
                Boolean(
                    data.settings?.offline
                ),

            customDays:
                numberValue(
                    data.settings?.customDays,
                    0
                ),

            showAvatar:
                data.settings?.showAvatar !== false,

            showUserAvatar:
                data.settings?.showUserAvatar !== false,

            showCharacterAvatar:
                data.settings?.showCharacterAvatar !== false,

            bubbleCSS:
                data.settings?.bubbleCSS || '',

            chatBackground:
                data.settings?.chatBackground || '',

            memoryRounds:
                numberValue(
                    data.settings?.memoryRounds,
                    20
                ),

            deleteReturn:
                Boolean(
                    data.settings?.deleteReturn
                ),

            blacklistReturn:
                Boolean(
                    data.settings?.blacklistReturn
                )

        },

        memorySummaries:
            Array.isArray(
                data.memorySummaries
            )
                ? data.memorySummaries
                : [],

        deleted:
            Boolean(
                data.deleted
            ),

        blocked:
            Boolean(
                data.blocked
            )

    };

}


/* =========================================================
   18. User 面具
   ========================================================= */

function getUserMask(){

    const mask =
        readJSON(
            STORAGE.userMask,
            null
        );

    if(!mask){

        return {
            ...DEFAULT_USER_MASK
        };

    }

    return {
        ...DEFAULT_USER_MASK,
        ...mask
    };

}


/* =========================================================
   19. 保存 User 面具
   ========================================================= */

function saveUserMask(
    mask
){

    const result = {

        ...DEFAULT_USER_MASK,
        ...(mask || {})

    };

    return writeJSON(
        STORAGE.userMask,
        result
    );

}


/* =========================================================
   20. 初始化 User
   ========================================================= */

function ensureUserMask(){

    const current =
        readJSON(
            STORAGE.userMask,
            null
        );

    if(!current){

        saveUserMask(
            DEFAULT_USER_MASK
        );

    }

}


/* =========================================================
   21. 大小号系统
   ========================================================= */

function getAccounts(){

    const accounts =
        readJSON(
            STORAGE.accounts,
            []
        );

    return Array.isArray(accounts)
        ? accounts
        : [];

}


function saveAccounts(
    accounts
){

    return writeJSON(
        STORAGE.accounts,
        Array.isArray(accounts)
            ? accounts
            : []
    );

}


function getCurrentAccountId(){

    return (
        localStorage.getItem(
            STORAGE.currentAccount
        )
        ||
        'main'
    );

}


function setCurrentAccountId(
    id
){

    localStorage.setItem(
        STORAGE.currentAccount,
        String(id)
    );

}


/* =========================================================
   22. 默认主账号
   ========================================================= */

function ensureMainAccount(){

    let accounts =
        getAccounts();

    if(
        !accounts.some(
            account =>
                account.id === 'main'
        )
    ){

        accounts.unshift({

            id:
                'main',

            name:
                '主号',

            avatar:
                getUserMask().avatar || '',

            createdAt:
                Date.now(),

            isMain:
                true

        });

        saveAccounts(
            accounts
        );

    }

}


/* =========================================================
   23. 钱包
   ========================================================= */

function getWallet(){

    const wallet =
        readJSON(
            STORAGE.wallet,
            null
        );

    return {

        ...DEFAULT_WALLET,

        ...(wallet || {}),

        balance:
            numberValue(
                wallet?.balance,
                0
            ),

        totalIncome:
            numberValue(
                wallet?.totalIncome,
                0
            ),

        totalExpense:
            numberValue(
                wallet?.totalExpense,
                0
            )

    };

}


function saveWallet(
    wallet
){

    return writeJSON(
        STORAGE.wallet,
        {

            ...DEFAULT_WALLET,
            ...(wallet || {}),

            balance:
                numberValue(
                    wallet?.balance,
                    0
                ),

            totalIncome:
                numberValue(
                    wallet?.totalIncome,
                    0
                ),

            totalExpense:
                numberValue(
                    wallet?.totalExpense,
                    0
                )

        }
    );

}


/* =========================================================
   24. 修改余额
   ========================================================= */

function changeBalance(
    amount,
    reason = '余额变动',
    type = 'adjust'
){

    const value =
        numberValue(
            amount,
            0
        );

    const wallet =
        getWallet();

    wallet.balance += value;

    if(value > 0){

        wallet.totalIncome +=
            value;

    }

    if(value < 0){

        wallet.totalExpense +=
            Math.abs(value);

    }

    saveWallet(
        wallet
    );


    addBill({

        type:
            type,

        amount:
            value,

        title:
            reason,

        paymentMethod:
            'balance',

        date:
            getDateString(),

        time:
            getTimeString()

    });


    return wallet;

}


/* =========================================================
   25. 银行卡
   ========================================================= */

function getBankCards(){

    const cards =
        readJSON(
            STORAGE.bankCards,
            []
        );

    return Array.isArray(cards)
        ? cards
        : [];

}


function saveBankCards(
    cards
){

    return writeJSON(
        STORAGE.bankCards,
        Array.isArray(cards)
            ? cards
            : []
    );

}


/* =========================================================
   26. 创建银行卡
   ========================================================= */

function createBankCard(
    data = {}
){

    return {

        id:
            data.id ||
            uid('bank'),

        cardNumber:
            String(
                data.cardNumber ||
                ''
            ),

        name:
            String(
                data.name ||
                ''
            ),

        bankName:
            String(
                data.bankName ||
                ''
            ),

        avatar:
            data.avatar ||
            '',

        balance:
            numberValue(
                data.balance,
                0
            ),

        createdAt:
            data.createdAt ||
            Date.now()

    };

}


/* =========================================================
   27. 亲属卡
   ========================================================= */

function getFamilyCards(){

    const cards =
        readJSON(
            STORAGE.familyCards,
            []
        );

    return Array.isArray(cards)
        ? cards
        : [];

}


function saveFamilyCards(
    cards
){

    return writeJSON(
        STORAGE.familyCards,
        Array.isArray(cards)
            ? cards
            : []
    );

}


/* =========================================================
   28. 创建亲属卡
   ========================================================= */

function createFamilyCard(
    data = {}
){

    return {

        id:
            data.id ||
            uid('family'),

        ownerType:
            data.ownerType ||
            'user',

        ownerId:
            data.ownerId ||
            'user_default',

        receiverType:
            data.receiverType ||
            'character',

        receiverId:
            data.receiverId ||
            '',

        receiverName:
            data.receiverName ||
            '',

        title:
            data.title ||
            '亲属卡',

        limit:
            numberValue(
                data.limit,
                0
            ),

        used:
            numberValue(
                data.used,
                0
            ),

        enabled:
            data.enabled !== false,

        createdAt:
            data.createdAt ||
            Date.now()

    };

}


/* =========================================================
   29. 消费账单
   ========================================================= */

function getBills(){

    const bills =
        readJSON(
            STORAGE.bills,
            []
        );

    return Array.isArray(bills)
        ? bills
        : [];

}


function saveBills(
    bills
){

    return writeJSON(
        STORAGE.bills,
        Array.isArray(bills)
            ? bills
            : []
    );

}


/* =========================================================
   30. 添加账单
   ========================================================= */

function addBill(
    data = {}
){

    const bills =
        getBills();

    bills.push({

        id:
            data.id ||
            uid('bill'),

        type:
            data.type ||
            'expense',

        title:
            data.title ||
            '消费',

        amount:
            numberValue(
                data.amount,
                0
            ),

        paymentMethod:
            data.paymentMethod ||
            'balance',

        category:
            data.category ||
            '其他',

        date:
            data.date ||
            getDateString(),

        time:
            data.time ||
            getTimeString(),

        characterId:
            data.characterId ||
            '',

        characterName:
            data.characterName ||
            '',

        note:
            data.note ||
            '',

        createdAt:
            data.createdAt ||
            Date.now()

    });

    saveBills(
        bills
    );

    return bills[
        bills.length - 1
    ];

}


/* =========================================================
   31. 账单统计
   ========================================================= */

function getBillStatistics(
    startDate = null,
    endDate = null
){

    const bills =
        getBills();

    let total =
        0;

    let income =
        0;

    let expense =
        0;

    const filtered =
        bills.filter(
            bill => {

                const date =
                    bill.date || '';

                if(
                    startDate &&
                    date < startDate
                ){

                    return false;

                }

                if(
                    endDate &&
                    date > endDate
                ){

                    return false;

                }

                return true;

            }
        );


    filtered.forEach(
        bill => {

            const amount =
                numberValue(
                    bill.amount,
                    0
                );

            if(
                amount >= 0
            ){

                income +=
                    amount;

            }
            else{

                expense +=
                    Math.abs(
                        amount
                    );

            }

        }
    );


    total =
        expense;


    return {

        total,

        income,

        expense,

        count:
            filtered.length,

        bills:
            filtered

    };

}


/* =========================================================
   32. 聊天记录
   ========================================================= */

function getAllMessages(){

    const data =
        readJSON(
            STORAGE.messages,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveAllMessages(
    messages
){

    return writeJSON(
        STORAGE.messages,
        messages
    );

}


function getMessages(
    characterId
){

    const all =
        getAllMessages();

    if(
        !Array.isArray(
            all[characterId]
        )
    ){

        all[characterId] =
            [];

        saveAllMessages(
            all
        );

    }

    return all[
        characterId
    ];

}


function saveMessages(
    characterId,
    messages
){

    const all =
        getAllMessages();

    all[characterId] =
        Array.isArray(
            messages
        )
            ? messages
            : [];

    return saveAllMessages(
        all
    );

}


/* =========================================================
   33. 添加聊天消息
   ========================================================= */

function pushMessage(
    characterId,
    message
){

    const list =
        getMessages(
            characterId
        );

    list.push({

        id:
            message.id ||
            uid('msg'),

        from:
            message.from ||
            'system',

        text:
            message.text ||
            '',

        time:
            message.time ||
            getTimeString(),

        timestamp:
            message.timestamp ||
            Date.now(),

        type:
            message.type ||
            'text',

        ...message

    });

    saveMessages(
        characterId,
        list
    );

    return list[
        list.length - 1
    ];

}


/* =========================================================
   34. 世界书
   ========================================================= */

function getWorldBooks(){

    const books =
        readJSON(
            STORAGE.worldBooks,
            []
        );

    return Array.isArray(books)
        ? books
        : [];

}


function saveWorldBooks(
    books
){

    return writeJSON(
        STORAGE.worldBooks,
        Array.isArray(books)
            ? books
            : []
    );

}


/* =========================================================
   35. 创建世界书
   ========================================================= */

function createWorldBook(
    data = {}
){

    return {

        id:
            data.id ||
            uid('world'),

        name:
            data.name ||
            '未命名世界书',

        content:
            data.content ||
            '',

        enabled:
            data.enabled !== false,

        createdAt:
            data.createdAt ||
            Date.now()

    };

}


/* =========================================================
   36. 朋友圈
   ========================================================= */

function getMoments(){

    const data =
        readJSON(
            STORAGE.moments,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveMoments(
    moments
){

    return writeJSON(
        STORAGE.moments,
        moments
    );

}


/* =========================================================
   37. 获取某个角色朋友圈
   ========================================================= */

function getCharacterMoments(
    characterId
){

    const all =
        getMoments();

    if(
        !Array.isArray(
            all[characterId]
        )
    ){

        all[characterId] =
            [];

        saveMoments(
            all
        );

    }

    return all[
        characterId
    ];

}


/* =========================================================
   38. 好友关系
   ========================================================= */

function getFriendships(){

    const data =
        readJSON(
            STORAGE.friendships,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveFriendships(
    data
){

    return writeJSON(
        STORAGE.friendships,
        data
    );

}


/* =========================================================
   39. 角色活动
   ========================================================= */

function getActivities(){

    const data =
        readJSON(
            STORAGE.activity,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveActivities(
    data
){

    return writeJSON(
        STORAGE.activity,
        data
    );

}


/* =========================================================
   40. 日记
   ========================================================= */

function getDiaries(){

    const data =
        readJSON(
            STORAGE.diaries,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveDiaries(
    data
){

    return writeJSON(
        STORAGE.diaries,
        data
    );

}


/* =========================================================
   41. 心思
   ========================================================= */

function getThoughts(){

    const data =
        readJSON(
            STORAGE.thoughts,
            {}
        );

    return (
        data &&
        typeof data === 'object'
    )
        ? data
        : {};

}


function saveThoughts(
    data
){

    return writeJSON(
        STORAGE.thoughts,
        data
    );

}


/* =========================================================
   42. Chat 设置
   ========================================================= */

function getChatSettings(){

    const settings =
        readJSON(
            STORAGE.settings,
            {}
        );

    return (
        settings &&
        typeof settings === 'object'
    )
        ? settings
        : {};

}


function saveChatSettings(
    settings
){

    return writeJSON(
        STORAGE.settings,
        settings || {}
    );

}


/* =========================================================
   43. 美化设置
   ========================================================= */

function getBeauty(){

    const beauty =
        readJSON(
            STORAGE.beauty,
            {}
        );

    return (
        beauty &&
        typeof beauty === 'object'
    )
        ? beauty
        : {

            bubbleCSS:
                '',

            chatBackground:
                '',

            userBubbleCSS:
                '',

            characterBubbleCSS:
                ''

        };

}


function saveBeauty(
    beauty
){

    return writeJSON(
        STORAGE.beauty,
        {

            ...getBeauty(),

            ...(beauty || {})

        }
    );

}


/* =========================================================
   44. 初始化全部数据
   ========================================================= */

function initializeStorage(){

    ensureUserMask();

    ensureMainAccount();

    getCharacters();

    getAllMessages();

    getWallet();

    getBankCards();

    getFamilyCards();

    getBills();

    getWorldBooks();

    getMoments();

    getFriendships();

    getActivities();

    getDiaries();

    getThoughts();

    getChatSettings();

    getBeauty();

}


/* =========================================================
   45. API 配置
   ========================================================= */

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
                '',

            key:
                api.key ||
                api.apiKey ||
                '',

            model:
                api.model ||
                api.modelName ||
                '',

            temperature:
                typeof api.temperature === 'number'
                    ? api.temperature
                    : 0.8

        };

    }
    catch(error){

        console.error(
            '读取 API 设置失败:',
            error
        );

        return {};

    }

}


/* =========================================================
   46. 当前用户身份
   ========================================================= */

function getCurrentUser(){

    return getUserMask();

}


/* =========================================================
   47. 检查角色资料是否完整
   ========================================================= */

function validateCharacter(
    character
){

    if(!character){

        return {

            valid:false,

            missing:[
                '角色资料'

            ]

        };

    }


    const missing = [];


    if(
        !String(
            character.name || ''
        ).trim()
    ){

        missing.push(
            '昵称'
        );

    }


    if(
        !String(
            character.wechatId || ''
        ).trim()
    ){

        missing.push(
            '微信号'
        );

    }


    if(
        !String(
            character.phone || ''
        ).trim()
    ){

        missing.push(
            '手机号'
        );

    }


    if(
        !String(
            character.idCard || ''
        ).trim()
    ){

        missing.push(
            '身份证号'
        );

    }


    if(
        !String(
            character.persona || ''
        ).trim()
    ){

        missing.push(
            '人设'
        );

    }


    return {

        valid:
            missing.length === 0,

        missing

    };

}


/* =========================================================
   48. 检查 User 面具
   ========================================================= */

function validateUserMask(
    mask
){

    const missing = [];


    if(
        !String(
            mask?.nickname || ''
        ).trim()
    ){

        missing.push(
            '昵称'
        );

    }


    if(
        !String(
            mask?.wechatId || ''
        ).trim()
    ){

        missing.push(
            '微信号'
        );

    }


    if(
        !String(
            mask?.phone || ''
        ).trim()
    ){

        missing.push(
            '手机号'
        );

    }


    if(
        !String(
            mask?.idCard || ''
        ).trim()
    ){

        missing.push(
            '身份证号'
        );

    }


    return {

        valid:
            missing.length === 0,

        missing

    };

}


/* =========================================================
   49. 消费
   ========================================================= */

function payWithBalance(
    amount,
    title = '消费',
    options = {}
){

    const value =
        Math.abs(
            numberValue(
                amount,
                0
            )
        );

    if(value <= 0){

        return {

            success:false,

            message:
                '金额必须大于 0'

        };

    }


    const wallet =
        getWallet();


    if(
        wallet.balance < value
    ){

        return {

            success:false,

            message:
                '余额不足'

        };

    }


    wallet.balance -=
        value;

    wallet.totalExpense +=
        value;

    saveWallet(
        wallet
    );


    addBill({

        type:
            'expense',

        amount:
            -value,

        title:
            title,

        paymentMethod:
            'balance',

        category:
            options.category ||
            '其他',

        characterId:
            options.characterId ||
            '',

        characterName:
            options.characterName ||
            '',

        note:
            options.note ||
            ''

    });


    return {

        success:true,

        amount:value,

        wallet

    };

}


/* =========================================================
   50. 银行卡消费
   ========================================================= */

function payWithBankCard(
    cardId,
    amount,
    title = '银行卡消费',
    options = {}
){

    const value =
        Math.abs(
            numberValue(
                amount,
                0
            )
        );

    const cards =
        getBankCards();

    const card =
        cards.find(
            item =>
                item.id === cardId
        );


    if(!card){

        return {

            success:false,

            message:
                '银行卡不存在'

        };

    }


    if(
        card.balance < value
    ){

        return {

            success:false,

            message:
                '银行卡余额不足'

        };

    }


    card.balance -=
        value;

    saveBankCards(
        cards
    );


    addBill({

        type:
            'expense',

        amount:
            -value,

        title:
            title,

        paymentMethod:
            'bank',

        category:
            options.category ||
            '其他',

        characterId:
            options.characterId ||
            '',

        characterName:
            options.characterName ||
            '',

        note:
            options.note ||
            ''

    });


    return {

        success:true,

        amount:value,

        card

    };

}


/* =========================================================
   51. 亲属卡消费
   ========================================================= */

function payWithFamilyCard(
    cardId,
    amount,
    title = '亲属卡消费',
    options = {}
){

    const value =
        Math.abs(
            numberValue(
                amount,
                0
            )
        );

    const cards =
        getFamilyCards();

    const card =
        cards.find(
            item =>
                item.id === cardId
        );


    if(!card){

        return {

            success:false,

            message:
                '亲属卡不存在'

        };

    }


    if(
        !card.enabled
    ){

        return {

            success:false,

            message:
                '亲属卡已经停用'

        };

    }


    const remaining =
        Math.max(
            0,
            card.limit -
            card.used
        );


    if(
        remaining < value
    ){

        return {

            success:false,

            message:
                '亲属卡额度不足'

        };

    }


    card.used +=
        value;

    saveFamilyCards(
        cards
    );


    addBill({

        type:
            'expense',

        amount:
            -value,

        title:
            title,

        paymentMethod:
            'family',

        category:
            options.category ||
            '其他',

        characterId:
            options.characterId ||
            '',

        characterName:
            options.characterName ||
            '',

        note:
            options.note ||
            ''

    });


    return {

        success:true,

        amount:value,

        card

    };

}


/* =========================================================
   52. 初始化
   ========================================================= */

initializeStorage();


/* =========================================================
   53. 暴露给后续模块
   ========================================================= */

window.WUYO =
    window.WUYO || {};


Object.assign(
    window.WUYO,
    {

        version:
            WUYO_VERSION,

        STORAGE,

        uid,

        escapeHTML,

        getNowDate,

        getTimeString,

        getDateString,

        getDateTimeString,

        numberValue,

        readJSON,

        writeJSON,

        removeStorage,

        getCharacters,

        saveCharacters,

        getCharacter,

        getCharacterByName,

        createCharacterData,

        getUserMask,

        saveUserMask,

        getAccounts,

        saveAccounts,

        getCurrentAccountId,

        setCurrentAccountId,

        getWallet,

        saveWallet,

        changeBalance,

        getBankCards,

        saveBankCards,

        createBankCard,

        getFamilyCards,

        saveFamilyCards,

        createFamilyCard,

        getBills,

        saveBills,

        addBill,

        getBillStatistics,

        getAllMessages,

        saveAllMessages,

        getMessages,

        saveMessages,

        pushMessage,

        getWorldBooks,

        saveWorldBooks,

        createWorldBook,

        getMoments,

        saveMoments,

        getCharacterMoments,

        getFriendships,

        saveFriendships,

        getActivities,

        saveActivities,

        getDiaries,

        saveDiaries,

        getThoughts,

        saveThoughts,

        getChatSettings,

        saveChatSettings,

        getBeauty,

        saveBeauty,

        getApiConfig,

        getCurrentUser,

        validateCharacter,

        validateUserMask,

        payWithBalance,

        payWithBankCard,

        payWithFamilyCard

    }

);


/* =========================================================
   PART 1 完成
   ========================================================= */

console.log(
    'WUYO CHAT PART 1 loaded:',
    WUYO_VERSION
);


})();
(function(){

'use strict';


/* =========================================================
   WUYO CHAT SYSTEM
   PART 2 / MAIN UI + CHARACTER SYSTEM
   ========================================================= */


const W =
    window.WUYO;

if(!W){

    console.error(
        'WUYO PART 2：PART 1 尚未加载'
    );

    return;

}


const container =
    document.getElementById(
        'chat-app'
    );

if(!container){

    return;

}


/* =========================================================
   当前状态
   ========================================================= */

let currentCharacterId =
    null;

let currentCharacter =
    null;

let currentPage =
    'chats';


/* =========================================================
   样式
   ========================================================= */

const STYLE = `

/* ===============================
   Chat 根容器
   =============================== */

#chat-app{

    position:
        relative;

    width:
        100%;

    height:
        100%;

    overflow:
        hidden;

    background:
        #f5f5f5;

    color:
        #222;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "SF Pro Display",
        "Helvetica Neue",
        Arial,
        sans-serif;

}


/* ===============================
   页面
   =============================== */

.wuyo-page{

    position:
        absolute;

    inset:
        0;

    display:
        none;

    flex-direction:
        column;

    background:
        #f7f7f7;

    overflow:
        hidden;

}

.wuyo-page.active{

    display:
        flex;

}


/* ===============================
   顶部
   =============================== */

.wuyo-header{

    height:
        58px;

    min-height:
        58px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    padding:
        0 16px;

    box-sizing:
        border-box;

    background:
        rgba(
            255,
            255,
            255,
            .96
        );

    border-bottom:
        1px solid
        #ededed;

}


.wuyo-title{

    font-size:
        23px;

    font-weight:
        700;

    letter-spacing:
        -.4px;

}


.wuyo-header-actions{

    display:
        flex;

    align-items:
        center;

    gap:
        7px;

}


.wuyo-icon-button{

    width:
        36px;

    height:
        36px;

    border:
        0;

    border-radius:
        50%;

    background:
        transparent;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    color:
        #333;

}


.wuyo-icon-button:active{

    background:
        #e9e9e9;

}


.wuyo-icon-button svg{

    width:
        20px;

    height:
        20px;

}


/* ===============================
   搜索
   =============================== */

.wuyo-search-wrap{

    padding:
        10px 14px;

    background:
        #fff;

}


.wuyo-search{

    height:
        38px;

    border-radius:
        11px;

    background:
        #f0f0f0;

    display:
        flex;

    align-items:
        center;

    gap:
        8px;

    padding:
        0 12px;

    box-sizing:
        border-box;

    color:
        #999;

}


.wuyo-search svg{

    width:
        17px;

    height:
        17px;

}


.wuyo-search input{

    border:
        0;

    outline:
        none;

    background:
        transparent;

    flex:
        1;

    min-width:
        0;

    font-size:
        14px;

    color:
        #222;

}


/* ===============================
   内容区域
   =============================== */

.wuyo-scroll{

    flex:
        1;

    min-height:
        0;

    overflow-y:
        auto;

    overflow-x:
        hidden;

    -webkit-overflow-scrolling:
        touch;

}


/* ===============================
   聊天列表
   =============================== */

.wuyo-chat-item{

    min-height:
        72px;

    display:
        flex;

    align-items:
        center;

    padding:
        10px 14px;

    box-sizing:
        border-box;

    background:
        #fff;

    border-bottom:
        1px solid
        #f0f0f0;

}


.wuyo-chat-item:active{

    background:
        #f2f2f2;

}


.wuyo-avatar{

    width:
        50px;

    height:
        50px;

    flex:
        0 0 50px;

    border-radius:
        15px;

    background:
        #dedede;

    background-size:
        cover;

    background-position:
        center;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    overflow:
        hidden;

}


.wuyo-chat-info{

    flex:
        1;

    min-width:
        0;

    margin-left:
        12px;

}


.wuyo-chat-top{

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        8px;

}


.wuyo-chat-name{

    font-size:
        15px;

    font-weight:
        600;

    white-space:
        nowrap;

    overflow:
        hidden;

    text-overflow:
        ellipsis;

}


.wuyo-chat-time{

    flex:
        none;

    font-size:
        11px;

    color:
        #aaa;

}


.wuyo-chat-preview{

    margin-top:
        5px;

    font-size:
        13px;

    color:
        #999;

    white-space:
        nowrap;

    overflow:
        hidden;

    text-overflow:
        ellipsis;

}


/* ===============================
   空状态
   =============================== */

.wuyo-empty{

    padding:
        60px 25px;

    text-align:
        center;

    color:
        #999;

    font-size:
        14px;

}


.wuyo-empty-button{

    margin-top:
        18px;

    border:
        0;

    border-radius:
        12px;

    padding:
        10px 18px;

    background:
        #222;

    color:
        #fff;

}


/* ===============================
   联系人分组
   =============================== */

.wuyo-section-title{

    padding:
        18px 15px 8px;

    font-size:
        12px;

    color:
        #999;

    font-weight:
        600;

}


.wuyo-contact-item{

    display:
        flex;

    align-items:
        center;

    min-height:
        70px;

    padding:
        10px 14px;

    box-sizing:
        border-box;

    background:
        #fff;

    border-bottom:
        1px solid
        #f1f1f1;

}


.wuyo-contact-info{

    flex:
        1;

    min-width:
        0;

    margin-left:
        12px;

}


.wuyo-contact-name{

    font-size:
        15px;

    font-weight:
        600;

}


.wuyo-contact-sub{

    margin-top:
        4px;

    font-size:
        12px;

    color:
        #999;

}


.wuyo-edit-btn{

    border:
        0;

    border-radius:
        10px;

    background:
        #eeeeee;

    color:
        #555;

    padding:
        7px 10px;

}


/* ===============================
   创建角色页面
   =============================== */

.wuyo-modal{

    position:
        absolute;

    inset:
        0;

    z-index:
        500;

    display:
        none;

    align-items:
        flex-end;

    background:
        rgba(
            0,
            0,
            0,
            .3
        );

}


.wuyo-modal.show{

    display:
        flex;

}


.wuyo-panel{

    width:
        100%;

    max-height:
        94%;

    overflow-y:
        auto;

    background:
        #f6f6f6;

    border-radius:
        24px 24px 0 0;

    padding:
        18px;

    box-sizing:
        border-box;

}


.wuyo-panel-head{

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    margin-bottom:
        15px;

}


.wuyo-panel-title{

    font-size:
        20px;

    font-weight:
        700;

}


.wuyo-close{

    width:
        34px;

    height:
        34px;

    border:
        0;

    border-radius:
        50%;

    background:
        #e8e8e8;

    font-size:
        20px;

}


.wuyo-avatar-editor{

    width:
        84px;

    height:
        84px;

    margin:
        0 auto 13px;

    border-radius:
        23px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

}


.wuyo-upload{

    display:
        block;

    text-align:
        center;

    background:
        #fff;

    border-radius:
        13px;

    padding:
        11px;

    margin-bottom:
        11px;

    color:
        #555;

    font-size:
        14px;

}


.wuyo-field{

    margin-bottom:
        11px;

}


.wuyo-field label{

    display:
        block;

    font-size:
        12px;

    color:
        #777;

    margin:
        0 0 5px 4px;

}


.wuyo-field input,
.wuyo-field textarea,
.wuyo-field select{

    width:
        100%;

    box-sizing:
        border-box;

    border:
        0;

    outline:
        none;

    background:
        #fff;

    border-radius:
        13px;

    padding:
        11px;

    font-size:
        14px;

    color:
        #222;

}


.wuyo-field textarea{

    min-height:
        90px;

    resize:
        vertical;

}


.wuyo-save{

    width:
        100%;

    border:
        0;

    border-radius:
        14px;

    padding:
        13px;

    background:
        #222;

    color:
        #fff;

    font-size:
        15px;

    margin-top:
        4px;

}


.wuyo-delete{

    width:
        100%;

    border:
        0;

    border-radius:
        14px;

    padding:
        11px;

    background:
        #ececec;

    color:
        #b33;

    font-size:
        14px;

    margin-top:
        8px;

}


/* ===============================
   聊天房间
   =============================== */

.wuyo-room{

    position:
        absolute;

    inset:
        0;

    z-index:
        100;

    display:
        none;

    flex-direction:
        column;

    background:
        #f5f5f5;

}


.wuyo-room.show{

    display:
        flex;

}


.wuyo-room-header{

    height:
        58px;

    min-height:
        58px;

    display:
        flex;

    align-items:
        center;

    background:
        rgba(
            255,
            255,
            255,
            .97
        );

    border-bottom:
        1px solid
        #e9e9e9;

}


.wuyo-room-back{

    width:
        48px;

    height:
        48px;

    border:
        0;

    background:
        transparent;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

}


.wuyo-room-title{

    flex:
        1;

    min-width:
        0;

    text-align:
        center;

    font-size:
        16px;

    font-weight:
        600;

}


.wuyo-room-more{

    width:
        48px;

    height:
        48px;

    border:
        0;

    background:
        transparent;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

}


.wuyo-room-body{

    flex:
        1;

    min-height:
        0;

    overflow-y:
        auto;

    padding:
        14px;

    box-sizing:
        border-box;

}


.wuyo-message-row{

    display:
        flex;

    margin-bottom:
        12px;

    align-items:
        flex-end;

    gap:
        8px;

}


.wuyo-message-row.me{

    justify-content:
        flex-end;

}


.wuyo-message-avatar{

    width:
        35px;

    height:
        35px;

    flex:
        0 0 35px;

    border-radius:
        11px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

}


.wuyo-message-bubble{

    max-width:
        76%;

    padding:
        10px 12px;

    border-radius:
        15px;

    background:
        #fff;

    color:
        #222;

    font-size:
        14px;

    line-height:
        1.5;

    overflow-wrap:
        anywhere;

    word-break:
        break-word;

}


.wuyo-message-row.me
.wuyo-message-bubble{

    background:
        #d9f4c8;

}


.wuyo-system-message{

    text-align:
        center;

    margin:
        10px 20px;

    color:
        #aaa;

    font-size:
        12px;

}


/* ===============================
   输入栏
   =============================== */

.wuyo-room-footer{

    display:
        flex;

    align-items:
        center;

    gap:
        7px;

    padding:
        8px;

    background:
        #fafafa;

    border-top:
        1px solid
        #e7e7e7;

}


.wuyo-input{

    flex:
        1;

    min-width:
        0;

    height:
        39px;

    border:
        0;

    outline:
        none;

    background:
        #fff;

    border-radius:
        10px;

    padding:
        0 12px;

    box-sizing:
        border-box;

    font-size:
        14px;

}


.wuyo-send{

    width:
        39px;

    height:
        39px;

    border:
        0;

    border-radius:
        11px;

    background:
        #222;

    color:
        #fff;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

}


.wuyo-send:disabled{

    opacity:
        .3;

}


/* ===============================
   更多菜单
   =============================== */

.wuyo-more-mask{

    position:
        absolute;

    inset:
        0;

    z-index:
        300;

    display:
        none;

    background:
        rgba(
            0,
            0,
            0,
            .2
        );

}


.wuyo-more-mask.show{

    display:
        block;

}


.wuyo-more-menu{

    position:
        absolute;

    top:
        56px;

    right:
        10px;

    width:
        210px;

    background:
        #fff;

    border-radius:
        15px;

    box-shadow:
        0 8px 30px
        rgba(
            0,
            0,
            0,
            .16
        );

    overflow:
        hidden;

}


.wuyo-more-item{

    width:
        100%;

    min-height:
        48px;

    border:
        0;

    background:
        #fff;

    display:
        flex;

    align-items:
        center;

    padding:
        0 15px;

    gap:
        10px;

    color:
        #222;

    font-size:
        14px;

    text-align:
        left;

}


.wuyo-more-item:active{

    background:
        #f2f2f2;

}


/* ===============================
   底部导航
   =============================== */

.wuyo-bottom{

    height:
        58px;

    min-height:
        58px;

    display:
        grid;

    grid-template-columns:
        repeat(
            4,
            1fr
        );

    background:
        rgba(
            255,
            255,
            255,
            .98
        );

    border-top:
        1px solid
        #e8e8e8;

}


.wuyo-tab{

    border:
        0;

    background:
        transparent;

    display:
        flex;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    gap:
        3px;

    color:
        #999;

    font-size:
        10px;

}


.wuyo-tab svg{

    width:
        19px;

    height:
        19px;

}


.wuyo-tab.active{

    color:
        #222;

}


/* ===============================
   Moments
   =============================== */

.wuyo-moments-cover{

    height:
        185px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

    position:
        relative;

}


.wuyo-moments-profile{

    position:
        absolute;

    right:
        16px;

    bottom:
        -25px;

    display:
        flex;

    align-items:
        flex-end;

    gap:
        9px;

}


.wuyo-moments-profile-name{

    color:
        #fff;

    font-size:
        15px;

    font-weight:
        600;

    text-shadow:
        0 1px 4px
        rgba(
            0,
            0,
            0,
            .4
        );

}


.wuyo-moments-avatar{

    width:
        62px;

    height:
        62px;

    border-radius:
        16px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

    border:
        3px solid
        #fff;

}


.wuyo-moment-card{

    margin:
        32px 13px 0;

    padding:
        14px;

    background:
        #fff;

    border-radius:
        15px;

}


.wuyo-moment-head{

    display:
        flex;

    gap:
        10px;

}


.wuyo-moment-avatar{

    width:
        42px;

    height:
        42px;

    border-radius:
        13px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

}


.wuyo-moment-name{

    font-size:
        14px;

    font-weight:
        600;

}


.wuyo-moment-time{

    margin-top:
        4px;

    color:
        #aaa;

    font-size:
        11px;

}


.wuyo-moment-text{

    margin:
        10px 0;

    line-height:
        1.55;

    font-size:
        14px;

}


.wuyo-moment-actions{

    display:
        flex;

    gap:
        8px;

}


.wuyo-moment-actions button{

    border:
        0;

    background:
        #f1f1f1;

    border-radius:
        9px;

    padding:
        7px 10px;

    font-size:
        12px;

}


/* ===============================
   Me
   =============================== */

.wuyo-me-profile{

    padding:
        22px 16px;

    background:
        #fff;

    display:
        flex;

    align-items:
        center;

    gap:
        13px;

}


.wuyo-me-avatar{

    width:
        68px;

    height:
        68px;

    border-radius:
        20px;

    background:
        #ddd;

    background-size:
        cover;

    background-position:
        center;

}


.wuyo-me-name{

    font-size:
        19px;

    font-weight:
        700;

}


.wuyo-me-id{

    margin-top:
        5px;

    color:
        #999;

    font-size:
        12px;

}


.wuyo-me-menu{

    margin-top:
        10px;

    background:
        #fff;

}


.wuyo-me-item{

    min-height:
        52px;

    display:
        flex;

    align-items:
        center;

    gap:
        12px;

    padding:
        0 16px;

    border-bottom:
        1px solid
        #f0f0f0;

    font-size:
        14px;

}


.wuyo-me-item svg{

    width:
        19px;

    height:
        19px;

}


/* ===============================
   隐藏 file input
   =============================== */

.wuyo-hidden{

    display:
        none !important;

}

`;

const style =
    document.createElement(
        'style'
    );

style.id =
    'wuyo-part2-style';

style.textContent =
    STYLE;

document.head.appendChild(
    style
);


/* =========================================================
   创建主 HTML
   ========================================================= */

container.innerHTML = `

<!-- =====================================================
     Chats
     ===================================================== -->

<section
    id="wuyo-page-chats"
    class="wuyo-page active"
>

    <header class="wuyo-header">

        <h1 class="wuyo-title">
            Chats
        </h1>

        <div class="wuyo-header-actions">

            <button
                class="wuyo-icon-button"
                id="wuyo-chat-add"
                type="button"
            >
                <i data-lucide="plus"></i>
            </button>

        </div>

    </header>


    <div class="wuyo-search-wrap">

        <div class="wuyo-search">

            <i data-lucide="search"></i>

            <input
                id="wuyo-chat-search"
                placeholder="Search..."
                autocomplete="off"
            >

        </div>

    </div>


    <div
        class="wuyo-scroll"
        id="wuyo-chat-list"
    ></div>


    <nav class="wuyo-bottom">

        <button
            class="wuyo-tab active"
            data-page="chats"
            type="button"
        >
            <i data-lucide="message-square"></i>
            <span>Chats</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="contacts"
            type="button"
        >
            <i data-lucide="users"></i>
            <span>Contacts</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="moments"
            type="button"
        >
            <i data-lucide="aperture"></i>
            <span>Moments</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="me"
            type="button"
        >
            <i data-lucide="user-circle"></i>
            <span>Me</span>
        </button>

    </nav>

</section>


<!-- =====================================================
     Contacts
     ===================================================== -->

<section
    id="wuyo-page-contacts"
    class="wuyo-page"
>

    <header class="wuyo-header">

        <h1 class="wuyo-title">
            Contacts
        </h1>

        <button
            class="wuyo-icon-button"
            id="wuyo-contact-add"
            type="button"
        >
            <i data-lucide="user-plus"></i>
        </button>

    </header>


    <div class="wuyo-search-wrap">

        <div class="wuyo-search">

            <i data-lucide="search"></i>

            <input
                id="wuyo-contact-search"
                placeholder="Search..."
                autocomplete="off"
            >

        </div>

    </div>


    <div
        class="wuyo-scroll"
        id="wuyo-contact-list"
    ></div>


    <nav class="wuyo-bottom">

        <button
            class="wuyo-tab"
            data-page="chats"
            type="button"
        >
            <i data-lucide="message-square"></i>
            <span>Chats</span>
        </button>

        <button
            class="wuyo-tab active"
            data-page="contacts"
            type="button"
        >
            <i data-lucide="users"></i>
            <span>Contacts</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="moments"
            type="button"
        >
            <i data-lucide="aperture"></i>
            <span>Moments</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="me"
            type="button"
        >
            <i data-lucide="user-circle"></i>
            <span>Me</span>
        </button>

    </nav>

</section>


<!-- =====================================================
     Moments
     ===================================================== -->

<section
    id="wuyo-page-moments"
    class="wuyo-page"
>

    <header class="wuyo-header">

        <h1 class="wuyo-title">
            Moments
        </h1>

        <div class="wuyo-header-actions">

            <button
                class="wuyo-icon-button"
                id="wuyo-moments-refresh"
                type="button"
            >
                <i data-lucide="refresh-cw"></i>
            </button>

            <button
                class="wuyo-icon-button"
                id="wuyo-moment-add"
                type="button"
            >
                <i data-lucide="plus"></i>
            </button>

        </div>

    </header>


    <div
        class="wuyo-scroll"
        id="wuyo-moments-body"
    ></div>


    <nav class="wuyo-bottom">

        <button
            class="wuyo-tab"
            data-page="chats"
            type="button"
        >
            <i data-lucide="message-square"></i>
            <span>Chats</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="contacts"
            type="button"
        >
            <i data-lucide="users"></i>
            <span>Contacts</span>
        </button>

        <button
            class="wuyo-tab active"
            data-page="moments"
            type="button"
        >
            <i data-lucide="aperture"></i>
            <span>Moments</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="me"
            type="button"
        >
            <i data-lucide="user-circle"></i>
            <span>Me</span>
        </button>

    </nav>

</section>


<!-- =====================================================
     Me
     ===================================================== -->

<section
    id="wuyo-page-me"
    class="wuyo-page"
>

    <header class="wuyo-header">

        <h1 class="wuyo-title">
            Me
        </h1>

        <button
            class="wuyo-icon-button"
            id="wuyo-user-edit"
            type="button"
        >
            <i data-lucide="pencil"></i>
        </button>

    </header>


    <div
        class="wuyo-scroll"
        id="wuyo-me-body"
    ></div>


    <nav class="wuyo-bottom">

        <button
            class="wuyo-tab"
            data-page="chats"
            type="button"
        >
            <i data-lucide="message-square"></i>
            <span>Chats</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="contacts"
            type="button"
        >
            <i data-lucide="users"></i>
            <span>Contacts</span>
        </button>

        <button
            class="wuyo-tab"
            data-page="moments"
            type="button"
        >
            <i data-lucide="aperture"></i>
            <span>Moments</span>
        </button>

        <button
            class="wuyo-tab active"
            data-page="me"
            type="button"
        >
            <i data-lucide="user-circle"></i>
            <span>Me</span>
        </button>

    </nav>

</section>


<!-- =====================================================
     Chat Room
     ===================================================== -->

<section
    id="wuyo-room"
    class="wuyo-room"
>

    <header class="wuyo-room-header">

        <button
            class="wuyo-room-back"
            id="wuyo-room-back"
            type="button"
        >
            <i data-lucide="chevron-left"></i>
        </button>


        <div
            class="wuyo-room-title"
            id="wuyo-room-title"
        >
            Chat
        </div>


        <button
            class="wuyo-room-more"
            id="wuyo-room-more"
            type="button"
        >
            <i data-lucide="more-horizontal"></i>
        </button>

    </header>


    <div
        class="wuyo-room-body"
        id="wuyo-room-body"
    ></div>


    <footer class="wuyo-room-footer">

        <input
            class="wuyo-input"
            id="wuyo-room-input"
            type="text"
            placeholder="Message..."
            autocomplete="off"
        >


        <button
            class="wuyo-send"
            id="wuyo-room-send"
            type="button"
            disabled
        >
            <i data-lucide="arrow-up"></i>
        </button>

    </footer>

</section>


<!-- =====================================================
     更多菜单
     ===================================================== -->

<div
    id="wuyo-more-mask"
    class="wuyo-more-mask"
>

    <div class="wuyo-more-menu">

        <button
            class="wuyo-more-item"
            id="wuyo-open-character-home"
            type="button"
        >
            <i data-lucide="user-round"></i>
            <span>角色主页</span>
        </button>


        <button
            class="wuyo-more-item"
            id="wuyo-open-chat-settings"
            type="button"
        >
            <i data-lucide="settings-2"></i>
            <span>聊天设置</span>
        </button>


        <button
            class="wuyo-more-item"
            id="wuyo-open-chat-beauty"
            type="button"
        >
            <i data-lucide="palette"></i>
            <span>聊天美化</span>
        </button>

    </div>

</div>


<!-- =====================================================
     角色编辑
     ===================================================== -->

<div
    id="wuyo-character-modal"
    class="wuyo-modal"
>

    <div class="wuyo-panel">

        <div class="wuyo-panel-head">

            <div
                class="wuyo-panel-title"
                id="wuyo-character-modal-title"
            >
                创建角色
            </div>

            <button
                class="wuyo-close"
                id="wuyo-character-close"
                type="button"
            >
                ×
            </button>

        </div>


        <div
            class="wuyo-avatar-editor"
            id="wuyo-character-avatar-preview"
        ></div>


        <label class="wuyo-upload">

            选择角色头像

            <input
                class="wuyo-hidden"
                id="wuyo-character-avatar"
                type="file"
                accept="image/*"
            >

        </label>


        <div class="wuyo-field">

            <label>
                昵称
            </label>

            <input
                id="wuyo-character-nickname"
                placeholder="角色昵称"
            >

        </div>


        <div class="wuyo-field">

            <label>
                备注
            </label>

            <input
                id="wuyo-character-note"
                placeholder="聊天联系人显示的备注"
            >

        </div>


        <div class="wuyo-field">

            <label>
                微信号
            </label>

            <input
                id="wuyo-character-wechat"
                placeholder="角色微信号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                手机号
            </label>

            <input
                id="wuyo-character-phone"
                placeholder="角色手机号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                身份证号
            </label>

            <input
                id="wuyo-character-idcard"
                placeholder="角色身份证号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                性别
            </label>

            <select
                id="wuyo-character-gender"
            >

                <option value="">
                    未设置
                </option>

                <option value="男">
                    男
                </option>

                <option value="女">
                    女
                </option>

                <option value="其他">
                    其他
                </option>

            </select>

        </div>


        <div class="wuyo-field">

            <label>
                身份
            </label>

            <input
                id="wuyo-character-identity"
                placeholder="例如：学生、医生"
            >

        </div>


        <div class="wuyo-field">

            <label>
                年龄
            </label>

            <input
                id="wuyo-character-age"
                placeholder="角色年龄"
            >

        </div>


        <div class="wuyo-field">

            <label>
                个性签名
            </label>

            <input
                id="wuyo-character-signature"
                placeholder="角色个性签名"
            >

        </div>


        <div class="wuyo-field">

            <label>
                人设
            </label>

            <textarea
                id="wuyo-character-persona"
                placeholder="角色性格、习惯、说话方式、背景等"
            ></textarea>

        </div>


        <div class="wuyo-field">

            <label>
                外观
            </label>

            <textarea
                id="wuyo-character-appearance"
                placeholder="角色外貌、穿着、发型等"
            ></textarea>

        </div>


        <button
            class="wuyo-save"
            id="wuyo-character-save"
            type="button"
        >
            保存角色
        </button>


        <button
            class="wuyo-delete"
            id="wuyo-character-delete"
            type="button"
        >
            删除角色
        </button>

    </div>

</div>


<!-- =====================================================
     User 编辑
     ===================================================== -->

<div
    id="wuyo-user-modal"
    class="wuyo-modal"
>

    <div class="wuyo-panel">

        <div class="wuyo-panel-head">

            <div class="wuyo-panel-title">
                我的面具
            </div>

            <button
                class="wuyo-close"
                id="wuyo-user-close"
                type="button"
            >
                ×
            </button>

        </div>


        <div
            class="wuyo-avatar-editor"
            id="wuyo-user-avatar-preview"
        ></div>


        <label class="wuyo-upload">

            选择我的头像

            <input
                class="wuyo-hidden"
                id="wuyo-user-avatar"
                type="file"
                accept="image/*"
            >

        </label>


        <div class="wuyo-field">

            <label>
                昵称
            </label>

            <input
                id="wuyo-user-nickname"
                placeholder="我的昵称"
            >

        </div>


        <div class="wuyo-field">

            <label>
                微信号
            </label>

            <input
                id="wuyo-user-wechat"
                placeholder="我的微信号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                手机号
            </label>

            <input
                id="wuyo-user-phone"
                placeholder="我的手机号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                身份证号
            </label>

            <input
                id="wuyo-user-idcard"
                placeholder="我的身份证号"
            >

        </div>


        <div class="wuyo-field">

            <label>
                性别
            </label>

            <select
                id="wuyo-user-gender"
            >

                <option value="">
                    未设置
                </option>

                <option value="男">
                    男
                </option>

                <option value="女">
                    女
                </option>

                <option value="其他">
                    其他
                </option>

            </select>

        </div>


        <div class="wuyo-field">

            <label>
                个性签名
            </label>

            <textarea
                id="wuyo-user-signature"
                placeholder="我的个性签名"
            ></textarea>

        </div>


        <button
            class="wuyo-save"
            id="wuyo-user-save"
            type="button"
        >
            保存面具
        </button>

    </div>

</div>

`;


/* =========================================================
   Lucide
   ========================================================= */

if(window.lucide){

    window.lucide.createIcons({
        root:
            container
    });

}


/* =========================================================
   快捷获取
   ========================================================= */

const $ =
    id =>
        document.getElementById(id);


/* =========================================================
   图片转 Base64
   ========================================================= */

function readImage(
    file
){

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if(!file){

                resolve('');

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   头像样式
   ========================================================= */

function avatarStyle(
    avatar
){

    if(!avatar){

        return '';

    }

    return `
        background-image:url("${avatar}");
        background-size:cover;
        background-position:center;
    `;

}


/* =========================================================
   页面切换
   ========================================================= */

function switchPage(
    page
){

    currentPage =
        page;


    container
        .querySelectorAll(
            '.wuyo-page'
        )
        .forEach(
            item => {

                item.classList.toggle(
                    'active',
                    item.id ===
                    'wuyo-page-' +
                    page
                );

            }
        );


    container
        .querySelectorAll(
            '.wuyo-tab'
        )
        .forEach(
            tab => {

                tab.classList.toggle(
                    'active',
                    tab.dataset.page ===
                    page
                );

            }
        );


    if(
        page === 'chats'
    ){

        renderChats();

    }


    if(
        page === 'contacts'
    ){

        renderContacts();

    }


    if(
        page === 'moments'
    ){

        renderMoments();

    }


    if(
        page === 'me'
    ){

        renderMe();

    }

}


/* =========================================================
   底部导航
   ========================================================= */

container
    .querySelectorAll(
        '.wuyo-tab'
    )
    .forEach(
        tab => {

            tab.addEventListener(
                'click',
                function(){

                    switchPage(
                        tab.dataset.page
                    );

                }
            );

        }
    );


/* =========================================================
   Chats
   ========================================================= */

function getLastMessage(
    characterId
){

    const messages =
        W.getMessages(
            characterId
        );

    const valid =
        messages.filter(
            message =>
                !message.thinking
        );


    return valid[
        valid.length - 1
    ] || null;

}


function renderChats(){

    const list =
        $('wuyo-chat-list');

    if(!list){

        return;

    }


    const characters =
        W.getCharacters();


    const search =
        (
            $('wuyo-chat-search')?.value ||
            ''
        )
        .trim()
        .toLowerCase();


    const filtered =
        characters.filter(
            character => {

                const text =
                    (
                        character.nickname ||
                        character.name ||
                        ''
                    )
                    .toLowerCase();

                return !search ||
                    text.includes(
                        search
                    );

            }
        );


    if(
        filtered.length === 0
    ){

        list.innerHTML = `

            <div class="wuyo-empty">

                <div>
                    暂无聊天
                </div>

                <button
                    class="wuyo-empty-button"
                    id="wuyo-empty-create"
                    type="button"
                >
                    创建角色
                </button>

            </div>

        `;


        $('wuyo-empty-create')
            ?.addEventListener(
                'click',
                openCharacterEditor
            );

        return;

    }


    list.innerHTML =
        filtered
            .map(
                character => {

                    const last =
                        getLastMessage(
                            character.id
                        );


                    const displayName =
                        character.note ||
                        character.nickname ||
                        character.name ||
                        '未命名';


                    const preview =
                        last?.text ||
                        '开始聊天';


                    return `

                        <div
                            class="wuyo-chat-item"
                            data-character-id="${escapeHTML(character.id)}"
                        >

                            <div
                                class="wuyo-avatar"
                                style="${avatarStyle(character.avatar)}"
                            ></div>


                            <div
                                class="wuyo-chat-info"
                            >

                                <div
                                    class="wuyo-chat-top"
                                >

                                    <span
                                        class="wuyo-chat-name"
                                    >
                                        ${escapeHTML(displayName)}
                                    </span>


                                    <span
                                        class="wuyo-chat-time"
                                    >
                                        ${
                                            last?.time ||
                                            ''
                                        }
                                    </span>

                                </div>


                                <div
                                    class="wuyo-chat-preview"
                                >
                                    ${escapeHTML(preview)}
                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join('');


    list
        .querySelectorAll(
            '[data-character-id]'
        )
        .forEach(
            item => {

                item.addEventListener(
                    'click',
                    function(){

                        openChat(
                            item.dataset.characterId
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Contacts
   ========================================================= */

function renderContacts(){

    const list =
        $('wuyo-contact-list');

    if(!list){

        return;

    }


    const characters =
        W.getCharacters();


    const search =
        (
            $('wuyo-contact-search')?.value ||
            ''
        )
        .trim()
        .toLowerCase();


    const filtered =
        characters.filter(
            character => {

                const text =
                    [
                        character.nickname,
                        character.name,
                        character.wechatId,
                        character.note
                    ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return !search ||
                    text.includes(
                        search
                    );

            }
        );


    let html = `

        <div class="wuyo-section-title">
            Characters
        </div>

    `;


    if(
        filtered.length === 0
    ){

        html += `

            <div class="wuyo-empty">

                暂无联系人

            </div>

        `;

    }
    else{

        html +=
            filtered
                .map(
                    character => `

                        <div
                            class="wuyo-contact-item"
                            data-character-id="${escapeHTML(character.id)}"
                        >

                            <div
                                class="wuyo-avatar"
                                style="${avatarStyle(character.avatar)}"
                            ></div>


                            <div
                                class="wuyo-contact-info"
                            >

                                <div
                                    class="wuyo-contact-name"
                                >
                                    ${escapeHTML(
                                        character.note ||
                                        character.nickname ||
                                        character.name
                                    )}
                                </div>


                                <div
                                    class="wuyo-contact-sub"
                                >
                                    ${
                                        character.wechatId
                                            ? '微信号：' +
                                              escapeHTML(
                                                  character.wechatId
                                              )
                                            : '未设置微信号'
                                    }
                                </div>

                            </div>


                            <button
                                class="wuyo-edit-btn"
                                data-edit-character="${escapeHTML(character.id)}"
                                type="button"
                            >
                                编辑
                            </button>

                        </div>

                    `
                )
                .join('');

    }


    html += `

        <div
            class="wuyo-contact-item"
            id="wuyo-create-contact"
        >

            <div
                class="wuyo-avatar"
                style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:22px;
                "
            >
                +
            </div>


            <div class="wuyo-contact-info">

                <div class="wuyo-contact-name">
                    添加好友
                </div>

                <div class="wuyo-contact-sub">
                    创建一个新的角色联系人
                </div>

            </div>

        </div>

    `;


    list.innerHTML =
        html;


    list
        .querySelectorAll(
            '[data-character-id]'
        )
        .forEach(
            item => {

                item.addEventListener(
                    'click',
                    function(event){

                        if(
                            event.target.closest(
                                '[data-edit-character]'
                            )
                        ){

                            return;

                        }


                        openChat(
                            item.dataset.characterId
                        );

                    }
                );

            }
        );


    list
        .querySelectorAll(
            '[data-edit-character]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    function(event){

                        event.preventDefault();

                        event.stopPropagation();


                        openCharacterEditor(
                            button.dataset.editCharacter
                        );

                    }
                );

            }
        );


    $('wuyo-create-contact')
        ?.addEventListener(
            'click',
            openCharacterEditor
        );

}


/* =========================================================
   Moments
   ========================================================= */

function renderMoments(){

    const body =
        $('wuyo-moments-body');

    if(!body){

        return;

    }


    const characters =
        W.getCharacters();


    const user =
        W.getUserMask();


    let posts = [];


    characters.forEach(
        character => {

            const moments =
                W.getCharacterMoments(
                    character.id
                );


            moments.forEach(
                moment => {

                    posts.push({

                        ...moment,

                        character

                    });

                }
            );

        }
    );


    posts.sort(
        (
            a,
            b
        ) =>
            numberValue(
                b.createdAt,
                0
            )
            -
            numberValue(
                a.createdAt,
                0
            )
    );


    let html = `

        <div
            class="wuyo-moments-cover"
            id="wuyo-moments-cover"
        >

            <div
                class="wuyo-moments-profile"
            >

                <span
                    class="wuyo-moments-profile-name"
                >
                    ${escapeHTML(
                        user.nickname ||
                        'User'
                    )}
                </span>


                <div
                    class="wuyo-moments-avatar"
                    style="${avatarStyle(user.avatar)}"
                ></div>

            </div>

        </div>

    `;


    if(posts.length === 0){

        html += `

            <div class="wuyo-empty">

                暂无朋友圈内容

            </div>

        `;

    }
    else{

        html +=
            posts
                .map(
                    post => {

                        const likes =
                            Array.isArray(
                                post.likes
                            )
                                ? post.likes.length
                                : 0;


                        const comments =
                            Array.isArray(
                                post.comments
                            )
                                ? post.comments.length
                                : 0;


                        return `

                            <article
                                class="wuyo-moment-card"
                            >

                                <div
                                    class="wuyo-moment-head"
                                >

                                    <div
                                        class="wuyo-moment-avatar"
                                        style="${avatarStyle(post.character.avatar)}"
                                    ></div>


                                    <div>

                                        <div
                                            class="wuyo-moment-name"
                                        >
                                            ${escapeHTML(
                                                post.character.note ||
                                                post.character.nickname ||
                                                post.character.name
                                            )}
                                        </div>


                                        <div
                                            class="wuyo-moment-time"
                                        >
                                            ${escapeHTML(
                                                post.time ||
                                                ''
                                            )}
                                        </div>

                                    </div>

                                </div>


                                <div
                                    class="wuyo-moment-text"
                                >
                                    ${escapeHTML(
                                        post.text ||
                                        ''
                                    )}
                                </div>


                                <div
                                    class="wuyo-moment-actions"
                                >

                                    <button
                                        type="button"
                                        data-like-moment="${escapeHTML(post.id)}"
                                        data-character-id="${escapeHTML(post.character.id)}"
                                    >
                                        赞 ${likes}
                                    </button>


                                    <button
                                        type="button"
                                        data-comment-moment="${escapeHTML(post.id)}"
                                        data-character-id="${escapeHTML(post.character.id)}"
                                    >
                                        评论 ${comments}
                                    </button>

                                </div>

                            </article>

                        `;

                    }
                )
                .join('');

    }


    body.innerHTML =
        html;


    body
        .querySelectorAll(
            '[data-like-moment]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    function(){

                        toggleMomentLike(
                            button.dataset.characterId,
                            button.dataset.likeMoment
                        );

                    }
                );

            }
        );


    body
        .querySelectorAll(
            '[data-comment-moment]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    function(){

                        commentMoment(
                            button.dataset.characterId,
                            button.dataset.commentMoment
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Moments 点赞
   ========================================================= */

function toggleMomentLike(
    characterId,
    momentId
){

    const all =
        W.getMoments();


    const list =
        Array.isArray(
            all[characterId]
        )
            ? all[characterId]
            : [];


    const post =
        list.find(
            item =>
                item.id === momentId
        );


    if(!post){

        return;

    }


    if(
        !Array.isArray(
            post.likes
        )
    ){

        post.likes =
            [];

    }


    const user =
        W.getUserMask();


    const userId =
        user.wechatId ||
        user.id;


    const index =
        post.likes.indexOf(
            userId
        );


    if(index >= 0){

        post.likes.splice(
            index,
            1
        );

    }
    else{

        post.likes.push(
            userId
        );

    }


    W.saveMoments(
        all
    );


    renderMoments();

}


/* =========================================================
   Moments 评论
   ========================================================= */

function commentMoment(
    characterId,
    momentId
){

    const text =
        prompt(
            '输入评论内容'
        );


    if(
        text === null ||
        !text.trim()
    ){

        return;

    }


    const all =
        W.getMoments();


    const list =
        Array.isArray(
            all[characterId]
        )
            ? all[characterId]
            : [];


    const post =
        list.find(
            item =>
                item.id === momentId
        );


    if(!post){

        return;

    }


    if(
        !Array.isArray(
            post.comments
        )
    ){

        post.comments =
            [];

    }


    const user =
        W.getUserMask();


    post.comments.push({

        id:
            W.uid('comment'),

        from:
            'user',

        nickname:
            user.nickname ||
            'User',

        text:
            text.trim(),

        time:
            W.getDateTimeString(),

        createdAt:
            Date.now()

    });


    W.saveMoments(
        all
    );


    renderMoments();

}


/* =========================================================
   Me
   ========================================================= */

function renderMe(){

    const body =
        $('wuyo-me-body');

    if(!body){

        return;

    }


    const user =
        W.getUserMask();


    const wallet =
        W.getWallet();


    body.innerHTML = `

        <div class="wuyo-me-profile">

            <div
                class="wuyo-me-avatar"
                style="${avatarStyle(user.avatar)}"
            ></div>


            <div>

                <div
                    class="wuyo-me-name"
                >
                    ${escapeHTML(
                        user.nickname ||
                        'User'
                    )}
                </div>


                <div
                    class="wuyo-me-id"
                >
                    微信号：
                    ${escapeHTML(
                        user.wechatId ||
                        '未设置'
                    )}
                </div>

            </div>

        </div>


        <div class="wuyo-me-menu">

            <div
                class="wuyo-me-item"
                id="wuyo-menu-profile"
            >
                <i data-lucide="user"></i>
                <span>我的面具</span>
            </div>


            <div
                class="wuyo-me-item"
                id="wuyo-menu-wallet"
            >
                <i data-lucide="wallet"></i>

                <span>
                    钱包
                </span>

                <span
                    style="
                        margin-left:auto;
                        color:#999;
                    "
                >
                    ${wallet.balance.toFixed(2)}
                </span>

            </div>


            <div
                class="wuyo-me-item"
                id="wuyo-menu-beauty"
            >
                <i data-lucide="palette"></i>
                <span>聊天美化</span>
            </div>


            <div
                class="wuyo-me-item"
                id="wuyo-menu-accounts"
            >
                <i data-lucide="layers"></i>
                <span>大小号</span>
            </div>

        </div>

    `;


    if(window.lucide){

        window.lucide.createIcons({
            root:
                body
        });

    }


    $('wuyo-menu-profile')
        ?.addEventListener(
            'click',
            openUserEditor
        );


    $('wuyo-user-edit')
        ?.addEventListener(
            'click',
            openUserEditor
        );


    $('wuyo-menu-wallet')
        ?.addEventListener(
            'click',
            function(){

                if(
                    typeof window.WUYO_OPEN_WALLET ===
                    'function'
                ){

                    window.WUYO_OPEN_WALLET();

                }
                else{

                    alert(
                        '钱包模块将在后续部分启用。'
                    );

                }

            }
        );


    $('wuyo-menu-beauty')
        ?.addEventListener(
            'click',
            function(){

                if(
                    typeof window.WUYO_OPEN_BEAUTY ===
                    'function'
                ){

                    window.WUYO_OPEN_BEAUTY();

                }

            }
        );


    $('wuyo-menu-accounts')
        ?.addEventListener(
            'click',
            function(){

                if(
                    typeof window.WUYO_OPEN_ACCOUNTS ===
                    'function'
                ){

                    window.WUYO_OPEN_ACCOUNTS();

                }

            }
        );

}


/* =========================================================
   创建角色编辑器
   ========================================================= */

let editingCharacterId =
    null;

let editingCharacterAvatar =
    '';


function resetCharacterEditor(){

    editingCharacterId =
        null;

    editingCharacterAvatar =
        '';


    $('wuyo-character-nickname').value =
        '';

    $('wuyo-character-note').value =
        '';

    $('wuyo-character-wechat').value =
        '';

    $('wuyo-character-phone').value =
        '';

    $('wuyo-character-idcard').value =
        '';

    $('wuyo-character-gender').value =
        '';

    $('wuyo-character-identity').value =
        '';

    $('wuyo-character-age').value =
        '';

    $('wuyo-character-signature').value =
        '';

    $('wuyo-character-persona').value =
        '';

    $('wuyo-character-appearance').value =
        '';


    $('wuyo-character-avatar-preview')
        .style
        .backgroundImage =
        '';


    $('wuyo-character-modal-title')
        .textContent =
        '创建角色';


    $('wuyo-character-delete')
        .style
        .display =
        'none';


    $('wuyo-character-avatar')
        .value =
        '';

}


/* =========================================================
   打开角色编辑器
   ========================================================= */

function openCharacterEditor(
    id = null
){

    resetCharacterEditor();


    if(id){

        const character =
            W.getCharacter(
                id
            );


        if(!character){

            return;

        }


        editingCharacterId =
            character.id;


        editingCharacterAvatar =
            character.avatar ||
            '';


        $('wuyo-character-nickname')
            .value =
            character.nickname ||
            character.name ||
            '';


        $('wuyo-character-note')
            .value =
            character.note ||
            '';


        $('wuyo-character-wechat')
            .value =
            character.wechatId ||
            '';


        $('wuyo-character-phone')
            .value =
            character.phone ||
            '';


        $('wuyo-character-idcard')
            .value =
            character.idCard ||
            '';


        $('wuyo-character-gender')
            .value =
            character.gender ||
            '';


        $('wuyo-character-identity')
            .value =
            character.identity ||
            '';


        $('wuyo-character-age')
            .value =
            character.age ||
            '';


        $('wuyo-character-signature')
            .value =
            character.signature ||
            '';


        $('wuyo-character-persona')
            .value =
            character.persona ||
            '';


        $('wuyo-character-appearance')
            .value =
            character.appearance ||
            '';


        if(
            editingCharacterAvatar
        ){

            $('wuyo-character-avatar-preview')
                .style
                .backgroundImage =
                `url("${editingCharacterAvatar}")`;

        }


        $('wuyo-character-modal-title')
            .textContent =
            '编辑角色';


        $('wuyo-character-delete')
            .style
            .display =
            'block';

    }


    $('wuyo-character-modal')
        .classList
        .add('show');

}


/* =========================================================
   关闭角色编辑器
   ========================================================= */

$('wuyo-character-close')
    .addEventListener(
        'click',
        function(){

            $('wuyo-character-modal')
                .classList
                .remove('show');

        }
    );


$('wuyo-character-modal')
    .addEventListener(
        'click',
        function(event){

            if(
                event.target ===
                $('wuyo-character-modal')
            ){

                $('wuyo-character-modal
               
                             }

        }
    );


/* =====================================================
   第 3 段
   角色扩展资料 + User 面具 + 好友系统基础
   ===================================================== */


/* =====================================================
   数据 Key
   ===================================================== */

const USER_MASK_KEY =
    'wuyo_user_masks';

const ACTIVE_USER_MASK_KEY =
    'wuyo_active_user_mask';

const FRIEND_KEY =
    'wuyo_friends';

const FRIEND_REQUEST_KEY =
    'wuyo_friend_requests';

const MOMENTS_KEY =
    'wuyo_moments';

const MOMENT_COMMENTS_KEY =
    'wuyo_moment_comments';

const MOMENT_LIKES_KEY =
    'wuyo_moment_likes';

const WALLET_KEY =
    'wuyo_wallet';

const BANK_CARD_KEY =
    'wuyo_bank_cards';

const FAMILY_CARD_KEY =
    'wuyo_family_cards';

const BILL_KEY =
    'wuyo_bills';

const CHAT_SETTINGS_KEY =
    'wuyo_chat_settings';

const CHARACTER_ACTIVITY_KEY =
    'wuyo_character_activity';

const DIARY_KEY =
    'wuyo_diaries';

const THOUGHT_KEY =
    'wuyo_thoughts';

const MEMORY_KEY =
    'wuyo_memory_summary';

const BEAUTIFY_KEY =
    'wuyo_chat_beautify';

const WORLD_BOOK_KEY =
    'wuyo_world_books';

const ACCOUNT_KEY =
    'wuyo_accounts';

const ACTIVE_ACCOUNT_KEY =
    'wuyo_active_account';


/* =====================================================
   通用 Storage
   ===================================================== */

function storageGet(
    key,
    fallback
){

    try{

        const value =
            localStorage.getItem(key);

        if(
            value === null ||
            value === ''
        ){

            return fallback;

        }

        return JSON.parse(value);

    }
    catch(error){

        console.error(
            'Storage 读取失败:',
            key,
            error
        );

        return fallback;

    }

}


function storageSet(
    key,
    value
){

    try{

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    }
    catch(error){

        console.error(
            'Storage 保存失败:',
            key,
            error
        );

        return false;

    }

}


/* =====================================================
   ID
   ===================================================== */

function makeId(
    prefix
){

    return (
        prefix +
        '_' +
        Date.now() +
        '_' +
        Math.random()
            .toString(36)
            .slice(2,8)
    );

}


/* =====================================================
   User 面具
   ===================================================== */

function getUserMasks(){

    return storageGet(
        USER_MASK_KEY,
        []
    );

}


function saveUserMasks(
    masks
){

    storageSet(
        USER_MASK_KEY,
        masks
    );

}


function getActiveUserMask(){

    const id =
        localStorage.getItem(
            ACTIVE_USER_MASK_KEY
        );

    if(!id){

        return null;

    }

    return getUserMasks()
        .find(
            item =>
                item.id === id
        ) || null;

}


function setActiveUserMask(
    id
){

    if(id){

        localStorage.setItem(
            ACTIVE_USER_MASK_KEY,
            id
        );

    }
    else{

        localStorage.removeItem(
            ACTIVE_USER_MASK_KEY
        );

    }

}


/* =====================================================
   默认 User 面具
   ===================================================== */

function ensureDefaultUserMask(){

    let masks =
        getUserMasks();


    if(
        masks.length === 0
    ){

        const defaultMask = {

            id:
                makeId('user'),

            name:
                'User',

            nickname:
                'User',

            wechatId:
                'user',

            phone:
                '',

            idNumber:
                '',

            gender:
                '',

            signature:
                '',

            avatar:
                '',

            createdAt:
                Date.now()

        };


        masks.push(
            defaultMask
        );


        saveUserMasks(
            masks
        );


        setActiveUserMask(
            defaultMask.id
        );

    }


    if(
        !getActiveUserMask()
    ){

        setActiveUserMask(
            masks[0].id
        );

    }

}


ensureDefaultUserMask();


/* =====================================================
   当前 User 身份
   ===================================================== */

function getCurrentUser(){

    return (
        getActiveUserMask() || {

            id:'user',

            name:'User',

            nickname:'User',

            wechatId:'user',

            phone:'',

            idNumber:'',

            gender:'',

            signature:'',

            avatar:''

        }
    );

}


/* =====================================================
   好友系统
   ===================================================== */

function getFriends(){

    return storageGet(
        FRIEND_KEY,
        []
    );

}


function saveFriends(
    friends
){

    storageSet(
        FRIEND_KEY,
        friends
    );

}


function getFriendRequests(){

    return storageGet(
        FRIEND_REQUEST_KEY,
        []
    );

}


function saveFriendRequests(
    requests
){

    storageSet(
        FRIEND_REQUEST_KEY,
        requests
    );

}


/* =====================================================
   判断好友
   ===================================================== */

function isFriend(
    characterId
){

    return getFriends()
        .some(
            item =>
                item.characterId ===
                characterId
        );

}


/* =====================================================
   添加好友
   ===================================================== */

function addFriend(
    character
){

    if(!character){

        return false;

    }


    if(
        isFriend(
            character.id
        )
    ){

        return false;

    }


    const friends =
        getFriends();


    friends.push({

        id:
            makeId('friend'),

        characterId:
            character.id,

        name:
            character.name,

        nickname:
            character.nickname ||
            character.name,

        wechatId:
            character.wechatId ||
            '',

        phone:
            character.phone ||
            '',

        avatar:
            character.avatar ||
            '',

        addedAt:
            Date.now()

    });


    saveFriends(
        friends
    );


    return true;

}


/* =====================================================
   删除好友
   ===================================================== */

function removeFriend(
    characterId
){

    const friends =
        getFriends()
            .filter(
                item =>
                    item.characterId !==
                    characterId
            );


    saveFriends(
        friends
    );

}


/* =====================================================
   好友申请
   ===================================================== */

function createFriendRequest(
    character,
    question
){

    if(!character){

        return null;

    }


    const requests =
        getFriendRequests();


    const request = {

        id:
            makeId('request'),

        characterId:
            character.id,

        characterName:
            character.name,

        characterAvatar:
            character.avatar ||
            '',

        question:
            question ||
            '',

        status:
            'pending',

        createdAt:
            Date.now()

    };


    requests.push(
        request
    );


    saveFriendRequests(
        requests
    );


    return request;

}


/* =====================================================
   角色资料标准化
   ===================================================== */

function normalizeCharacter(
    character
){

    if(!character){

        return character;

    }


    /*
     * 保证角色具有完整的
     * 社交资料字段
     */

    if(
        !character.nickname
    ){

        character.nickname =
            character.name ||
            '';

    }


    if(
        !character.wechatId
    ){

        character.wechatId =
            '';

    }


    if(
        !character.phone
    ){

        character.phone =
            '';

    }


    if(
        !character.idNumber
    ){

        character.idNumber =
            '';

    }


    if(
        !character.signature
    ){

        character.signature =
            '';

    }


    if(
        !character.gender
    ){

        character.gender =
            '';

    }


    /*
     * 角色主页
     */

    if(
        !character.profile
    ){

        character.profile = {

            bio:
                character.persona ||
                '',

            location:
                '',

            birthday:
                '',

            school:
                '',

            company:
                '',

            hobbies:
                ''

        };

    }


    /*
     * 功能开关
     */

    if(
        !character.features
    ){

        character.features = {};

    }


    return character;

}


/* =====================================================
   自动修复旧角色
   ===================================================== */

function normalizeAllCharacters(){

    const characters =
        getChars();


    let changed =
        false;


    const result =
        characters.map(
            character => {

                const before =
                    JSON.stringify(
                        character
                    );


                const normalized =
                    normalizeCharacter(
                        character
                    );


                const after =
                    JSON.stringify(
                        normalized
                    );


                if(
                    before !== after
                ){

                    changed =
                        true;

                }


                return normalized;

            }
        );


    if(changed){

        saveChars(
            result
        );

    }


    return result;

}


normalizeAllCharacters();


/* =====================================================
   扩展角色资料编辑器
   ===================================================== */

function ensureCharacterExtraFields(){

    const panel =
        document.querySelector(
            '.character-panel'
        );


    if(!panel){

        return;

    }


    /*
     * 防止重复创建
     */

    if(
        panel.querySelector(
            '#character-extra-fields'
        )
    ){

        return;

    }


    const saveButton =
        panel.querySelector(
            '#char-save'
        );


    const extra =
        document.createElement(
            'div'
        );


    extra.id =
        'character-extra-fields';


    extra.innerHTML = `

        <div class="character-field">

            <label>
                微信号
            </label>

            <input
                id="char-wechat-id"
                type="text"
                placeholder="角色微信号"
            >

        </div>


        <div class="character-field">

            <label>
                手机号
            </label>

            <input
                id="char-phone"
                type="text"
                placeholder="角色手机号"
            >

        </div>


        <div class="character-field">

            <label>
                昵称
            </label>

            <input
                id="char-nickname"
                type="text"
                placeholder="微信昵称"
            >

        </div>


        <div class="character-field">

            <label>
                身份证号
            </label>

            <input
                id="char-id-number"
                type="text"
                placeholder="角色身份证号"
            >

        </div>


        <div class="character-field">

            <label>
                性别
            </label>

            <input
                id="char-gender"
                type="text"
                placeholder="例如：男 / 女 / 其他"
            >

        </div>


        <div class="character-field">

            <label>
                个性签名
            </label>

            <input
                id="char-signature"
                type="text"
                placeholder="角色微信个性签名"
            >

        </div>


        <div class="character-field">

            <label>
                所在位置
            </label>

            <input
                id="char-location"
                type="text"
                placeholder="例如：东京"
            >

        </div>


        <div class="character-field">

            <label>
                主页简介
            </label>

            <textarea
                id="char-profile-bio"
                placeholder="角色主页简介"
            ></textarea>

        </div>


        <div class="character-field">

            <label>
                生日
            </label>

            <input
                id="char-birthday"
                type="text"
                placeholder="例如：2002-08-12"
            >

        </div>


        <div class="character-field">

            <label>
                学校
            </label>

            <input
                id="char-school"
                type="text"
                placeholder="角色就读学校"
            >

        </div>


        <div class="character-field">

            <label>
                工作单位
            </label>

            <input
                id="char-company"
                type="text"
                placeholder="角色工作单位"
            >

        </div>


        <div class="character-field">

            <label>
                兴趣爱好
            </label>

            <textarea
                id="char-hobbies"
                placeholder="角色兴趣爱好"
            ></textarea>

        </div>

    `;


    if(saveButton){

        saveButton.before(
            extra
        );

    }
    else{

        panel.appendChild(
            extra
        );

    }

}


/*
 * 延迟执行，
 * 确保旧角色弹窗已经存在
 */

setTimeout(
    ensureCharacterExtraFields,
    0
);


/* =====================================================
   扩展打开编辑角色
   ===================================================== */

const originalOpenEditor =
    typeof openEditor ===
    'function'
        ? openEditor
        : null;


/*
 * 使用包装函数，
 * 不破坏原来的角色编辑功能
 */

if(originalOpenEditor){

    window.wuyoOriginalOpenEditor =
        originalOpenEditor;

}


/* =====================================================
   填充扩展字段
   ===================================================== */

function fillCharacterExtraFields(
    character
){

    ensureCharacterExtraFields();


    const profile =
        character?.profile ||
        {};


    const set =
        function(
            id,
            value
        ){

            const el =
                $(id);

            if(el){

                el.value =
                    value || '';

            }

        };


    set(
        'char-wechat-id',
        character?.wechatId
    );


    set(
        'char-phone',
        character?.phone
    );


    set(
        'char-nickname',
        character?.nickname
    );


    set(
        'char-id-number',
        character?.idNumber
    );


    set(
        'char-gender',
        character?.gender
    );


    set(
        'char-signature',
        character?.signature
    );


    set(
        'char-location',
        profile.location
    );


    set(
        'char-profile-bio',
        profile.bio
    );


    set(
        'char-birthday',
        profile.birthday
    );


    set(
        'char-school',
        profile.school
    );


    set(
        'char-company',
        profile.company
    );


    set(
        'char-hobbies',
        profile.hobbies
    );

}


/* =====================================================
   覆盖保存按钮
   ===================================================== */

const oldSaveButton =
    $('char-save');


if(oldSaveButton){

    oldSaveButton.addEventListener(
        'click',
        function(){

            /*
             * 等待原保存逻辑完成
             */

            setTimeout(
                function(){

                    const name =
                        $('char-name')?.value
                            ?.trim();


                    if(!name){

                        return;

                    }


                    let characters =
                        getChars();


                    const index =
                        characters.findIndex(
                            item =>
                                item.name ===
                                name
                        );


                    if(index < 0){

                        return;

                    }


                    const character =
                        normalizeCharacter(
                            characters[index]
                        );


                    character.wechatId =
                        $('char-wechat-id')
                            ?.value
                            ?.trim() ||
                        '';


                    character.phone =
                        $('char-phone')
                            ?.value
                            ?.trim() ||
                        '';


                    character.nickname =
                        $('char-nickname')
                            ?.value
                            ?.trim() ||
                        character.name;


                    character.idNumber =
                        $('char-id-number')
                            ?.value
                            ?.trim() ||
                        '';


                    character.gender =
                        $('char-gender')
                            ?.value
                            ?.trim() ||
                        '';


                    character.signature =
                        $('char-signature')
                            ?.value
                            ?.trim() ||
                        '';


                    character.profile = {

                        bio:
                            $('char-profile-bio')
                                ?.value
                                ?.trim() ||
                            character.persona ||
                            '',

                        location:
                            $('char-location')
                                ?.value
                                ?.trim() ||
                            '',

                        birthday:
                            $('char-birthday')
                                ?.value
                                ?.trim() ||
                            '',

                        school:
                            $('char-school')
                                ?.value
                                ?.trim() ||
                            '',

                        company:
                            $('char-company')
                                ?.value
                                ?.trim() ||
                            '',

                        hobbies:
                            $('char-hobbies')
                                ?.value
                                ?.trim() ||
                            ''

                    };


                    characters[index] =
                        character;


                    saveChars(
                        characters
                    );


                    renderContacts();

                    renderChats();

                },
                50
            );

        }
    );

}


/* =====================================================
   扩展创建角色时的默认字段
   ===================================================== */

document.addEventListener(
    'click',
    function(event){

        const target =
            event.target;


        if(
            target &&
            (
                target.id ===
                'chat-add-btn' ||

                target.id ===
                'contact-add-btn' ||

                target.id ===
                'character-add-item' ||

                target.id ===
                'character-add-empty'
            )
        ){

            setTimeout(
                function(){

                    ensureCharacterExtraFields();

                    fillCharacterExtraFields(
                        {}
                    );

                },
                50
            );

        }

    }
);


/* =====================================================
   编辑按钮监听
   ===================================================== */

container.addEventListener(
    'click',
    function(event){

        const edit =
            event.target.closest(
                '[data-edit]'
            );


        if(!edit){

            return;

        }


        const id =
            edit.dataset.edit;


        setTimeout(
            function(){

                const character =
                    getChars().find(
                        item =>
                            item.id === id
                    );


                if(character){

                    ensureCharacterExtraFields();

                    fillCharacterExtraFields(
                        character
                    );

                }

            },
            50
        );

    }
);


/* =====================================================
   创建好友入口
   ===================================================== */

function openAddFriendPanel(){

    let mask =
        document.getElementById(
            'wuyo-add-friend-panel'
        );


    if(mask){

        mask.style.display =
            'flex';

        return;

    }


    mask =
        document.createElement(
            'div'
        );


    mask.id =
        'wuyo-add-friend-panel';


    mask.style.cssText = `
        position:absolute;
        inset:0;
        z-index:10000;
        display:flex;
        align-items:flex-end;
        background:rgba(0,0,0,.32);
    `;


    mask.innerHTML = `

        <div
            style="
                width:100%;
                max-height:90%;
                overflow-y:auto;
                background:#f7f7f7;
                border-radius:24px 24px 0 0;
                padding:18px;
            "
        >

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    margin-bottom:16px;
                "
            >

                <strong
                    style="
                        font-size:20px;
                    "
                >
                    添加好友
                </strong>

                <button
                    id="wuyo-add-friend-close"
                    type="button"
                    style="
                        width:34px;
                        height:34px;
                        border:0;
                        border-radius:50%;
                        background:#e8e8e8;
                        font-size:20px;
                    "
                >
                    ×
                </button>

            </div>


            <input
                id="wuyo-friend-search"
                type="text"
                placeholder="搜索角色姓名、微信号或手机号"
                style="
                    width:100%;
                    border:0;
                    outline:none;
                    background:#fff;
                    border-radius:14px;
                    padding:12px;
                    margin-bottom:12px;
                    font-size:15px;
                "
            >


            <div
                id="wuyo-friend-results"
            ></div>

        </div>

    `;


    container.appendChild(
        mask
    );


    function renderResults(){

        const keyword =
            $('wuyo-friend-search')
                ?.value
                ?.trim()
                ?.toLowerCase() ||
            '';


        const characters =
            getChars()
                .filter(
                    character => {

                        if(
                            !keyword
                        ){

                            return true;

                        }


                        return (

                            String(
                                character.name ||
                                ''
                            )
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                            ||

                            String(
                                character.nickname ||
                                ''
                            )
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                            ||

                            String(
                                character.wechatId ||
                                ''
                            )
                            .toLowerCase()
                            .includes(
                                keyword
                            )

                            ||

                            String(
                                character.phone ||
                                ''
                            )
                            .includes(
                                keyword
                            )

                        );

                    }
                );


        const result =
            $('wuyo-friend-results');


        if(!result){

            return;

        }


        if(
            characters.length === 0
        ){

            result.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px;
                        color:#999;
                    "
                >
                    没有找到角色
                </div>

            `;

            return;

        }


        result.innerHTML =
            characters.map(
                character => {

                    const already =
                        isFriend(
                            character.id
                        );


                    return `

                        <div
                            data-friend-id="${character.id}"
                            style="
                                display:flex;
                                align-items:center;
                                gap:12px;
                                padding:12px;
                                background:#fff;
                                border-radius:16px;
                                margin-bottom:8px;
                            "
                        >

                            <div
                                style="
                                    width:52px;
                                    height:52px;
                                    flex:none;
                                    border-radius:15px;
                                    background:#ddd;
                                    background-size:cover;
                                    background-position:center;
                                    ${
                                        character.avatar
                                            ? `background-image:url("${character.avatar}");`
                                            : ''
                                    }
                                "
                            ></div>

                            <div
                                style="
                                    flex:1;
                                    min-width:0;
                                "
                            >

                                <div
                                    style="
                                        font-weight:600;
                                    "
                                >
                                    ${esc(
                                        character.nickname ||
                                        character.name
                                    )}
                                </div>

                                <div
                                    style="
                                        margin-top:4px;
                                        font-size:12px;
                                        color:#999;
                                    "
                                >
                                    ${
                                        character.wechatId
                                            ? '微信号：' +
                                              esc(
                                                  character.wechatId
                                              )
                                            : '暂无微信号'
                                    }
                                </div>

                            </div>

                            <button
                                class="wuyo-add-friend-action"
                                data-friend-character="${character.id}"
                                type="button"
                                style="
                                    border:0;
                                    border-radius:10px;
                                    padding:8px 11px;
                                    background:#222;
                                    color:#fff;
                                "
                            >
                                ${
                                    already
                                        ? '已添加'
                                        : '添加'
                                }
                            </button>

                        </div>

                    `;

                }
            ).join('');


        result
            .querySelectorAll(
                '.wuyo-add-friend-action'
            )
            .forEach(
                button => {

                    button.onclick =
                        function(event){

                            event.preventDefault();

                            event.stopPropagation();


                            const character =
                                getChars().find(
                                    item =>
                                        item.id ===
                                        button.dataset.friendCharacter
                                );


                            if(!character){

                                return;

                            }


                            if(
                                isFriend(
                                    character.id
                                )
                            ){

                                return;

                            }


                            addFriend(
                                character
                            );


                            button.textContent =
                                '已添加';


                            button.disabled =
                                true;


                            renderContacts();

                        };

                }
            );

    }


    $('wuyo-add-friend-close')
        .onclick =
        function(){

            mask.style.display =
                'none';

        };


    mask.onclick =
        function(event){

            if(
                event.target ===
                mask
            ){

                mask.style.display =
                    'none';

            }

        };


    $('wuyo-friend-search')
        .addEventListener(
            'input',
            renderResults
        );


    renderResults();

}


/* =====================================================
   联系人右上角添加好友
   ===================================================== */

const contactAdd =
    document.getElementById(
        'contact-add-btn'
    );


if(contactAdd){

    /*
     * 保留原本创建角色功能，
     * 这里改为弹出选择：
     * 创建角色 / 添加好友
     */

    contactAdd.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();


            let menu =
                document.getElementById(
                    'wuyo-contact-add-menu'
                );


            if(menu){

                menu.remove();

            }


            menu =
                document.createElement(
                    'div'
                );


            menu.id =
                'wuyo-contact-add-menu';


            menu.style.cssText = `
                position:absolute;
                top:55px;
                right:12px;
                z-index:9000;
                background:#fff;
                border-radius:15px;
                padding:6px;
                box-shadow:0 8px 30px rgba(0,0,0,.15);
                min-width:150px;
            `;


            menu.innerHTML = `

                <button
                    id="wuyo-menu-add-character"
                    type="button"
                    style="
                        display:block;
                        width:100%;
                        border:0;
                        background:transparent;
                        padding:11px;
                        text-align:left;
                        border-radius:10px;
                    "
                >
                    创建角色
                </button>

                <button
                    id="wuyo-menu-add-friend"
                    type="button"
                    style="
                        display:block;
                        width:100%;
                        border:0;
                        background:transparent;
                        padding:11px;
                        text-align:left;
                        border-radius:10px;
                    "
                >
                    添加好友
                </button>

            `;


            const header =
                document.querySelector(
                    '#chat-tab-contacts .chat-header'
                );


            if(header){

                header.appendChild(
                    menu
                );

            }
            else{

                container.appendChild(
                    menu
                );

            }


            $('wuyo-menu-add-character')
                .onclick =
                function(){

                    menu.remove();

                    if(
                        typeof openEditor ===
                        'function'
                    ){

                        openEditor();

                    }

                };


            $('wuyo-menu-add-friend')
                .onclick =
                function(){

                    menu.remove();

                    openAddFriendPanel();

                };

        };

}


/* =====================================================
   角色朋友圈基础数据
   ===================================================== */

function getMoments(){

    return storageGet(
        MOMENTS_KEY,
        []
    );

}


function saveMoments(
    moments
){

    storageSet(
        MOMENTS_KEY,
        moments
    );

}


function getMomentComments(){

    return storageGet(
        MOMENT_COMMENTS_KEY,
        {}
    );

}


function saveMomentComments(
    comments
){

    storageSet(
        MOMENT_COMMENTS_KEY,
        comments
    );

}


function getMomentLikes(){

    return storageGet(
        MOMENT_LIKES_KEY,
        {}
    );

}


function saveMomentLikes(
    likes
){

    storageSet(
        MOMENT_LIKES_KEY,
        likes
    );

}


/* =====================================================
   默认钱包
   ===================================================== */

function getWallet(){

    return storageGet(
        WALLET_KEY,
        {

            balance:0,

            totalExpense:0,

            currency:'CNY'

        }
    );

}


function saveWallet(
    wallet
){

    storageSet(
        WALLET_KEY,
        wallet
    );

}


/* =====================================================
   默认账单
   ===================================================== */

function getBills(){

    return storageGet(
        BILL_KEY,
        []
    );

}


function saveBills(
    bills
){

    storageSet(
        BILL_KEY,
        bills
    );

}


/* =====================================================
   银行卡
   ===================================================== */

function getBankCards(){

    return storageGet(
        BANK_CARD_KEY,
        []
    );

}


function saveBankCards(
    cards
){

    storageSet(
        BANK_CARD_KEY,
        cards
    );

}


/* =====================================================
   亲属卡
   ===================================================== */

function getFamilyCards(){

    return storageGet(
        FAMILY_CARD_KEY,
        []
    );

}


function saveFamilyCards(
    cards
){

    storageSet(
        FAMILY_CARD_KEY,
        cards
    );

}


/* =====================================================
   聊天设置
   ===================================================== */

function getChatSettings(
    characterId
){

    const all =
        storageGet(
            CHAT_SETTINGS_KEY,
            {}
        );


    if(
        !all[characterId]
    ){

        all[characterId] = {

            timeAwareness:
                false,

            remoteMode:
                false,

            activeMessages:
                false,

            activeInterval:
                60,

            activeIntervalUnit:
                'minutes',

            minReply:
                1,

            maxReply:
                3,

            freeActivity:
                false,

            diaryPush:
                false,

            thoughtView:
                true,

            npcMoments:
                true,

            autoAddFriends:
                false,

            reversePhone:
                false,

            offlineInvite:
                false,

            autoTranslate:
                false,

            translateLanguages:
                [],

            voice:
                false,

            voiceFrequency:
                20,

            offlineMode:
                false,

            offlineReturnProbability:
                70,

            customDate:
                0,

            avatarUser:
                true,

            avatarCharacter:
                true,

            bubbleCss:
                '',

            chatBackground:
                '',

            memoryRounds:
                20,

            memorySummaries:
                [],

            worldBooks:
                []

        };


        storageSet(
            CHAT_SETTINGS_KEY,
            all
        );

    }


    return all[characterId];

}


function saveChatSettings(
    characterId,
    settings
){

    const all =
        storageGet(
            CHAT_SETTINGS_KEY,
            {}
        );


    all[characterId] =
        settings;


    storageSet(
        CHAT_SETTINGS_KEY,
        all
    );

}


/* =====================================================
   角色活动
   ===================================================== */

function getActivities(
    characterId
){

    const all =
        storageGet(
            CHARACTER_ACTIVITY_KEY,
            {}
        );


    return all[characterId] || [];

}


function saveActivities(
    characterId,
    activities
){

    const all =
        storageGet(
            CHARACTER_ACTIVITY_KEY,
            {}
        );


    all[characterId] =
        activities;


    storageSet(
        CHARACTER_ACTIVITY_KEY,
        all
    );

}


/* =====================================================
   日记
   ===================================================== */

function getDiaries(
    characterId
){

    const all =
        storageGet(
            DIARY_KEY,
            {}
        );


    return all[characterId] || [];

}


function saveDiaries(
    characterId,
    diaries
){

    const all =
        storageGet(
            DIARY_KEY,
            {}
        );


    all[characterId] =
        diaries;


    storageSet(
        DIARY_KEY,
        all
    );

}


/* =====================================================
   心思
   ===================================================== */

function getThoughts(
    characterId
){

    const all =
        storageGet(
            THOUGHT_KEY,
            {}
        );


    return all[characterId] || [];

}


function saveThoughts(
    characterId,
    thoughts
){

    const all =
        storageGet(
            THOUGHT_KEY,
            {}
        );


    all[characterId] =
        thoughts;


    storageSet(
        THOUGHT_KEY,
        all
    );

}


/* =====================================================
   记忆总结
   ===================================================== */

function getMemorySummaries(
    characterId
){

    const all =
        storageGet(
            MEMORY_KEY,
            {}
        );


    return all[characterId] || [];

}


function saveMemorySummaries(
    characterId,
    summaries
){

    const all =
        storageGet(
            MEMORY_KEY,
            {}
        );


    all[characterId] =
        summaries;


    storageSet(
        MEMORY_KEY,
        all
    );

}


/* =====================================================
   世界书
   ===================================================== */

function getWorldBooks(){

    return storageGet(
        WORLD_BOOK_KEY,
        []
    );

}


function saveWorldBooks(
    books
){

    storageSet(
        WORLD_BOOK_KEY,
        books
    );

}


/* =====================================================
   美化
   ===================================================== */

function getBeautify(){

    return storageGet(
        BEAUTIFY_KEY,
        {

            bubbleCss:'',
            background:'',
            userBubble:'',
            characterBubble:''

        }
    );

}


function saveBeautify(
    data
){

    storageSet(
        BEAUTIFY_KEY,
        data
    );

}


/* =====================================================
   大小号
   ===================================================== */

function getAccounts(){

    return storageGet(
        ACCOUNT_KEY,
        []
    );

}


function saveAccounts(
    accounts
){

    storageSet(
        ACCOUNT_KEY,
        accounts
    );

}


function getActiveAccount(){

    const id =
        localStorage.getItem(
            ACTIVE_ACCOUNT_KEY
        );


    if(!id){

        return null;

    }


    return getAccounts()
        .find(
            account =>
                account.id === id
        ) || null;

}


function setActiveAccount(
    id
){

    if(id){

        localStorage.setItem(
            ACTIVE_ACCOUNT_KEY,
            id
        );

    }

    else{

        localStorage.removeItem(
            ACTIVE_ACCOUNT_KEY
        );

    }

}


/* =====================================================
   初始化账户
   ===================================================== */

function ensureAccounts(){

    let accounts =
        getAccounts();


    if(
        accounts.length === 0
    ){

        const mainAccount = {

            id:
                makeId('account'),

            name:
                '大号',

            maskId:
                getActiveUserMask()?.id ||
                null,

            createdAt:
                Date.now()

        };


        accounts.push(
            mainAccount
        );


        saveAccounts(
            accounts
        );


        setActiveAccount(
            mainAccount.id
        );

    }


    if(
        !getActiveAccount()
    ){

        setActiveAccount(
            accounts[0].id
        );

    }

}


ensureAccounts();


/* =====================================================
   给旧角色补齐资料
   ===================================================== */

(function(){

    const characters =
        getChars();


    let changed =
        false;


    characters.forEach(
        character => {

            const before =
                JSON.stringify(
                    character
                );


            normalizeCharacter(
                character
            );


            const after =
                JSON.stringify(
                    character
                );


            if(
                before !== after
            ){

                changed =
                    true;

            }

        }
    );


    if(changed){

        saveChars(
            characters
        );

    }

})();


/* =====================================================
   全局暴露
   后续 Part 使用
   ===================================================== */

window.wuyoChatSystem = {

    getUserMasks,
    saveUserMasks,

    getCurrentUser,
    getActiveUserMask,
    setActiveUserMask,

    getFriends,
    saveFriends,
    addFriend,
    removeFriend,
    isFriend,

    getFriendRequests,
    saveFriendRequests,
    createFriendRequest,

    getMoments,
    saveMoments,

    getMomentComments,
    saveMomentComments,

    getMomentLikes,
    saveMomentLikes,

    getWallet,
    saveWallet,

    getBills,
    saveBills,

    getBankCards,
    saveBankCards,

    getFamilyCards,
    saveFamilyCards,

    getChatSettings,
    saveChatSettings,

    getActivities,
    saveActivities,

    getDiaries,
    saveDiaries,

    getThoughts,
    saveThoughts,

    getMemorySummaries,
    saveMemorySummaries,

    getWorldBooks,
    saveWorldBooks,

    getBeautify,
    saveBeautify,

    getAccounts,
    saveAccounts,

    getActiveAccount,
    setActiveAccount,

    normalizeCharacter,

    makeId

};


/* =====================================================
   第 3 段结束
   ===================================================== */

/* =====================================================
   第 4 段
   Chat 房间高级设置
   从第 3 段结束位置继续
   ===================================================== */


/* =====================================================
   工具：创建元素
   ===================================================== */

function wuyoCreateElement(tag, className, html){

    const el =
        document.createElement(tag);

    if(className){
        el.className =
            className;
    }

    if(html !== undefined){
        el.innerHTML =
            html;
    }

    return el;
}


/* =====================================================
   工具：获取当前角色
   ===================================================== */

function wuyoGetCurrentCharacter(){

    if(
        typeof currentCharacter !== 'undefined' &&
        currentCharacter
    ){

        return currentCharacter;

    }

    if(
        typeof currentContact !== 'undefined' &&
        currentContact
    ){

        return getChars().find(
            character =>
                character.name ===
                currentContact
        ) || null;

    }

    return null;

}


/* =====================================================
   角色资料标准化
   ===================================================== */

function wuyoEnsureCharacter(character){

    if(!character){

        return null;

    }

    const chars =
        getChars();

    const index =
        chars.findIndex(
            item =>
                item.id ===
                character.id
        );

    if(index < 0){

        return character;

    }

    const normalized =
        normalizeCharacter(
            chars[index]
        );

    chars[index] =
        normalized;

    saveChars(
        chars
    );

    return normalized;

}


/* =====================================================
   高级设置样式
   ===================================================== */

const wuyoAdvancedStyle =
    document.createElement('style');

wuyoAdvancedStyle.textContent = `

/* =================================================
   三点按钮
   ================================================= */

.chat-room-more-btn{

    width:36px;

    height:36px;

    border:0;

    background:transparent;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    color:#222;

    padding:0;

}

.chat-room-more-btn:active{

    background:#e9e9e9;

}


/* =================================================
   高级设置遮罩
   ================================================= */

.wuyo-chat-settings-mask{

    position:absolute;

    inset:0;

    z-index:500;

    background:rgba(0,0,0,.25);

    display:none;

    align-items:flex-end;

    overflow:hidden;

}


/* =================================================
   设置面板
   ================================================= */

.wuyo-chat-settings-panel{

    width:100%;

    max-height:92%;

    background:#f5f5f5;

    border-radius:24px 24px 0 0;

    overflow-y:auto;

    overflow-x:hidden;

    padding:18px;

    box-sizing:border-box;

    -webkit-overflow-scrolling:touch;

}


/* =================================================
   设置顶部
   ================================================= */

.wuyo-settings-head{

    display:flex;

    align-items:center;

    justify-content:space-between;

    margin-bottom:18px;

}

.wuyo-settings-title{

    font-size:20px;

    font-weight:700;

    color:#222;

}

.wuyo-settings-close{

    width:34px;

    height:34px;

    border:0;

    border-radius:50%;

    background:#e7e7e7;

    color:#333;

    font-size:20px;

}


/* =================================================
   角色主页入口
   ================================================= */

.wuyo-character-home-button{

    width:100%;

    border:0;

    background:#fff;

    border-radius:16px;

    padding:14px;

    display:flex;

    align-items:center;

    gap:12px;

    margin-bottom:10px;

    text-align:left;

}

.wuyo-character-home-avatar{

    width:48px;

    height:48px;

    border-radius:15px;

    background:#ddd;

    background-position:center;

    background-size:cover;

    background-repeat:no-repeat;

    flex:none;

}

.wuyo-character-home-info{

    flex:1;

    min-width:0;

}

.wuyo-character-home-name{

    font-size:15px;

    font-weight:650;

    color:#222;

}

.wuyo-character-home-sub{

    font-size:12px;

    color:#999;

    margin-top:4px;

}


/* =================================================
   设置分组
   ================================================= */

.wuyo-setting-section{

    margin-top:16px;

}

.wuyo-setting-section-title{

    font-size:12px;

    color:#888;

    margin:0 0 7px 6px;

}


/* =================================================
   设置组
   ================================================= */

.wuyo-setting-group{

    background:#fff;

    border-radius:17px;

    overflow:hidden;

}


/* =================================================
   设置项目
   ================================================= */

.wuyo-setting-item{

    min-height:52px;

    display:flex;

    align-items:center;

    gap:11px;

    padding:10px 14px;

    box-sizing:border-box;

    border-bottom:1px solid #eeeeee;

}

.wuyo-setting-item:last-child{

    border-bottom:0;

}

.wuyo-setting-item-main{

    flex:1;

    min-width:0;

}

.wuyo-setting-item-title{

    font-size:14px;

    color:#222;

}

.wuyo-setting-item-desc{

    font-size:11px;

    color:#999;

    margin-top:3px;

    line-height:1.4;

}


/* =================================================
   开关
   ================================================= */

.wuyo-switch{

    width:46px;

    height:27px;

    border:0;

    border-radius:20px;

    background:#d8d8d8;

    position:relative;

    flex:none;

    padding:0;

}

.wuyo-switch::after{

    content:"";

    position:absolute;

    width:23px;

    height:23px;

    border-radius:50%;

    background:#fff;

    left:2px;

    top:2px;

    box-shadow:0 1px 3px rgba(0,0,0,.15);

    transition:.18s;

}

.wuyo-switch.active{

    background:#222;

}

.wuyo-switch.active::after{

    left:21px;

}


/* =================================================
   输入框
   ================================================= */

.wuyo-setting-input{

    width:100%;

    min-height:42px;

    border:0;

    outline:none;

    border-radius:12px;

    background:#f4f4f4;

    padding:10px 12px;

    box-sizing:border-box;

    color:#222;

    font-size:14px;

}


/* =================================================
   多行输入
   ================================================= */

.wuyo-setting-textarea{

    width:100%;

    min-height:86px;

    resize:none;

    border:0;

    outline:none;

    border-radius:12px;

    background:#f4f4f4;

    padding:11px 12px;

    box-sizing:border-box;

    color:#222;

    font-size:14px;

    line-height:1.5;

}


/* =================================================
   数字设置
   ================================================= */

.wuyo-number-row{

    display:flex;

    align-items:center;

    gap:8px;

}

.wuyo-number-row .wuyo-setting-input{

    flex:1;

}

.wuyo-unit{

    color:#888;

    font-size:12px;

    flex:none;

}


/* =================================================
   设置按钮
   ================================================= */

.wuyo-setting-action{

    width:100%;

    border:0;

    background:#fff;

    min-height:52px;

    padding:12px 14px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    text-align:left;

    color:#222;

    font-size:14px;

}

.wuyo-setting-action + 
.wuyo-setting-action{

    border-top:1px solid #eee;

}


/* =================================================
   危险按钮
   ================================================= */

.wuyo-danger-action{

    color:#c44;

}


/* =================================================
   设置详情页
   ================================================= */

.wuyo-sub-panel{

    display:none;

}

.wuyo-sub-panel.active{

    display:block;

}


/* =================================================
   顶部返回
   ================================================= */

.wuyo-sub-head{

    display:flex;

    align-items:center;

    gap:8px;

    margin-bottom:16px;

}

.wuyo-sub-back{

    width:34px;

    height:34px;

    border:0;

    border-radius:50%;

    background:#e7e7e7;

    display:flex;

    align-items:center;

    justify-content:center;

}

.wuyo-sub-title{

    font-size:18px;

    font-weight:700;

    color:#222;

}


/* =================================================
   角色主页
   ================================================= */

.wuyo-character-profile{

    display:none;

    position:absolute;

    inset:0;

    z-index:600;

    background:#f5f5f5;

    overflow-y:auto;

}

.wuyo-character-profile.active{

    display:block;

}

.wuyo-profile-cover{

    height:190px;

    background:#ddd;

    background-size:cover;

    background-position:center;

}

.wuyo-profile-content{

    margin-top:-35px;

    position:relative;

    padding:0 18px 30px;

}

.wuyo-profile-avatar{

    width:76px;

    height:76px;

    border-radius:22px;

    border:4px solid #f5f5f5;

    background:#ddd;

    background-size:cover;

    background-position:center;

}

.wuyo-profile-name{

    margin-top:10px;

    font-size:21px;

    font-weight:700;

    color:#222;

}

.wuyo-profile-note{

    margin-top:4px;

    color:#888;

    font-size:13px;

}

.wuyo-profile-card{

    background:#fff;

    border-radius:17px;

    margin-top:16px;

    padding:15px;

}

.wuyo-profile-label{

    font-size:12px;

    color:#999;

    margin-bottom:6px;

}

.wuyo-profile-value{

    color:#222;

    font-size:14px;

    line-height:1.6;

    white-space:pre-wrap;

    overflow-wrap:anywhere;

}

`;


document.head.appendChild(
    wuyoAdvancedStyle
);


/* =====================================================
   给聊天顶部加入三个点
   ===================================================== */

const roomHeader =
    document.querySelector(
        '#chat-room-page .chat-room-header'
    );


if(roomHeader){

    let existing =
        roomHeader.querySelector(
            '#wuyo-chat-more-btn'
        );

    if(!existing){

        existing =
            document.createElement(
                'button'
            );

        existing.id =
            'wuyo-chat-more-btn';

        existing.type =
            'button';

        existing.className =
            'chat-room-more-btn';

        existing.innerHTML =
            '<i data-lucide="more-horizontal"></i>';

        roomHeader.appendChild(
            existing
        );

    }

}


/* =====================================================
   高级设置主结构
   ===================================================== */

let wuyoSettingsMask =
    document.getElementById(
        'wuyo-chat-settings-mask'
    );


if(!wuyoSettingsMask){

    wuyoSettingsMask =
        document.createElement('div');

    wuyoSettingsMask.id =
        'wuyo-chat-settings-mask';

    wuyoSettingsMask.className =
        'wuyo-chat-settings-mask';

    wuyoSettingsMask.innerHTML = `

        <div
            class="wuyo-chat-settings-panel"
            id="wuyo-chat-settings-panel"
        >

            <div
                class="wuyo-settings-head"
            >

                <div
                    class="wuyo-settings-title"
                >
                    聊天设置
                </div>

                <button
                    class="wuyo-settings-close"
                    id="wuyo-settings-close"
                    type="button"
                >
                    ×
                </button>

            </div>


            <!-- 角色主页 -->

            <button
                class="wuyo-character-home-button"
                id="wuyo-open-character-profile"
                type="button"
            >

                <div
                    class="wuyo-character-home-avatar"
                    id="wuyo-character-home-avatar"
                ></div>

                <div
                    class="wuyo-character-home-info"
                >

                    <div
                        class="wuyo-character-home-name"
                        id="wuyo-character-home-name"
                    >
                        角色主页
                    </div>

                    <div
                        class="wuyo-character-home-sub"
                        id="wuyo-character-home-sub"
                    >
                        查看角色资料
                    </div>

                </div>

                <i
                    data-lucide="chevron-right"
                ></i>

            </button>


            <!-- 备注 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    联系人
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <div
                        class="wuyo-setting-item"
                        style="display:block"
                    >

                        <div
                            class="wuyo-setting-item-title"
                            style="margin-bottom:8px"
                        >
                            备注
                        </div>

                        <input
                            class="wuyo-setting-input"
                            id="wuyo-character-note-input"
                            type="text"
                            placeholder="设置聊天联系人备注"
                        >

                    </div>

                </div>

            </div>


            <!-- 时间与世界 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    世界与时间
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                时间感知
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                使用真实 24 小时时间影响角色生活状态
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-time-toggle"
                            type="button"
                        ></button>

                    </div>


                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                异地模式
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                根据双方所在地生成当地时间与天气
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-location-toggle"
                            type="button"
                        ></button>

                    </div>

                </div>

            </div>


            <!-- 主动行为 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    主动行为
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                主动发消息
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                允许角色按照设定间隔主动联系
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-proactive-toggle"
                            type="button"
                        ></button>

                    </div>


                    <div
                        class="wuyo-setting-item"
                        style="display:block"
                    >

                        <div
                            class="wuyo-setting-item-title"
                        >
                            主动消息间隔
                        </div>

                        <div
                            class="wuyo-number-row"
                            style="margin-top:8px"
                        >

                            <input
                                class="wuyo-setting-input"
                                id="wuyo-proactive-min"
                                type="number"
                                min="1"
                                value="30"
                            >

                            <span
                                class="wuyo-unit"
                            >
                                最少分钟
                            </span>

                            <input
                                class="wuyo-setting-input"
                                id="wuyo-proactive-max"
                                type="number"
                                min="1"
                                value="120"
                            >

                            <span
                                class="wuyo-unit"
                            >
                                最多分钟
                            </span>

                        </div>

                    </div>


                    <div
                        class="wuyo-setting-item"
                        style="display:block"
                    >

                        <div
                            class="wuyo-setting-item-title"
                        >
                            回复气泡数量
                        </div>

                        <div
                            class="wuyo-number-row"
                            style="margin-top:8px"
                        >

                            <input
                                class="wuyo-setting-input"
                                id="wuyo-reply-min"
                                type="number"
                                min="1"
                                value="1"
                            >

                            <span
                                class="wuyo-unit"
                            >
                                最少
                            </span>

                            <input
                                class="wuyo-setting-input"
                                id="wuyo-reply-max"
                                type="number"
                                min="1"
                                value="3"
                            >

                            <span
                                class="wuyo-unit"
                            >
                                最多
                            </span>

                        </div>

                    </div>


                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                角色自由活动
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                允许角色自主进行朋友圈、日记、心思等活动
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-free-activity-toggle"
                            type="button"
                        ></button>

                    </div>

                </div>

            </div>


            <!-- 社交行为 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    社交行为
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                自动发朋友圈
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-auto-moment-toggle"
                            type="button"
                        ></button>

                    </div>


                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                自定义 NPC 评论
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                允许角色朋友圈出现自定义好友评论
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-npc-comment-toggle"
                            type="button"
                        ></button>

                    </div>


                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                自动添加好友
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                允许角色主动添加朋友、家人、同事等联系人
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-auto-friend-toggle"
                            type="button"
                        ></button>

                    </div>

                </div>

            </div>


            <!-- 翻译与语音 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    语言与语音
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                自动翻译
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                点击消息气泡后查看翻译
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-translate-toggle"
                            type="button"
                        ></button>

                    </div>


                    <div
                        class="wuyo-setting-item"
                    >

                        <div
                            class="wuyo-setting-item-main"
                        >

                            <div
                                class="wuyo-setting-item-title"
                            >
                                语音消息
                            </div>

                            <div
                                class="wuyo-setting-item-desc"
                            >
                                按照设定概率发送角色语音
                            </div>

                        </div>

                        <button
                            class="wuyo-switch"
                            id="wuyo-voice-toggle"
                            type="button"
                        ></button>

                    </div>

                </div>

            </div>


            <!-- 更多 -->

            <div
                class="wuyo-setting-section"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    更多功能
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <button
                        class="wuyo-setting-action"
                        id="wuyo-diary-open"
                        type="button"
                    >

                        <span>
                            日记推送与查看
                        </span>

                        <i data-lucide="chevron-right"></i>

                    </button>


                    <button
                        class="wuyo-setting-action"
                        id="wuyo-thought-open"
                        type="button"
                    >

                        <span>
                            心思查看
                        </span>

                        <i data-lucide="chevron-right"></i>

                    </button>


                    <button
                        class="wuyo-setting-action"
                        id="wuyo-worldbook-open"
                        type="button"
                    >

                        <span>
                            世界书
                        </span>

                        <i data-lucide="chevron-right"></i>

                    </button>


                    <button
                        class="wuyo-setting-action"
                        id="wuyo-memory-open"
                        type="button"
                    >

                        <span>
                            记忆总结
                        </span>

                        <i data-lucide="chevron-right"></i>

                    </button>


                    <button
                        class="wuyo-setting-action"
                        id="wuyo-beautify-open"
                        type="button"
                    >

                        <span>
                            聊天美化
                        </span>

                        <i data-lucide="chevron-right"></i>

                    </button>

                </div>

            </div>


            <!-- 底部危险操作 -->

            <div
                class="wuyo-setting-section"
                style="margin-bottom:20px"
            >

                <div
                    class="wuyo-setting-section-title"
                >
                    角色关系
                </div>

                <div
                    class="wuyo-setting-group"
                >

                    <button
                        class="wuyo-setting-action wuyo-danger-action"
                        id="wuyo-delete-character"
                        type="button"
                    >
                        删除角色
                    </button>

                    <button
                        class="wuyo-setting-action wuyo-danger-action"
                        id="wuyo-block-character"
                        type="button"
                    >
                        拉黑角色
                    </button>

                </div>

            </div>

        </div>

    `;

    container.appendChild(
        wuyoSettingsMask
    );

}


/* =====================================================
   三点按钮事件
   ===================================================== */

const wuyoMoreButton =
    document.getElementById(
        'wuyo-chat-more-btn'
    );


if(wuyoMoreButton){

    wuyoMoreButton.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            wuyoOpenChatSettings();

        };

}


/* =====================================================
   打开聊天设置
   ===================================================== */

function wuyoOpenChatSettings(){

    const character =
        wuyoGetCurrentCharacter();

    if(!character){

        return;

    }

    wuyoSyncChatSettings();

    wuyoUpdateCharacterHome();

    wuyoSettingsMask.style.display =
        'flex';

}


/* =====================================================
   关闭聊天设置
   ===================================================== */

const wuyoSettingsClose =
    document.getElementById(
        'wuyo-settings-close'
    );


if(wuyoSettingsClose){

    wuyoSettingsClose.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            wuyoSettingsMask.style.display =
                'none';

        };

}


wuyoSettingsMask.addEventListener(
    'click',
    function(event){

        if(
            event.target ===
            wuyoSettingsMask
        ){

            wuyoSettingsMask.style.display =
                'none';

        }

    }
);


/* =====================================================
   设置开关辅助函数
   ===================================================== */

function wuyoSetSwitch(id, value){

    const button =
        document.getElementById(id);

    if(!button){

        return;

    }

    button.classList.toggle(
        'active',
        !!value
    );

}


function wuyoReadSwitch(id){

    const button =
        document.getElementById(id);

    return !!(
        button &&
        button.classList.contains('active')
    );

}


/* =====================================================
   获取当前角色设置
   ===================================================== */

function wuyoCurrentSettings(){

    const character =
        wuyoGetCurrentCharacter();

    if(!character){

        return {};

    }

    const all =
        getChatSettings();

    return (
        all[character.id] ||
        all[character.name] ||
        {}
    );

}


/* =====================================================
   保存当前角色设置
   ===================================================== */

function wuyoSaveCurrentSettings(patch){

    const character =
        wuyoGetCurrentCharacter();

    if(!character){

        return;

    }

    const all =
        getChatSettings();

    const old =
        all[character.id] ||
        all[character.name] ||
        {};

    all[character.id] = {

        ...old,

        ...patch

    };

    if(
        character.name !==
        character.id
    ){

        delete all[character.name];

    }

    saveChatSettings(
        all
    );

}


/* =====================================================
   同步设置界面
   ===================================================== */

function wuyoSyncChatSettings(){

    const settings =
        wuyoCurrentSettings();

    wuyoSetSwitch(
        'wuyo-time-toggle',
        settings.timeAwareness
    );

    wuyoSetSwitch(
        'wuyo-location-toggle',
        settings.remoteMode
    );

    wuyoSetSwitch(
        'wuyo-proactive-toggle',
        settings.proactiveMessage
    );

    wuyoSetSwitch(
        'wuyo-free-activity-toggle',
        settings.freeActivity
    );

    wuyoSetSwitch(
        'wuyo-auto-moment-toggle',
        settings.autoMoments
    );

    wuyoSetSwitch(
        'wuyo-npc-comment-toggle',
        settings.npcComments
    );

    wuyoSetSwitch(
        'wuyo-auto-friend-toggle',
        settings.autoAddFriends
    );

    wuyoSetSwitch(
        'wuyo-translate-toggle',
        settings.translation
    );

    wuyoSetSwitch(
        'wuyo-voice-toggle',
        settings.voice
    );


    const proactiveMin =
        document.getElementById(
            'wuyo-proactive-min'
        );

    const proactiveMax =
        document.getElementById(
            'wuyo-proactive-max'
        );

    const replyMin =
        document.getElementById(
            'wuyo-reply-min'
        );

    const replyMax =
        document.getElementById(
            'wuyo-reply-max'
        );


    if(proactiveMin){

        proactiveMin.value =
            settings.proactiveMin ||
            30;

    }

    if(proactiveMax){

        proactiveMax.value =
            settings.proactiveMax ||
            120;

    }

    if(replyMin){

        replyMin.value =
            settings.replyMin ||
            1;

    }

    if(replyMax){

        replyMax.value =
            settings.replyMax ||
            3;

    }


    const noteInput =
        document.getElementById(
            'wuyo-character-note-input'
        );

    const character =
        wuyoGetCurrentCharacter();

    if(
        noteInput &&
        character
    ){

        noteInput.value =
            character.note || '';

    }

}


/* =====================================================
   绑定开关
   ===================================================== */

function wuyoBindSwitch(
    id,
    key
){

    const button =
        document.getElementById(id);

    if(!button){

        return;

    }

    button.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            const next =
                !button.classList.contains(
                    'active'
                );

            button.classList.toggle(
                'active',
                next
            );

            wuyoSaveCurrentSettings({

                [key]:
                    next

            });

        };

}


/* =====================================================
   开关绑定
   ===================================================== */

wuyoBindSwitch(
    'wuyo-time-toggle',
    'timeAwareness'
);

wuyoBindSwitch(
    'wuyo-location-toggle',
    'remoteMode'
);

wuyoBindSwitch(
    'wuyo-proactive-toggle',
    'proactiveMessage'
);

wuyoBindSwitch(
    'wuyo-free-activity-toggle',
    'freeActivity'
);

wuyoBindSwitch(
    'wuyo-auto-moment-toggle',
    'autoMoments'
);

wuyoBindSwitch(
    'wuyo-npc-comment-toggle',
    'npcComments'
);

wuyoBindSwitch(
    'wuyo-auto-friend-toggle',
    'autoAddFriends'
);

wuyoBindSwitch(
    'wuyo-translate-toggle',
    'translation'
);

wuyoBindSwitch(
    'wuyo-voice-toggle',
    'voice'
);


/* =====================================================
   主动消息参数
   ===================================================== */

[
    [
        'wuyo-proactive-min',
        'proactiveMin'
    ],
    [
        'wuyo-proactive-max',
        'proactiveMax'
    ],
    [
        'wuyo-reply-min',
        'replyMin'
    ],
    [
        'wuyo-reply-max',
        'replyMax'
    ]
]
.forEach(
    pair => {

        const input =
            document.getElementById(
                pair[0]
            );

        if(!input){

            return;

        }

        input.addEventListener(
            'change',
            function(){

                let value =
                    Number(
                        input.value
                    );

                if(
                    !Number.isFinite(value) ||
                    value < 1
                ){

                    value = 1;

                }

                input.value =
                    value;

                wuyoSaveCurrentSettings({

                    [pair[1]]:
                        value

                });

            }
        );

    }
);


/* =====================================================
   保存备注
   ===================================================== */

const noteInput =
    document.getElementById(
        'wuyo-character-note-input'
    );


if(noteInput){

    noteInput.addEventListener(
        'change',
        function(){

            const character =
                wuyoGetCurrentCharacter();

            if(!character){

                return;

            }

            const chars =
                getChars();

            const index =
                chars.findIndex(
                    item =>
                        item.id ===
                        character.id
                );

            if(index < 0){

                return;

            }

            chars[index].note =
                noteInput.value.trim();

            saveChars(
                chars
            );


            if(
                typeof currentCharacter !==
                'undefined' &&
                currentCharacter
            ){

                currentCharacter =
                    chars[index];

            }


            wuyoUpdateCharacterHome();

            if(
                typeof renderContacts ===
                'function'
            ){

                renderContacts();

            }

            if(
                typeof renderChats ===
                'function'
            ){

                renderChats();

            }

        }
    );

}


/* =====================================================
   更新角色主页入口
   ===================================================== */

function wuyoUpdateCharacterHome(){

    const character =
        wuyoGetCurrentCharacter();

    if(!character){

        return;

    }

    const avatar =
        document.getElementById(
            'wuyo-character-home-avatar'
        );

    const name =
        document.getElementById(
            'wuyo-character-home-name'
        );

    const sub =
        document.getElementById(
            'wuyo-character-home-sub'
        );


    if(avatar){

        avatar.style.backgroundImage =
            character.avatar
                ? `url("${character.avatar}")`
                : '';

    }


    if(name){

        name.textContent =
            character.note
                ? character.note
                : character.name;

    }


    if(sub){

        sub.textContent =
            character.note
                ? character.name
                : '查看角色主页';

    }

}


/* =====================================================
   角色主页页面
   ===================================================== */

let wuyoProfile =
    document.getElementById(
        'wuyo-character-profile'
    );


if(!wuyoProfile){

    wuyoProfile =
        document.createElement('div');

    wuyoProfile.id =
        'wuyo-character-profile';

    wuyoProfile.className =
        'wuyo-character-profile';

    wuyoProfile.innerHTML = `

        <div
            class="wuyo-sub-head"
            style="padding:18px 18px 0"
        >

            <button
                class="wuyo-sub-back"
                id="wuyo-profile-back"
                type="button"
            >

                <i data-lucide="chevron-left"></i>

            </button>

            <div
                class="wuyo-sub-title"
            >
                角色主页
            </div>

        </div>


        <div
            class="wuyo-profile-cover"
            id="wuyo-profile-cover"
        ></div>


        <div
            class="wuyo-profile-content"
        >

            <div
                class="wuyo-profile-avatar"
                id="wuyo-profile-avatar"
            ></div>

            <div
                class="wuyo-profile-name"
                id="wuyo-profile-name"
            >
                角色
            </div>

            <div
                class="wuyo-profile-note"
                id="wuyo-profile-note"
            >
            </div>


            <div
                class="wuyo-profile-card"
            >

                <div
                    class="wuyo-profile-label"
                >
                    微信号
                </div>

                <div
                    class="wuyo-profile-value"
                    id="wuyo-profile-wechat"
                >
                    未设置
                </div>

            </div>


            <div
                class="wuyo-profile-card"
            >

                <div
                    class="wuyo-profile-label"
                >
                    手机号
                </div>

                <div
                    class="wuyo-profile-value"
                    id="wuyo-profile-phone"
                >
                    未设置
                </div>

            </div>


            <div
                class="wuyo-profile-card"
            >

                <div
                    class="wuyo-profile-label"
                >
                    身份
                </div>

                <div
                    class="wuyo-profile-value"
                    id="wuyo-profile-identity"
                >
                    未设置
                </div>

            </div>


            <div
                class="wuyo-profile-card"
            >

                <div
                    class="wuyo-profile-label"
                >
                    人设
                </div>

                <div
                    class="wuyo-profile-value"
                    id="wuyo-profile-persona"
                >
                    未设置
                </div>

            </div>


            <div
                class="wuyo-profile-card"
            >

                <div
                    class="wuyo-profile-label"
                >
                    外观
                </div>

                <div
                    class="wuyo-profile-value"
                    id="wuyo-profile-appearance"
                >
                    未设置
                </div>

            </div>

        </div>

    `;

    container.appendChild(
        wuyoProfile
    );

}


/* =====================================================
   打开角色主页
   ===================================================== */

function wuyoOpenCharacterProfile(){

    const character =
        wuyoGetCurrentCharacter();

    if(!character){

        return;

    }


    const avatar =
        document.getElementById(
            'wuyo-profile-avatar'
        );

    const cover =
        document.getElementById(
            'wuyo-profile-cover'
        );

    const name =
        document.getElementById(
            'wuyo-profile-name'
        );

    const note =
        document.getElementById(
            'wuyo-profile-note'
        );

    const wechat =
        document.getElementById(
            'wuyo-profile-wechat'
        );

    const phone =
        document.getElementById(
            'wuyo-profile-phone'
        );

    const identity =
        document.getElementById(
            'wuyo-profile-identity'
        );

    const persona =
        document.getElementById(
            'wuyo-profile-persona'
        );

    const appearance =
        document.getElementById(
            'wuyo-profile-appearance'
        );


    if(avatar){

        avatar.style.backgroundImage =
            character.avatar
                ? `url("${character.avatar}")`
                : '';

    }


    if(cover){

        cover.style.backgroundImage =
            character.cover
                ? `url("${character.cover}")`
                : '';

    }


    if(name){

        name.textContent =
            character.nickname ||
            character.name ||
            '角色';

    }


    if(note){

        note.textContent =
            character.note ||
            '';

    }


    if(wechat){

        wechat.textContent =
            character.wechatId ||
            character.wechat ||
            '未设置';

    }


    if(phone){

        phone.textContent =
            character.phone ||
            character.mobile ||
            '未设置';

    }


    if(identity){

        identity.textContent =
            character.identity ||
            '未设置';

    }


    if(persona){

        persona.textContent =
            character.persona ||
            '未设置';

    }


    if(appearance){

        appearance.textContent =
            character.appearance ||
            '未设置';

    }


    wuyoProfile.classList.add(
        'active'
    );

}


/* =====================================================
   角色主页入口事件
   ===================================================== */

const profileButton =
    document.getElementById(
        'wuyo-open-character-profile'
    );


if(profileButton){

    profileButton.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            wuyoOpenCharacterProfile();

        };

}


/* =====================================================
   角色主页返回
   ===================================================== */

const profileBack =
    document.getElementById(
        'wuyo-profile-back'
    );


if(profileBack){

    profileBack.onclick =
        function(event){

            event.preventDefault();

            event.stopPropagation();

            wuyoProfile.classList.remove(
                'active'
            );

        };

}


/* =====================================================
   初始化图标
   ===================================================== */

if(window.lucide){

    lucide.createIcons({

        root:
            container

    });

}


/* =====================================================
   第 4 段结束
   ===================================================== */

/* =====================================================
   第 5 段
   朋友圈 Moments 系统
   ===================================================== */

(function(){

    const container =
        document.getElementById('chat-app');

    if(!container) return;


    /* =================================================
       Storage
       ================================================= */

    const MOMENT_KEY =
        'wuyo_moments';

    const MOMENT_COMMENT_KEY =
        'wuyo_moment_comments';

    const MOMENT_LIKE_KEY =
        'wuyo_moment_likes';

    const USER_MASK_KEY =
        'wuyo_user_masks';

    const USER_PROFILE_KEY =
        'wuyo_user_profile';


    /* =================================================
       工具
       ================================================= */

    function makeId(){

        return (
            'id_' +
            Date.now() +
            '_' +
            Math.random()
                .toString(36)
                .slice(2,9)
        );

    }


    function readStorage(key, fallback){

        try{

            const raw =
                localStorage.getItem(key);

            if(!raw){

                return fallback;

            }

            return JSON.parse(raw);

        }
        catch(error){

            console.error(
                '读取数据失败:',
                key,
                error
            );

            return fallback;

        }

    }


    function writeStorage(key, value){

        try{

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        }
        catch(error){

            console.error(
                '保存数据失败:',
                key,
                error
            );

        }

    }


    /* =================================================
       朋友圈数据
       ================================================= */

    function getMoments(){

        return readStorage(
            MOMENT_KEY,
            []
        );

    }


    function saveMoments(list){

        writeStorage(
            MOMENT_KEY,
            list
        );

    }


    function getMomentComments(){

        return readStorage(
            MOMENT_COMMENT_KEY,
            {}
        );

    }


    function saveMomentComments(data){

        writeStorage(
            MOMENT_COMMENT_KEY,
            data
        );

    }


    function getMomentLikes(){

        return readStorage(
            MOMENT_LIKE_KEY,
            {}
        );

    }


    function saveMomentLikes(data){

        writeStorage(
            MOMENT_LIKE_KEY,
            data
        );

    }


    /* =================================================
       当前 User
       ================================================= */

    function getUserProfile(){

        const defaultProfile = {

            nickname:
                'User',

            wechatId:
                'user',

            phone:
                '',

            idCard:
                '',

            signature:
                '',

            gender:
                '',

            avatar:
                '',

            background:
                ''

        };


        const profile =
            readStorage(
                USER_PROFILE_KEY,
                defaultProfile
            );


        return {

            ...defaultProfile,

            ...profile

        };

    }


    function saveUserProfile(profile){

        writeStorage(
            USER_PROFILE_KEY,
            profile
        );

    }


    /* =================================================
       朋友圈背景
       ================================================= */

    function getMomentsBackground(){

        const profile =
            getUserProfile();

        return profile.background || '';

    }


    function setMomentsBackground(data){

        const profile =
            getUserProfile();

        profile.background =
            data || '';

        saveUserProfile(
            profile
        );

    }


    /* =================================================
       创建朋友圈
       ================================================= */

    function createMoment(options){

        options =
            options || {};


        const moment = {

            id:
                options.id ||
                makeId(),

            ownerType:
                options.ownerType ||
                'user',

            ownerId:
                options.ownerId ||
                'user',

            ownerName:
                options.ownerName ||
                getUserProfile().nickname ||
                'User',

            ownerAvatar:
                options.ownerAvatar ||
                getUserProfile().avatar ||
                '',

            text:
                options.text ||
                '',

            image:
                options.image ||
                '',

            time:
                options.time ||
                new Date().toISOString(),

            location:
                options.location ||
                '',

            visibility:
                options.visibility ||
                'all'

        };


        const list =
            getMoments();


        list.unshift(
            moment
        );


        saveMoments(
            list
        );


        return moment;

    }


    /* =================================================
       删除朋友圈
       ================================================= */

    function deleteMoment(id){

        const list =
            getMoments()
                .filter(
                    item =>
                        item.id !== id
                );


        saveMoments(
            list
        );


        const comments =
            getMomentComments();


        delete comments[id];


        saveMomentComments(
            comments
        );


        const likes =
            getMomentLikes();


        delete likes[id];


        saveMomentLikes(
            likes
        );

    }


    /* =================================================
       点赞
       ================================================= */

    function toggleMomentLike(
        momentId,
        userId
    ){

        userId =
            userId ||
            'user';


        const likes =
            getMomentLikes();


        if(!likes[momentId]){

            likes[momentId] = [];

        }


        const index =
            likes[momentId].indexOf(
                userId
            );


        if(index >= 0){

            likes[momentId].splice(
                index,
                1
            );

            saveMomentLikes(
                likes
            );

            return false;

        }


        likes[momentId].push(
            userId
        );


        saveMomentLikes(
            likes
        );


        return true;

    }


    /* =================================================
       评论
       ================================================= */

    function addMomentComment(
        momentId,
        options
    ){

        options =
            options || {};


        const comments =
            getMomentComments();


        if(!comments[momentId]){

            comments[momentId] = [];

        }


        const comment = {

            id:
                makeId(),

            fromType:
                options.fromType ||
                'user',

            fromId:
                options.fromId ||
                'user',

            fromName:
                options.fromName ||
                getUserProfile().nickname ||
                'User',

            fromAvatar:
                options.fromAvatar ||
                getUserProfile().avatar ||
                '',

            text:
                String(
                    options.text ||
                    ''
                ).trim(),

            time:
                new Date().toISOString(),

            replyTo:
                options.replyTo ||
                null,

            replyName:
                options.replyName ||
                ''

        };


        if(!comment.text){

            return null;

        }


        comments[momentId].push(
            comment
        );


        saveMomentComments(
            comments
        );


        return comment;

    }


    /* =================================================
       朋友圈页面
       ================================================= */

    let momentsPage =
        document.getElementById(
            'wuyo-moments-page'
        );


    if(!momentsPage){

        momentsPage =
            document.createElement(
                'div'
            );

        momentsPage.id =
            'wuyo-moments-page';

        momentsPage.className =
            'wuyo-extra-page';

        momentsPage.innerHTML = `

            <div class="wuyo-moments-header">

                <button
                    type="button"
                    id="wuyo-moments-back"
                >
                    <i data-lucide="chevron-left"></i>
                </button>

                <div class="wuyo-moments-title">
                    Moments
                </div>

                <div class="wuyo-moments-actions">

                    <button
                        type="button"
                        id="wuyo-moment-refresh"
                        title="刷新朋友圈"
                    >
                        <i data-lucide="refresh-cw"></i>
                    </button>

                    <button
                        type="button"
                        id="wuyo-moment-add"
                        title="发布朋友圈"
                    >
                        <i data-lucide="camera"></i>
                    </button>

                </div>

            </div>


            <div
                class="wuyo-moments-cover"
                id="wuyo-moments-cover"
            >

                <button
                    type="button"
                    id="wuyo-change-moment-bg"
                >
                    更换背景
                </button>

                <input
                    id="wuyo-moment-bg-input"
                    type="file"
                    accept="image/*"
                    hidden
                >

                <div
                    class="wuyo-moments-user"
                >

                    <div
                        class="wuyo-moments-user-avatar"
                        id="wuyo-moments-user-avatar"
                    ></div>

                    <div
                        class="wuyo-moments-user-name"
                        id="wuyo-moments-user-name"
                    >
                        User
                    </div>

                </div>

            </div>


            <div
                class="wuyo-moments-feed"
                id="wuyo-moments-feed"
            ></div>

        `;


        container.appendChild(
            momentsPage
        );

    }


    /* =================================================
       Moments CSS
       ================================================= */

    const style =
        document.createElement(
            'style'
        );


    style.textContent = `

    .wuyo-extra-page{

        position:absolute;

        inset:0;

        z-index:80;

        display:none;

        flex-direction:column;

        background:#f5f5f5;

        overflow:hidden;

    }


    .wuyo-extra-page.active{

        display:flex;

    }


    .wuyo-moments-header{

        height:48px;

        flex:none;

        display:flex;

        align-items:center;

        justify-content:space-between;

        padding:0 10px;

        box-sizing:border-box;

        background:rgba(255,255,255,.96);

        border-bottom:1px solid #e5e5e5;

    }


    .wuyo-moments-header button{

        width:38px;

        height:38px;

        border:0;

        background:transparent;

        border-radius:50%;

        display:flex;

        align-items:center;

        justify-content:center;

        color:#222;

    }


    .wuyo-moments-title{

        font-size:16px;

        font-weight:600;

        color:#222;

    }


    .wuyo-moments-actions{

        display:flex;

        gap:2px;

    }


    .wuyo-moments-cover{

        position:relative;

        height:190px;

        flex:none;

        background:#dcdcdc;

        background-position:center;

        background-size:cover;

        overflow:hidden;

    }


    .wuyo-moments-cover::after{

        content:"";

        position:absolute;

        inset:0;

        background:linear-gradient(
            transparent 35%,
            rgba(0,0,0,.35)
        );

        pointer-events:none;

    }


    #wuyo-change-moment-bg{

        position:absolute;

        right:12px;

        top:12px;

        z-index:3;

        width:auto;

        height:auto;

        padding:7px 10px;

        border-radius:9px;

        background:rgba(255,255,255,.8);

        font-size:12px;

        color:#333;

    }


    .wuyo-moments-user{

        position:absolute;

        left:16px;

        right:16px;

        bottom:15px;

        z-index:3;

        display:flex;

        align-items:flex-end;

        gap:10px;

    }


    .wuyo-moments-user-avatar{

        width:58px;

        height:58px;

        flex:none;

        border-radius:17px;

        background:#ddd;

        background-position:center;

        background-size:cover;

        border:2px solid #fff;

        box-sizing:border-box;

    }


    .wuyo-moments-user-name{

        padding-bottom:7px;

        color:#fff;

        font-size:17px;

        font-weight:600;

        text-shadow:0 1px 3px rgba(0,0,0,.3);

    }


    .wuyo-moments-feed{

        flex:1;

        min-height:0;

        overflow-y:auto;

        padding:12px 12px 40px;

        box-sizing:border-box;

    }


    .wuyo-moment-card{

        padding:14px 0;

        border-bottom:1px solid #e5e5e5;

    }


    .wuyo-moment-top{

        display:flex;

        gap:10px;

    }


    .wuyo-moment-avatar{

        width:44px;

        height:44px;

        flex:none;

        border-radius:13px;

        background:#ddd;

        background-position:center;

        background-size:cover;

    }


    .wuyo-moment-main{

        min-width:0;

        flex:1;

    }


    .wuyo-moment-name{

        font-size:14px;

        font-weight:600;

        color:#333;

        margin-bottom:5px;

    }


    .wuyo-moment-text{

        font-size:14px;

        color:#222;

        line-height:1.6;

        white-space:pre-wrap;

        overflow-wrap:anywhere;

    }


    .wuyo-moment-image{

        width:100%;

        max-height:280px;

        object-fit:cover;

        border-radius:12px;

        margin-top:9px;

    }


    .wuyo-moment-meta{

        display:flex;

        justify-content:space-between;

        align-items:center;

        margin-top:9px;

        font-size:11px;

        color:#999;

    }


    .wuyo-moment-buttons{

        display:flex;

        gap:5px;

    }


    .wuyo-moment-buttons button{

        border:0;

        background:#f0f0f0;

        border-radius:8px;

        padding:5px 8px;

        font-size:12px;

        color:#555;

    }


    .wuyo-moment-buttons button.active{

        background:#ddd;

        color:#111;

    }


    .wuyo-moment-comments{

        margin-top:8px;

        background:#f4f4f4;

        border-radius:9px;

        padding:7px 9px;

    }


    .wuyo-moment-comment{

        font-size:12px;

        line-height:1.6;

        color:#444;

        padding:2px 0;

    }


    .wuyo-moment-comment-name{

        font-weight:600;

    }


    .wuyo-moment-empty{

        text-align:center;

        color:#999;

        padding:45px 15px;

        font-size:13px;

    }


    `;


    document.head.appendChild(
        style
    );


    /* =================================================
       渲染朋友圈
       ================================================= */

    function renderMoments(){

        const feed =
            document.getElementById(
                'wuyo-moments-feed'
            );


        if(!feed) return;


        const profile =
            getUserProfile();


        const avatar =
            document.getElementById(
                'wuyo-moments-user-avatar'
            );


        const name =
            document.getElementById(
                'wuyo-moments-user-name'
            );


        if(avatar){

            avatar.style.backgroundImage =
                profile.avatar
                    ? `url("${profile.avatar}")`
                    : '';

        }


        if(name){

            name.textContent =
                profile.nickname ||
                'User';

        }


        const cover =
            document.getElementById(
                'wuyo-moments-cover'
            );


        if(cover){

            cover.style.backgroundImage =
                profile.background
                    ? `url("${profile.background}")`
                    : '';

        }


        const moments =
            getMoments();


        const comments =
            getMomentComments();


        const likes =
            getMomentLikes();


        if(!moments.length){

            feed.innerHTML = `

                <div class="wuyo-moment-empty">

                    暂时还没有朋友圈

                </div>

            `;

            return;

        }


        feed.innerHTML =
            moments.map(
                moment => {

                    const liked =
                        (
                            likes[moment.id] ||
                            []
                        ).includes(
                            'user'
                        );


                    const momentComments =
                        comments[moment.id] ||
                        [];


                    return `

                        <article
                            class="wuyo-moment-card"
                            data-moment-id="${moment.id}"
                        >

                            <div
                                class="wuyo-moment-top"
                            >

                                <div
                                    class="wuyo-moment-avatar"
                                    style="${
                                        moment.ownerAvatar
                                            ? `background-image:url("${moment.ownerAvatar}")`
                                            : ''
                                    }"
                                ></div>


                                <div
                                    class="wuyo-moment-main"
                                >

                                    <div
                                        class="wuyo-moment-name"
                                    >
                                        ${escapeHtml(
                                            moment.ownerName
                                        )}
                                    </div>


                                    <div
                                        class="wuyo-moment-text"
                                    >
                                        ${escapeHtml(
                                            moment.text
                                        )}
                                    </div>


                                    ${
                                        moment.image
                                            ? `
                                                <img
                                                    class="wuyo-moment-image"
                                                    src="${moment.image}"
                                                >
                                            `
                                            : ''
                                    }


                                    <div
                                        class="wuyo-moment-meta"
                                    >

                                        <span>
                                            ${formatMomentTime(
                                                moment.time
                                            )}
                                        </span>


                                        <div
                                            class="wuyo-moment-buttons"
                                        >

                                            <button
                                                type="button"
                                                data-moment-like
                                                class="${
                                                    liked
                                                        ? 'active'
                                                        : ''
                                                }"
                                            >
                                                赞 ${
                                                    (
                                                        likes[
                                                            moment.id
                                                        ] ||
                                                        []
                                                    ).length || ''
                                                }
                                            </button>


                                            <button
                                                type="button"
                                                data-moment-comment
                                            >
                                                评论
                                            </button>

                                        </div>

                                    </div>


                                    ${
                                        momentComments.length
                                            ? `

                                                <div
                                                    class="wuyo-moment-comments"
                                                >

                                                    ${
                                                        momentComments
                                                            .map(
                                                                comment => `

                                                                    <div
                                                                        class="wuyo-moment-comment"
                                                                    >

                                                                        <span
                                                                            class="wuyo-moment-comment-name"
                                                                        >
                                                                            ${escapeHtml(
                                                                                comment.fromName
                                                                            )}
                                                                        </span>

                                                                        ${
                                                                            comment.replyName
                                                                                ? `
                                                                                    回复
                                                                                    ${escapeHtml(
                                                                                        comment.replyName
                                                                                    )}
                                                                                `
                                                                                : ''
                                                                        }

                                                                        ：${escapeHtml(
                                                                            comment.text
                                                                        )}

                                                                    </div>

                                                                `
                                                            )
                                                            .join('')
                                                    }

                                                </div>

                                            `
                                            : ''
                                    }

                                </div>

                            </div>

                        </article>

                    `;

                }
            ).join('');


        bindMomentEvents();

    }


    /* =================================================
       HTML 转义
       ================================================= */

    function escapeHtml(text){

        const div =
            document.createElement(
                'div'
            );

        div.textContent =
            text == null
                ? ''
                : String(text);

        return div.innerHTML;

    }


    /* =================================================
       时间格式
       ================================================= */

    function formatMomentTime(value){

        const date =
            new Date(value);


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return '';

        }


        const now =
            new Date();


        const sameDay =
            date.getFullYear() ===
                now.getFullYear() &&
            date.getMonth() ===
                now.getMonth() &&
            date.getDate() ===
                now.getDate();


        if(sameDay){

            return (
                String(
                    date.getHours()
                ).padStart(2,'0')
                +
                ':'
                +
                String(
                    date.getMinutes()
                ).padStart(2,'0')
            );

        }


        return (
            date.getMonth()+1
        )
        +
        '/'
        +
        date.getDate();

    }


    /* =================================================
       朋友圈点击事件
       ================================================= */

    function bindMomentEvents(){

        const feed =
            document.getElementById(
                'wuyo-moments-feed'
            );


        if(!feed) return;


        feed
            .querySelectorAll(
                '[data-moment-like]'
            )
            .forEach(
                button => {

                    button.onclick =
                        function(){

                            const card =
                                button.closest(
                                    '[data-moment-id]'
                                );


                            if(!card) return;


                            toggleMomentLike(
                                card.dataset.momentId,
                                'user'
                            );


                            renderMoments();

                        };

                }
            );


        feed
            .querySelectorAll(
                '[data-moment-comment]'
            )
            .forEach(
                button => {

                    button.onclick =
                        function(){

                            const card =
                                button.closest(
                                    '[data-moment-id]'
                                );


                            if(!card) return;


                            const text =
                                prompt(
                                    '请输入评论内容'
                                );


                            if(
                                text === null
                            ){

                                return;

                            }


                            addMomentComment(
                                card.dataset.momentId,
                                {
                                    text:text
                                }
                            );


                            renderMoments();

                        };

                }
            );

    }


    /* =================================================
       返回
       ================================================= */

    const back =
        document.getElementById(
            'wuyo-moments-back'
        );


    if(back){

        back.onclick =
            function(){

                momentsPage.classList.remove(
                    'active'
                );

            };

    }


    /* =================================================
       刷新朋友圈
       ================================================= */

    const refresh =
        document.getElementById(
            'wuyo-moment-refresh'
        );


    if(refresh){

        refresh.onclick =
            function(){

                renderMoments();

            };

    }


    /* =================================================
       更换朋友圈背景
       ================================================= */

    const changeBg =
        document.getElementById(
            'wuyo-change-moment-bg'
        );


    const bgInput =
        document.getElementById(
            'wuyo-moment-bg-input'
        );


    if(changeBg && bgInput){

        changeBg.onclick =
            function(){

                bgInput.click();

            };


        bgInput.onchange =
            function(event){

                const file =
                    event.target.files[0];


                if(!file){

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function(){

                        setMomentsBackground(
                            reader.result
                        );


                        renderMoments();

                    };


                reader.readAsDataURL(
                    file
                );


                bgInput.value =
                    '';

            };

    }


    /* =================================================
       发布朋友圈
       ================================================= */

    const addButton =
        document.getElementById(
            'wuyo-moment-add'
        );


    if(addButton){

        addButton.onclick =
            function(){

                const text =
                    prompt(
                        '请输入朋友圈内容'
                    );


                if(
                    text === null ||
                    !text.trim()
                ){

                    return;

                }


                const profile =
                    getUserProfile();


                createMoment({

                    ownerType:'user',

                    ownerId:'user',

                    ownerName:
                        profile.nickname ||
                        'User',

                    ownerAvatar:
                        profile.avatar ||
                        '',

                    text:
                        text.trim()

                });


                renderMoments();

            };

    }


    /* =================================================
       暴露接口
       ================================================= */

    window.wuyoMomentsSystem = {

        getMoments,

        saveMoments,

        createMoment,

        deleteMoment,

        toggleMomentLike,

        addMomentComment,

        getMomentComments,

        saveMomentComments,

        getMomentLikes,

        saveMomentLikes,

        getUserProfile,

        saveUserProfile,

        setMomentsBackground,

        renderMoments,

        open(){

            renderMoments();

            momentsPage.classList.add(
                'active'
            );

        },

        close(){

            momentsPage.classList.remove(
                'active'
            );

        }

    };


    /* =================================================
       Lucide
       ================================================= */

    if(window.lucide){

        lucide.createIcons({

            root:
                momentsPage

        });

    }

})();