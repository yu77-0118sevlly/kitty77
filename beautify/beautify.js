(function() {
    const container = document.getElementById('beautify-app');
    if (!container) return;

    // 动态注入内部结构
    container.innerHTML = `
        <header class="beautify-nav-bar">
            <button class="beautify-icon-btn" onclick="window.closeApp('beautify')"><i data-lucide="chevron-left"></i></button>
            <span class="beautify-nav-title">无忧机美化</span>
            <button class="beautify-text-btn" id="beautify-save-btn">保存</button>
        </header>

        <div class="beautify-settings-container">
            <div class="beautify-section-title">总体视觉</div>
            <div class="beautify-setting-group">
                <div class="beautify-setting-item"><span>背景纯色</span><input type="color" id="bg-color" value="#f4f4f7"></div>
                <div class="beautify-setting-item"><span>自定义背景图</span><button class="beautify-upload-btn" data-target="bg-image">上传</button></div>
                <div class="beautify-setting-item"><span>卡片圆角 (px)</span><input type="range" id="card-radius" min="10" max="40" value="24"></div>
                <div class="beautify-setting-item"><span>卡片透明度</span><input type="range" id="card-opacity" min="10" max="100" value="55"></div>
            </div>

            <div class="beautify-section-title">主页文字 & AI 伴侣</div>
            <div class="beautify-setting-group">
                <div class="beautify-setting-item vertical"><span>品牌名称 (左上角)</span><input type="text" id="text-brand" value="WUYO"></div>
                <div class="beautify-setting-item vertical"><span>AI 伴侣标题</span><input type="text" id="text-ai-title" value="AI 伙伴"></div>
                <div class="beautify-setting-item vertical"><span>AI 伴侣副标题</span><input type="text" id="text-ai-subtitle" value="随时准备与你交流…"></div>
                
                <!-- 🟢 自定义 AI 头像设置区域 -->
                <div class="beautify-setting-item">
                    <span>AI 头像</span>
                    <div class="beautify-avatar-preview" id="ai-avatar-preview"></div>
                    <button class="beautify-upload-btn" data-target="ai-avatar">更换</button>
                </div>
            </div>

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
                <details class="beautify-widget-details"><summary>Memory 记忆组件</summary>
                    <div class="beautify-detail-content">
                        <div class="beautify-setting-item"><span>显示组件</span><input type="checkbox" id="w-memory-show" checked></div>
                        <div class="beautify-setting-item vertical"><span>主标题</span><input type="text" id="w-memory-title" value="MEMORY"></div>
                        <div class="beautify-setting-item vertical"><span>副标题</span><input type="text" id="w-memory-sub" value="美好的瞬间"></div>
                        <div class="beautify-setting-item"><span>更换图片</span><button class="beautify-upload-btn" data-target="w-memory-img">上传</button></div>
                    </div>
                </details>
                <details class="beautify-widget-details"><summary>Today 每日文字</summary>
                    <div class="beautify-detail-content">
                        <div class="beautify-setting-item"><span>显示组件</span><input type="checkbox" id="w-today-show" checked></div>
                        <div class="beautify-setting-item vertical"><span>正文内容</span><textarea id="w-today-text" rows="3">保持专注，\n顺其自然。</textarea></div>
                    </div>
                </details>
                <details class="beautify-widget-details"><summary>情侣纪念日</summary>
                    <div class="beautify-detail-content">
                        <div class="beautify-setting-item"><span>显示组件</span><input type="checkbox" id="w-couple-show" checked></div>
                        <div class="beautify-setting-item vertical"><span>相恋日期</span><input type="date" id="w-couple-date" value="2024-01-01"></div>
                        <div class="beautify-setting-item"><span>背景图片</span><button class="beautify-upload-btn" data-target="w-couple-img">上传</button></div>
                    </div>
                </details>
            </div>

            <div class="beautify-section-title">App 图标自定义</div>
            <div class="beautify-setting-group" id="app-icon-settings"></div>

            <button class="beautify-danger-btn" id="beautify-reset-btn">恢复默认设置</button>
        </div>
    `;

    lucide.createIcons({ root: container });

    const defaultConfig = {
        style: { bgColor: '#f4f4f7', bgImage: '', cardRadius: '24', cardOpacity: '55' },
        // 🟢 初始化 aiAvatar 字段
        texts: { brand: 'WUYO', aiTitle: 'AI 伙伴', aiSubtitle: '随时准备与你交流…', aiAvatar: '' },
        profile: { nickname: '锁骨痣', avatar: '' },
        widgets: {
            memory: { show: true, title: 'MEMORY', sub: '美好的瞬间', img: '' },
            today: { show: true, text: '保持专注，\n顺其自然。' },
            couple: { show: true, date: '2024-01-01', img: '' }
        },
        apps: {} 
    };

    let wuyoConfig = JSON.parse(localStorage.getItem('wuyo_config')) || defaultConfig;
    
    // 生成动态列表
    const appsList = ['世界书', '美化', '相册', '备忘录', '音乐', '日历', '设置', '情侣空间', '查手机', '小手机', '短信', '阅读', '时钟', '地图', '记忆总结', '小游戏'];
    const appSettingsContainer = document.getElementById('app-icon-settings');
    appsList.forEach(app => {
        appSettingsContainer.innerHTML += `
            <details class="beautify-widget-details">
                <summary>${app}</summary>
                <div class="beautify-detail-content">
                    <div class="beautify-setting-item vertical"><span>重命名</span><input type="text" id="app-name-${app}" value="${wuyoConfig.apps[app]?.name || app}"></div>
                    <div class="beautify-setting-item"><span>自定义图标</span><button class="beautify-upload-btn" data-target="app-img-${app}">上传图片</button></div>
                </div>
            </details>
        `;
    });

    const bindData = () => {
        document.getElementById('bg-color').value = wuyoConfig.style.bgColor;
        document.getElementById('card-radius').value = wuyoConfig.style.cardRadius;
        document.getElementById('card-opacity').value = wuyoConfig.style.cardOpacity;
        document.getElementById('text-brand').value = wuyoConfig.texts.brand;
        document.getElementById('text-ai-title').value = wuyoConfig.texts.aiTitle;
        document.getElementById('text-ai-subtitle').value = wuyoConfig.texts.aiSubtitle;
        
        // 🟢 渲染已保存的 AI 头像预览
        if(wuyoConfig.texts.aiAvatar) {
            document.getElementById('ai-avatar-preview').style.backgroundImage = `url(${wuyoConfig.texts.aiAvatar})`;
        }

        document.getElementById('profile-nickname').value = wuyoConfig.profile.nickname;
        if(wuyoConfig.profile.avatar) {
            document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${wuyoConfig.profile.avatar})`;
        }
        
        document.getElementById('w-memory-show').checked = wuyoConfig.widgets.memory.show;
        document.getElementById('w-memory-title').value = wuyoConfig.widgets.memory.title;
        document.getElementById('w-memory-sub').value = wuyoConfig.widgets.memory.sub;
        document.getElementById('w-today-show').checked = wuyoConfig.widgets.today.show;
        document.getElementById('w-today-text').value = wuyoConfig.widgets.today.text;
        document.getElementById('w-couple-show').checked = wuyoConfig.widgets.couple.show;
        document.getElementById('w-couple-date').value = wuyoConfig.widgets.couple.date;
    };
    bindData();

    const uploader = document.createElement('input');
    uploader.type = 'file';
    uploader.accept = 'image/*';
    uploader.style.display = 'none';
    container.appendChild(uploader);

    let currentTarget = '';
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('beautify-upload-btn')) {
            currentTarget = e.target.getAttribute('data-target');
            uploader.click();
        }
    });

    uploader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && currentTarget) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                
                // 处理所有图片上传
                if (currentTarget === 'bg-image') wuyoConfig.style.bgImage = base64;
                if (currentTarget === 'profile-avatar') {
                    wuyoConfig.profile.avatar = base64;
                    document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${base64})`;
                }
                
                // 🟢 捕获 AI 头像上传并更新预览
                if (currentTarget === 'ai-avatar') {
                    wuyoConfig.texts.aiAvatar = base64;
                    document.getElementById('ai-avatar-preview').style.backgroundImage = `url(${base64})`;
                }

                if (currentTarget === 'w-memory-img') wuyoConfig.widgets.memory.img = base64;
                if (currentTarget === 'w-couple-img') wuyoConfig.widgets.couple.img = base64;
                if (currentTarget.startsWith('app-img-')) {
                    const appName = currentTarget.replace('app-img-', '');
                    if(!wuyoConfig.apps[appName]) wuyoConfig.apps[appName] = {};
                    wuyoConfig.apps[appName].img = base64;
                }
            };
            reader.readAsDataURL(file);
        }
        uploader.value = '';
    });

    // 🟢 保存设置逻辑
    document.getElementById('beautify-save-btn').addEventListener('click', () => {
        wuyoConfig.style.bgColor = document.getElementById('bg-color').value;
        wuyoConfig.style.cardRadius = document.getElementById('card-radius').value;
        wuyoConfig.style.cardOpacity = document.getElementById('card-opacity').value;
        wuyoConfig.texts.brand = document.getElementById('text-brand').value;
        wuyoConfig.texts.aiTitle = document.getElementById('text-ai-title').value;
        wuyoConfig.texts.aiSubtitle = document.getElementById('text-ai-subtitle').value;
        wuyoConfig.profile.nickname = document.getElementById('profile-nickname').value;
        wuyoConfig.widgets.memory.show = document.getElementById('w-memory-show').checked;
        wuyoConfig.widgets.memory.title = document.getElementById('w-memory-title').value;
        wuyoConfig.widgets.memory.sub = document.getElementById('w-memory-sub').value;
        wuyoConfig.widgets.today.show = document.getElementById('w-today-show').checked;
        wuyoConfig.widgets.today.text = document.getElementById('w-today-text').value;
        wuyoConfig.widgets.couple.show = document.getElementById('w-couple-show').checked;
        wuyoConfig.widgets.couple.date = document.getElementById('w-couple-date').value;

        appsList.forEach(app => {
            const input = document.getElementById(`app-name-${app}`);
            if(input && input.value !== app) {
                if(!wuyoConfig.apps[app]) wuyoConfig.apps[app] = {};
                wuyoConfig.apps[app].name = input.value;
            }
        });

        // 真实长久保存到 localStorage
        localStorage.setItem('wuyo_config', JSON.stringify(wuyoConfig));
        
        // 弹出你要求的可爱提示
        alert('保存成功ovo');
        
        // 应用并退回主页
        if (typeof window.applyConfig === 'function') window.applyConfig();
        window.closeApp('beautify'); 
    });

    document.getElementById('beautify-reset-btn').addEventListener('click', () => {
        if(confirm('确定要恢复所有默认设置吗？')) {
            localStorage.removeItem('wuyo_config');
            location.reload(); 
        }
    });
})();
