window.MomentsViewTemplate = `
    <div class="moments-page" id="moments-page-main">
        <!-- 顶部透明导航 -->
        <header class="moments-header" id="moments-header">
            <button class="moments-icon-btn" id="moments-back-btn"><i data-lucide="chevron-left"></i></button>
            <span class="moments-header-title">朋友圈</span>
            <button class="moments-icon-btn" id="moments-camera-btn"><i data-lucide="camera"></i></button>
        </header>

        <!-- 滚动列表区 -->
        <div class="moments-scroll-area" id="moments-scroll-area">
            <!-- 封面与个人资料 -->
            <div class="moments-cover-container" id="moments-cover-bg">
                <div class="moments-user-info">
                    <div class="moments-user-name" id="moments-user-name">我</div>
                    <div class="moments-user-avatar" id="moments-user-avatar"><i data-lucide="user"></i></div>
                </div>
            </div>

            <!-- 朋友圈动态流 -->
            <div class="moments-feed" id="moments-feed-list">
                <!-- 动态将由 JS 渲染在此处 -->
            </div>
        </div>
    </div>
`;
