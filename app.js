document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化 Lucide 极简图标
    lucide.createIcons();

    // 2. 日期更新逻辑 (去除了已删除的时钟部分，防止报错)
    const updateDate = () => {
        const now = new Date();
        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        
        const dayEl = document.getElementById('current-day');
        const dateEl = document.getElementById('current-date');
        
        if (dayEl) dayEl.textContent = days[now.getDay()];
        if (dateEl) dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;
    };
    
    updateDate();

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

        // Dock 栏动画
        if (targetId === 'view-home') {
            dock.style.transform = 'translateX(-50%) translateY(0)';
            dock.style.opacity = '1';
            dock.style.pointerEvents = 'auto';
        } else {
            dock.style.transform = 'translateX(-50%) translateY(40px)';
            dock.style.opacity = '0';
            dock.style.pointerEvents = 'none';
        }
    };

    // 绑定所有点击事件
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
