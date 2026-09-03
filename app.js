document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化图标
    lucide.createIcons();

    // 2. 日期与 24 小时组件更新逻辑
    const updateDateTime = () => {
        const now = new Date();
        
        // 更新日期
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayEl = document.getElementById('current-day');
        const dateEl = document.getElementById('current-date');
        
        if (dayEl) dayEl.textContent = days[now.getDay()];
        if (dateEl) dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;

        // 更新 24小时小组件
        const timeWidget = document.getElementById('widget-time');
        if (timeWidget) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeWidget.textContent = `${hours}:${minutes}`;
        }
    };
    
    updateDateTime();
    setInterval(updateDateTime, 60000); // 每分钟更新一次时钟

    // 3. 视图切换逻辑
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

        // 仅在首页显示 Dock，其他页面隐藏下沉
        if (targetId === 'view-home') {
            dock.style.transform = 'translateX(-50%) translateY(0)';
            dock.style.opacity = '1';
            dock.style.pointerEvents = 'auto';
        } else {
            dock.style.transform = 'translateX(-50%) translateY(50px)';
            dock.style.opacity = '0';
            dock.style.pointerEvents = 'none';
        }
    };

    // 绑定点击事件
    navigationTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = trigger.getAttribute('data-target');
            if (targetId) {
                navigateTo(targetId);
            }
        });
    });
});
