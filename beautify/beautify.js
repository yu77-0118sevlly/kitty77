(function() {
    const container = document.getElementById('beautify-app');
    if (!container) return;

    // 默认配置模板 (包含你之前的所有设置项)
    const defaultConfigTemplate = {
        style: { bgColor: '#bfc1c5', bgImage: '', cardRadius: '25', cardOpacity: '55' },
        texts: { brand: 'WUYO', aiTitle: 'AI 伙伴', aiSubtitle: '随时准备与你交流…', aiAvatar: '' },
        profile: { nickname: '', avatar: '' },
        widgets: {
            focus: { show: false, title: 'FOCUS', text: '留一点时间给自己', icon: 'sparkles', background: '' },
            note: { show: false, title: 'TODAY', text: '慢一点，也没关系', icon: 'quote', background: '' },
            mood: { show: false, title: 'MOOD', text: '晴朗 · 24°', icon: 'cloud-sun', background: '' }
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
    wuyoConfig.widgets = Object.fromEntries(Object.entries(defaultConfigTemplate.widgets).map(([id, widget]) => [id, { ...widget, ...((wuyoConfig.widgets || {})[id] || {}) }]));
    wuyoConfig.apps = wuyoConfig.apps || {};

    // 完整的 App 列表 (包含新增的 15 个 App)
    const appsList = [['worldbook','世界书','book-open'], ['beautify','美化','sparkles'], ['chat','聊天','message-circle'], ['contacts','联系人','users'], ['calendar','日历','calendar-days'], ['settings','设置','settings-2'], ['album','相册','image'], ['notes','备忘录','notebook-pen'], ['music','音乐','music-2'], ['memory','记忆','brain-circuit'], ['heart','情侣空间','heart'], ['weather','天气','cloud-sun'], ['clock','时钟','clock-3'], ['map','地图','map-pin'], ['camera','相机','camera'], ['more','更多','grid-2x2']];

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
                </div>

                <div class="beautify-section-title">自定义小组件</div>
                <p class="beautify-helper">默认不显示。启用后可自定义卡片背景、标题、文字和图标。</p>
                <div class="beautify-setting-group" id="widget-settings"></div>

                <div class="beautify-section-title">App 图标自定义</div>
                <div class="beautify-setting-group" id="app-icon-settings"></div>
            </div>
            
            <input type="file" id="beautify-image-uploader" accept="image/*" style="display:none;">
            <input type="file" id="beautify-json-uploader" accept=".json" style="display:none;">
        `;

        const widgetContainer = document.getElementById('widget-settings');
        Object.entries(wuyoConfig.widgets).forEach(([id, widget]) => {
            widgetContainer.insertAdjacentHTML('beforeend', `<details class="beautify-widget-details"><summary>${widget.title || id}</summary><div class="beautify-detail-content"><label class="beautify-setting-item"><span>显示在主页</span><input type="checkbox" id="widget-show-${id}" ${widget.show ? 'checked' : ''}></label><div class="beautify-setting-item vertical"><span>标题</span><input type="text" id="widget-title-${id}" value="${widget.title || ''}"></div><div class="beautify-setting-item vertical"><span>文字</span><input type="text" id="widget-text-${id}" value="${widget.text || ''}"></div><div class="beautify-setting-item vertical"><span>图标名称</span><input type="text" id="widget-icon-${id}" value="${widget.icon || 'sparkles'}"></div><div class="beautify-setting-item"><span>组件整体背景图</span><button class="beautify-upload-btn" data-target="widget-bg-${id}">上传</button></div></div></details>`);
        });
        const appSettingsContainer = document.getElementById('app-icon-settings');
        appSettingsContainer.classList.add('app-editor-grid');
        appsList.forEach(([id, name, icon]) => {
            const setting = wuyoConfig.apps[id] || wuyoConfig.apps[name] || {};
            appSettingsContainer.insertAdjacentHTML('beforeend', `<button type="button" class="app-editor-card" data-app-id="${id}" data-app-name="${name}" data-app-icon="${icon}"><span class="app-editor-preview" ${setting.img ? `style="background-image:url(${setting.img})"` : ''}><i data-lucide="${setting.icon || icon}"></i></span><span>${setting.name || name}</span></button>`);
        });
        appSettingsContainer.insertAdjacentHTML('beforeend', '<button type="button" class="app-editor-card app-editor-add" id="add-custom-app"><span><i data-lucide="plus"></i></span><span>添加图标</span></button>');

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
        if(wuyoConfig.profile.avatar) document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${wuyoConfig.profile.avatar})`;
        

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

        document.getElementById('app-icon-settings').addEventListener('click', (e) => {
            const add = e.target.closest('#add-custom-app');
            if (add) { const name = prompt('新图标名称'); if (!name) return; const id = `custom_${Date.now()}`; const apps = JSON.parse(localStorage.getItem('wuyo_custom_apps') || '[]'); apps.push({ id, name, icon: 'sparkles' }); localStorage.setItem('wuyo_custom_apps', JSON.stringify(apps)); window.renderHomeApps?.(); renderUI(); return; }
            const card = e.target.closest('.app-editor-card');
            if (!card) return;
            const id = card.dataset.appId; const name = prompt('图标名称', card.dataset.appName); if (name === null) return;
            if (!wuyoConfig.apps[id]) wuyoConfig.apps[id] = {};
            wuyoConfig.apps[id].name = name.trim() || card.dataset.appName;
            const icon = prompt('Lucide 图标名称（例如 heart、camera、star）', wuyoConfig.apps[id].icon || card.dataset.appIcon); if (icon) wuyoConfig.apps[id].icon = icon.trim();
            window.renderHomeApps?.(); renderUI();
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
                        if (currentTarget.startsWith('widget-bg-')) wuyoConfig.widgets[currentTarget.replace('widget-bg-', '')].background = compressedBase64;
                        
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
            
            Object.keys(wuyoConfig.widgets).forEach((id) => {
                wuyoConfig.widgets[id].show = document.getElementById(`widget-show-${id}`).checked;
                wuyoConfig.widgets[id].title = document.getElementById(`widget-title-${id}`).value;
                wuyoConfig.widgets[id].text = document.getElementById(`widget-text-${id}`).value;
                wuyoConfig.widgets[id].icon = document.getElementById(`widget-icon-${id}`).value || 'sparkles';
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
