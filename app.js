document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化极简图标
    lucide.createIcons();

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
