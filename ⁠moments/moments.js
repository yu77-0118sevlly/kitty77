(function() {
    // 等待主页面 DOM 渲染完成
    window.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('chat-app');
        if (!container) return;

        // 1. 将朋友圈的 DOM 追加到应用容器中
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = window.MomentsViewTemplate;
        container.appendChild(tempDiv.firstElementChild);
        lucide.createIcons({ root: container });

        // 2. 初始化朋友圈数据 (如果没有数据，生成两条极简演示数据)
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
                    time: Date.now() - 3600000, // 1小时前
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
                    time: Date.now() - 86400000, // 1天前
                    likes: ["AI 伙伴"],
                    comments: []
                }
            ];
            localStorage.setItem('wuyo_moments_data', JSON.stringify(momentsData));
        }

        // 3. 拦截底栏的「朋友圈 (Moments)」按钮点击事件
        // 注意：这需要在 chat.js 执行完后绑定，或者我们通过事件委托拦截
        document.body.addEventListener('click', (e) => {
            const momentsBtn = e.target.closest('.wechat-nav-item');
            if (momentsBtn && momentsBtn.textContent.includes('Moments')) {
                // 阻止默认的 alert
                e.preventDefault(); 
                e.stopPropagation();
                openMomentsPage();
            }
        }, true);

        // 4. 核心逻辑绑定
        const momentsPage = document.getElementById('moments-page-main');
        const scrollArea = document.getElementById('moments-scroll-area');
        const header = document.getElementById('moments-header');
        
        // 监听滚动，改变导航栏透明度
        scrollArea.addEventListener('scroll', () => {
            if (scrollArea.scrollTop > 200) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        document.getElementById('moments-back-btn').addEventListener('click', () => {
            momentsPage.classList.remove('active');
        });

        document.getElementById('moments-camera-btn').addEventListener('click', () => {
            alert("发朋友圈功能即将接入 AI 感知引擎！");
        });

        // 5. 渲染列表功能
        const renderMoments = () => {
            const feedList = document.getElementById('moments-feed-list');
            feedList.innerHTML = '';
            
            const data = JSON.parse(localStorage.getItem('wuyo_moments_data')) || [];

            // 同步顶部个人信息
            const configStr = localStorage.getItem('wuyo_config');
            const coupleConf = JSON.parse(localStorage.getItem('wuyo_couple_config')) || {};
            let userAv = coupleConf.userAvatar || '';
            if(!userAv && configStr) { const cfg = JSON.parse(configStr); if(cfg.profile && cfg.profile.avatar) userAv = cfg.profile.avatar; }
            
            const avEl = document.getElementById('moments-user-avatar');
            if (userAv) { avEl.style.backgroundImage = `url(${userAv})`; avEl.innerHTML = ''; }
            
            // 渲染动态
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

                // 互动区 (点赞与评论)
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
            lucide.createIcons({ root: feedList });
        };

        const openMomentsPage = () => {
            renderMoments();
            momentsPage.classList.add('active');
        };
    });
})();
