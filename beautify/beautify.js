(function() {
    const container = document.getElementById('beautify-app');
    if (!container) return;

    // 默认配置模板 (包含你之前的所有设置项)
    const defaultConfigTemplate = {
        style: { bgColor: '#f4f4f7', bgImage: '', cardRadius: '24', cardOpacity: '55' },
        texts: { brand: 'WUYO', aiTitle: 'AI 伙伴', aiSubtitle: '随时准备与你交流…', aiAvatar: '' },
        profile: { nickname: '锁骨痣', avatar: '' },
        widgets: {
            memory: { show: true, title: 'MEMORY', sub: '美好的瞬间', img: '' },
            today: { show: true, text: '保持专注，\n顺其自然。' },
            couple: { show: true, date: '2024-01-01', text: 'LOVE', userAvatar: '', charAvatar: '' },
            listen: { show: true, song: 'Midnight City', artist: 'M83', time: '01:24:36', text: '和你一起听歌', cover: '' }
        },
        apps: {} 
    };

    let beautifyPresets = JSON.parse(localStorage.getItem('wuyo_presets'));
    if (!beautifyPresets || !Array.isArray(beautifyPresets) || beautifyPresets.length === 0) {
        beautifyPresets = [{ id: 'default', name: '默认美化', builtIn: true, config: JSON.parse(JSON.stringify(defaultConfigTemplate)) }];
        localStorage.setItem('wuyo_presets', JSON.stringify(beautifyPresets));
    }

    let currentThemeId = localStorage.getItem('wuyo_current_theme') || 'default';
    let activePreset = beautifyPresets.find(p => p.id === currentThemeId) || beautifyPresets[0];
    
    // 确保旧版数据也拥有新的字段结构
    let wuyoConfig = JSON.parse(JSON.stringify(activePreset.config));
    if (!wuyoConfig.widgets.couple) wuyoConfig.widgets.couple = defaultConfigTemplate.widgets.couple;
    if (!wuyoConfig.widgets.listen) wuyoConfig.widgets.listen = defaultConfigTemplate.widgets.listen;

    // 完整的 App 列表 (包含新增的 15 个 App)
    const appsList = ['世界书', '美化', '相册', '备忘录', '音乐', '日历', '设置', '情侣空间', '论坛', '直播', '小红书', '社交', '外卖', '购物', '闲鱼', '淘宝', '一起看', '见面吧', '在干嘛', '出行', '推特', '倒数日', '健康记录', '查手机', '小手机', '短信', '阅读', '时钟', '地图', '记忆总结', '小游戏'];

    const renderUI = () => {
        container.innerHTML = `
            <header class="beautify-nav-bar">
                <button class="beautify-icon-btn" onclick="window.closeApp('beautify')"><i data-lucide="chevron-left"></i></button>
                <span class="beautify-nav-title">无忧机美化</span>
                <button class="beautify-text-btn" id="beautify-save-btn">保存</button>
            </header>

            <div class="beautify-settings-container">
                <div class="beautify-section-title">主题管理方案</div>
                <div class="beautify-setting-group">
                    <div id="theme-list-container"></div>
                    <div class="theme-io-group">
                        <button class="theme-btn-io" id="btn-import-theme"><i data-lucide="download"></i> 导入美化</button>
                        <button class="theme-btn-io" id="btn-export-theme"><i data-lucide="upload"></i> 导出美化</button>
                    </div>
                </div>

                <div class="beautify-section-title">当前编辑：${activePreset.name}</div>

                <!-- 🟢 你之前原有的总体视觉配置 -->
                <div class="beautify-section-title">总体视觉</div>
                <div class="beautify-setting-group">
                    <div class="beautify-setting-item"><span>背景纯色</span><input type="color" id="bg-color" value="#f4f4f7"></div>
                    <div class="beautify-setting-item"><span>自定义背景图</span><button class="beautify-upload-btn" data-target="bg-image">上传</button></div>
                    <div class="beautify-setting-item"><span>卡片圆角 (px)</span><input type="range" id="card-radius" min="10" max="40" value="24"></div>
                    <div class="beautify-setting-item"><span>卡片透明度</span><input type="range" id="card-opacity" min="10" max="100" value="55"></div>
                </div>

                <!-- 🟢 你之前原有的主页文字配置 -->
                <div class="beautify-section-title">主页文字 & AI 伴侣</div>
                <div class="beautify-setting-group">
                    <div class="beautify-setting-item vertical"><span>品牌名称 (左上角)</span><input type="text" id="text-brand" value="WUYO"></div>
                    <div class="beautify-setting-item vertical"><span>AI 伴侣标题</span><input type="text" id="text-ai-title" value="AI 伙伴"></div>
                    <div class="beautify-setting-item vertical"><span>AI 伴侣副标题</span><input type="text" id="text-ai-subtitle" value="随时准备与你交流…"></div>
                    <div class="beautify-setting-item">
                        <span>AI 头像</span>
                        <div class="beautify-avatar-preview" id="ai-avatar-preview"></div>
                        <button class="beautify-upload-btn" data-target="ai-avatar">更换</button>
                    </div>
                </div>

                <!-- 🟢 你之前原有的个人资料配置 -->
                <div class="beautify-section-title">个人资料</div>
                <div class="beautify-setting-group">
                    <div class="beautify-setting-item">
                        <span>头像</span>
                        <div class="beautify-avatar-preview" id="profile-avatar-preview"></div>
                        <button class="beautify-upload-btn" data-target="profile-avatar">更换</button>
                    </div>
                    <div class="beautify-setting-item vertical"><span>昵称</span><input type="text" id="profile-nickname" value="锁骨痣"></div>
                </div>

                <div class="beautify-section-title">桌面组件管理</div>
                <div class="beautify-setting-group" id="widget-settings">
                    <details class="beautify-widget-details"><summary>高级情侣组件</summary>
                        <div class="beautify-detail-content">
                            <div class="beautify-setting-item vertical"><span>自定义标题</span><input type="text" id="w-couple-text" value="LOVE"></div>
                            <div class="beautify-setting-item vertical"><span>相恋日期</span><input type="date" id="w-couple-date" value="2024-01-01"></div>
                            <div class="beautify-setting-item"><span>User 头像</span><button class="beautify-upload-btn" data-target="w-couple-user-img">上传</button></div>
                            <div class="beautify-setting-item"><span>Char 头像</span><button class="beautify-upload-btn" data-target="w-couple-char-img">上传</button></div>
                        </div>
                    </details>
                    
                    <details class="beautify-widget-details"><summary>一起听歌组件</summary>
                        <div class="beautify-detail-content">
                            <div class="beautify-setting-item vertical"><span>歌曲名</span><input type="text" id="w-listen-song" value="Midnight City"></div>
                            <div class="beautify-setting-item vertical"><span>歌手</span><input type="text" id="w-listen-artist" value="M83"></div>
                            <div class="beautify-setting-item vertical"><span>时长进度</span><input type="text" id="w-listen-time" value="01:24:36"></div>
                            <div class="beautify-setting-item vertical"><span>底部文字</span><input type="text" id="w-listen-text" value="和你一起听歌"></div>
                            <div class="beautify-setting-item"><span>歌曲封面</span><button class="beautify-upload-btn" data-target="w-listen-cover">上传</button></div>
                        </div>
                    </details>
                    
                    <details class="beautify-widget-details"><summary>Memory 记忆组件</summary>
                        <div class="beautify-detail-content">
                            <div class="beautify-setting-item vertical"><span>主标题</span><input type="text" id="w-memory-title" value="MEMORY"></div>
                            <div class="beautify-setting-item vertical"><span>副标题</span><input type="text" id="w-memory-sub" value="美好的瞬间"></div>
                            <div class="beautify-setting-item"><span>更换图片</span><button class="beautify-upload-btn" data-target="w-memory-img">上传</button></div>
                        </div>
                    </details>
                    
                    <details class="beautify-widget-details"><summary>Today 每日文字</summary>
                        <div class="beautify-detail-content">
                            <div class="beautify-setting-item vertical"><span>正文内容</span><textarea id="w-today-text" rows="3"></textarea></div>
                        </div>
                    </details>
                </div>

                <div class="beautify-section-title">App 图标自定义</div>
                <div class="beautify-setting-group" id="app-icon-settings"></div>
            </div>
            
            <input type="file" id="beautify-image-uploader" accept="image/*" style="display:none;">
            <input type="file" id="beautify-json-uploader" accept=".json" style="display:none;">
        `;

        const appSettingsContainer = document.getElementById('app-icon-settings');
        appsList.forEach(app => {
            appSettingsContainer.innerHTML += `
                <details class="beautify-widget-details">
                    <summary>${app}</summary>
                    <div class="beautify-detail-content">
                        <div class="beautify-setting-item vertical"><span>重命名</span><input type="text" id="app-name-${app}" value="${wuyoConfig.apps[app]?.name || app}"></div>
                        <div class="beautify-setting-item"><span>自定义图标</span><button class="beautify-upload-btn" data-target="app-img-${app}">上传</button></div>
                    </div>
                </details>
            `;
        });

        renderThemeList(); bindDataToForms(); bindEvents(); lucide.createIcons({ root: container });
    };

    const renderThemeList = () => {
        const listContainer = document.getElementById('theme-list-container'); listContainer.innerHTML = '';
        beautifyPresets.forEach(preset => {
            const isCurrent = preset.id === currentThemeId;
            const statusHtml = isCurrent ? `<span class="theme-status"><i data-lucide="check-circle-2"></i> 使用中</span>` : '';
            const deleteBtnHtml = (!preset.builtIn && !isCurrent) ? `<button class="theme-btn-delete" data-id="${preset.id}">删除</button>` : '';
            const applyBtnHtml = !isCurrent ? `<button class="theme-btn-apply" data-id="${preset.id}">应用</button>` : '';

            listContainer.innerHTML += `
                <div class="theme-list-item">
                    <div class="theme-info"><span class="theme-name">${preset.name}</span>${statusHtml}</div>
                    <div class="theme-actions">${applyBtnHtml}${deleteBtnHtml}</div>
                </div>
            `;
        });
        lucide.createIcons({ root: listContainer });
    };

    const bindDataToForms = () => {
        document.getElementById('bg-color').value = wuyoConfig.style.bgColor;
        document.getElementById('card-radius').value = wuyoConfig.style.cardRadius;
        document.getElementById('card-opacity').value = wuyoConfig.style.cardOpacity;
        document.getElementById('text-brand').value = wuyoConfig.texts.brand;
        document.getElementById('text-ai-title').value = wuyoConfig.texts.aiTitle;
        document.getElementById('text-ai-subtitle').value = wuyoConfig.texts.aiSubtitle;

        if(wuyoConfig.texts.aiAvatar) document.getElementById('ai-avatar-preview').style.backgroundImage = `url(${wuyoConfig.texts.aiAvatar})`;
        document.getElementById('profile-nickname').value = wuyoConfig.profile.nickname;
        if(wuyoConfig.profile.avatar) document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${wuyoConfig.profile.avatar})`;
        
        document.getElementById('w-couple-text').value = wuyoConfig.widgets.couple.text;
        document.getElementById('w-couple-date').value = wuyoConfig.widgets.couple.date;
        
        document.getElementById('w-listen-song').value = wuyoConfig.widgets.listen.song;
        document.getElementById('w-listen-artist').value = wuyoConfig.widgets.listen.artist;
        document.getElementById('w-listen-time').value = wuyoConfig.widgets.listen.time;
        document.getElementById('w-listen-text').value = wuyoConfig.widgets.listen.text;

        document.getElementById('w-memory-title').value = wuyoConfig.widgets.memory.title;
        document.getElementById('w-memory-sub').value = wuyoConfig.widgets.memory.sub;
        document.getElementById('w-today-text').value = wuyoConfig.widgets.today.text;
    };

    const bindEvents = () => {
        const compressImage = (base64Str, maxWidth, callback) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width, height = img.height;
                if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
                canvas.width = width; canvas.height = height; canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                callback(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = base64Str;
        };

        const imgUploader = document.getElementById('beautify-image-uploader');
        let currentTarget = '';
        
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('beautify-upload-btn')) { currentTarget = e.target.getAttribute('data-target'); imgUploader.click(); }
            if (e.target.classList.contains('theme-btn-apply')) {
                currentThemeId = e.target.getAttribute('data-id');
                activePreset = beautifyPresets.find(p => p.id === currentThemeId);
                wuyoConfig = JSON.parse(JSON.stringify(activePreset.config));
                localStorage.setItem('wuyo_current_theme', currentThemeId); localStorage.setItem('wuyo_config', JSON.stringify(wuyoConfig));
                alert(`已应用方案：${activePreset.name}`);
                if (typeof window.applyConfig === 'function') window.applyConfig(); renderUI();
            }
            if (e.target.classList.contains('theme-btn-delete')) {
                if (confirm('确定要删除这个美化方案吗？')) {
                    beautifyPresets = beautifyPresets.filter(p => p.id !== e.target.getAttribute('data-id'));
                    localStorage.setItem('wuyo_presets', JSON.stringify(beautifyPresets)); renderThemeList();
                }
            }
        });

        imgUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && currentTarget) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    compressImage(event.target.result, 800, (compressedBase64) => {
                        if (currentTarget === 'bg-image') wuyoConfig.style.bgImage = compressedBase64;
                        if (currentTarget === 'profile-avatar') { wuyoConfig.profile.avatar = compressedBase64; document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${compressedBase64})`; }
                        if (currentTarget === 'ai-avatar') { wuyoConfig.texts.aiAvatar = compressedBase64; document.getElementById('ai-avatar-preview').style.backgroundImage = `url(${compressedBase64})`; }
                        
                        if (currentTarget === 'w-couple-user-img') wuyoConfig.widgets.couple.userAvatar = compressedBase64;
                        if (currentTarget === 'w-couple-char-img') wuyoConfig.widgets.couple.charAvatar = compressedBase64;
                        if (currentTarget === 'w-listen-cover') wuyoConfig.widgets.listen.cover = compressedBase64;
                        if (currentTarget === 'w-memory-img') wuyoConfig.widgets.memory.img = compressedBase64;
                        
                        if (currentTarget.startsWith('app-img-')) {
                            const appName = currentTarget.replace('app-img-', '');
                            if(!wuyoConfig.apps[appName]) wuyoConfig.apps[appName] = {};
                            wuyoConfig.apps[appName].img = compressedBase64;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
            imgUploader.value = '';
        });

        document.getElementById('btn-export-theme').addEventListener('click', () => {
            let themeName = prompt("请为当前美化方案命名：", activePreset.name === "默认美化" ? "我的黑白极简" : activePreset.name);
            if (!themeName) return; collectFormData();
            const exportData = { id: 'theme_' + Date.now(), name: themeName, builtIn: false, config: wuyoConfig };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
            const a = document.createElement('a'); a.href = dataStr; a.download = themeName + ".json"; document.body.appendChild(a); a.click(); a.remove();
        });

        const jsonUploader = document.getElementById('beautify-json-uploader');
        document.getElementById('btn-import-theme').addEventListener('click', () => jsonUploader.click());

        jsonUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedTheme = JSON.parse(event.target.result);
                        if (importedTheme && importedTheme.name && importedTheme.config) {
                            importedTheme.id = 'theme_' + Date.now(); importedTheme.builtIn = false;
                            beautifyPresets.push(importedTheme); localStorage.setItem('wuyo_presets', JSON.stringify(beautifyPresets));
                            alert(`成功导入美化方案：${importedTheme.name}`); renderThemeList();
                        } else alert('导入失败：文件格式不正确！');
                    } catch (error) { alert('导入失败：无法解析 JSON 文件！'); }
                };
                reader.readAsText(file);
            }
            jsonUploader.value = '';
        });

        const collectFormData = () => {
            wuyoConfig.style.bgColor = document.getElementById('bg-color').value;
            wuyoConfig.style.cardRadius = document.getElementById('card-radius').value;
            wuyoConfig.style.cardOpacity = document.getElementById('card-opacity').value;
            wuyoConfig.texts.brand = document.getElementById('text-brand').value;
            wuyoConfig.texts.aiTitle = document.getElementById('text-ai-title').value;
            wuyoConfig.texts.aiSubtitle = document.getElementById('text-ai-subtitle').value;
            wuyoConfig.profile.nickname = document.getElementById('profile-nickname').value;
            
            wuyoConfig.widgets.couple.text = document.getElementById('w-couple-text').value;
            wuyoConfig.widgets.couple.date = document.getElementById('w-couple-date').value;
            
            wuyoConfig.widgets.listen.song = document.getElementById('w-listen-song').value;
            wuyoConfig.widgets.listen.artist = document.getElementById('w-listen-artist').value;
            wuyoConfig.widgets.listen.time = document.getElementById('w-listen-time').value;
            wuyoConfig.widgets.listen.text = document.getElementById('w-listen-text').value;

            wuyoConfig.widgets.memory.title = document.getElementById('w-memory-title').value;
            wuyoConfig.widgets.memory.sub = document.getElementById('w-memory-sub').value;
            wuyoConfig.widgets.today.text = document.getElementById('w-today-text').value;

            appsList.forEach(app => {
                const input = document.getElementById(`app-name-${app}`);
                if(input && input.value !== app) {
                    if(!wuyoConfig.apps[app]) wuyoConfig.apps[app] = {}; wuyoConfig.apps[app].name = input.value;
                }
            });
        };

        document.getElementById('beautify-save-btn').addEventListener('click', () => {
            collectFormData();
            const index = beautifyPresets.findIndex(p => p.id === currentThemeId);
            if (index !== -1) beautifyPresets[index].config = wuyoConfig;
            localStorage.setItem('wuyo_presets', JSON.stringify(beautifyPresets));
            localStorage.setItem('wuyo_config', JSON.stringify(wuyoConfig)); 
            alert('保存成功ovo');
            if (typeof window.applyConfig === 'function') window.applyConfig();
            window.closeApp('beautify'); 
        });
    };

    renderUI();
})();
