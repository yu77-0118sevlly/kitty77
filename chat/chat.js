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
        let tempLocalWbContent = ''; 

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
                localWbEnabled: conf.localWbEnabled || false,
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
            tempEditableUserAvatar = ''; tempEditableAiAvatar = ''; tempEditableBgImg = '';
            tempLocalWbContent = localStorage.getItem('wuyo_localwb_' + charId) || '';
            
            isMultiSelectMode = false; selectedIndices.clear();
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
        // 💥 新的极简输入框 ID
        const inputArea = document.getElementById('chat-msg-input');
        const sendBtn = document.getElementById('chat-user-send-btn');
        const aiReplyBtn = document.getElementById('chat-ai-reply-btn');
        const ctxMenu = document.getElementById('chat-context-menu');
        
        msgList.addEventListener('scroll', () => ctxMenu.classList.remove('show')); 
        msgList.addEventListener('click', () => ctxMenu.classList.remove('show'));
        const scrollToBottom = () => { setTimeout(() => { msgList.scrollTop = msgList.scrollHeight; }, 50); };

        const fetchInnerVoice = async (roleName) => {
            document.getElementById('iv-modal-title').textContent = `${roleName} 的心声`;
            document.getElementById('iv-modal-content').textContent = '正在获取心声...';
            document.getElementById('inner-voice-modal').style.display = 'flex';
            
            try {
                const apiConfigStr = localStorage.getItem('wuyo_settings_api');
                if(!apiConfigStr) throw new Error("API未配置");
                const apiConfig = JSON.parse(apiConfigStr);
                const historyContext = globalChatData[currentChatId].slice(-10).map(m => ({ role: m.role, content: m.content }));
                
                const sysPrompt = `[SYSTEM]\nBased on the conversation context, generate the CURRENT inner thoughts and feelings of ${roleName}. Do not use any quotes. Maximum 2 short sentences. STRICTLY NO EMOJIS. Maintain a minimalist, black-and-white tone. Use Simplified Chinese.`;
                const apiMessages = [{ role: 'system', content: sysPrompt }, ...historyContext];
                
                const cleanUrl = apiConfig.chat.url.replace(/\/+$/, '') + '/v1/chat/completions';
                const response = await fetch(cleanUrl, {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.chat.key}` },
                    body: JSON.stringify({ model: apiConfig.chat.model, messages: apiMessages, temperature: 0.8 })
                });
                const data = await response.json();
                document.getElementById('iv-modal-content').textContent = data.choices[0].message.content.trim();
            } catch(e) {
                document.getElementById('iv-modal-content').textContent = '获取心声失败: ' + e.message;
            }
        };

        document.getElementById('iv-modal-close').addEventListener('click', () => {
            document.getElementById('inner-voice-modal').style.display = 'none';
        });

        const renderMessages = () => {
            if(!currentChatId) return; 
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
                    
                    if (behaviorConf.innerVoice) {
                        avDiv.style.cursor = 'pointer';
                        avDiv.title = '点击查看心声';
                        avDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            fetchInnerVoice(roleInfo.name);
                        });
                    }
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
                
                if (!behaviorConf.showTimestamp) {
                    timeSub.style.display = 'none';
                }

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
                                        messages: [{role: 'user', content: `请将以下内容翻译成简体中文，只返回翻译结果，没有任何表情符号：\n${msg.content.replace(/<[^>]*>?/gm, '')}`}],
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

        // ... 省略 ctxMenu 事件绑定 ...

        // ==========================================
        // 💥 构建系统提示词（强制洗脑版）
        // ==========================================
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
                finalPrompt += `[SYSTEM: USER SETTING]\n${persona.name||'未知'}\n${persona.info||'未知'}\n\n`;
            }
            
            const roleInfo = getCurrentRoleInfo();
            finalPrompt += `[SYSTEM: YOUR ROLE]\nYou are: ${roleInfo.name}\n\n`;
            
            const styleConf = getChatStyleConfig();
            const bConf = getBehaviorConfig();
            
            if (bConf.localWbEnabled) {
                const lwb = localStorage.getItem('wuyo_localwb_' + currentChatId);
                if (lwb) finalPrompt += `[SYSTEM: LOCAL DATA]\n${lwb}\n\n`;
            }
            
            let uT = new Date().toLocaleString();
            let aT = new Date().toLocaleString();
            try {
                uT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.userTimezone});
                aT = new Date().toLocaleString("zh-CN", {timeZone: styleConf.aiTimezone});
            } catch (e) {}

            const uW = await fetchWeather(styleConf.userTimezone);
            const aW = await fetchWeather(styleConf.aiTimezone);
            
            // 💥 强制人设与位置注入
            finalPrompt += `
[CRITICAL SYSTEM DIRECTIVES: ENVIRONMENT & LOCATION]
- The User is currently in ${styleConf.userTimezone}. Their current local time is: ${uT}. Weather: ${uW}.
- YOU are currently physically located in ${styleConf.aiTimezone}. Your current local time is: ${aT}. Weather: ${aW}.
- You MUST actively simulate being in your physical location (${styleConf.aiTimezone}). Act completely naturally according to your local time and environment.

[CRITICAL SYSTEM DIRECTIVES: LANGUAGE & STYLE (MANDATORY)]
1. YOU MUST NEVER USE EMOJIS OR EMOTICONS. Stay completely text-based, minimalist, and cold.
2. DO NOT use overly enthusiastic or subservient tones. Keep it short, natural, and realistic.
`;

            if(styleConf.aiLanguage && styleConf.aiLanguage !== 'default') {
                // 强制只用对应语言回复，绝不允许穿插中文
                finalPrompt += `3. CRITICAL: You are FORBIDDEN from speaking Chinese. You MUST reply ONLY and STRICTLY in ${styleConf.aiLanguage}. If the user speaks Chinese, you understand it but STILL reply ONLY in ${styleConf.aiLanguage}!\n\n`;
                
                if(styleConf.autoTranslate) {
                    finalPrompt += `4. Immediately after your ${styleConf.aiLanguage} response, you MUST append a Simplified Chinese translation exactly formatted like this:\n<hr class="trans-line"><div class="trans-text">中文翻译</div>\n\n`;
                }
            } else {
                finalPrompt += `3. Reply in Simplified Chinese unless specified otherwise.\n\n`;
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

        // 💥 绑定新版的点击事件
        sendBtn.addEventListener('click', sendUserMessage);
        aiReplyBtn.addEventListener('click', triggerAiReply);
        inputArea.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                sendUserMessage(); 
            } 
        });

        // AI 主动发送消息轮询
        setInterval(() => {
            if (!currentChatId || document.visibilityState !== 'visible') return;
            const bConf = getBehaviorConfig();
            if (!bConf.proactiveEnabled || !bConf.proactiveInterval) return;

            const now = new Date(); 
            const currentMin = now.getHours() * 60 + now.getMinutes();
            const parseTime = (t) => { const [h,m] = t.split(':'); return parseInt(h)*60 + parseInt(m); };
            const startM = parseTime(bConf.dndStart || '23:00'); 
            const endM = parseTime(bConf.dndEnd || '08:00');
            
            let isDnd = false;
            if (startM < endM) {
                isDnd = (currentMin >= startM && currentMin < endM);
            } else {
                isDnd = (currentMin >= startM || currentMin < endM);
            }
            if (isDnd) return;

            const history = globalChatData[currentChatId] || [];
            if (history.length === 0) return;
            
            const lastMsg = history[history.length - 1];
            
            if (Date.now() - lastMsg.time > bConf.proactiveInterval * 60000) {
                const statusText = document.getElementById('chat-status-text');
                if (statusText.textContent.includes('正在输入')) return;
                triggerAiReply(); 
            }
        }, 15000);

        renderChatList();
    }
})();
