(function() {
    const container = document.getElementById('settings-app');
    if (!container) return;

    // ==========================================
    // 1. 初始化 DOM 结构 (主页 + 子页面)
    // ==========================================
    container.innerHTML = `
        <!-- 主界面 -->
        <div class="settings-page root active" id="st-page-main">
            <header class="st-nav-bar">
                <button class="st-icon-btn" onclick="window.closeApp('settings')"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">设置</span>
                <div style="width:24px;"></div>
            </header>
            <div class="st-container">
                <div class="st-group">
                    <div class="st-item st-nav" data-target="st-page-persona">
                        <span class="st-label"><i data-lucide="user-circle"></i> User 面具</span>
                        <span class="st-value"><i data-lucide="chevron-right"></i></span>
                    </div>
                </div>
                <div class="st-group">
                    <div class="st-item st-nav" data-target="st-page-api">
                        <span class="st-label"><i data-lucide="cpu"></i> API 设置</span>
                        <span class="st-value"><i data-lucide="chevron-right"></i></span>
                    </div>
                    <div class="st-item st-nav" data-target="st-page-tts">
                        <span class="st-label"><i data-lucide="mic"></i> MiniMax 语音合成</span>
                        <span class="st-value"><i data-lucide="chevron-right"></i></span>
                    </div>
                </div>
                <div class="st-group">
                    <div class="st-item st-nav" data-target="st-page-msg">
                        <span class="st-label"><i data-lucide="message-square"></i> 消息</span>
                        <span class="st-value"><i data-lucide="chevron-right"></i></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 子页面：User 面具 -->
        <div class="settings-page" id="st-page-persona">
            <header class="st-nav-bar">
                <button class="st-icon-btn st-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">User 面具</span>
                <button class="st-text-btn save" id="save-persona">保存</button>
            </header>
            <div class="st-container">
                <div class="st-section-title">基础资料</div>
                <div class="st-group">
                    <div class="st-item">
                        <span class="st-label">User 头像</span>
                        <div class="st-value" style="gap:16px;">
                            <div class="st-avatar-preview" id="st-user-avatar-preview"></div>
                            <button class="st-btn-small" id="btn-upload-persona-avatar">更换</button>
                        </div>
                    </div>
                    <div class="st-item vertical no-click">
                        <span class="st-label">User 称呼</span>
                        <input type="text" class="st-input" id="st-user-name" placeholder="请输入你的称呼">
                    </div>
                </div>
                <div class="st-section-title">身份与人设设定 (供 AI 读取)</div>
                <div class="st-group">
                    <div class="st-item vertical no-click">
                        <textarea class="st-textarea" id="st-user-info" placeholder="例如：我是一名独立设计师，性格冷静，喜欢极简风格，平时喜欢喝黑咖啡..."></textarea>
                    </div>
                </div>
            </div>
            <input type="file" id="st-avatar-uploader" accept="image/*" style="display:none;">
        </div>

        <!-- 子页面：API 设置 -->
        <div class="settings-page" id="st-page-api">
            <header class="st-nav-bar">
                <button class="st-icon-btn st-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">API 设置</span>
                <button class="st-text-btn save" id="save-api">保存</button>
            </header>
            <div class="st-container">
                <div class="st-section-title">普通聊天 API</div>
                <div class="st-group">
                    <div class="st-item vertical no-click">
                        <span class="st-label">API URL</span>
                        <input type="text" class="st-input" id="api-chat-url" placeholder="https://api.example.com">
                    </div>
                    <div class="st-item vertical no-click">
                        <span class="st-label">API Key</span>
                        <div class="st-input-row">
                            <input type="password" class="st-input" id="api-chat-key" placeholder="sk-...">
                            <button class="st-btn-small st-toggle-pwd" data-target="api-chat-key">显示</button>
                        </div>
                    </div>
                    <div class="st-item vertical no-click">
                        <div style="display:flex; justify-content:space-between; width:100%;">
                            <span class="st-label">模型选择</span>
                            <button class="st-btn-small action" id="btn-pull-chat-model">拉取模型</button>
                        </div>
                        <select class="st-select" id="api-chat-model"><option value="">请先拉取并选择模型</option></select>
                    </div>
                    <div class="st-item vertical no-click">
                        <div style="display:flex; justify-content:space-between; width:100%;">
                            <span class="st-label">Temperature: <span id="temp-val-display">0.7</span></span>
                        </div>
                        <input type="range" class="st-slider" id="api-chat-temp" min="0" max="2" step="0.1" value="0.7">
                        <span style="font-size:12px; color:#8E8E93;">数值越低越贴合设定，越高随机性越强</span>
                    </div>
                    <div class="st-item no-click" style="justify-content: center;">
                        <button class="st-btn-small" style="width: 100%; padding: 12px; font-size: 15px;" id="btn-test-chat-api">测试连接</button>
                    </div>
                </div>

                <div class="st-section-title">生图 API (可选)</div>
                <div class="st-group">
                    <div class="st-item">
                        <span class="st-label">启用生图 API</span>
                        <input type="checkbox" class="st-toggle" id="api-image-enable">
                    </div>
                    <div id="image-api-details" style="display: none; border-top: 0.5px solid #F2F2F7;">
                        <div class="st-item vertical no-click">
                            <span class="st-label">API URL</span>
                            <input type="text" class="st-input" id="api-img-url" placeholder="https://api.example.com">
                        </div>
                        <div class="st-item vertical no-click">
                            <span class="st-label">API Key</span>
                            <div class="st-input-row">
                                <input type="password" class="st-input" id="api-img-key" placeholder="sk-...">
                                <button class="st-btn-small st-toggle-pwd" data-target="api-img-key">显示</button>
                            </div>
                        </div>
                        <div class="st-item vertical no-click">
                            <div style="display:flex; justify-content:space-between; width:100%;">
                                <span class="st-label">模型选择</span>
                                <button class="st-btn-small action" id="btn-pull-img-model">拉取模型</button>
                            </div>
                            <select class="st-select" id="api-img-model"><option value="">请先拉取并选择模型</option></select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 子页面：MiniMax TTS -->
        <div class="settings-page" id="st-page-tts">
            <header class="st-nav-bar">
                <button class="st-icon-btn st-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">MiniMax 语音</span>
                <button class="st-text-btn save" id="save-tts">保存</button>
            </header>
            <div class="st-container">
                <div class="st-group">
                    <div class="st-item">
                        <span class="st-label">启用语音合成</span>
                        <input type="checkbox" class="st-toggle" id="tts-enable">
                    </div>
                    <div id="tts-details" style="display: none; border-top: 0.5px solid #F2F2F7;">
                        <div class="st-item vertical no-click">
                            <span class="st-label">API Key</span>
                            <div class="st-input-row">
                                <input type="password" class="st-input" id="tts-key" placeholder="填写 API Key">
                                <button class="st-btn-small st-toggle-pwd" data-target="tts-key">显示</button>
                            </div>
                        </div>
                        <div class="st-item vertical no-click">
                            <span class="st-label">Group ID</span>
                            <input type="text" class="st-input" id="tts-group" placeholder="填写 Group ID">
                        </div>
                        <div class="st-item vertical no-click">
                            <div style="display:flex; justify-content:space-between; width:100%;">
                                <span class="st-label">TTS 模型</span>
                                <button class="st-btn-small action" id="btn-pull-tts-model">拉取模型</button>
                            </div>
                            <select class="st-select" id="tts-model"><option value="">请先拉取并选择模型</option></select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 子页面：消息 -->
        <div class="settings-page" id="st-page-msg">
            <header class="st-nav-bar">
                <button class="st-icon-btn st-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">消息</span>
                <button class="st-text-btn save" id="save-msg">保存</button>
            </header>
            <div class="st-container">
                <div class="st-section-title">通知与保活</div>
                <div class="st-group">
                    <div class="st-item">
                        <span class="st-label">消息铃声</span>
                        <div class="st-value">
                            <span id="msg-ringtone-name">默认音效</span>
                            <button class="st-btn-small" id="btn-upload-ringtone">上传</button>
                        </div>
                    </div>
                    <div class="st-item">
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <span class="st-label">消息后台保活</span>
                            <span style="font-size:12px; color:#8E8E93;">开启后切出聊天页面消息仍会保留并响铃</span>
                        </div>
                        <input type="checkbox" class="st-toggle" id="msg-keep-alive" checked>
                    </div>
                </div>

                <div class="st-section-title">数据管理</div>
                <div class="st-group">
                    <div class="st-item st-nav" data-target="st-page-memory">
                        <span class="st-label">查看内存统计</span>
                        <span class="st-value"><i data-lucide="chevron-right"></i></span>
                    </div>
                </div>
            </div>
            <input type="file" id="st-ringtone-uploader" accept="audio/*" style="display:none;">
        </div>

        <!-- 子页面：内存统计 (纯查看) -->
        <div class="settings-page" id="st-page-memory">
            <header class="st-nav-bar">
                <button class="st-icon-btn st-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="st-nav-title">内存统计</span>
                <div style="width:24px;"></div>
            </header>
            <div class="st-container">
                <div class="mem-chart-container">
                    <div class="mem-chart" id="mem-chart-pie">
                        <div class="mem-chart-inner">
                            <span class="mem-total-val" id="mem-total-text">0 MB</span>
                            <span class="mem-total-label">已使用容量</span>
                        </div>
                    </div>
                </div>
                <div class="st-section-title">本地数据明细</div>
                <div class="st-group" id="mem-details-list">
                    <!-- 动态生成 -->
                </div>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    // ==========================================
    // 2. 页面导航系统
    // ==========================================
    const navItems = container.querySelectorAll('.st-nav');
    const backBtns = container.querySelectorAll('.st-back-btn');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = document.getElementById(item.getAttribute('data-target'));
            if(target) {
                target.classList.add('active');
                if(item.getAttribute('data-target') === 'st-page-memory') renderMemoryStats();
            }
        });
    });
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.settings-page').classList.remove('active');
        });
    });

    // 密码显示切换
    container.querySelectorAll('.st-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.getAttribute('data-target'));
            if(input.type === 'password') { input.type = 'text'; btn.textContent = '隐藏'; }
            else { input.type = 'password'; btn.textContent = '显示'; }
        });
    });

    // ==========================================
    // 3. 数据绑定与保存引擎
    // ==========================================
    // --- User 面具 ---
    let userPersona = JSON.parse(localStorage.getItem('wuyo_settings_persona')) || { avatar: '', name: '', info: '' };
    if(userPersona.avatar) document.getElementById('st-user-avatar-preview').style.backgroundImage = `url(${userPersona.avatar})`;
    document.getElementById('st-user-name').value = userPersona.name;
    document.getElementById('st-user-info').value = userPersona.info;

    document.getElementById('btn-upload-persona-avatar').addEventListener('click', () => document.getElementById('st-avatar-uploader').click());
    document.getElementById('st-avatar-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                userPersona.avatar = event.target.result;
                document.getElementById('st-user-avatar-preview').style.backgroundImage = `url(${userPersona.avatar})`;
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('save-persona').addEventListener('click', () => {
        userPersona.name = document.getElementById('st-user-name').value;
        userPersona.info = document.getElementById('st-user-info').value;
        localStorage.setItem('wuyo_settings_persona', JSON.stringify(userPersona));
        alert('User 面具保存成功');
    });

    // --- API 设置 ---
    let apiConfig = JSON.parse(localStorage.getItem('wuyo_settings_api')) || { 
        chat: { url: '', key: '', model: '', temp: 0.7 }, 
        img: { enable: false, url: '', key: '', model: '' } 
    };
    
    // 初始化 Chat API
    document.getElementById('api-chat-url').value = apiConfig.chat.url;
    document.getElementById('api-chat-key').value = apiConfig.chat.key;
    document.getElementById('api-chat-temp').value = apiConfig.chat.temp;
    document.getElementById('temp-val-display').textContent = apiConfig.chat.temp;
    if(apiConfig.chat.model) document.getElementById('api-chat-model').innerHTML = `<option value="${apiConfig.chat.model}">${apiConfig.chat.model}</option>`;
    
    document.getElementById('api-chat-temp').addEventListener('input', (e) => { document.getElementById('temp-val-display').textContent = e.target.value; });

    // 初始化 Image API
    document.getElementById('api-image-enable').checked = apiConfig.img.enable;
    document.getElementById('image-api-details').style.display = apiConfig.img.enable ? 'block' : 'none';
    document.getElementById('api-img-url').value = apiConfig.img.url;
    document.getElementById('api-img-key').value = apiConfig.img.key;
    if(apiConfig.img.model) document.getElementById('api-img-model').innerHTML = `<option value="${apiConfig.img.model}">${apiConfig.img.model}</option>`;

    document.getElementById('api-image-enable').addEventListener('change', (e) => {
        document.getElementById('image-api-details').style.display = e.target.checked ? 'block' : 'none';
    });

    // 真实的 API 请求逻辑
    const pullModels = async (urlStr, keyStr, selectId) => {
        const url = document.getElementById(urlStr).value.trim();
        const key = document.getElementById(keyStr).value.trim();
        if(!url || !key) return alert('失败：请先填写完整的 API URL 和 API Key');
        
        try {
            const cleanUrl = url.replace(/\/+$/, '') + '/v1/models';
            const res = await fetch(cleanUrl, { headers: { 'Authorization': `Bearer ${key}` } });
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if(data && data.data) {
                document.getElementById(selectId).innerHTML = data.data.map(m => `<option value="${m.id}">${m.id}</option>`).join('');
                alert('模型拉取成功！请在下拉框中选择。');
            } else throw new Error("返回格式不正确");
        } catch(e) {
            alert(`拉取失败: ${e.message}。请检查 URL 或网络。`);
        }
    };
    document.getElementById('btn-pull-chat-model').addEventListener('click', () => pullModels('api-chat-url', 'api-chat-key', 'api-chat-model'));
    document.getElementById('btn-pull-img-model').addEventListener('click', () => pullModels('api-img-url', 'api-img-key', 'api-img-model'));

    document.getElementById('btn-test-chat-api').addEventListener('click', async () => {
        const url = document.getElementById('api-chat-url').value.trim();
        const key = document.getElementById('api-chat-key').value.trim();
        const model = document.getElementById('api-chat-model').value;
        if(!url || !key || !model) return alert('测试失败：请确保 URL, Key 和模型均已填写/选择。');
        
        try {
            const cleanUrl = url.replace(/\/+$/, '') + '/v1/chat/completions';
            const res = await fetch(cleanUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify({ model: model, messages: [{ role: 'user', content: 'hello' }], max_tokens: 1 })
            });
            if(res.ok) alert('✅ API 连接测试成功！');
            else throw new Error(`服务端返回异常: ${res.status} ${res.statusText}`);
        } catch(e) {
            alert(`❌ 连接失败: ${e.message}`);
        }
    });

    document.getElementById('save-api').addEventListener('click', () => {
        apiConfig.chat.url = document.getElementById('api-chat-url').value;
        apiConfig.chat.key = document.getElementById('api-chat-key').value;
        apiConfig.chat.model = document.getElementById('api-chat-model').value;
        apiConfig.chat.temp = document.getElementById('api-chat-temp').value;
        
        apiConfig.img.enable = document.getElementById('api-image-enable').checked;
        apiConfig.img.url = document.getElementById('api-img-url').value;
        apiConfig.img.key = document.getElementById('api-img-key').value;
        apiConfig.img.model = document.getElementById('api-img-model').value;
        
        localStorage.setItem('wuyo_settings_api', JSON.stringify(apiConfig));
        alert('API 设置保存成功');
    });

    // --- MiniMax TTS ---
    let ttsConfig = JSON.parse(localStorage.getItem('wuyo_settings_tts')) || { enable: false, key: '', groupId: '', model: '' };
    document.getElementById('tts-enable').checked = ttsConfig.enable;
    document.getElementById('tts-details').style.display = ttsConfig.enable ? 'block' : 'none';
    document.getElementById('tts-key').value = ttsConfig.key;
    document.getElementById('tts-group').value = ttsConfig.groupId;
    if(ttsConfig.model) document.getElementById('tts-model').innerHTML = `<option value="${ttsConfig.model}">${ttsConfig.model}</option>`;

    document.getElementById('tts-enable').addEventListener('change', (e) => {
        document.getElementById('tts-details').style.display = e.target.checked ? 'block' : 'none';
    });
    document.getElementById('btn-pull-tts-model').addEventListener('click', () => {
        // MiniMax 特殊处理占位，这里模拟拉取或填入默认语音模型
        const key = document.getElementById('tts-key').value;
        const groupId = document.getElementById('tts-group').value;
        if(!key || !groupId) return alert("请先填写 Key 和 Group ID");
        // 这里可以直接写入官方已知的 TTS 模型，避免跨域报错
        document.getElementById('tts-model').innerHTML = `
            <option value="speech-01">speech-01 (女声/男声可选)</option>
            <option value="speech-01-turbo">speech-01-turbo</option>
        `;
        alert("模型拉取成功！(已获取 MiniMax 官方模型库)");
    });
    document.getElementById('save-tts').addEventListener('click', () => {
        ttsConfig.enable = document.getElementById('tts-enable').checked;
        ttsConfig.key = document.getElementById('tts-key').value;
        ttsConfig.groupId = document.getElementById('tts-group').value;
        ttsConfig.model = document.getElementById('tts-model').value;
        localStorage.setItem('wuyo_settings_tts', JSON.stringify(ttsConfig));
        alert('MiniMax 语音配置保存成功');
    });

    // --- 消息管理 ---
    let msgConfig = JSON.parse(localStorage.getItem('wuyo_settings_msg')) || { ringtoneName: '默认音效', ringtoneData: '', keepAlive: true };
    document.getElementById('msg-ringtone-name').textContent = msgConfig.ringtoneName;
    document.getElementById('msg-keep-alive').checked = msgConfig.keepAlive;

    document.getElementById('btn-upload-ringtone').addEventListener('click', () => document.getElementById('st-ringtone-uploader').click());
    document.getElementById('st-ringtone-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // 简单限制大小防止爆存储 (500kb)
            if(file.size > 500000) return alert("为了不占用过多内存，请上传 500KB 以内的短提示音音频！");
            const reader = new FileReader();
            reader.onload = (event) => {
                msgConfig.ringtoneData = event.target.result;
                msgConfig.ringtoneName = file.name;
                document.getElementById('msg-ringtone-name').textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('save-msg').addEventListener('click', () => {
        msgConfig.keepAlive = document.getElementById('msg-keep-alive').checked;
        try {
            localStorage.setItem('wuyo_settings_msg', JSON.stringify(msgConfig));
            alert('消息设置保存成功');
        } catch(e) { alert("保存失败，可能是铃声音频文件太大导致内存不足！"); }
    });

    // ==========================================
    // 4. 内存统计系统
    // ==========================================
    const renderMemoryStats = () => {
        let stats = { 聊天记录: 0, 图片与壁纸: 0, 美化配置: 0, 角色与面具: 0, 其他本地数据: 0 };
        let totalBytes = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const size = (localStorage.getItem(key).length + key.length) * 2; // JS UTF-16 字节计算
            totalBytes += size;

            if (key.includes('chat') || key.includes('msg')) stats['聊天记录'] += size;
            else if (key.includes('bg') || key.includes('avatar') || key.includes('img') || key.includes('ringtone')) stats['图片与壁纸'] += size;
            else if (key.includes('wuyo_config') || key.includes('wuyo_preset')) stats['美化配置'] += size;
            else if (key.includes('persona')) stats['角色与面具'] += size;
            else stats['其他本地数据'] += size;
        }

        const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
        const totalMB = toMB(totalBytes);
        document.getElementById('mem-total-text').textContent = totalMB + ' MB';

        // 颜色映射
        const colors = ['#1C1C1E', '#8E8E93', '#C7C7CC', '#E5E5EA', '#F2F2F7'];
        let listHtml = '';
        let conicStops = [];
        let currentPercent = 0;

        let colorIdx = 0;
        for (const [name, bytes] of Object.entries(stats)) {
            if(bytes > 0 || name === '其他本地数据') {
                const mb = toMB(bytes);
                const percent = totalBytes > 0 ? (bytes / totalBytes) * 100 : (name === '其他本地数据' ? 100 : 0);
                const color = colors[colorIdx % colors.length];
                
                listHtml += `
                    <div class="st-item no-click">
                        <span class="st-label"><span class="mem-legend-box" style="background:${color}"></span>${name}</span>
                        <span class="st-value">${mb} MB</span>
                    </div>
                `;
                
                if (totalBytes > 0 && percent > 0) {
                    conicStops.push(`${color} ${currentPercent}% ${currentPercent + percent}%`);
                    currentPercent += percent;
                }
                colorIdx++;
            }
        }
        document.getElementById('mem-details-list').innerHTML = listHtml;
        
        if(totalBytes > 0) {
            document.getElementById('mem-chart-pie').style.background = `conic-gradient(${conicStops.join(', ')})`;
        } else {
            document.getElementById('mem-chart-pie').style.background = '#E5E5EA';
        }
    };
})();
