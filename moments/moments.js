(function() {
    // 强制强刷缓存标记
    console.log("Moments module loaded v2.0");

    window.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('chat-app');
        if (!container) return;

        // 1. 检查并注入朋友圈 DOM 视图（如果还没有的话）
        if (!document.getElementById('moments-page-main')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = window.MomentsViewTemplate;
            container.appendChild(tempDiv.firstElementChild);
            if (window.lucide) lucide.createIcons({ root: container });
        }

        // 2. 初始化朋友圈假数据
        let momentsData = JSON.parse(localStorage.getItem('wuyo_moments_data'));
        if (!momentsData || momentsData.length === 0) {
            momentsData = [
                {
                    id: "m_1001",
                    authorId: "char_default",
                    authorName: "AI 伙伴",
                    avatar: "",
                    content: "今天下班路上突然下雨了，还好带了伞。",
                    images: [],
                    time: Date.now() - 3600000,
                    likes: ["我"],
                    comments: [
                        { id: "c_1", author: "我", text: "注意安全，别感冒了。" }
                    ]
                },
                {
                    id: "m_1002",
                    authorId: "user",
                    authorName: "我",
                    avatar: "",
                    content: "工作很累，但晚霞很美。",
                    images: [],
                    time: Date.now() - 86400000,
                    likes: ["AI 伙伴"],
                    comments: []
                }
            ];
            localStorage.setItem('wuyo_moments_data', JSON.stringify(momentsData));
        }

        // 3. 💥 暴力拦截底栏点击：彻底消灭“开发中”弹窗
        document.body.addEventListener('click', (e) => {
            const navItem = e.target.closest('.wechat-nav-item');
            if (navItem) {
                const textSpan = navItem.querySelector('span');
                const text = textSpan ? textSpan.textContent.trim() : navItem.textContent.trim();
                
                // 只要点的是 Moments / 朋友圈
                if (text.includes('Moments') || text.includes('朋友圈')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // 强行拦截原有的 alert 事件
                    openMomentsPage();
                }
            }
        }, true); // 使用捕获阶段，抢先拦截

        // 4. 界面交互绑定
        const momentsPage = document.getElementById('moments-page-main');
        const scrollArea = document.getElementById('moments-scroll-area');
        const header = document.getElementById('moments-header');
        
        if (scrollArea) {
            scrollArea.addEventListener('scroll', () => {
                if (scrollArea.scrollTop > 200) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        const backBtn = document.getElementById('moments-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                momentsPage.classList.remove('active');
            });
        }

        const cameraBtn = document.getElementById('moments-camera-btn');
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                alert("发朋友圈功能即将接入 AI 动态感知引擎！");
            });
        }

        // 5. 渲染朋友圈动态
        const renderMoments = () => {
            const feedList = document.getElementById('moments-feed-list');
            if (!feedList) return;
            feedList.innerHTML = '';
            
            const data = JSON.parse(localStorage.getItem('wuyo_moments_data')) || [];

            // 获取用户头像
            const configStr = localStorage.getItem('wuyo_config');
            const coupleConf = JSON.parse(localStorage.getItem('wuyo_couple_config')) || {};
            let userAv = coupleConf.userAvatar || '';
            if(!userAv && configStr) { 
                const cfg = JSON.parse(configStr); 
                if(cfg.profile && cfg.profile.avatar) userAv = cfg.profile.avatar; 
            }
            
            const avEl = document.getElementById('moments-user-avatar');
            if (avEl && userAv) { 
                avEl.style.backgroundImage = `url(${userAv})`; 
                avEl.innerHTML = ''; 
            }
            
            data.forEach(item => {
                const dateObj = new Date(item.time);
                const timeStr = `${dateObj.getMonth()+1}月${dateObj.getDate()}日 ${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}`;

                let html = `
                    <div class="moment-item">
                        <div class="moment-avatar" style="${item.avatar ? `background-image:url(${item.avatar})` : ''}">${item.avatar ? '' : '<i data-lucide="user"></i>'}</div>
                        <div class="moment-body">
                            <div class="moment-name">${item.authorName}</div>
                            <div class="moment-text">${item.content}</div>
                `;

                let interactionHtml = '';
                if (item.likes.length > 0 || item.comments.length > 0) {
                    interactionHtml += `<div class="moment-comments-area">`;
                    if (item.likes.length > 0) {
                        interactionHtml += `<div class="moment-likes"><i data-lucide="heart"></i> ${item.likes.join(', ')}</div>`;
                    }
                    item.comments.forEach(c => {
                        interactionHtml += `<div class="moment-comment-item"><span class="comment-author">${c.author}:</span> ${c.text}</div>`;
                    });
                    interactionHtml += `</div>`;
                }

                html += `
                            <div class="moment-footer">
                                <span class="moment-time">${timeStr}</span>
                                <button class="moment-action-btn"><i data-lucide="more-horizontal" style="width:14px;height:14px;"></i></button>
                            </div>
                            ${interactionHtml}
                        </div>
                    </div>
                `;
                feedList.innerHTML += html;
            });
            if (window.lucide) lucide.createIcons({ root: feedList });
        };

        const openMomentsPage = () => {
            renderMoments();
            momentsPage.classList.add('active');
        };
    });
})();
