(function() {
    window.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('chat-app');
        if (!container) return;

        // 1. 确保朋友圈的 DOM 视图已经注入
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

        // 3. 💥 精准直接绑定：点击底栏的 Moments 按钮，直通朋友圈页面！
        // 延时 100ms 确保底栏的 HTML 已经被 chat.js 渲染出来
        setTimeout(() => {
            const momentsNav = document.getElementById('nav-btn-moments');
            if (momentsNav) {
                momentsNav.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openMomentsPage();
                });
            } else {
                // 兼容兜底：如果 ID 没找到，遍历所有导航项寻找 Moments 文字
                document.querySelectorAll('.wechat-nav-item').forEach(item => {
                    if (item.textContent.includes('Moments') || item.textContent.includes('朋友圈')) {
                        // 克隆节点以彻底清除原有的 onclick 弹窗事件
                        const newItem = item.cloneNode(true);
                        item.parentNode.replaceChild(newItem, item);
                        newItem.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openMomentsPage();
                        });
                    }
                });
            }
        }, 300);

        // 4. 界面交互事件绑定
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

        // 5. 渲染朋友圈列表
        const renderMoments = () => {
            const feedList = document.getElementById('moments-feed-list');
            if (!feedList) return;
            feedList.innerHTML = '';
            
            const data = JSON.parse(localStorage.getItem('wuyo_moments_data')) || [];

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
