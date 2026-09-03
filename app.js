// ==========================================
// 📱 手机系统级交互：App 打开与模块动态加载
// ==========================================
window.openApp = (appId) => {
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) homeScreen.style.display = 'none';
    
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) appContainer.style.display = 'block';

    if (appId === 'beautify' && !window.beautifyLoaded) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'beautify/beautify.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'beautify/beautify.js';
        document.body.appendChild(script);

        window.beautifyLoaded = true;
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

    // 1. 总体视觉
    if (config.style) {
        if (config.style.bgImage) {
            document.body.style.backgroundImage = `url(${config.style.bgImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            root.style.setProperty('--bg-color', config.style.bgColor);
            document.body.style.backgroundImage = 'none';
        }
        root.style.setProperty('--radius-md', `${config.style.cardRadius}px`);
        const alpha = config.style.cardOpacity / 100;
        root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${alpha})`);
    }

    // 2. 主页文字 & AI 伴侣头像同步
    if (config.texts) {
        const brandEl = document.querySelector('.brand-name');
        if(brandEl) brandEl.textContent = config.texts.brand;
        
        const aiTitleEl = document.querySelector('.ai-info h2');
        if(aiTitleEl) aiTitleEl.textContent = config.texts.aiTitle;
        
        const aiSubEl = document.querySelector('.ai-info p');
        if(aiSubEl) aiSubEl.textContent = config.texts.aiSubtitle;

        // 🟢 核心：应用用户自定义的 AI 头像
        const aiAvatarEl = document.querySelector('.ai-avatar');
        if (aiAvatarEl) {
            if (config.texts.aiAvatar) {
                aiAvatarEl.innerHTML = ''; // 清除默认的机器人 icon
                aiAvatarEl.style.backgroundImage = `url(${config.texts.aiAvatar})`;
                aiAvatarEl.style.backgroundSize = 'cover';
                aiAvatarEl.style.backgroundPosition = 'center';
            } else {
                // 如果没有自定义，恢复默认机器人 icon
                aiAvatarEl.style.backgroundImage = 'none';
                aiAvatarEl.innerHTML = '<i data-lucide="bot"></i>';
                lucide.createIcons({ root: aiAvatarEl });
            }
        }
    }

    // 3. 个人资料 (右上角头像与昵称)
    if (config.profile) {
        if (config.profile.nickname) {
            const nicknameEl = document.getElementById('user-nickname');
            if (nicknameEl) nicknameEl.textContent = config.profile.nickname;
        }
        if (config.profile.avatar) {
            const profilePic = document.getElementById('profile-pic');
            if(profilePic) {
                profilePic.style.backgroundImage = `url(${config.profile.avatar})`;
                profilePic.classList.add('has-image');
            }
        }
    }

    // 4. 组件同步
    if (config.widgets) {
        const memoryTag = document.querySelector('.polaroid-tag');
        const memoryDesc = document.querySelector('.polaroid-desc');
        const memoryPic = document.getElementById('memory-pic');
        if(memoryTag) memoryTag.textContent = config.widgets.memory.title;
        if(memoryDesc) memoryDesc.textContent = config.widgets.memory.sub;
        if(memoryPic && config.widgets.memory.img) {
            memoryPic.style.backgroundImage = `url(${config.widgets.memory.img})`;
            memoryPic.classList.add('has-image');
        }
        
        const todayText = document.querySelector('.today-text');
        if(todayText) {
            todayText.innerHTML = config.widgets.today.text.replace(/\n/g, '<br>');
        }

        if (config.widgets.couple && config.widgets.couple.date) {
            const startDate = new Date(config.widgets.couple.date);
            const diffTime = Math.abs(new Date() - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const coupleDaysEl = document.querySelector('.couple-days');
            if (coupleDaysEl) coupleDaysEl.textContent = `${diffDays} Days`;
        }
    }

    // 5. App 图标同步
    if (config.apps) {
        const appSpans = document.querySelectorAll('.app-item span');
        appSpans.forEach(span => {
            const appName = span.textContent;
            if (config.apps[appName]) {
                if (config.apps[appName].name) {
                    span.textContent = config.apps[appName].name;
                }
                if (config.apps[appName].img) {
                    const iconDiv = span.previousElementSibling;
                    if(iconDiv) {
                        iconDiv.innerHTML = '';
                        iconDiv.style.backgroundImage = `url(${config.apps[appName].img})`;
                        iconDiv.style.backgroundSize = 'cover';
                    }
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

    const updateDateTime = () => {
        const now = new Date();
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        
        const currentDay = days[now.getDay()];
        const currentDate = `${now.getMonth() + 1}月${now.getDate()}日`;
        
        const dayEl = document.getElementById('current-day');
        const dateEl = document.getElementById('current-date');
        if (dayEl) dayEl.textContent = currentDay;
        if (dateEl) dateEl.textContent = currentDate;

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const widgetTimeEl = document.getElementById('widget-time');
        const widgetDateSubEl = document.getElementById('widget-date-sub');
        if (widgetTimeEl) widgetTimeEl.textContent = `${hours}:${minutes}`;
        if (widgetDateSubEl) widgetDateSubEl.textContent = currentDate;
    };
    
    updateDateTime();
    setInterval(updateDateTime, 60000); 

    const swiper = document.getElementById('desktop-swiper');
    const dots = document.querySelectorAll('.pagination-dots .dot');

    if (swiper) {
        swiper.addEventListener('scroll', () => {
            const scrollPosition = swiper.scrollLeft;
            const pageIndex = Math.round(scrollPosition / swiper.clientWidth);
            
            dots.forEach((dot, index) => {
                if (index === pageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    const imageUploader = document.getElementById('image-uploader');
    const uploadables = document.querySelectorAll('#home-screen .uploadable');
    let currentUploadTarget = null;

    if (imageUploader) {
        uploadables.forEach(el => {
            el.addEventListener('click', () => {
                currentUploadTarget = el;
                imageUploader.click();
            });
        });

        imageUploader.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && currentUploadTarget) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    currentUploadTarget.style.backgroundImage = `url(${imageUrl})`;
                    currentUploadTarget.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
            imageUploader.value = '';
        });
    }
});
