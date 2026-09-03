document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // 默认配置对象
    const defaultConfig = {
        style: { bgColor: '#f4f4f7', bgImage: '', cardRadius: '24', cardOpacity: '55' },
        texts: { brand: 'WUYO', aiTitle: 'AI 伙伴', aiSubtitle: '随时准备与你交流…' },
        profile: { nickname: '锁骨痣', avatar: '' },
        widgets: {
            memory: { show: true, title: 'MEMORY', sub: '美好的瞬间', img: '' },
            today: { show: true, text: '保持专注，\n顺其自然。' },
            couple: { show: true, date: '2024-01-01', img: '' }
        },
        apps: {} 
    };

    let wuyoConfig = JSON.parse(localStorage.getItem('wuyo_config')) || defaultConfig;
    
    // 初始化 App 列表生成
    const appsList = ['世界书', '美化', '相册', '备忘录', '音乐', '日历', '设置', '情侣空间', '查手机', '小手机', '短信', '阅读', '时钟', '地图', '记忆总结', '小游戏'];
    const appSettingsContainer = document.getElementById('app-icon-settings');
    
    appsList.forEach(app => {
        appSettingsContainer.innerHTML += `
            <details class="widget-details">
                <summary>${app}</summary>
                <div class="detail-content">
                    <div class="setting-item vertical"><span>重命名</span><input type="text" id="app-name-${app}" value="${wuyoConfig.apps[app]?.name || app}"></div>
                    <div class="setting-item"><span>自定义图标</span><button class="upload-btn" data-target="app-img-${app}">上传图片</button></div>
                </div>
            </details>
        `;
    });

    // 绑定数据到表单
    const bindData = () => {
        document.getElementById('bg-color').value = wuyoConfig.style.bgColor;
        document.getElementById('card-radius').value = wuyoConfig.style.cardRadius;
        document.getElementById('card-opacity').value = wuyoConfig.style.cardOpacity;
        
        document.getElementById('text-brand').value = wuyoConfig.texts.brand;
        document.getElementById('text-ai-title').value = wuyoConfig.texts.aiTitle;
        document.getElementById('text-ai-subtitle').value = wuyoConfig.texts.aiSubtitle;
        
        document.getElementById('profile-nickname').value = wuyoConfig.profile.nickname;
        if(wuyoConfig.profile.avatar) document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${wuyoConfig.profile.avatar})`;

        document.getElementById('w-memory-show').checked = wuyoConfig.widgets.memory.show;
        document.getElementById('w-memory-title').value = wuyoConfig.widgets.memory.title;
        document.getElementById('w-memory-sub').value = wuyoConfig.widgets.memory.sub;
        
        document.getElementById('w-today-show').checked = wuyoConfig.widgets.today.show;
        document.getElementById('w-today-text').value = wuyoConfig.widgets.today.text;
        
        document.getElementById('w-couple-show').checked = wuyoConfig.widgets.couple.show;
        document.getElementById('w-couple-date').value = wuyoConfig.widgets.couple.date;
    };
    bindData();

    // 图片上传处理 (转 Base64 存入 config)
    const uploader = document.getElementById('global-uploader');
    let currentTarget = '';
    
    // 使用事件代理或者重新绑定以支持动态生成的按钮
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('upload-btn')) {
            currentTarget = e.target.getAttribute('data-target');
            uploader.click();
        }
    });

    uploader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                if (currentTarget === 'bg-image') wuyoConfig.style.bgImage = base64;
                if (currentTarget === 'profile-avatar') {
                    wuyoConfig.profile.avatar = base64;
                    document.getElementById('profile-avatar-preview').style.backgroundImage = `url(${base64})`;
                }
                if (currentTarget === 'w-memory-img') wuyoConfig.widgets.memory.img = base64;
                if (currentTarget === 'w-couple-img') wuyoConfig.widgets.couple.img = base64;
                if (currentTarget.startsWith('app-img-')) {
                    const appName = currentTarget.replace('app-img-', '');
                    if(!wuyoConfig.apps[appName]) wuyoConfig.apps[appName] = {};
                    wuyoConfig.apps[appName].img = base64;
                }
                alert('图片已加载，点击右上角保存生效');
            };
            reader.readAsDataURL(file);
        }
        // 重置上传框，允许同名文件再次触发 change
        uploader.value = '';
    });

    // 保存按钮逻辑
    document.getElementById('save-btn').addEventListener('click', () => {
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

        // 保存 Apps 名字
        appsList.forEach(app => {
            const input = document.getElementById(`app-name-${app}`);
            if(input && input.value !== app) {
                if(!wuyoConfig.apps[app]) wuyoConfig.apps[app] = {};
                wuyoConfig.apps[app].name = input.value;
            }
        });

        localStorage.setItem('wuyo_config', JSON.stringify(wuyoConfig));
        alert('保存成功！');
        window.location.href = '../index.html'; // 强制跳回主页
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm('确定要恢复所有默认设置吗？')) {
            localStorage.removeItem('wuyo_config');
            window.location.href = '../index.html';
        }
    });
});
