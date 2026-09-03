(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-page root active" id="chat-page-list">
            <header class="chat-header">
                <div style="width:32px;"></div>
                <span class="chat-header-title">微信</span>
                <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
            </header>
            <div class="chat-search-bar">
                <i data-lucide="search"></i>
                <input type="text" class="chat-search-input" placeholder="搜索">
            </div>
            <div class="chat-list-container" id="chat-list-render-area"></div>
            
            <div class="wechat-bottom-nav">
                <div class="wechat-nav-item active"><i data-lucide="message-square"></i><span>Chats</span></div>
                <div class="wechat-nav-item" id="nav-btn-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
                <div class="wechat-nav-item" onclick="alert('朋友圈功能开发中')"><i data-lucide="compass"></i><span>Moments</span></div>
                <div class="wechat-nav-item" onclick="alert('个人中心功能开发中')"><i data-lucide="user"></i><span>Me</span></div>
            </div>
        </div>

        <div class="chat-page" id="chat-page-detail">
            <header class="chat-header">
                <div class="chat-header-left" id="chat-back-to-list">
                    <button class="chat-icon-btn" style="padding:0;"><i data-lucide="chevron-left"></i></button>
                    <div class="chat-header-avatar" id="header-ai-avatar"></div>
                    <div class="chat-title-area">
                        <span class="chat-title" id="chat-char-name">AI</span>
                        <span class="chat-status" id="chat-status-text">在线</span>
                    </div>
                </div>
                <button class="chat-icon-btn" id="chat-btn-settings"><i data-lucide="more-horizontal"></i></button>
            </header>
            
            <div class="chat-messages" id="chat-message-list"></div>

            <div class="chat-quote-bar" id="chat-quote-bar" style="display:none;">
                <div class="quote-bar-content">
                    <span id="quote-bar-text">引用内容...</span>
                </div>
                <button class="quote-close-btn" id="quote-close-btn"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
            </div>

            <div class="chat-input-area">
                <button class="chat-ext-btn"><i data-lucide="mic"></i></button>
                <textarea class="chat-input" id="chat-textarea" placeholder="发消息..." rows="1"></textarea>
                <button class="chat-ext-btn" id="chat-ext-ai" title="强制 AI 回复"><i data-lucide="bot"></i></button>
                <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
                <button class="chat-send-btn" id="chat-send-btn">发送</button>
            </div>
            
            <!-- 💥 用 JS 内联样式锁死的纯文本两排式小浮窗，绝对不会受旧 CSS 影响 -->
            <div id="chat-context-menu" style="position: absolute; background: #FFFFFF; border: 0.5px solid rgba(0,0,0,0.12); border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.12); display: none; grid-template-columns: repeat(3, 1fr); padding: 8px; gap: 6px; z-index: 10000; width: 170px;">
                <div class="ctx-item" id="ctx-btn-quote" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #1C1C1E; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">引用</div>
                <div class="ctx-item" id="ctx-btn-copy" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #1C1C1E; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">复制</div>
                <div class="ctx-item" id="ctx-btn-recall" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #1C1C1E; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">撤回</div>
                <div class="ctx-item" id="ctx-btn-delete" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #1C1C1E; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">删除</div>
                <div class="ctx-item" id="ctx-btn-purge" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #FF3B30; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">彻底删除</div>
                <div class="ctx-item" id="ctx-btn-multiselect" style="padding: 6px 2px; font-size: 11px; font-weight: 600; color: #1C1C1E; text-align: center; cursor: pointer; border-radius: 6px; background: #F4F4F7;">多选</div>
            </div>

            <div class="chat-multiselect-bar" id="chat-multiselect-bar" style="display:none;">
                <button class="ms-action-btn" id="ms-btn-delete-all"><i data-lucide="trash-2"></i>删除所选</button>
                <button class="ms-action-btn cancel" id="ms-btn-cancel">取消</button>
            </div>
        </div>

        <div class="chat-page" id="chat-page-settings">
            <header class="chat-header">
                <button class="chat-icon-btn" id="chat-settings-back"><i data-lucide="chevron-left"></i></button>
                <span class="chat-header-title">聊天与气泡美化</span>
                <button id="settings-save-btn" style="font-size:16px; font-weight:600; color:#1C1C1E; background:none; border:none; cursor:pointer; padding:4px;">保存</button>
            </header>
            <div style="flex:1; overflow-y:auto; padding-top:16px;">
                <div class="settings-list-group">
                    <div class="settings-list-item" id="settings-btn-profile">
                        <span>角色主页</span><i data-lucide="chevron-right"></i>
                    </div>
                    <div class="settings-list-item" id="settings-btn-memory">
                        <span>AI 长期记忆</span><i data-lucide="chevron-right"></i>
                    </div>
                </div>

                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">聊天常规设置 (置顶与免打扰)</div>
                <div class="settings-list-group">
                    <div class="settings-list-item">
                        <span>置顶聊天</span>
                        <label class="ios-switch"><input type="checkbox" id="chat-pinned-toggle"><span class="ios-slider"></span></label>
                    </div>
                    <div class="settings-list-item">
                        <span>消息免打扰</span>
                        <label class="ios-switch"><input type="checkbox" id="chat-mute-toggle"><span class="ios-slider"></span></label>
                    </div>
                </div>

                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">顶部双头像与浪漫签名自定义</div>
                <div class="settings-list-group">
                    <div class="settings-list-item" id="set-user-avatar-btn">
                        <span>我的头像框</span>
                        <div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-user-av"></div>
                    </div>
                    <div class="settings-list-item" id="set-ai-avatar-btn">
                        <span>AI 头像框</span>
                        <div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-ai-av"></div>
                    </div>
                    <div style="padding: 16px; display:flex; flex-direction:column; gap:8px;">
                        <span style="font-size:14px; color:#8E8E93;">浪漫标语</span>
                        <input type="text" id="couple-sign-input" style="padding:10px 14px; border-radius:10px; border:0.5px solid #E5E5EA; background:#F4F4F7; font-size:15px; outline:none;" placeholder="我会爱你很久很久">
                    </div>
                </div>

                <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">气泡样式、背景与头像显隐开关</div>
                <div class="settings-list-group">
                    <div class="settings-list-item">
                        <span>显示用户头像</span>
                        <label class="ios-switch"><input type="checkbox" id="show-user-avatar-toggle" checked><span class="ios-slider"></span></label>
                    </div>
                    <div class="settings-list-item">
                        <span>显示 AI 头像</span>
                        <label class="ios-switch"><input type="checkbox" id="show-ai-avatar-toggle" checked><span class="ios-slider"></span></label>
                    </div>
                    <div class="settings-list-item">
                        <span>气泡颜色</span>
                        <input type="color" id="bubble-color-picker" value="#FFFFFF" style="width:36px; height:24px; border:none; background:none; cursor:pointer;">
                    </div>
                    <div class="settings-list-item">
                        <span>气泡大小 (字号)</span>
                        <select id="bubble-fontsize-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                            <option value="13px">小 (13px)</option>
                            <option value="14px" selected>标准 (14px)</option>
                            <option value="16px">大 (16px)</option>
                        </select>
                    </div>
                    <div class="settings-list-item">
                        <span>气泡圆角 (粗细)</span>
                        <select id="bubble-radius-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                            <option value="8px">锐利 (8px)</option>
                            <option value="14px" selected>适中 (14px)</option>
                            <option value="22px">圆润 (22px)</option>
                        </select>
                    </div>
                    <div class="settings-list-item" id="set-bg-img-btn">
                        <span>聊天背景图</span>
                        <span style="font-size:14px; color:#8E8E93;" id="bg-img-status">点击上传</span>
                    </div>
                    <div class="settings-list-item" id="import-theme-preset">
                        <span>导入美化预设代码</span><i data-lucide="chevron-right"></i>
                    </div>
                </div>

                <div class="settings-list-group">
                    <div class="settings-list-item danger" id="settings-btn-clear">
                        清空聊天记录
                    </div>
                </div>
            </div>
            <input type="file" id="couple-avatar-uploader" accept="image/*" style="display:none;">
            <input type="file" id="chat-bg-uploader" accept="image/*" style="display:none;">
        </div>
    `;
    lucide.createIcons({ root: container });

    document.getElementById('nav-btn-contacts').addEventListener('click', () => { container.style.display = 'none'; window.openApp('contacts'); });

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
        let finalAiAv = tempEditableAiAvatar !== '' ? tempEditableAiAvatar : (role.faceImg || role.avatar || '');

        return { 
            id: role.id, 
            name: role.remark ? `${role.remark}` : role.name, 
            sub: role.personality ? role.personality.substring(0, 20) : '在线', 
            avatar: finalAiAv,
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
            userAvatar: tempEditableUserAvatar !== '' ? tempEditableUserAvatar : (coupleConf.userAvatar || defaultUserAvatar),
            signature: coupleConf.signature !== undefined ? coupleConf.signature : '我会爱你很久很久',
            bubbleBg: conf.bubbleBg || '#FFFFFF',
            bubbleFontSize: conf.bubbleFontSize || '14px',
            bubbleRadius: conf.bubbleRadius || '14px',
            bgImg: tempEditableBgImg !== '' ? tempEditableBgImg : (conf.bgImg || ''),
            showUserAvatar: conf.showUserAvatar !== undefined ? conf.showUserAvatar : true,
            showAiAvatar: conf.showAiAvatar !== undefined ? conf.showAiAvatar : true
        };
    };

    const applyChatStylesToDOM = () => {
        const styleConf = getChatStyleConfig();
        const msgListEl = document.getElementById('chat-message-list');
        if(msgListEl) {
            msgListEl.style.setProperty('--bubble-bg', styleConf.bubbleBg);
            msgListEl.style.setProperty('--bubble-font-size', styleConf.bubbleFontSize);
            msgListEl.style.setProperty('--bubble-radius', styleConf.bubbleRadius);
            if(styleConf.bgImg) {
                msgListEl.style.backgroundImage = `url(${styleConf.bgImg})`;
            } else {
                msgListEl.style.backgroundImage = 'none';
            }
        }
    };

    const formatTime = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };

    const renderChatList = () => {
        const listArea = document.getElementById('chat-list-render-area');
        let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
        if(roles.length === 0) {
            roles.push({ id: 'char_default', name: 'AI 伙伴', avatar: '' });
            localStorage.setItem('wuyo_roles', JSON.stringify(roles));
        }

        roles.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });

        let html = '';
        roles.forEach(role => {
            if(!globalChatData[role.id]) globalChatData[role.id] = [];
            const history = globalChatData[role.id];
            let lastMsg = '准备好开始对话了...'; let lastTime = '';
            if(history.length > 0) { const lastObj = history[history.length - 1]; lastMsg = lastObj.content; lastTime = formatTime(lastObj.time); }

            const activeAiAv = role.faceImg || role.avatar || '';
            const avatarStyle = activeAiAv ? `background-image: url(${activeAiAv});` : ``;
            const avatarInner = activeAiAv ? '' : `<i data-lucide="bot"></i>`;
            const displayName = role.remark ? `${role.remark} (${role.name})` : role.name;
            const pinnedBg = role.pinned ? 'background: #F9F9FB;' : '';

            html += `
                <div class="chat-list-item" style="${pinnedBg}" onclick="window.openChatDetail('${role.id}')">
                    <div class="chat-list-avatar" style="${avatarStyle}">${avatarInner}</div>
                    <div class="chat-list-info">
                        <div class="chat-list-top">
                            <span class="chat-list-name">${displayName} ${role.pinned ? '<span style="font-size:11px; color:#8E8E93; font-weight:400; margin-left:4px;">[置顶]</span>' : ''}</span>
                            <span class="chat-list-time">${lastTime}</span>
                        </div>
                        <span class="chat-list-msg">${lastMsg}</span>
                    </div>
                </div>
            `;
        });
        listArea.innerHTML = html;
        lucide.createIcons({ root: listArea });
    };

    window.openChatDetail = (charId) => {
        currentChatId = charId; 
        tempEditableUserAvatar = ''; 
        tempEditableAiAvatar = '';
        tempEditableBgImg = '';
        isMultiSelectMode = false;
        selectedIndices.clear();
        document.getElementById('chat-multiselect-bar').style.display = 'none';

        const roleInfo = getCurrentRoleInfo();
        document.getElementById('chat-char-name').textContent = roleInfo.name;
        document.getElementById('chat-status-text').textContent = roleInfo.sub;
        
        const headerAv = document.getElementById('header-ai-avatar');
        if(roleInfo.avatar) { headerAv.style.backgroundImage = `url(${roleInfo.avatar})`; headerAv.innerHTML = ''; }
        else { headerAv.style.backgroundImage = ''; headerAv.innerHTML = '<i data-lucide="bot" style="width:18px;height:18px;"></i>'; lucide.createIcons({ root: headerAv }); }

        document.getElementById('chat-page-detail').classList.add('active'); 
        renderMessages();
        applyChatStylesToDOM();
    };

    document.getElementById('chat-back-to-list').addEventListener('click', () => {
        document.getElementById('chat-page-detail').classList.remove('active'); currentChatId = null; renderChatList(); 
    });

    const msgList = document.getElementById('chat-message-list');
    const inputArea = document.getElementById('chat-textarea');
    const sendBtn = document.getElementById('chat-send-btn');
    const statusText = document.getElementById('chat-status-text');
    const ctxMenu = document.getElementById('chat-context-menu');
    
    msgList.addEventListener('scroll', () => ctxMenu.style.display = 'none'); 
    msgList.addEventListener('click', () => ctxMenu.style.display = 'none');
    const scrollToBottom = () => { setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); };

    const renderMessages = () => {
        if(!currentChatId) return; 
        msgList.innerHTML = '';
        if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
        const history = globalChatData[currentChatId];
        const roleInfo = getCurrentRoleInfo();
        const styleConf = getChatStyleConfig();

        const bannerEl = document.createElement('div');
        bannerEl.className = 'chat-couple-banner';
        
        const userAvStyle = styleConf.userAvatar ? `background-image:url(${styleConf.userAvatar});` : '';
        const aiAvStyle = roleInfo.avatar ? `background-image:url(${roleInfo.avatar});` : '';

        bannerEl.innerHTML = `
            <div class="couple-avatars-box">
                <div class="couple-avatar-item" style="${userAvStyle}">${styleConf.userAvatar ? '' : '<i data-lucide="user"></i>'}</div>
                <div class="couple-avatar-item" style="${aiAvStyle}">${roleInfo.avatar ? '' : '<i data-lucide="bot"></i>'}</div>
            </div>
            <div class="couple-signature-text">${styleConf.signature}</div>
        `;
        msgList.appendChild(bannerEl);

        if(history.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'chat-empty';
            emptyEl.textContent = '暂无消息，打个招呼吧';
            msgList.appendChild(emptyEl);
            scrollToBottom();
            return;
        }

        history.forEach((msg, index) => {
            if(msg.recalled) {
                const recallEl = document.createElement('div');
                recallEl.style.cssText = 'text-align:center; font-size:11px; color:#8E8E93; margin:8px 0;';
                recallEl.textContent = msg.role === 'user' ? '你撤回了一条消息' : '对方撤回了一条消息';
                msgList.appendChild(recallEl);
                return;
            }

            const isUser = msg.role === 'user';
            const row = document.createElement('div');
            row.className = `chat-bubble-row ${isUser ? 'user' : 'ai'}`;

            if(isMultiSelectMode) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.cssText = 'margin: auto 8px; width: 18px; height: 18px; accent-color: #1C1C1E; cursor: pointer;';
                checkbox.checked = selectedIndices.has(index);
                checkbox.addEventListener('change', () => {
                    if(checkbox.checked) selectedIndices.add(index);
                    else selectedIndices.delete(index);
                });
                row.appendChild(checkbox);
            }

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
            
            let contentHtml = '';
            if(msg.quote) {
                contentHtml += `<div class="bubble-quote-box">${msg.quote}</div>`;
            }
            contentHtml += msg.content.replace(/\n/g, '<br>');
            bubble.innerHTML = contentHtml;

            const timeSub = document.createElement('div');
            timeSub.className = 'bubble-time-sub';
            timeSub.textContent = formatTime(msg.time);

            // 💥 完美内联计算：双击气泡下方弹出小浮窗，带百分之百安全的防溢出保护
            bubble.addEventListener('dblclick', (e) => {
                if(isMultiSelectMode) return;
                selectedMsgIndex = index; 
                const rect = bubble.getBoundingClientRect();
                const containerRect = msgList.getBoundingClientRect();
                
                let leftPos = rect.left + rect.width / 2 - containerRect.left;
                const menuWidth = 170;
                if (leftPos + menuWidth / 2 > containerRect.width - 10) {
                    leftPos = containerRect.width - menuWidth / 2 - 10;
                } else if (leftPos - menuWidth / 2 < 10) {
                    leftPos = menuWidth / 2 + 10;
                }

                ctxMenu.style.left = `${leftPos - menuWidth / 2}px`; 
                ctxMenu.style.top = `${rect.bottom - containerRect.top + msgList.scrollTop + 6}px`; 
                ctxMenu.style.display = 'grid';
            });

            col.appendChild(bubble);
            col.appendChild(timeSub);

            row.appendChild(avDiv);
            row.appendChild(col);
            msgList.appendChild(row);
        });
        lucide.createIcons({ root: msgList });
        scrollToBottom();
    };

    document.getElementById('ctx-btn-copy').addEventListener('click', (e) => {
        e.stopPropagation(); 
        if(selectedMsgIndex !== null && currentChatId) {
            navigator.clipboard.writeText(globalChatData[currentChatId][selectedMsgIndex].content).then(() => alert('已复制'));
        }
        ctxMenu.style.display = 'none';
    });

    document.getElementById('ctx-btn-quote').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) {
            const msg = globalChatData[currentChatId][selectedMsgIndex];
            quoteMessage = msg.content;
            document.getElementById('quote-bar-text').textContent = `引用: ${msg.content}`;
            document.getElementById('chat-quote-bar').style.display = 'flex';
            inputArea.focus();
        }
        ctxMenu.style.display = 'none';
    });

    document.getElementById('quote-close-btn').addEventListener('click', () => {
        quoteMessage = null;
        document.getElementById('chat-quote-bar').style.display = 'none';
    });

    document.getElementById('ctx-btn-recall').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) {
            globalChatData[currentChatId][selectedMsgIndex].recalled = true;
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            renderMessages();
        }
        ctxMenu.style.display = 'none';
    });

    document.getElementById('ctx-btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) {
            globalChatData[currentChatId].splice(selectedMsgIndex, 1);
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            renderMessages();
        }
        ctxMenu.style.display = 'none';
    });

    document.getElementById('ctx-btn-purge').addEventListener('click', (e) => {
        e.stopPropagation();
        if(selectedMsgIndex !== null && currentChatId) {
            const msgText = globalChatData[currentChatId][selectedMsgIndex].content;
            globalChatData[currentChatId].splice(selectedMsgIndex, 1);
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));

            let memories = JSON.parse(localStorage.getItem('wuyo_memories')) || {};
            if(memories[currentRole]) {
                memories[currentRole] = memories[currentRole].filter(m => !m.text.includes(msgText));
                localStorage.setItem('wuyo_memories', JSON.stringify(memories));
            }
            alert("已彻底删除该消息及相关关联记忆。");
            renderMessages();
        }
        ctxMenu.style.display = 'none';
    });

    document.getElementById('ctx-btn-multiselect').addEventListener('click', (e) => {
        e.stopPropagation();
        isMultiSelectMode = true;
        selectedIndices.clear();
        if(selectedMsgIndex !== null) selectedIndices.add(selectedMsgIndex);
        document.getElementById('chat-multiselect-bar').style.display = 'flex';
        ctxMenu.style.display = 'none';
        renderMessages();
    });

    document.getElementById('ms-btn-cancel').addEventListener('click', () => {
        isMultiSelectMode = false;
        selectedIndices.clear();
        document.getElementById('chat-multiselect-bar').style.display = 'none';
        renderMessages();
    });

    document.getElementById('ms-btn-delete-all').addEventListener('click', () => {
        if(selectedIndices.size === 0) return alert("请先勾选要删除的消息！");
        if(confirm(`确定删除选中的 ${selectedIndices.size} 条消息吗？`)) {
            const sortedIndices = Array.from(selectedIndices).sort((a, b) => b - a);
            sortedIndices.forEach(idx => {
                globalChatData[currentChatId].splice(idx, 1);
            });
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            isMultiSelectMode = false;
            selectedIndices.clear();
            document.getElementById('chat-multiselect-bar').style.display = 'none';
            renderMessages();
        }
    });

    // 打开设置菜单
    document.getElementById('chat-btn-settings').addEventListener('click', () => {
        const styleConf = getChatStyleConfig();
        const roleInfo = getCurrentRoleInfo();
        document.getElementById('couple-sign-input').value = styleConf.signature;
        document.getElementById('bubble-color-picker').value = styleConf.bubbleBg;
        document.getElementById('bubble-fontsize-select').value = styleConf.bubbleFontSize;
        document.getElementById('bubble-radius-select').value = styleConf.bubbleRadius;
        document.getElementById('show-user-avatar-toggle').checked = styleConf.showUserAvatar;
        document.getElementById('show-ai-avatar-toggle').checked = styleConf.showAiAvatar;
        document.getElementById('chat-pinned-toggle').checked = roleInfo.pinned;
        document.getElementById('chat-mute-toggle').checked = roleInfo.muted;
        
        const pUser = document.getElementById('preview-user-av');
        if(styleConf.userAvatar) pUser.style.backgroundImage = `url(${styleConf.userAvatar})`; else pUser.style.backgroundImage = '';
        
        const pAi = document.getElementById('preview-ai-av');
        if(roleInfo.avatar) pAi.style.backgroundImage = `url(${roleInfo.avatar})`; else pAi.style.backgroundImage = '';

        document.getElementById('bg-img-status').textContent = styleConf.bgImg ? '已设置背景' : '点击上传';
        document.getElementById('chat-page-settings').classList.add('active');
    });
    
    document.getElementById('chat-settings-back').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
        renderMessages(); 
        applyChatStylesToDOM();
    });

    // 保存设置按钮
    document.getElementById('settings-save-btn').addEventListener('click', () => {
        const sig = document.getElementById('couple-sign-input').value;
        const bubbleBg = document.getElementById('bubble-color-picker').value;
        const fontSize = document.getElementById('bubble-fontsize-select').value;
        const radius = document.getElementById('bubble-radius-select').value;
        const showUserAv = document.getElementById('show-user-avatar-toggle').checked;
        const showAiAv = document.getElementById('show-ai-avatar-toggle').checked;
        const isPinned = document.getElementById('chat-pinned-toggle').checked;
        const isMuted = document.getElementById('chat-mute-toggle').checked;

        if(currentChatId) {
            let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
            let r = roles.find(item => item.id === currentChatId);
            if(r) {
                r.pinned = isPinned;
                r.muted = isMuted;
                if(tempEditableAiAvatar) r.faceImg = tempEditableAiAvatar;
                localStorage.setItem('wuyo_roles', JSON.stringify(roles));
            }
        }

        let coupleConf = JSON.parse(localStorage.getItem('wuyo_couple_config')) || {};
        coupleConf.signature = sig;
        if(tempEditableUserAvatar) coupleConf.userAvatar = tempEditableUserAvatar;
        localStorage.setItem('wuyo_couple_config', JSON.stringify(coupleConf));

        let chatStyleConf = JSON.parse(localStorage.getItem('wuyo_chat_style_config')) || {};
        chatStyleConf.bubbleBg = bubbleBg;
        chatStyleConf.bubbleFontSize = fontSize;
        chatStyleConf.bubbleRadius = radius;
        chatStyleConf.showUserAvatar = showUserAv;
        chatStyleConf.showAiAvatar = showAiAv;
        if(tempEditableBgImg) chatStyleConf.bgImg = tempEditableBgImg;
        localStorage.setItem('wuyo_chat_style_config', JSON.stringify(chatStyleConf));

        alert("设置保存成功！");
        document.getElementById('chat-page-settings').classList.remove('active');
        
        applyChatStylesToDOM();
        renderMessages();
    });

    let activeUploadTarget = null;
    document.getElementById('set-user-avatar-btn').addEventListener('click', () => { activeUploadTarget = 'user'; document.getElementById('couple-avatar-uploader').click(); });
    document.getElementById('set-ai-avatar-btn').addEventListener('click', () => { activeUploadTarget = 'ai'; document.getElementById('couple-avatar-uploader').click(); });
    document.getElementById('set-bg-img-btn').addEventListener('click', () => { document.getElementById('chat-bg-uploader').click(); });

    document.getElementById('couple-avatar-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const res = event.target.result;
                if(activeUploadTarget === 'user') {
                    tempEditableUserAvatar = res;
                    document.getElementById('preview-user-av').style.backgroundImage = `url(${res})`;
                } else if(activeUploadTarget === 'ai') {
                    tempEditableAiAvatar = res;
                    document.getElementById('preview-ai-av').style.backgroundImage = `url(${res})`;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('chat-bg-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempEditableBgImg = event.target.result;
                document.getElementById('bg-img-status').textContent = '已选择新背景';
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('import-theme-preset').addEventListener('click', () => {
        const code = prompt("请粘贴或输入美化预设的 JSON 配置代码：");
        if(code) {
            try {
                const json = JSON.parse(code);
                if(json.bubbleBg) document.getElementById('bubble-color-picker').value = json.bubbleBg;
                if(json.bubbleFontSize) document.getElementById('bubble-fontsize-select').value = json.bubbleFontSize;
                if(json.bubbleRadius) document.getElementById('bubble-radius-select').value = json.bubbleRadius;
                if(json.signature) document.getElementById('couple-sign-input').value = json.signature;
                if(json.showUserAvatar !== undefined) document.getElementById('show-user-avatar-toggle').checked = json.showUserAvatar;
                if(json.showAiAvatar !== undefined) document.getElementById('show-ai-avatar-toggle').checked = json.showAiAvatar;
                alert("预设导入成功！请点击右上角「保存」生效。");
            } catch(err) {
                alert("JSON 代码格式错误，导入失败！");
            }
        }
    });

    document.getElementById('settings-btn-clear').addEventListener('click', () => {
        if(confirm('清空聊天记录？不可恢复！')) {
            globalChatData[currentChatId] = []; localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            renderMessages(); document.getElementById('chat-page-settings').classList.remove('active');
        }
    });

    document.getElementById('settings-btn-memory').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
        container.style.display = 'none'; window.openApp('memory');
        setTimeout(() => { if(window.openMemory) window.openMemory(currentChatId, document.getElementById('chat-char-name').textContent, 'chat'); }, 100);
    });

    document.getElementById('settings-btn-profile').addEventListener('click', () => {
        document.getElementById('chat-page-settings').classList.remove('active');
        if(window.openRoleProfile) { container.style.display = 'none'; window.openApp('contacts'); window.openRoleProfile(currentChatId); }
    });

    inputArea.addEventListener('input', function() {
        this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        if(this.value.trim() !== '') { sendBtn.classList.add('active'); } 
        else { sendBtn.classList.remove('active'); }
    });

    const buildSystemPrompt = () => {
        let finalPrompt = "";
        if (window.getAllActiveWorldbookContext) finalPrompt += window.getAllActiveWorldbookContext() + "\n\n";
        if (window.getMemoryContext) finalPrompt += window.getMemoryContext(currentChatId) + "\n\n";
        const personaStr = localStorage.getItem('wuyo_settings_persona');
        if (personaStr) { const persona = JSON.parse(personaStr); finalPrompt += `[SYSTEM: USER]\n${persona.name||'未知'}\n${persona.info||'未知'}\n\n`; }
        const roleInfo = getCurrentRoleInfo();
        finalPrompt += `[SYSTEM: CHAR]\n${roleInfo.name}\n\n`;
        const now = new Date(); finalPrompt += `[SYSTEM: TIME]\n${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${formatTime(now.getTime())}\n\n`;
        return finalPrompt.trim();
    };

    const triggerAiReply = async () => {
        if(!currentChatId) return;
        const roleInfo = getCurrentRoleInfo();
        const apiConfigStr = localStorage.getItem('wuyo_settings_api');
        if(!apiConfigStr) return alert("请先在设置中配置 API！");
        const apiConfig = JSON.parse(apiConfigStr);
        if(!apiConfig.chat || !apiConfig.chat.url || !apiConfig.chat.key) return alert("API 配置不完整！");

        statusText.textContent = roleInfo.muted ? '对方正在输入 (免打扰)' : '对方正在输入...';
        statusText.style.color = '#1C1C1E';
        
        const aiMsgObj = { role: 'assistant', content: '', time: Date.now() };
        if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
        globalChatData[currentChatId].push(aiMsgObj); 
        renderMessages(); 
        
        const rows = msgList.querySelectorAll('.chat-bubble-row.ai'); 
        const currentBubble = rows[rows.length - 1].querySelector('.chat-bubble');
        const historyContext = globalChatData[currentChatId].slice(-21, -1).map(m => ({ role: m.role, content: m.content }));
        const apiMessages = [{ role: 'system', content: buildSystemPrompt() }, ...historyContext];

        try {
            const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
            const response = await fetch(cleanUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                body: JSON.stringify({ model: apiConfig.chat.model, messages: apiMessages, temperature: parseFloat(apiConfig.chat.temp) || 0.7, stream: true })
            });
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            const reader = response.body.getReader(); const decoder = new TextDecoder('utf-8'); let done = false;
            while(!done) {
                const {value, done: readerDone} = await reader.read(); done = readerDone;
                if(value) {
                    const chunk = decoder.decode(value, {stream: true}); const lines = chunk.split('\n');
                    for(let line of lines) {
                        if(line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if(data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                    aiMsgObj.content += data.choices[0].delta.content; currentBubble.innerHTML = aiMsgObj.content.replace(/\n/g, '<br>'); scrollToBottom();
                                }
                            } catch(e) { }
                        }
                    }
                }
            }
            statusText.textContent = roleInfo.muted ? '在线 (免打扰)' : '在线';
            statusText.style.color = '#8E8E93';
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); renderChatList(); 
        } catch (error) {
            statusText.textContent = '未连接'; aiMsgObj.content = `[错误: ${error.message}]`; currentBubble.innerHTML = aiMsgObj.content;
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
        }
    };

    const sendUserMessage = () => {
        const text = inputArea.value.trim(); if(!text || !currentChatId) return;
        if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
        
        let finalContent = text;
        if(quoteMessage) {
            finalContent = `<span style="font-size:12px; opacity:0.75; border-left:2px solid rgba(0,0,0,0.2); padding-left:6px; display:block; margin-bottom:4px;">引用: ${quoteMessage}</span>${text}`;
            quoteMessage = null;
            document.getElementById('chat-quote-bar').style.display = 'none';
        }

        globalChatData[currentChatId].push({ role: 'user', content: finalContent, time: Date.now() }); 
        localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
        
        inputArea.value = ''; inputArea.style.height = 'auto'; 
        renderMessages(); 
        triggerAiReply(); 
    };

    sendBtn.addEventListener('click', sendUserMessage);
    inputArea.addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUserMessage(); } });
    document.getElementById('chat-ext-ai').addEventListener('click', triggerAiReply);
    renderChatList();
})();
