(function() {
    const container = document.getElementById('contacts-app');
    if (!container) return;

    // 1. 初始化 DOM：三层页面架构 (列表 -> 个人主页 -> 编辑页)
    container.innerHTML = `
        <!-- 页面 1：通讯录列表 -->
        <div class="ct-page root active" id="ct-page-list">
            <header class="ct-header">
                <div style="width:32px;"></div>
                <span class="ct-header-title">通讯录</span>
                <button class="ct-icon-btn" id="btn-goto-create"><i data-lucide="user-plus"></i></button>
            </header>
            <div class="ct-body">
                <div class="ct-search-bar"><input type="text" class="ct-search-input" placeholder="🔍 搜索角色"></div>
                <div id="ct-list-render-area"></div>
            </div>
            <!-- 底部导航占位 (由全局统一控制，这里预留空隙) -->
        </div>

        <!-- 页面 2：角色个人主页 -->
        <div class="ct-page" id="ct-page-profile">
            <header class="ct-header" style="background:transparent; border:none;">
                <button class="ct-icon-btn ct-back-btn"><i data-lucide="chevron-left"></i></button>
                <button class="ct-icon-btn" id="btn-goto-edit"><i data-lucide="more-horizontal"></i></button>
            </header>
            <div class="ct-body" id="ct-profile-render-area">
                <!-- 动态渲染主页资料 -->
            </div>
        </div>

        <!-- 页面 3：创建/编辑角色 -->
        <div class="ct-page" id="ct-page-editor">
            <header class="ct-header">
                <button class="ct-icon-btn ct-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="ct-header-title" id="editor-title">创建新角色</span>
                <button class="ct-text-btn" id="btn-save-role">完成</button>
            </header>
            <div class="ct-body">
                <div class="ct-form-group">
                    <div class="ct-form-row">
                        <span class="ct-form-label">头像</span>
                        <div class="ct-avatar-upload" id="role-avatar-preview"><i data-lucide="camera" style="color:#8E8E93;"></i></div>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">昵称</span>
                        <input type="text" class="ct-input" id="role-name" placeholder="例如：霸道总裁">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">备注</span>
                        <input type="text" class="ct-input" id="role-remark" placeholder="你对TA的专属称呼">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">当前关系</span>
                        <select class="ct-select" id="role-relation">
                            <option value="陌生人">陌生人</option>
                            <option value="朋友" selected>普通朋友</option>
                            <option value="暧昧">暧昧</option>
                            <option value="恋人">恋人</option>
                            <option value="家人">家人</option>
                        </select>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">所在地</span>
                        <input type="text" class="ct-input" id="role-city" placeholder="例如：上海 (用于获取天气)">
                    </div>
                </div>
                
                <div style="padding: 0 16px 8px 32px; font-size:12px; color:#8E8E93;">核心人格与设定 (供 AI 读取)</div>
                <div class="ct-form-group">
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">性格与说话方式</span>
                        <textarea class="ct-textarea" id="role-personality" placeholder="例如：高冷、毒舌，但内心柔软，喜欢发短句..."></textarea>
                    </div>
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">背景故事/职业</span>
                        <textarea class="ct-textarea" id="role-bgstory" placeholder="例如：跨国集团的CEO，平时工作很忙..."></textarea>
                    </div>
                </div>
                
                <button class="ct-btn-large danger" id="btn-delete-role" style="display:none; margin: 16px;">删除角色</button>
            </div>
            <input type="file" id="ct-avatar-uploader" accept="image/*" style="display:none;">
        </div>
    `;
    lucide.createIcons({ root: container });

    // 2. 核心数据管理 (全局角色数据库)
    let wuyoRoles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
    let currentEditRoleId = null;
    let currentProfileRoleId = null;

    // 3. 渲染通讯录列表
    const renderContactList = () => {
        const listArea = document.getElementById('ct-list-render-area');
        if (wuyoRoles.length === 0) {
            listArea.innerHTML = `<div style="text-align:center; padding:40px 16px; color:#8E8E93; font-size:14px;">通讯录为空<br>点击右上角添加您的第一个专属 AI 角色</div>`;
            return;
        }
        let html = '';
        wuyoRoles.forEach(role => {
            const avatarStyle = role.avatar ? `background-image: url(${role.avatar});` : '';
            const avatarInner = role.avatar ? '' : `<i data-lucide="user"></i>`;
            const displayName = role.remark ? `${role.remark} <span style="font-size:14px; color:#8E8E93;">(${role.name})</span>` : role.name;
            
            html += `
                <div class="ct-list-item" onclick="window.openRoleProfile('${role.id}')">
                    <div class="ct-list-avatar" style="${avatarStyle}">${avatarInner}</div>
                    <div class="ct-list-name">${displayName}</div>
                </div>
            `;
        });
        listArea.innerHTML = html;
        lucide.createIcons({ root: listArea });
    };

    // 4. 渲染个人主页
    window.openRoleProfile = (roleId) => {
        const role = wuyoRoles.find(r => r.id === roleId);
        if(!role) return;
        currentProfileRoleId = roleId;
        
        const avatarStyle = role.avatar ? `background-image: url(${role.avatar});` : '';
        const displayName = role.remark || role.name;
        const realNameHtml = role.remark ? `<div class="ct-profile-remark">昵称：${role.name}</div>` : '';
        
        const profileArea = document.getElementById('ct-profile-render-area');
        profileArea.innerHTML = `
            <div class="ct-profile-top">
                <div class="ct-profile-avatar" style="${avatarStyle}"></div>
                <div class="ct-profile-info">
                    <div class="ct-profile-name">${displayName} <i data-lucide="${role.gender === '女' ? 'venus' : 'mars'}" style="width:16px; color:#8E8E93;"></i></div>
                    ${realNameHtml}
                    <div class="ct-tag-row">
                        <span class="ct-tag">状态: ${role.relationship || '朋友'}</span>
                        ${role.city ? `<span class="ct-tag">${role.city}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="ct-group">
                <div class="ct-row">
                    <div class="ct-row-label">性格标签</div>
                    <div class="ct-row-value">${role.personality || '暂无设定'}</div>
                </div>
                <div class="ct-row">
                    <div class="ct-row-label">背景设定</div>
                    <div class="ct-row-value">${role.bgStory || '暂无设定'}</div>
                </div>
            </div>
            
            <button class="ct-btn-large primary" onclick="window.chatWithRole('${role.id}')"><i data-lucide="message-square"></i> 发消息</button>
            <button class="ct-btn-large"><i data-lucide="book-open"></i> 专属世界书/记忆 (开发中)</button>
        `;
        lucide.createIcons({ root: profileArea });
        document.getElementById('ct-page-profile').classList.add('active');
    };

    // 为以后调用 Chat App 预留全局接口
    window.chatWithRole = (roleId) => {
        container.style.display = 'none'; // 隐藏通讯录
        document.getElementById('home-screen').style.display = 'none';
        document.getElementById('chat-app').style.display = 'block';
        // 如果 chat 模块已加载，则通知它打开指定角色
        if(window.openChatDetail) window.openChatDetail(roleId);
        else window.openApp('chat'); // Fallback
    };

    // 5. 创建与编辑角色
    const openEditor = (roleId = null) => {
        currentEditRoleId = roleId;
        const titleEl = document.getElementById('editor-title');
        const delBtn = document.getElementById('btn-delete-role');
        const preview = document.getElementById('role-avatar-preview');
        
        if (roleId) {
            const role = wuyoRoles.find(r => r.id === roleId);
            titleEl.textContent = '编辑角色资料';
            delBtn.style.display = 'block';
            if(role.avatar) preview.style.backgroundImage = `url(${role.avatar})`; else preview.style.backgroundImage = '';
            document.getElementById('role-name').value = role.name || '';
            document.getElementById('role-remark').value = role.remark || '';
            document.getElementById('role-relation').value = role.relationship || '朋友';
            document.getElementById('role-city').value = role.city || '';
            document.getElementById('role-personality').value = role.personality || '';
            document.getElementById('role-bgstory').value = role.bgStory || '';
        } else {
            titleEl.textContent = '创建新角色';
            delBtn.style.display = 'none';
            preview.style.backgroundImage = '';
            // 清空表单
            document.querySelectorAll('.ct-input, .ct-textarea').forEach(el => el.value = '');
            document.getElementById('role-relation').value = '朋友';
        }
        document.getElementById('ct-page-editor').classList.add('active');
    };

    document.getElementById('btn-goto-create').addEventListener('click', () => openEditor(null));
    document.getElementById('btn-goto-edit').addEventListener('click', () => openEditor(currentProfileRoleId));

    // 返回按钮逻辑
    document.querySelectorAll('.ct-back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => e.target.closest('.ct-page').classList.remove('active'));
    });

    // 头像上传
    let tempAvatar = '';
    document.getElementById('role-avatar-preview').addEventListener('click', () => document.getElementById('ct-avatar-uploader').click());
    document.getElementById('ct-avatar-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempAvatar = event.target.result;
                document.getElementById('role-avatar-preview').style.backgroundImage = `url(${tempAvatar})`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 保存角色
    document.getElementById('btn-save-role').addEventListener('click', () => {
        const name = document.getElementById('role-name').value.trim();
        if(!name) return alert("角色昵称不能为空哦！");

        const roleData = {
            id: currentEditRoleId || 'char_' + Date.now().toString(36),
            name: name,
            remark: document.getElementById('role-remark').value.trim(),
            relationship: document.getElementById('role-relation').value,
            city: document.getElementById('role-city').value.trim(),
            personality: document.getElementById('role-personality').value.trim(),
            bgStory: document.getElementById('role-bgstory').value.trim(),
            avatar: tempAvatar || (currentEditRoleId ? wuyoRoles.find(r=>r.id===currentEditRoleId).avatar : '')
        };

        if (currentEditRoleId) {
            const idx = wuyoRoles.findIndex(r => r.id === currentEditRoleId);
            wuyoRoles[idx] = roleData;
        } else {
            wuyoRoles.unshift(roleData);
        }

        localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles));
        tempAvatar = ''; // reset
        renderContactList();
        
        // 返回处理
        document.getElementById('ct-page-editor').classList.remove('active');
        if(currentEditRoleId) window.openRoleProfile(currentEditRoleId); // 刷新个人主页
    });

    // 删除角色
    document.getElementById('btn-delete-role').addEventListener('click', () => {
        if(confirm("确定要删除这个角色吗？聊天记录和回忆也将一同清除！")) {
            wuyoRoles = wuyoRoles.filter(r => r.id !== currentEditRoleId);
            localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles));
            
            // 清理全局聊天记录
            const globalChat = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {};
            delete globalChat[currentEditRoleId];
            localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChat));

            renderContactList();
            document.getElementById('ct-page-editor').classList.remove('active');
            document.getElementById('ct-page-profile').classList.remove('active');
        }
    });

    // 初始化渲染
    renderContactList();

    // 关闭 App 逻辑绑定到全局（如果从底座点击返回的话）
    // 桌面上的图标点击已在全局接管
})();
