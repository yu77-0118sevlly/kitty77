(function() {
    const container = document.getElementById('chat-app');
    if (!container) return;

    // 动态加载视图模板
    const script = document.createElement('script');
    script.src = 'chat/chat-view.js?v=' + Date.now();
    script.onload = () => {
        container.innerHTML = window.ChatViewTemplate;
        lucide.createIcons({ root: container });
        initChatLogic();
    };
    document.head.appendChild(script);

    function initChatLogic() {
        document.getElementById('nav-btn-contacts').addEventListener('click', () => { 
            container.style.display = 'none'; 
            window.openApp('contacts'); 
        });

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
            let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [{ id: 'char_default', name: 'AI 伙伴', avatar: '' }];
            
            roles.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

            let html = '';
            roles.forEach(role => {
                const history = globalChatData[role.id] || [];
                let lastMsg = '准备好开始对话了...'; 
                let lastTime = '';
                if(history.length > 0) { 
                    lastMsg = history[history.length - 1].content; 
                    lastTime = formatTime(history[history.length - 1].time); 
                }

                const avatarStyle = role.faceImg || role.avatar ? `background-image: url(${role.faceImg || role.avatar});` : ``;
                const avatarInner = role.faceImg || role.avatar ? '' : `<i data-lucide="bot"></i>`;
                const displayName = role.remark || role.name;
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
            document.getElementById('chat-input-area').style.display = 'flex';

            const roleInfo = getCurrentRoleInfo();
            document.getElementById('chat-char-name').textContent = roleInfo.name;
            document.getElementById('chat-status-text').textContent = roleInfo.sub;
            
            const headerAv = document.getElementById('header-ai-avatar');
            headerAv.style.backgroundImage = roleInfo.avatar ? `url(${roleInfo.avatar})` : '';
            headerAv.innerHTML = roleInfo.avatar ? '' : '<i data-lucide="bot" style="width:18px;height:18px;"></i>';
            lucide.createIcons({ root: headerAv });

            document.getElementById('chat-page-detail').classList.add('active'); 
            renderMessages();
            applyChatStylesToDOM();
        };

        document.getElementById('chat-back-to-list').addEventListener('click', () => { 
            document.getElementById('chat-page-detail').classList.remove('active'); 
            currentChatId = null; 
            renderChatList(); 
        });

        const msgList = document.getElementById('chat-message-list');
        const inputArea = document.getElementById('chat-textarea');
        const sendBtn = document.getElementById('chat-send-btn');
        const ctxMenu = document.getElementById('chat-context-menu');
        
        msgList.addEventListener('scroll', () => ctxMenu.classList.remove('show')); 
        msgList.addEventListener('click', () => ctxMenu.classList.remove('show'));
        const scrollToBottom = () => { setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); };

        const renderMessages = () => {
            if(!currentChatId) return; 
            msgList.innerHTML = '';
            const history = globalChatData[currentChatId] || [];
            const roleInfo = getCurrentRoleInfo();
            const styleConf = getChatStyleConfig();

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

                if(isMultiSelectMode) {
                    const checkContainer = document.createElement('div');
                    checkContainer.style.cssText = 'padding: 0 12px 0 16px; display: flex; align-items: center; justify-content: center; height: 34px;';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.style.cssText = 'width: 20px; height: 20px; accent-color: #1C1C1E; cursor: pointer; pointer-events: none;';
                    checkbox.checked = selectedIndices.has(index);
                    
                    checkContainer.appendChild(checkbox);
                    outerWrapper.appendChild(checkContainer);

                    outerWrapper.style.cursor = 'pointer';
                    outerWrapper.addEventListener('click', () => {
                        checkbox.checked = !checkbox.checked;
                        if (checkbox.checked) selectedIndices.add(index);
                        else selectedIndices.delete(index);
                    });
                }

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

                if(msg.translation) {
                    const transClass = msg.translation === '正在翻译...' ? 'trans-loading' : 'trans-text';
                    contentHtml += `<hr class="trans-line"><div class="${transClass}">${msg.translation.replace(/\n/g, '<br>')}</div>`;
                }

                bubble.innerHTML = contentHtml;

                const timeSub = document.createElement('div');
                timeSub.className = 'bubble-time-sub';
                timeSub.textContent = formatTime(msg.time);

                let clickTimer = null;
                bubble.addEventListener('click', (e) => {
                    if(isMultiSelectMode) return;
                    if(clickTimer) clearTimeout(clickTimer);
                    
                    clickTimer = setTimeout(async () => {
                        if(!isUser && styleConf.aiLanguage !== 'default' && !styleConf.autoTranslate && !msg.translation) {
                            msg.translation = '正在翻译...';
                            renderMessages();
                            
                            try {
                                const apiConfig = JSON.parse(localStorage.getItem('wuyo_settings_api'));
                                if (!apiConfig || !apiConfig.chat) throw new Error("API未配置");
                                const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
                                const transRes = await fetch(cleanUrl, {
                                    method: 'POST', 
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                                    body: JSON.stringify({
                                        model: apiConfig.chat.model,
                                        messages: [{role: 'user', content: `请将以下内容翻译成简体中文，只返回翻译结果：\n${msg.content.replace(/<[^>]*>?/gm, '')}`}],
                                        temperature: 0.1
                                    })
                                });
                                const data = await transRes.json();
                                msg.translation = data.choices[0].message.content.trim() || '翻译结果为空';
                            } catch(err) {
                                msg.translation = '翻译失败';
                            }
                            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
                            renderMessages();
                        }
                    }, 220); 
                });

                bubble.addEventListener('dblclick', (e) => {
                    if(isMultiSelectMode) return;
                    if(clickTimer) clearTimeout(clickTimer); 
                    
                    selectedMsgIndex = index; 
                    const rect = bubble.getBoundingClientRect();
                    const detailRect = document.getElementById('chat-page-detail').getBoundingClientRect();
                    
                    let leftPos = rect.left + rect.width / 2 - detailRect.left;
                    const menuWidth = 175; 
                    
                    if (leftPos + menuWidth / 2 > detailRect.width - 12) {
                        leftPos = detailRect.width - menuWidth / 2 - 12;
                    } else if (leftPos - menuWidth / 2 < 12) {
                        leftPos = menuWidth / 2 + 12;
                    }

                    ctxMenu.style.left = `${leftPos - menuWidth / 2}px`; 
                    ctxMenu.style.top = `${rect.bottom - detailRect.top + 8}px`; 
                    ctxMenu.classList.add('show');
                });

                col.appendChild(bubble);
                col.appendChild(timeSub);
                row.appendChild(avDiv);
                row.appendChild(col);
                
                outerWrapper.appendChild(row);
                msgList.appendChild(outerWrapper);
            });
            lucide.createIcons({ root: msgList });
            scrollToBottom();
        };

        const closeCtxMenu = () => ctxMenu.classList.remove('show');

        document.getElementById('ctx-btn-copy').addEventListener('click', (e) => {
            e.stopPropagation(); 
            if(selectedMsgIndex !== null && currentChatId) {
                navigator.clipboard.writeText(globalChatData[currentChatId][selectedMsgIndex].content).then(() => alert('已复制'));
            }
            closeCtxMenu();
        });

        document.getElementById('ctx-btn-quote').addEventListener('click', (e) => {
            e.stopPropagation();
            if(selectedMsgIndex !== null && currentChatId) {
                quoteMessage = globalChatData[currentChatId][selectedMsgIndex].content;
                document.getElementById('quote-bar-text').textContent = `引用: ${quoteMessage}`;
                document.getElementById('chat-quote-bar').style.display = 'flex';
                inputArea.focus();
            }
            closeCtxMenu();
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
            closeCtxMenu();
        });

        document.getElementById('ctx-btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            if(selectedMsgIndex !== null && currentChatId) {
                globalChatData[currentChatId].splice(selectedMsgIndex, 1);
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
                renderMessages();
            }
            closeCtxMenu();
        });

        document.getElementById('ctx-btn-purge').addEventListener('click', (e) => {
            e.stopPropagation();
            if(selectedMsgIndex !== null && currentChatId) {
                const msgText = globalChatData[currentChatId][selectedMsgIndex].content;
                globalChatData[currentChatId].splice(selectedMsgIndex, 1);
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));

                let memories = JSON.parse(localStorage.getItem('wuyo_memories')) || {};
                if(memories[currentChatId]) {
                    memories[currentChatId] = memories[currentChatId].filter(m => !m.text.includes(msgText));
                    localStorage.setItem('wuyo_memories', JSON.stringify(memories));
                }
                alert("已彻底删除该消息及相关关联记忆。");
                renderMessages();
            }
            closeCtxMenu();
        });

        document.getElementById('ctx-btn-multiselect').addEventListener('click', (e) => {
            e.stopPropagation();
            isMultiSelectMode = true;
            selectedIndices.clear();
            selectedIndices.add(selectedMsgIndex);
            
            document.getElementById('chat-input-area').style.display = 'none';
            document.getElementById('chat-multiselect-bar').style.display = 'flex';
            closeCtxMenu();
            renderMessages();
        });

        document.getElementById('ms-btn-cancel').addEventListener('click', () => {
            isMultiSelectMode = false;
            selectedIndices.clear();
            document.getElementById('chat-multiselect-bar').style.display = 'none';
            document.getElementById('chat-input-area').style.display = 'flex';
            renderMessages();
        });

        document.getElementById('ms-btn-delete-all').addEventListener('click', () => {
            if(selectedIndices.size === 0) return alert("请先勾选要删除的消息！");
            if(confirm(`确定删除选中的 ${selectedIndices.size} 条消息吗？`)) {
                const sortedIndices = Array.from(selectedIndices).sort((a, b) => b - a);
                sortedIndices.forEach(idx => globalChatData[currentChatId].splice(idx, 1));
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
                
                isMultiSelectMode = false;
                selectedIndices.clear();
                document.getElementById('chat-multiselect-bar').style.display = 'none';
                document.getElementById('chat-input-area').style.display = 'flex';
                renderMessages();
            }
        });

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
            
            document.getElementById('user-timezone-select').value = styleConf.userTimezone;
            document.getElementById('ai-timezone-select').value = styleConf.aiTimezone;
            document.getElementById('ai-language-select').value = styleConf.aiLanguage;
            document.getElementById('auto-translate-toggle').checked = styleConf.autoTranslate;
            
            const pUser = document.getElementById('preview-user-av');
            pUser.style.backgroundImage = styleConf.userAvatar ? `url(${styleConf.userAvatar})` : '';
            const pAi = document.getElementById('preview-ai-av');
            pAi.style.backgroundImage = roleInfo.avatar ? `url(${roleInfo.avatar})` : '';

            document.getElementById('bg-img-status').textContent = styleConf.bgImg ? '已设置背景' : '点击上传';
            document.getElementById('chat-page-settings').classList.add('active');
        });

        // 💥 新增：打开独立的二级高级设置页面
        document.getElementById('settings-btn-advanced').addEventListener('click', () => {
            document.getElementById('chat-page-advanced-settings').classList.add('active');
        });

        // 💥 新增：关闭二级高级设置页面
        document.getElementById('advanced-settings-back').addEventListener('click', () => {
            document.getElementById('chat-page-advanced-settings').classList.remove('active');
        });
        
        document.getElementById('chat-settings-back').addEventListener('click', () => {
            document.getElementById('chat-page-settings').classList.remove('active');
            renderMessages(); 
            applyChatStylesToDOM();
        });

        document.getElementById('settings-save-btn').addEventListener('click', () => {
            if(currentChatId) {
                let roles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
                let r = roles.find(item => item.id === currentChatId);
                if(r) {
                    r.pinned = document.getElementById('chat-pinned-toggle').checked;
                    r.muted = document.getElementById('chat-mute-toggle').checked;
                    if(tempEditableAiAvatar) r.faceImg = tempEditableAiAvatar;
                    localStorage.setItem('wuyo_roles', JSON.stringify(roles));
                }
            }

            let coupleConf = JSON.parse(localStorage.getItem('wuyo_couple_config')) || {};
            coupleConf.signature = document.getElementById('couple-sign-input').value;
            if(tempEditableUserAvatar) coupleConf.userAvatar = tempEditableUserAvatar;
            localStorage.setItem('wuyo_couple_config', JSON.stringify(coupleConf));

            let chatStyleConf = JSON.parse(localStorage.getItem('wuyo_chat_style_config')) || {};
            chatStyleConf.bubbleBg = document.getElementById('bubble-color-picker').value;
            chatStyleConf.bubbleFontSize = document.getElementById('bubble-fontsize-select').value;
            chatStyleConf.bubbleRadius = document.getElementById('bubble-radius-select').value;
            chatStyleConf.showUserAvatar = document.getElementById('show-user-avatar-toggle').checked;
            chatStyleConf.showAiAvatar = document.getElementById('show-ai-avatar-toggle').checked;
            chatStyleConf.userTimezone = document.getElementById('user-timezone-select').value;
            chatStyleConf.aiTimezone = document.getElementById('ai-timezone-select').value;
            chatStyleConf.aiLanguage = document.getElementById('ai-language-select').value;
            chatStyleConf.autoTranslate = document.getElementById('auto-translate-toggle').checked;
            
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
                    if(activeUploadTarget === 'user') {
                        tempEditableUserAvatar = event.target.result;
                        document.getElementById('preview-user-av').style.backgroundImage = `url(${event.target.result})`;
                    } else {
                        tempEditableAiAvatar = event.target.result;
                        document.getElementById('preview-ai-av').style.backgroundImage = `url(${event.target.result})`;
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
                globalChatData[currentChatId] = [];
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
                renderMessages();
                document.getElementById('chat-page-settings').classList.remove('active');
            }
        });

        document.getElementById('settings-btn-memory').addEventListener('click', () => {
            document.getElementById('chat-page-settings').classList.remove('active');
            container.style.display = 'none';
            window.openApp('memory');
            setTimeout(() => { if(window.openMemory) window.openMemory(currentChatId, document.getElementById('chat-char-name').textContent, 'chat'); }, 100);
        });

        document.getElementById('settings-btn-profile').addEventListener('click', () => {
            document.getElementById('chat-page-settings').classList.remove('active');
            if(window.openRoleProfile) {
                container.style.display = 'none';
                window.openApp('contacts');
                window.openRoleProfile(currentChatId);
            }
        });

        inputArea.addEventListener('input', function() {
            this.style.height = 'auto'; 
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            if(this.value.trim() !== '') sendBtn.classList.add('active');
            else sendBtn.classList.remove('active');
        });

        const fetchWeather = async (tz) => {
            try {
                const city = tz.split('/').pop().replace('_', ' ');
                const res = await fetch(`https://wttr.in/${city}?format=j1`);
                const data = await res.json();
                return `${data.current_condition[0].lang_zh[0].value}, ${data.current_condition[0].temp_C}°C`;
            } catch(e) {
                return '未知';
            }
        };

        const buildSystemPrompt = async () => {
            let finalPrompt = "";
            if (window.getAllActiveWorldbookContext) finalPrompt += window.getAllActiveWorldbookContext() + "\n\n";
            if (window.getMemoryContext) finalPrompt += window.getMemoryContext(currentChatId) + "\n\n";
            const personaStr = localStorage.getItem('wuyo_settings_persona');
            if (personaStr) {
                const persona = JSON.parse(personaStr);
                finalPrompt += `[SYSTEM: USER]\n${persona.name||'未知'}\n${persona.info||'未知'}\n\n`;
            }
            
            const roleInfo = getCurrentRoleInfo();
            finalPrompt += `[SYSTEM: CHAR]\n${roleInfo.name}\n\n`;
            
            const styleConf = getChatStyleConfig();
            
            let uT = new Date().toLocaleString();
            let aT = new Date().toLocaleString();
            try {
                uT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.userTimezone});
                aT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.aiTimezone});
            } catch (e) {}

            const uW = await fetchWeather(styleConf.userTimezone);
            const aW = await fetchWeather(styleConf.aiTimezone);
            
            finalPrompt += `[SYSTEM: 异地模式与实时环境]\nUser Location: ${styleConf.userTimezone}. Current Time: ${uT}. Weather: ${uW}.\nYour Location: ${styleConf.aiTimezone}. Current Time: ${aT}. Weather: ${aW}.\nDirective: You MUST be fully aware of the time difference and weather. Actively simulate the current local environment for your location and naturally incorporate the weather and time into your responses to enhance realism.\n\n`;
            
            if(styleConf.aiLanguage && styleConf.aiLanguage !== 'default') {
                if(styleConf.autoTranslate) {
                    finalPrompt += `[SYSTEM: LANGUAGE & TRANSLATION]\nYou MUST strictly reply in ${styleConf.aiLanguage}. Immediately after your ${styleConf.aiLanguage} reply, you MUST append a Simplified Chinese translation exactly formatted like this:\n<hr class="trans-line"><div class="trans-text">您的中文翻译内容</div>\n\n`;
                } else {
                    finalPrompt += `[SYSTEM: LANGUAGE]\nYou MUST strictly reply in ${styleConf.aiLanguage}. DO NOT append any Chinese translation.\n\n`;
                }
            }
            return finalPrompt.trim();
        };

        const triggerAiReply = async () => {
            if(!currentChatId) return;
            const roleInfo = getCurrentRoleInfo();
            const apiConfigStr = localStorage.getItem('wuyo_settings_api');
            if(!apiConfigStr) return alert("请先在设置中配置 API！");
            const apiConfig = JSON.parse(apiConfigStr);
            if(!apiConfig.chat || !apiConfig.chat.url || !apiConfig.chat.key) return alert("API 配置不完整！");

            const statusText = document.getElementById('chat-status-text');
            statusText.textContent = roleInfo.muted ? '对方正在输入 (免打扰)' : '对方正在输入...';
            statusText.style.color = '#1C1C1E';
            
            const aiMsgObj = { role: 'assistant', content: '', time: Date.now() };
            if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
            globalChatData[currentChatId].push(aiMsgObj); 
            renderMessages(); 
            
            const rows = msgList.querySelectorAll('.chat-bubble-row.ai'); 
            const currentBubble = rows[rows.length - 1].querySelector('.chat-bubble');
            const historyContext = globalChatData[currentChatId].slice(-21, -1).map(m => ({ role: m.role, content: m.content }));
            
            const sysPrompt = await buildSystemPrompt(); 
            const apiMessages = [{ role: 'system', content: sysPrompt }, ...historyContext];

            try {
                const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
                const response = await fetch(cleanUrl, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                    body: JSON.stringify({ model: apiConfig.chat.model, messages: apiMessages, temperature: parseFloat(apiConfig.chat.temp) || 0.7, stream: true })
                });
                if(!response.ok) throw new Error(`HTTP ${response.status}`);
                
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
                statusText.textContent = roleInfo.muted ? '在线 (免打扰)' : '在线';
                statusText.style.color = '#8E8E93';
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData)); 
                renderChatList(); 
            } catch (error) {
                statusText.textContent = '未连接'; 
                aiMsgObj.content = `[错误: ${error.message}]`; 
                currentBubble.innerHTML = aiMsgObj.content;
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            }
        };

        const sendUserMessage = () => {
            const text = inputArea.value.trim(); 
            if(!text || !currentChatId) return;
            
            if(!globalChatData[currentChatId]) globalChatData[currentChatId] = [];
            
            let finalContent = text;
            if(quoteMessage) {
                finalContent = `<div class="bubble-quote-box">${quoteMessage}</div>${text}`;
                quoteMessage = null;
                document.getElementById('chat-quote-bar').style.display = 'none';
            }

            globalChatData[currentChatId].push({ role: 'user', content: finalContent, time: Date.now() }); 
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChatData));
            
            inputArea.value = ''; 
            inputArea.style.height = 'auto'; 
            renderMessages(); 
            triggerAiReply(); 
        };

        sendBtn.addEventListener('click', sendUserMessage);
        inputArea.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                sendUserMessage(); 
            } 
        });
        document.getElementById('chat-ext-ai').addEventListener('click', triggerAiReply);
        
        renderChatList();
    }
})();
