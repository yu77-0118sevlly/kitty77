// ==========================================
// 📱 WUYO 系统级交互
// ==========================================
const defaultHomeApps = [
    ['worldbook', '世界书', 'book-open'], ['beautify', '美化', 'sparkles'], ['chat', '聊天', 'message-circle'], ['contacts', '联系人', 'users'],
    ['calendar', '日历', 'calendar-days'], ['settings', '设置', 'settings-2'], ['album', '相册', 'image'], ['notes', '备忘录', 'notebook-pen'],
    ['music', '音乐', 'music-2'], ['memory', '记忆', 'brain-circuit'], ['heart', '情侣空间', 'heart'], ['weather', '天气', 'cloud-sun'],
    ['clock', '时钟', 'clock-3'], ['map', '地图', 'map-pin'], ['camera', '相机', 'camera'], ['more', '更多', 'grid-2x2']
];

const readJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (error) { return fallback; }
};

window.renderHomeApps = () => {
    const grid = document.getElementById('home-app-grid');
    if (!grid) return;
    const config = readJson('wuyo_config', {});
    const appSettings = config.apps || {};
    const customApps = readJson('wuyo_custom_apps', []);
    const apps = [...defaultHomeApps.map(([id, name, icon]) => ({ id, name, icon })), ...customApps];
    const savedOrder = readJson('wuyo_app_order', []);
    const orderIndex = new Map(savedOrder.map((id, index) => [id, index]));
    apps.sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999));
    grid.replaceChildren();
    apps.forEach((app) => {
        const settings = appSettings[app.id] || appSettings[app.name] || {};
        const item = document.createElement('button');
        item.type = 'button'; item.className = 'app-item'; item.dataset.appId = app.id; item.draggable = true;
        const icon = document.createElement('span'); icon.className = 'app-icon';
        if (settings.img) icon.style.backgroundImage = `url(${settings.img})`;
        else icon.innerHTML = `<i data-lucide="${settings.icon || app.icon}"></i>`;
        const label = document.createElement('span'); label.textContent = settings.name || app.name;
        item.append(icon, label);
        item.addEventListener('click', () => window.openApp(app.id));
        grid.appendChild(item);
    });
    if (window.lucide) lucide.createIcons({ root: grid });
    let dragged = null;
    grid.addEventListener('dragstart', (event) => { dragged = event.target.closest('.app-item'); if (dragged) dragged.classList.add('dragging'); });
    grid.addEventListener('dragend', () => { if (dragged) dragged.classList.remove('dragging'); dragged = null; });
    grid.addEventListener('dragover', (event) => { event.preventDefault(); const target = event.target.closest('.app-item'); if (dragged && target && target !== dragged) target.classList.add('drag-over'); });
    grid.addEventListener('dragleave', (event) => event.target.closest('.app-item')?.classList.remove('drag-over'));
    grid.addEventListener('drop', (event) => { event.preventDefault(); const target = event.target.closest('.app-item'); if (!dragged || !target || target === dragged) return; target.classList.remove('drag-over'); grid.insertBefore(dragged, target); localStorage.setItem('wuyo_app_order', JSON.stringify([...grid.children].map(el => el.dataset.appId))); });
    let touchItem = null;
    grid.addEventListener('pointerdown', (event) => { touchItem = event.target.closest('.app-item'); });
    grid.addEventListener('pointermove', (event) => { if (!touchItem) return; const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.app-item'); if (target && target !== touchItem && target.parentElement === grid) grid.insertBefore(touchItem, target); });
    grid.addEventListener('pointerup', () => { if (!touchItem) return; localStorage.setItem('wuyo_app_order', JSON.stringify([...grid.children].map(el => el.dataset.appId))); touchItem = null; });
};

window.renderHomeWidgets = () => {
    const area = document.getElementById('custom-widget-area');
    if (!area) return;
    const widgets = readJson('wuyo_config', {}).widgets || {};
    area.replaceChildren();
    Object.entries(widgets).filter(([, widget]) => widget.show).forEach(([id, widget]) => {
        if (!widget.title && !widget.text) return;
        const card = document.createElement('article'); card.className = 'custom-widget';
        if (widget.background) card.style.backgroundImage = `url(${widget.background})`;
        card.innerHTML = `<div class="custom-widget-content"><div class="custom-widget-title">${widget.title || 'WIDGET'}</div><div class="custom-widget-text">${widget.text || widget.sub || ''}</div></div><div class="custom-widget-icon"><i data-lucide="${widget.icon || 'sparkles'}"></i></div>`;
        area.appendChild(card);
    });
    if (window.lucide) lucide.createIcons({ root: area });
};

window.openApp = (appId) => {
    const appContainer = document.getElementById(`${appId}-app`);
    if (!appContainer) {
        alert('该功能暂未开放。');
        return;
    }

    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'none';
    appContainer.style.display = 'block';

    // 💥 终极防缓存：每次打开都带上当前时间戳，逼迫浏览器读取最新代码！
    const bust = '?v=' + Date.now();

    // 1. 加载美化模块
    if (appId === 'beautify' && !window.beautifyLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'beautify/beautify.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'beautify/beautify.js' + bust; document.body.appendChild(script);
        window.beautifyLoaded = true;
    }

    // 2. 加载聊天模块
    if (appId === 'chat' && !window.chatLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'chat/chat.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'chat/chat.js' + bust; document.body.appendChild(script);
        window.chatLoaded = true;
    }

    // 3. 加载设置模块
    if (appId === 'settings' && !window.settingsLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'settings/settings.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'settings/settings.js' + bust; document.body.appendChild(script);
        window.settingsLoaded = true;
    }

    // 4. 加载世界书模块
    if (appId === 'worldbook' && !window.worldbookLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'worldbook/worldbook.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'worldbook/worldbook.js' + bust; document.body.appendChild(script);
        window.worldbookLoaded = true;
    }

    // 5. 💥 加载通讯录多角色模块 (加入了防缓存！)
    if (appId === 'contacts' && !window.contactsLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'contacts/contacts.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'contacts/contacts.js' + bust; document.body.appendChild(script);
        window.contactsLoaded = true;
    }

    // 6. 动态加载记忆模块
    if (appId === 'memory' && !window.memoryLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'memory/memory.css' + bust; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'memory/memory.js' + bust; document.body.appendChild(script);
        window.memoryLoaded = true;
    }

    // 7. 纯净版日历模块打开触发
    if (appId === 'calendar') {
        const mainAppBox = document.getElementById('calendar-app-main');
        if (mainAppBox) {
            setTimeout(() => { mainAppBox.classList.add('active'); }, 10);
        }
        if (window.renderCalendarInstance) {
            window.renderCalendarInstance();
        }
    }
};

window.closeApp = (appId) => {
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) appContainer.style.display = 'none';
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'block';
};

// ==========================================
// 🎨 WUYO 美化数据同步引擎
// ==========================================
window.applyConfig = () => {
    const configStr = localStorage.getItem('wuyo_config');
    if (!configStr) return;
    const config = JSON.parse(configStr);
    const root = document.documentElement;

    // 总体视觉同步
    if (config.style) {
        if (config.style.bgImage) {
            document.body.style.backgroundImage = `url(${config.style.bgImage})`;
            document.body.style.backgroundSize = 'cover'; document.body.style.backgroundPosition = 'center';
        } else {
            root.style.setProperty('--bg-color', config.style.bgColor); document.body.style.backgroundImage = 'none';
        }
        if (config.style.cardRadius) root.style.setProperty('--radius-md', `${config.style.cardRadius}px`);
        if (config.style.cardOpacity) root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${config.style.cardOpacity / 100})`);
    }

    // 文字与 AI 头像同步
    if (config.texts) {
        const brandEl = document.querySelector('.brand-name'); if(brandEl && config.texts.brand) brandEl.textContent = config.texts.brand;
        const aiTitleEl = document.querySelector('.ai-info h2'); if(aiTitleEl && config.texts.aiTitle) aiTitleEl.textContent = config.texts.aiTitle;
        const aiSubEl = document.querySelector('.ai-info p'); if(aiSubEl && config.texts.aiSubtitle) aiSubEl.textContent = config.texts.aiSubtitle;

        const aiAvatarEl = document.querySelector('.ai-avatar');
        if (aiAvatarEl) {
            if (config.texts.aiAvatar) {
                aiAvatarEl.innerHTML = ''; aiAvatarEl.style.backgroundImage = `url(${config.texts.aiAvatar})`; aiAvatarEl.style.backgroundSize = 'cover';
            } else {
                aiAvatarEl.style.backgroundImage = 'none'; aiAvatarEl.innerHTML = '<i data-lucide="bot"></i>'; lucide.createIcons({ root: aiAvatarEl });
            }
        }
    }

    // 右上角个人资料同步
    if (config.profile) {
        const nicknameEl = document.getElementById('user-nickname'); if (nicknameEl && config.profile.nickname) nicknameEl.textContent = config.profile.nickname;
        const profilePic = document.getElementById('profile-pic');
        if(profilePic && config.profile.avatar) { profilePic.style.backgroundImage = `url(${config.profile.avatar})`; profilePic.classList.add('has-image'); }
    }

    window.renderHomeWidgets();
    window.renderHomeApps();


};

// ==========================================
// 🚀 DOM 加载完成后初始化核心功能
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    window.applyConfig();

    // 更新时钟与日期
    const updateDateTime = () => {
        const now = new Date(); const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayEl = document.getElementById('current-day'); if (dayEl) dayEl.textContent = days[now.getDay()];
        const dateEl = document.getElementById('current-date'); if (dateEl) dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;
        
        const hours = String(now.getHours()).padStart(2, '0'); const minutes = String(now.getMinutes()).padStart(2, '0');
        const widgetTimeEl = document.getElementById('widget-time'); if (widgetTimeEl) widgetTimeEl.textContent = `${hours}:${minutes}`;
        const widgetDateSubEl = document.getElementById('widget-date-sub'); if (widgetDateSubEl) widgetDateSubEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;
    };
    updateDateTime(); setInterval(updateDateTime, 60000); 

    window.renderHomeApps();
    window.renderHomeWidgets();
    document.querySelectorAll('.dock-item[data-app-id]').forEach((item) => item.addEventListener('click', () => window.openApp(item.dataset.appId)));

    // 桌面组件点击上传图片
    const imageUploader = document.getElementById('image-uploader');
    let currentUploadTarget = null;
    if (imageUploader) {
        document.querySelectorAll('#home-screen .uploadable').forEach(el => {
            el.addEventListener('click', () => { currentUploadTarget = el; imageUploader.click(); });
        });
        imageUploader.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && currentUploadTarget) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentUploadTarget.innerHTML = '';
                    currentUploadTarget.style.backgroundImage = `url(${e.target.result})`; 
                    currentUploadTarget.style.backgroundSize = 'cover';
                    currentUploadTarget.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
            imageUploader.value = '';
        });
    }
});
