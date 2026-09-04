(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 💥 终极防白屏：把 HTML 直接写死在 JS 里，彻底告别加载失败和缓存错乱！
    const chatHTML = `
        <!-- 1. 聊天列表页 -->
        <div class="chat-page root active" id="chat-page-list">
            <header class="chat-header">
                <div style="width:32px;"></div><span class="chat-header-title">微信</span><button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
            </header>
            <div class="chat-search-bar"><i data-lucide="search"></i><input type="text" class="chat-search-input" placeholder="搜索"></div>
            <div class="chat-list-container" id="chat-list-render-area"></div>
            <div class="wechat-bottom-nav">
                <div class="wechat-nav-item active"><i data-lucide="message-square"></i><span>Chats</span></div>
                <div class="wechat-nav-item" id="nav-btn-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
                <div class="wechat-nav-item" id="nav-btn-moments"><i data-lucide="compass"></i><span>Moments</span></div>
                <div class="wechat-nav-item" onclick="alert('功能开发中')"><i data-lucide="user"></i><span>Me</span></div>
            </div>
        </div>

        <!-- 2. 聊天详情页 -->
        <div class="chat-page" id="chat-page-detail">
            <header class="chat-header">
                <div class="chat-header-left" id="chat-back-to-list">
                    <button class="chat-icon-btn" style="padding:0;"><i data-lucide="chevron-left"></i></button>
                    <div class="chat-header-avatar" id="header-ai-avatar"></div>
                    <div class="chat-title-area"><span class="chat-title" id="chat-char-name">AI</span><span class="chat-status" id="chat-status-text">在线</span></div>
                </div>
                <button class="chat-icon-btn" id="chat-btn-settings"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-quote-bar" id="chat-quote-bar" style="display:none;">
                <div class="quote-bar-content"><span id="quote-bar-text"></span></div>
                <button class="quote-close-btn" id="quote-close-btn"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
            </div>

            <!-- 💥 极简版底部输入区 -->
            <div class="chat-bottom-bar" id="chat-input-area">
                <button class="chat-icon-btn" id="chat-add-btn" type="button"><i data-lucide="plus"></i></button>
                <div class="chat-input-wrapper">
                    <input type="text" id="chat-msg-input" placeholder="发消息..." autocomplete="off">
                </div>
                <div class="chat-action-group">
                    <button class="chat-action-btn btn-ai" id="chat-ai-reply-btn" type="button">AI</button>
                    <button class="chat-action-btn btn-send" id="chat-user-send-btn" type="button">发送</button>
                </div>
            </div>
            
            <div class="chat-context-menu" id="chat-context-menu">
                <div class="ctx-item" id="ctx-btn-quote">引用</div><div class="ctx-item" id="ctx-btn-copy">复制</div><div class="ctx-item" id="ctx-btn-recall">撤回</div>
                <div class="ctx-item" id="ctx-btn-delete">删除</div><div class="ctx-item" id="ctx-btn-purge" style="color:#FF3B30;">彻底删除</div><div class="ctx-item" id="ctx-btn-multiselect">多选</div>
            </div>
            
            <div class="chat-multiselect-bar" id="chat-multiselect-bar" style="display:none;">
                <button class="ms-action-btn" id="ms-btn-delete-all">删除所选</button>
                <button class="ms-action-btn cancel" id="ms-btn-cancel">取消</button>
            </div>
        </div>

        <!-- 3. 主设置页 -->
        <div class="chat-page" id="chat-page-settings" style="z-index: 20;">
            <header class="chat-header">
                <button class="chat-icon-btn" id="chat-settings-back"><i data-lucide="chevron-left"></i></button>
                <span class="chat-header-title">聊天设置</span>
                <button id="settings-save-btn" style="font-size:16px; font-weight:600; color:#1C1C1E; background:none; border:none; cursor:pointer; padding:4px;">保存</button>
            </header>
            <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
                <div class="settings-list-group">
                    <div class="settings-list-item" id="settings-btn-profile"><span>角色主页</span><i data-lucide="chevron-right"></i></div>
                    <div class="settings-list-item" id="settings-btn-memory"><span>AI 长期记忆</span><i data-lucide="chevron-right"></i></div>
                    <div class="settings-list-item" id="settings-btn-advanced"><span>异地模式与翻译</span><i data-lucide="chevron-right"></i></div>
                    <div class="settings-list-item" id="settings-btn-behavior"><span>角色行为与进阶设定</span><i data-lucide="chevron-right"></i></div>
                </div>
                
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">常规设置</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>置顶聊天</span><label class="ios-switch"><input type="checkbox" id="chat-pinned-toggle"><span class="ios-slider"></span></label></div>
                    <div class="settings-list-item"><span>消息免打扰</span><label class="ios-switch"><input type="checkbox" id="chat-mute-toggle"><span class="ios-slider"></span></label></div>
                </div>
                
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">双头像与签名</div>
                <div class="settings-list-group">
                    <div class="settings-list-item" id="set-user-avatar-btn"><span>我的头像</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-user-av"></div></div>
                    <div class="settings-list-item" id="set-ai-avatar-btn"><span>AI 头像</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-ai-av"></div></div>
                    <div style="padding: 16px; display:flex; flex-direction:column; gap:8px;"><span style="font-size:14px; color:#8E8E93;">浪漫标语</span><input type="text" id="couple-sign-input" style="padding:10px 14px; border-radius:10px; border:0.5px solid #E5E5EA; background:#F4F4F7; font-size:15px; outline:none;" placeholder="我会爱你很久很久"></div>
                </div>
                
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">气泡样式与背景</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>显示用户头像</span><label class="ios-switch"><input type="checkbox" id="show-user-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                    <div class="settings-list-item"><span>显示 AI 头像</span><label class="ios-switch"><input type="checkbox" id="show-ai-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                    <div class="settings-list-item"><span>气泡颜色</span><input type="color" id="bubble-color-picker" value="#FFFFFF" style="width:36px; height:24px; border:none; background:none; cursor:pointer;"></div>
                    <div class="settings-list-item"><span>气泡大小</span><select id="bubble-fontsize-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;"><option value="13px">小 (13px)</option><option value="14px" selected>标准 (14px)</option><option value="16px">大 (16px)</option></select></div>
                    <div class="settings-list-item"><span>气泡圆角</span><select id="bubble-radius-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;"><option value="8px">锐利 (8px)</option><option value="14px" selected>适中 (14px)</option><option value="22px">圆润 (22px)</option></select></div>
                    <div class="settings-list-item" id="set-bg-img-btn"><span>聊天背景图</span><span style="font-size:14px; color:#8E8E93;" id="bg-img-status">点击上传</span></div>
                    <div class="settings-list-item" id="import-theme-preset"><span>导入预设代码</span><i data-lucide="chevron-right"></i></div>
                </div>
                <div class="settings-list-group"><div class="settings-list-item danger" id="settings-btn-clear">清空聊天记录</div></div>
            </div>
        </div>

        <!-- 4. 异地模式与翻译页 -->
        <div class="chat-page" id="chat-page-advanced-settings" style="z-index: 30;">
            <header class="chat-header"><button class="chat-icon-btn" id="advanced-settings-back"><i data-lucide="chevron-left"></i></button><span class="chat-header-title">异地模式与翻译</span><div style="width:32px;"></div></header>
            <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">异地模式 (同步当地时间与天气)</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>我的时区</span><select id="user-timezone-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;"><option value="Asia/Shanghai">北京时间 (中国大陆)</option><option value="Asia/Tokyo">东京时间 (日本)</option><option value="Europe/London">伦敦时间 (英国)</option><option value="America/New_York">纽约时间 (美东)</option><option value="America/Los_Angeles">洛杉矶 (美西)</option></select></div>
                    <div class="settings-list-item"><span>TA 的时区</span><select id="ai-timezone-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;"><option value="Asia/Shanghai">北京时间 (中国大陆)</option><option value="Asia/Tokyo">东京时间 (日本)</option><option value="Europe/London">伦敦时间 (英国)</option><option value="America/New_York">纽约时间 (美东)</option><option value="America/Los_Angeles">洛杉矶 (美西)</option></select></div>
                </div>
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">跨语言与翻译</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>TA 的语言</span><select id="ai-language-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;"><option value="default">默认 (简体中文)</option><option value="English">英语 (English)</option><option value="Japanese">日语 (日本語)</option><option value="Korean">韩语 (한국어)</option><option value="Spanish">西班牙语 (Español)</option></select></div>
                    <div class="settings-list-item"><span>自动翻译</span><label class="ios-switch"><input type="checkbox" id="auto-translate-toggle"><span class="ios-slider"></span></label></div>
                </div>
            </div>
        </div>

        <!-- 5. 角色行为与进阶设定页 -->
        <div class="chat-page" id="chat-page-behavior-settings" style="z-index: 30;">
            <header class="chat-header"><button class="chat-icon-btn" id="behavior-settings-back"><i data-lucide="chevron-left"></i></button><span class="chat-header-title">行为与设定</span><div style="width:32px;"></div></header>
            <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">回复长度限制 (留空则不限)</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>最少回复句数</span><input type="number" id="bh-min-sentences" placeholder="如: 1" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
                    <div class="settings-list-item"><span>最多回复句数</span><input type="number" id="bh-max-sentences" placeholder="如: 3" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
                </div>
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">主动交互与免打扰</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>允许主动发消息</span><label class="ios-switch"><input type="checkbox" id="bh-proactive-toggle"><span class="ios-slider"></span></label></div>
                    <div class="settings-list-item"><span>触发间隔(分钟)</span><input type="number" id="bh-proactive-interval" placeholder="30" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
                    <div class="settings-list-item"><span>免打扰开始</span><input type="time" id="bh-dnd-start" value="23:00" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none;"></div>
                    <div class="settings-list-item"><span>免打扰结束</span><input type="time" id="bh-dnd-end" value="08:00" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none;"></div>
                </div>
                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">聊天显示交互</div>
                <div class="settings-list-group">
                    <div class="settings-list-item"><span>显示消息时间戳</span><label class="ios-switch"><input type="checkbox" id="bh-timestamp-toggle" checked><span class="ios-slider"></span></label></div>
                    <div class="settings-list-item"><span>角色心声 (点头像查看)</span><label class="ios-switch"><input type="checkbox" id="bh-innervoice-toggle"><span class="ios-slider"></span></label></div>
                </div>
            </div>
        </div>

        <input type="file" id="couple-avatar-uploader" accept="image/*" style="display:none;">
        <input type="file" id="chat-bg-uploader" accept="image/*" style="display:none;">
    `;

    // 强行把 HTML 塞入容器
    container.innerHTML = chatHTML;
    
    if (window.lucide) {
        lucide.createIcons({ root: container });
    }

    // 💥 防崩溃包裹区：如果任何元素找不到，只会输出错误，但绝对不白屏！
    try {
        initChatLogic();
    } catch (err) {
        console.error("【UI绑定失败】", err);
        container.innerHTML += `<div style="padding:20px; text-align:center; color:red; z-index:99999; position:absolute; top:50px;">严重错误，请按 F12 查看控制台</div>`;
    }

    function initChatLogic() {
        const btnContacts = document.getElementById('nav-btn-contacts');
        if (btnContacts) {
            btnContacts.addEventListener('click', () => { 
                container.style.display = 'none'; 
                window.openApp('contacts'); 
            });
        }

        let currentChatId = null; 
        let globalChatData = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {};
        let selectedMsgIndex = null;
        let quoteMessage = null; 
        let isMultiSelectMode = false; 
        let selectedIndices = new Set(); 
        
        let tempEditableUserAvatar = '';
        let tempEditableAiAvatar = '';
        let tempEditableBgImg = '';

        const getCurrentRoleInfo = () => {
            let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
            if(roles.length === 0) {
                roles.push({ id: 'char_default', name: 'AI 伙伴', avatar: '' });
                localStorage.setItem('wuyo_roles', JSON.stringify(roles));
            }
            const role = roles.find(r => r.id === currentChatId) || roles[0];
            return { 
                id: role.id, 
                name: role.remark || role.name, 
                sub: role.personality ? role.personality.substring(0, 20) : '在线', 
                avatar: tempEditableAiAvatar || role.faceImg || role.avatar || '',
                pinned: role.pinned || false, 
                muted: role.muted || false
            };
        };

        const getChatStyleConfig = () => {
            let conf = JSON.parse(localStorage.getItem('wuyo_chat_style_config')) || {};
            const coupleConf = JSON.parse(localStorage.getItem('wuyo_couple_config')) || {};
            const configStr = localStorage.getItem('wuyo_config');
            let defaultUserAvatar = '';
            if(configStr) {
                const cfg = JSON.parse(configStr);
                if(cfg.profile && cfg.profile.avatar) defaultUserAvatar = cfg.profile.avatar;
            }
            return {
                userAvatar: tempEditableUserAvatar || coupleConf.userAvatar || defaultUserAvatar,
                signature: coupleConf.signature !== undefined ? coupleConf.signature : '我会爱你很久很久',
                bubbleBg: conf.bubbleBg || '#FFFFFF',
                bubbleFontSize: conf.bubbleFontSize || '14px',
                bubbleRadius: conf.bubbleRadius || '14px',
                bgImg: tempEditableBgImg || conf.bgImg || '',
                showUserAvatar: conf.showUserAvatar !== false,
                showAiAvatar: conf.showAiAvatar !== false,
                userTimezone: conf.userTimezone || 'Asia/Shanghai',
                aiTimezone: conf.aiTimezone || 'Asia/Shanghai',
                aiLanguage: conf.aiLanguage || 'default',
                autoTranslate: conf.autoTranslate || false
            };
        };

        const getBehaviorConfig = () => {
            let conf = JSON.parse(localStorage.getItem('wuyo_behavior_config')) || {};
            return {
                minSentences: conf.minSentences || '',
                maxSentences: conf.maxSentences || '',
                proactiveEnabled: conf.proactiveEnabled || false,
                proactiveInterval: conf.proactiveInterval || '30',
                dndStart: conf.dndStart || '23:00',
                dndEnd: conf.dndEnd || '08:00',
                showTimestamp: conf.showTimestamp !== false,
                innerVoice: conf.innerVoice || false
            };
        };

        const applyChatStylesToDOM = () => {
            const conf = getChatStyleConfig();
            const msgListEl = document.getElementById('chat-message-list');
            if(!msgListEl) return;
            msgListEl.style.setProperty('--bubble-bg', conf.bubbleBg);
            msgListEl.style.setProperty('--bubble-font-size', conf.bubbleFontSize);
            msgListEl.style.setProperty('--bubble-radius', conf.bubbleRadius);
            msgListEl.style.backgroundImage = conf.bgImg ? `url(${conf.bgImg})` : 'none';
        };

        const formatTime = (ts) => { 
            const d = new Date(ts); 
            return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; 
        };

        const renderChatList = () => {
            const listArea = document.getElementById('chat-list-render-area');
            if(!listArea) return;
            let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [{ id: 'char_default', name: 'AI 伙伴', avatar: '' }];
            roles.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

            let html = '';
            roles.forEach(role => {
                const history = globalChatData[role.id] || [];
                let lastMsg = '准备好开始对话了...'; 
                let lastTime = '';
                if(history.length > 0) { 
                    lastMsg = history[history.length - 1].content.replace(/<[^>]+>/g, ''); 
                    lastTime = formatTime(history[history.length - 1].time); 
                }

                const avatarStyle = role.faceImg || role.avatar ? `background-image: url(${role.faceImg || role.avatar});` : ``;
                const avatarInner = role.faceImg || role.avatar ? '' : `<i data-lucide="bot"></i>`;
                const pinnedBg = role.pinned ? 'background: #F9F9FB;' : '';

                html += `
                    <div class="chat-list-item" style="${pinnedBg}" onclick="window.openChatDetail('${role.id}')">
                        <div class="chat-list-avatar" style="${avatarStyle}">${avatarInner}</div>
                        <div class="chat-list-info">
                            <div class="chat-list-top">
                                <span class="chat-list-name">${role.remark || role.name} ${role.pinned ? '<span style="font-size:11px; color:#8E8E93; font-weight:400; margin-left:4px;">[置顶]</span>' : ''}</span>
                                <span class="chat-list-time">${lastTime}</span>
                            </div>
                            <span class="chat-list-msg">${lastMsg}</span>
                        </div>
                    </div>
                `;
            });
            listArea.innerHTML = html;
            if (window.lucide) lucide.createIcons({ root: listArea });
        };

        window.openChatDetail = (charId) => {
            currentChatId = charId; 
            tempEditableUserAvatar = ''; tempEditableAiAvatar = ''; tempEditableBgImg = '';
            
            isMultiSelectMode = false; selectedIndices.clear();
            const msBar = document.getElementById('chat-multiselect-bar');
            const inArea = document.getElementById('chat-input-area');
            if(msBar) msBar.style.display = 'none';
            if(inArea) inArea.style.display = 'flex';

            const roleInfo = getCurrentRoleInfo();
            const nameEl = document.getElementById('chat-char-name');
            const subEl = document.getElementById('chat-status-text');
            if(nameEl) nameEl.textContent = roleInfo.name;
            if(subEl) subEl.textContent = roleInfo.sub;
            
            const headerAv = document.getElementById('header-ai-avatar');
            if(headerAv) {
                headerAv.style.backgroundImage = roleInfo.avatar ? `url(${roleInfo.avatar})` : '';
                headerAv.innerHTML = roleInfo.avatar ? '' : '<i data-lucide="bot" style="width:18px;height:18px;"></i>';
                if (window.lucide) lucide.createIcons({ root: headerAv });
            }

            const detailPage = document.getElementById('chat-page-detail');
            if(detailPage) detailPage.classList.add('active'); 
            renderMessages();
            applyChatStylesToDOM();
        };

        const backToListBtn = document.getElementById('chat-back-to-list');
        if(backToListBtn) {
            backToListBtn.addEventListener('click', () => { 
                document.getElementById('chat-page-detail').classList.remove('active'); 
                currentChatId = null; 
                renderChatList(); 
            });
        }

        const msgList = document.getElementById('chat-message-list');
        const inputArea = document.getElementById('chat-msg-input');
        const sendBtn = document.getElementById('chat-user-send-btn');
        const aiReplyBtn = document.getElementById('chat-ai-reply-btn');
        const ctxMenu = document.getElementById('chat-context-menu');
        
        if (msgList && ctxMenu) {
            msgList.addEventListener('scroll', () => ctxMenu.classList.remove('show')); 
            msgList.addEventListener('click', () => ctxMenu.classList.remove('show'));
        }
        
        const scrollToBottom = () => { 
            if(msgList) setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); 
        };

        const renderMessages = () => {
            if(!currentChatId || !msgList) return; 
            msgList.innerHTML = '';
            const history = globalChatData[currentChatId] || [];
            const roleInfo = getCurrentRoleInfo();
            const styleConf = getChatStyleConfig();
            const behaviorConf = getBehaviorConfig();

            const bannerEl = document.createElement('div');
            bannerEl.className = 'chat-couple-banner';
            bannerEl.innerHTML = `
                <div class="couple-avatars-box">
                    <div class="couple-avatar-item" style="${styleConf.userAvatar ? `background-image:url(${styleConf.userAvatar})` : ''}">${styleConf.userAvatar ? '' : '<i data-lucide="user"></i>'}</div>
                    <div class="couple-avatar-item" style="${roleInfo.avatar ? `background-image:url(${roleInfo.avatar})` : ''}">${roleInfo.avatar ? '' : '<i data-lucide="bot"></i>'}</div>
                </div>
                <div class="couple-signature-text">${styleConf.signature}</div>
            `;
            msgList.appendChild(bannerEl);

            if(history.length === 0) {
                msgList.innerHTML += '<div class="chat-empty">暂无消息，打个招呼吧</div>';
                scrollToBottom();
                return;
            }

            history.forEach((msg, index) => {
                if(msg.recalled) {
                    msgList.innerHTML += `<div style="text-align:center; font-size:11px; color:#8E8E93; margin:8px 0;">${msg.role === 'user' ? '你' : '对方'}撤回了一条消息</div>`;
                    return;
                }

                const isUser = msg.role === 'user';
                const outerWrapper = document.createElement('div');
                outerWrapper.style.cssText = 'display: flex; align-items: flex-start; width: 100%; margin-bottom: 0;';

                const row = document.createElement('div');
                row.className = `chat-bubble-row ${isUser ? 'user' : 'ai'}`;
                row.style.flex = '1';

                const avDiv = document.createElement('div');
                avDiv.className = 'bubble-avatar';

                if (isUser) {
                    if (!styleConf.showUserAvatar) avDiv.classList.add('hidden');
                    else if (styleConf.userAvatar) avDiv.style.backgroundImage = `url(${styleConf.userAvatar})`; 
                    else avDiv.innerHTML = '<i data-lucide="user" style="width:18px;height:18px;"></i>'; 
                } else {
                    if (!styleConf.showAiAvatar) avDiv.classList.add('hidden');
                    else if (roleInfo.avatar) avDiv.style.backgroundImage = `url(${roleInfo.avatar})`; 
                    else avDiv.innerHTML = '<i data-lucide="bot" style="width:18px;height:18px;"></i>'; 
                }

                const col = document.createElement('div');
                col.className = 'bubble-column';

                const bubble = document.createElement('div');
                bubble.className = `chat-bubble`;
                
                let contentHtml = msg.quote ? `<div class="bubble-quote-box">${msg.quote}</div>` : '';
                contentHtml += msg.content.replace(/\n/g, '<br>');
                bubble.innerHTML = contentHtml;

                const timeSub = document.createElement('div');
                timeSub.className = 'bubble-time-sub';
                timeSub.textContent = formatTime(msg.time);
                if (!behaviorConf.showTimestamp) timeSub.style.display = 'none';

                bubble.addEventListener('dblclick', (e) => {
                    selectedMsgIndex = index; 
                    const rect = bubble.getBoundingClientRect();
                    const detailRect = document.getElementById('chat-page-detail').getBoundingClientRect();
                    let leftPos = rect.left + rect.width / 2 - detailRect.left;
                    if(ctxMenu) {
                        ctxMenu.style.left = `${leftPos - 80}px`; 
                        ctxMenu.style.top = `${rect.bottom - detailRect.top + 8}px`; 
                        ctxMenu.classList.add('show');
                    }
                });

                col.appendChild(bubble);
                col.appendChild(timeSub);
                row.appendChild(avDiv);
                row.appendChild(col);
                outerWrapper.appendChild(row);
                msgList.appendChild(outerWrapper);
            });
            if (window.lucide) lucide.createIcons({ root: msgList });
            scrollToBottom();
        };

        const fetchWeather = async (tz) => {
            try {
                const city = tz.split('/').pop().replace('_', ' ');
                const res = await fetch(`https://wttr.in/${city}?format=j1`);
                const data = await res.json();
                return `${data.current_condition[0].lang_zh[0].value}, ${data.current_condition[0].temp_C}°C`;
            } catch(e) { return '未知'; }
        };

        const buildSystemPrompt = async () => {
            let finalPrompt = "";
            const roleInfo = getCurrentRoleInfo();
            const styleConf = getChatStyleConfig();
            
            finalPrompt += `[SYSTEM: YOUR ROLE]\nYou are: ${roleInfo.name}\n\n`;
            
            let uT = new Date().toLocaleString();
            let aT = new Date().toLocaleString();
            try {
                uT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.userTimezone});
                aT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.aiTimezone});
            } catch (e) {}

            finalPrompt += `[CRITICAL SYSTEM DIRECTIVES]\n- User Local Time: ${uT}.\n- YOUR Physical Location: ${styleConf.aiTimezone}. YOUR Local Time: ${aT}.\n- YOU MUST NEVER USE EMOJIS.\n`;

            if(styleConf.aiLanguage && styleConf.aiLanguage !== 'default') {
                finalPrompt += `- You MUST reply ONLY and STRICTLY in ${styleConf.aiLanguage}. NO CHINESE ALLOWED.\n\n`;
            } else {
                finalPrompt += `- Reply in Simplified Chinese.\n\n`;
            }
            return finalPrompt.trim();
        };

        const triggerAiReply = async () => {
            if(!currentChatId) return;
            const apiConfigStr = localStorage.getItem('wuyo_settings_api');
            if(!apiConfigStr) return alert("请先在设置中配置 API！");
            const apiConfig = JSON.parse(apiConfigStr);
            if(!apiConfig.chat || !apiConfig.chat.url) return;

            const statusText = document.getElementById('chat-status-text');
            if(statusText) statusText.textContent = '对方正在输入...';
            
            const aiMsgObj = { role: 'assistant', content: '', time: Date.now() };
            if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
            globalChatData[currentChatId].push(aiMsgObj); 
            renderMessages(); 
            
            const rows = msgList.querySelectorAll('.chat-bubble-row.ai'); 
            const currentBubble = rows[rows.length - 1].querySelector('.chat-bubble');
            const historyContext = globalChatData[currentChatId].slice(-10, -1).map(m => ({ role: m.role, content: m.content }));
            
            const sysPrompt = await buildSystemPrompt(); 
            const apiMessages = [{ role: 'system', content: sysPrompt }, ...historyContext];

            try {
                const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
                const response = await fetch(cleanUrl, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                    body: JSON.stringify({ model: apiConfig.chat.model, messages: apiMessages, temperature: 0.7, stream: true })
                });
                
                const reader = response.body.getReader(); 
                const decoder = new TextDecoder('utf-8'); 
                let done = false;
                
                while(!done) {
                    const {value, done: readerDone} = await reader.read(); 
                    done = readerDone;
                    if(value) {
                        const chunk = decoder.decode(value, {stream: true}); 
                        const lines = chunk.split('\n');
                        for(let line of lines) {
                            if(line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                                try {
                                    const data = JSON.parse(line.slice(6));
                                    if(data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                        aiMsgObj.content += data.choices[0].delta.content; 
                                        currentBubble.innerHTML = aiMsgObj.content.replace(/\n/g, '<br>'); 
                                        scrollToBottom();
                                    }
                                } catch(e) {}
                            }
                        }
                    }
                }
                if(statusText) statusText.textContent = '在线';
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); 
                renderChatList(); 
            } catch (error) {
                if(statusText) statusText.textContent = '未连接'; 
                aiMsgObj.content = `[网络错误]`; 
                currentBubble.innerHTML = aiMsgObj.content;
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            }
        };

        const sendUserMessage = () => {
            if(!inputArea) return;
            const text = inputArea.value.trim(); 
            if(!text || !currentChatId) return;
            
            if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
            globalChatData[currentChatId].push({ role: 'user', content: text, time: Date.now() }); 
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            
            inputArea.value = ''; 
            renderMessages(); 
            triggerAiReply(); 
        };

        // 💥 安全绑定事件
        if(sendBtn) sendBtn.addEventListener('click', sendUserMessage);
        if(aiReplyBtn) aiReplyBtn.addEventListener('click', triggerAiReply);
        if(inputArea) inputArea.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') { e.preventDefault(); sendUserMessage(); } 
        });

        // 绑定各类设置返回与保存按钮 (带非空判断)
        const bindClick = (id, fn) => { const el = document.getElementById(id); if(el) el.addEventListener('click', fn); };
        
        bindClick('chat-btn-settings', () => {
            const page = document.getElementById('chat-page-settings');
            if(page) page.classList.add('active');
        });
        bindClick('chat-settings-back', () => {
            const page = document.getElementById('chat-page-settings');
            if(page) page.classList.remove('active');
        });
        bindClick('settings-btn-advanced', () => {
            const page = document.getElementById('chat-page-advanced-settings');
            if(page) page.classList.add('active');
        });
        bindClick('advanced-settings-back', () => {
            const page = document.getElementById('chat-page-advanced-settings');
            if(page) page.classList.remove('active');
        });
        bindClick('settings-btn-behavior', () => {
            const page = document.getElementById('chat-page-behavior-settings');
            if(page) page.classList.add('active');
        });
        bindClick('behavior-settings-back', () => {
            const page = document.getElementById('chat-page-behavior-settings');
            if(page) page.classList.remove('active');
        });

        renderChatList();
    }
})();
