// ==========================================
// 📱 手机系统级交互：App 打开与模块动态加载
// ==========================================
window.openApp = (appId) => {
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) {
        homeScreen.style.display = 'none';
    }
    
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) {
        appContainer.style.display = 'block';
    }

    // 1. 动态加载美化模块
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

    // 2. 动态加载聊天社交模块
    if (appId === 'chat' && !window.chatLoaded) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'chat/chat.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'chat/chat.js';
        document.body.appendChild(script);

        window.chatLoaded = true;
    }
};

window.closeApp = (appId) => {
    const appContainer = document.getElementById(`${appId}-app`);
    if (appContainer) {
        appContainer.style.display = 'none';
    }
    
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) {
        homeScreen.style.display = 'flex';
    }
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
        if (brandEl) brandEl.textContent = config.texts.brand;
        
        const aiTitleEl = document.querySelector('.ai-info h2');
        if (aiTitleEl) aiTitleEl.textContent = config.texts.aiTitle;
        
        const aiSubEl = document.querySelector('.ai-info p');
        if (aiSubEl) aiSubEl.textContent = config.texts.aiSubtitle;

        // 应用用户自定义的 AI 头像
        const aiAvatarEl = document.querySelector('.ai-avatar');
        if (aiAvatarEl) {
            if (config.texts.aiAvatar) {
                aiAvatarEl.innerHTML = ''; // 清除默认的机器人 icon
                aiAvatarEl.style.backgroundImage = `url(${config.texts.aiAvatar})`;
                aiAvatarEl.style.backgroundSize = 'cover';
                aiAvatarEl.style.backgroundPosition = 'center';
            } else {
                aiAvatarEl.style.backgroundImage = 'none';
                aiAvatarEl.innerHTML = '<i data-lucide="bot"></i>';
                lucide.createIcons({ root: aiAvatarEl });
            }
        }
    }

    // 3. 个人资料 (右上角头像与昵称)
    if (config.profile) {
        const nicknameEl = document.getElementById('user-nickname');
        if (nicknameEl && config.profile.nickname) {
            nicknameEl.textContent = config.profile.nickname;
        }
        
        const profilePic = document.getElementById('profile-pic');
        if (profilePic && config.profile.avatar) {
            profilePic.style.backgroundImage = `url(${config.profile.avatar})`;
            profilePic.classList.add('has-image');
        }
    }

    // 4. 组件同步 (包含新增的情侣组件和一起听歌组件)
    if (config.widgets) {
        // Memory 记忆组件
        const memoryTag = document.querySelector('.polaroid-tag');
        const memoryDesc = document.querySelector('.polaroid-desc');
        const memoryPic = document.getElementById('memory-pic');
        
        if (memoryTag && config.widgets.memory) memoryTag.textContent = config.widgets.memory.title;
        if (memoryDesc && config.widgets.memory) memoryDesc.textContent = config.widgets.memory.sub;
        if (memoryPic && config.widgets.memory && config.widgets.memory.img) {
            memoryPic.style.backgroundImage = `url(${config.widgets.memory.img})`;
            memoryPic.classList.add('has-image');
        }
        
        // Today 每日文字
        const todayText = document.querySelector('.today-text');
        if (todayText && config.widgets.today) {
            todayText.innerHTML = config.widgets.today.text.replace(/\n/g, '<br>');
        }

        // 高级情侣组件
        if (config.widgets.couple) {
            if (config.widgets.couple.date) {
                const startDate = new Date(config.widgets.couple.date);
                const diffTime = Math.abs(new Date() - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                const coupleDaysEl = document.getElementById('w-couple-days-display');
                if (coupleDaysEl) coupleDaysEl.textContent = `${diffDays} Days`;
            }
            
            const cTitle = document.getElementById('w-couple-title');
            if (cTitle) cTitle.textContent = config.widgets.couple.text || 'LOVE';
            
            const cUser = document.getElementById('w-couple-user-img');
            if (cUser && config.widgets.couple.userAvatar) {
                cUser.innerHTML = '';
                cUser.style.backgroundImage = `url(${config.widgets.couple.userAvatar})`;
            }
            
            const cChar = document.getElementById('w-couple-char-img');
            if (cChar && config.widgets.couple.charAvatar) {
                cChar.innerHTML = '';
                cChar.style.backgroundImage = `url(${config.widgets.couple.charAvatar})`;
            }
        }

        // 一起听歌组件
        if (config.widgets.listen) {
            const lCover = document.getElementById('w-listen-cover');
            if (lCover && config.widgets.listen.cover) {
                lCover.innerHTML = '';
                lCover.style.backgroundImage = `url(${config.widgets.listen.cover})`;
            }
            
            const lSong = document.getElementById('w-listen-song');
            if (lSong) lSong.textContent = config.widgets.listen.song;
            
            const lArtist = document.getElementById('w-listen-artist');
            if (lArtist) lArtist.textContent = config.widgets.listen.artist;
            
            const lTime = document.getElementById('w-listen-time');
            if (lTime) lTime.textContent = config.widgets.listen.time;
            
            const lText = document.getElementById('w-listen-text');
            if (lText) lText.textContent = config.widgets.listen.text;
            
            // 一起听歌组件的头像同步读取情侣组件里设置的头像
            const lUser = document.getElementById('l-avatar-user');
            if (lUser && config.widgets.couple && config.widgets.couple.userAvatar) {
                lUser.style.backgroundImage = `url(${config.widgets.couple.userAvatar})`;
            }
            
            const lChar = document.getElementById('l-avatar-char');
            if (lChar && config.widgets.couple && config.widgets.couple.charAvatar) {
                lChar.style.backgroundImage = `url(${config.widgets.couple.charAvatar})`;
            }
        }
    }

    // 5. App 图标同步 (支持所有新增的 App)
    if (config.apps) {
        const appSpans = document.querySelectorAll('.app-item span');
        appSpans.forEach(span => {
            const appName = span.textContent;
            if (config.apps[appName]) {
                // 替换名称
                if (config.apps[appName].name) {
                    span.textContent = config.apps[appName].name;
                }
                // 替换图片
                if (config.apps[appName].img) {
                    const iconDiv = span.previousElementSibling;
                    if (iconDiv) {
                        iconDiv.innerHTML = ''; // 清除默认图标
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
    // 1. 初始化极简图标
    lucide.createIcons();
    
    // 2. 立即执行配置同步渲染
    window.applyConfig();

    // 3. 时间与日期自动更新逻辑
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

    // 4. 桌面滑动分页指示器同步逻辑
    const swiper = document.getElementById('desktop-swiper');
    const dots = document.querySelectorAll('.pagination-dots .dot');

    if (swiper) {
        swiper.addEventListener('scroll', () => {
            // 计算当前滑到了第几页
            const scrollPosition = swiper.scrollLeft;
            const pageIndex = Math.round(scrollPosition / swiper.clientWidth);
            
            // 更新点的状态
            dots.forEach((dot, index) => {
                if (index === pageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    // 5. 主页原始的图片自定义上传系统 (Widget直接点击上传)
    const imageUploader = document.getElementById('image-uploader');
    const uploadables = document.querySelectorAll('#home-screen .uploadable');
    let currentUploadTarget = null;

    if (imageUploader) {
        // 点击图片区域触发隐藏的文件输入框
        uploadables.forEach(el => {
            el.addEventListener('click', () => {
                currentUploadTarget = el;
                imageUploader.click();
            });
        });

        // 渲染图片
        imageUploader.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && currentUploadTarget) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;
                    currentUploadTarget.style.backgroundImage = `url(${imageUrl})`;
                    currentUploadTarget.style.backgroundSize = 'cover';
                    currentUploadTarget.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
            imageUploader.value = '';
        });
    }
});
