

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化极简图标
    lucide.createIcons();
    document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // ==========================================
    // 🎨 WUYO 美化数据同步引擎
    // 读取 localStorage 并应用到主屏幕
    // ==========================================
    const applyConfig = () => {
        const configStr = localStorage.getItem('wuyo_config');
        if (!configStr) return; // 如果没有自定义配置，使用默认 CSS
        
        const config = JSON.parse(configStr);
        const root = document.documentElement;

        // 1. 应用总体视觉 (通过 CSS 变量重写)
        if (config.style) {
            if (config.style.bgImage) {
                document.body.style.backgroundImage = `url(${config.style.bgImage})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            } else {
                root.style.setProperty('--bg-color', config.style.bgColor);
            }
            root.style.setProperty('--radius-md', `${config.style.cardRadius}px`);
            // 将 1-100 的透明度滑块值转换为 0-1 的 alpha 值
            const alpha = config.style.cardOpacity / 100;
            root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${alpha})`);
        }

        // 2. 应用主页文字
        if (config.texts) {
            const brandEl = document.querySelector('.brand-name');
            if(brandEl) brandEl.textContent = config.texts.brand;
            
            const aiTitleEl = document.querySelector('.ai-info h2');
            if(aiTitleEl) aiTitleEl.textContent = config.texts.aiTitle;
            
            const aiSubEl = document.querySelector('.ai-info p');
            if(aiSubEl) aiSubEl.textContent = config.texts.aiSubtitle;
        }

            // 3. 应用头像与昵称
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


        // 4. 应用 Widget (Memory 等)
        if (config.widgets) {
            // Memory
            const memoryTag = document.querySelector('.polaroid-tag');
            const memoryDesc = document.querySelector('.polaroid-desc');
            const memoryPic = document.getElementById('memory-pic');
            if(memoryTag) memoryTag.textContent = config.widgets.memory.title;
            if(memoryDesc) memoryDesc.textContent = config.widgets.memory.sub;
            if(memoryPic && config.widgets.memory.img) {
                memoryPic.style.backgroundImage = `url(${config.widgets.memory.img})`;
                memoryPic.classList.add('has-image');
            }
            
            // Today
            const todayText = document.querySelector('.today-text');
            if(todayText) {
                // 处理换行符
                todayText.innerHTML = config.widgets.today.text.replace(/\n/g, '<br>');
            }

            // 情侣相恋天数计算
            if (config.widgets.couple && config.widgets.couple.date) {
                const startDate = new Date(config.widgets.couple.date);
                const diffTime = Math.abs(new Date() - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                const coupleDaysEl = document.querySelector('.couple-days');
                if (coupleDaysEl) coupleDaysEl.textContent = `${diffDays} Days`;
            }
        }

        // 5. 应用 App 图标与重命名
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
                        const iconDiv = span.previousElementSibling; // 获取上方的 .app-icon
                        if(iconDiv) {
                            iconDiv.innerHTML = ''; // 清除原有的 lucide 图标
                            iconDiv.style.backgroundImage = `url(${config.apps[appName].img})`;
                            iconDiv.style.backgroundSize = 'cover';
                        }
                    }
                }
            });
        }
    };
    
    // 立即执行配置同步
    applyConfig();

    // ==========================================
    // 下面保留原有的时间更新、分页指示器等代码...
    // ==========================================
    const updateDateTime = () => { /* ...原代码... */ };
    updateDateTime();
    setInterval(updateDateTime, 60000); 
    // ...
});


    // 2. 时间与日期自动更新逻辑
    const updateDateTime = () => {
        const now = new Date();
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        
        // 更新顶部头部
        const currentDay = days[now.getDay()];
        const currentDate = `${now.getMonth() + 1}月${now.getDate()}日`;
        
        document.getElementById('current-day').textContent = currentDay;
        document.getElementById('current-date').textContent = currentDate;

        // 更新时钟小组件
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('widget-time').textContent = `${hours}:${minutes}`;
        document.getElementById('widget-date-sub').textContent = currentDate;
    };
    
    updateDateTime();
    setInterval(updateDateTime, 60000); 

    // 3. 桌面滑动分页指示器同步逻辑
    const swiper = document.getElementById('desktop-swiper');
    const dots = document.querySelectorAll('.pagination-dots .dot');

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

    // 4. 图片自定义上传系统
    const imageUploader = document.getElementById('image-uploader');
    const uploadables = document.querySelectorAll('.uploadable');
    let currentUploadTarget = null;

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
                currentUploadTarget.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
        imageUploader.value = '';
    });
});
