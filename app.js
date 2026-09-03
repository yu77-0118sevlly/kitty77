// ==========================================
// 📱 WUYO 系统级交互：App 打开与模块动态加载
// ==========================================
window.openApp = (appId) => {
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'none';
    
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) appContainer.style.display = 'block';

    // 1. 加载美化模块
    if (appId === 'beautify' && !window.beautifyLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'beautify/beautify.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'beautify/beautify.js'; document.body.appendChild(script);
        window.beautifyLoaded = true;
    }

    // 2. 加载聊天模块
    if (appId === 'chat' && !window.chatLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'chat/chat.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'chat/chat.js'; document.body.appendChild(script);
        window.chatLoaded = true;
    }

    // 3. 加载设置模块
    if (appId === 'settings' && !window.settingsLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'settings/settings.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'settings/settings.js'; document.body.appendChild(script);
        window.settingsLoaded = true;
    }

    // 4. 加载世界书模块
    if (appId === 'worldbook' && !window.worldbookLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'worldbook/worldbook.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'worldbook/worldbook.js'; document.body.appendChild(script);
        window.worldbookLoaded = true;
    }

    // 5. 加载通讯录多角色模块
    if (appId === 'contacts' && !window.contactsLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'contacts/contacts.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'contacts/contacts.js'; document.body.appendChild(script);
        window.contactsLoaded = true;
    }
        // 6. 动态加载记忆模块
    if (appId === 'memory' && !window.memoryLoaded) {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'memory/memory.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'memory/memory.js'; document.body.appendChild(script);
        window.memoryLoaded = true;
    }

};

window.closeApp = (appId) => {
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) appContainer.style.display = 'none';
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'flex';
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

    // 桌面小组件同步
    if (config.widgets) {
        const memoryTag = document.querySelector('.polaroid-tag'); const memoryDesc = document.querySelector('.polaroid-desc'); const memoryPic = document.getElementById('memory-pic');
        if(memoryTag && config.widgets.memory) memoryTag.textContent = config.widgets.memory.title; 
        if(memoryDesc && config.widgets.memory) memoryDesc.textContent = config.widgets.memory.sub;
        if(memoryPic && config.widgets.memory?.img) { memoryPic.style.backgroundImage = `url(${config.widgets.memory.img})`; memoryPic.classList.add('has-image'); }
        
        const todayText = document.querySelector('.today-text'); 
        if(todayText && config.widgets.today) todayText.innerHTML = config.widgets.today.text.replace(/\n/g, '<br>');

        if (config.widgets.couple) {
            if(config.widgets.couple.date) {
                const diffDays = Math.ceil(Math.abs(new Date() - new Date(config.widgets.couple.date)) / (1000 * 60 * 60 * 24)); 
                const coupleDaysEl = document.getElementById('w-couple-days-display'); if (coupleDaysEl) coupleDaysEl.textContent = `${diffDays} Days`;
            }
            const cTitle = document.getElementById('w-couple-title'); if(cTitle) cTitle.textContent = config.widgets.couple.text || 'LOVE';
            const cUser = document.getElementById('w-couple-user-img'); if(cUser && config.widgets.couple.userAvatar) { cUser.innerHTML = ''; cUser.style.backgroundImage = `url(${config.widgets.couple.userAvatar})`; }
            const cChar = document.getElementById('w-couple-char-img'); if(cChar && config.widgets.couple.charAvatar) { cChar.innerHTML = ''; cChar.style.backgroundImage = `url(${config.widgets.couple.charAvatar})`; }
        }

        if (config.widgets.listen) {
            const lCover = document.getElementById('w-listen-cover'); if(lCover && config.widgets.listen.cover) { lCover.innerHTML = ''; lCover.style.backgroundImage = `url(${config.widgets.listen.cover})`; }
            const lSong = document.getElementById('w-listen-song'); if(lSong) lSong.textContent = config.widgets.listen.song;
            const lArtist = document.getElementById('w-listen-artist'); if(lArtist) lArtist.textContent = config.widgets.listen.artist;
            const lTime = document.getElementById('w-listen-time'); if(lTime) lTime.textContent = config.widgets.listen.time;
            const lText = document.getElementById('w-listen-text'); if(lText) lText.textContent = config.widgets.listen.text;
            
            const lUser = document.getElementById('l-avatar-user'); if(lUser && config.widgets.couple?.userAvatar) lUser.style.backgroundImage = `url(${config.widgets.couple.userAvatar})`;
            const lChar = document.getElementById('l-avatar-char'); if(lChar && config.widgets.couple?.charAvatar) lChar.style.backgroundImage = `url(${config.widgets.couple.charAvatar})`;
        }
    }

    // App 自定义图标同步
    if (config.apps) {
        document.querySelectorAll('.app-item span').forEach(span => {
            const appName = span.textContent;
            if (config.apps[appName]) {
                if (config.apps[appName].name) span.textContent = config.apps[appName].name;
                if (config.apps[appName].img) {
                    const iconDiv = span.previousElementSibling;
                    if(iconDiv) { iconDiv.innerHTML = ''; iconDiv.style.backgroundImage = `url(${config.apps[appName].img})`; iconDiv.style.backgroundSize = 'cover'; }
                }
            }
        });
    }
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

    // 桌面滑动与指示器联动
    const swiper = document.getElementById('desktop-swiper');
    const dots = document.querySelectorAll('.pagination-dots .dot');
    if (swiper) {
        swiper.addEventListener('scroll', () => {
            const pageIndex = Math.round(swiper.scrollLeft / swiper.clientWidth);
            dots.forEach((dot, index) => { if (index === pageIndex) dot.classList.add('active'); else dot.classList.remove('active'); });
        });
    }

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
