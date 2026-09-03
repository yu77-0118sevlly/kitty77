document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化 Lucide 极简图标
    lucide.createIcons();

    // 2. 状态栏时钟与日期更新
    const updateTime = () => {
        const now = new Date();
        
        // 更新时钟
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}`;
        
        // 更新首页日期 (仅在页面加载时更新一次即可)
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const currentDay = days[now.getDay()];
        const month = now.getMonth() + 1;
        const date = now.getDate();
        
        const dayEl = document.getElementById('current-day');
        const dateEl = document.getElementById('current-date');
        
        if (dayEl) dayEl.textContent = currentDay;
        if (dateEl) dateEl.textContent = `${month}月${date}日`;
    };
    
    updateTime();
    setInterval(updateTime, 60000); // 每分钟更新一次时钟

    // 3. 单页应用 (SPA) 路由切换逻辑
    const views = document.querySelectorAll('.view');
    const navigationTriggers = document.querySelectorAll('[data-target]');
    const dock = document.getElementById('dock');

    const navigateTo = (targetId) => {
        // 隐藏所有视图
        views.forEach(view => {
            view.classList.remove('active');
        });

        // 显示目标视图
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Dock 栏动画：仅在首页显示，进入其他页面时下沉隐藏
        if (targetId === 'view-home') {
            dock.style.transform = 'translateX(-50%) translateY(0)';
            dock.style.opacity = '1';
            dock.style.pointerEvents = 'auto';
        } else {
            dock.style.transform = 'translateX(-50%) translateY(30px)';
            dock.style.opacity = '0';
            dock.style.pointerEvents = 'none';
        }
    };

    // 绑定所有带有 data-target 属性的按钮 (App图标、返回按钮、Home Indicator)
    navigationTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            const targetId = trigger.getAttribute('data-target');
            if (targetId) {
                navigateTo(targetId);
            }
        });
    });
});
