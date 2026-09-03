(function() {
    const container = document.getElementById('contacts-app');
    if (!container) return;

    // 1. 初始化 DOM：纯中文界面，纯英文底部 Tab
    container.innerHTML = `
        <div class="ct-page root active" id="ct-page-list">
            <header class="ct-header">
                <button class="ct-icon-btn" onclick="window.closeApp('contacts')"><i data-lucide="chevron-left"></i></button>
                <span class="ct-header-title">通讯录</span>
                <button class="ct-icon-btn" id="btn-goto-create"><i data-lucide="user-plus"></i></button>
            </header>
            <div class="ct-body">
                <div class="ct-search-bar">
                    <i data-lucide="search" style="width:16px; height:16px; color:#8E8E93; margin-right:8px;"></i>
                    <input type="text" class="ct-search-input" placeholder="搜索">
                </div>
                <div id="ct-list-render-area"></div>
            </div>
            
            <div class="wechat-bottom-nav">
                <div class="wechat-nav-item" id="nav-btn-chats"><i data-lucide="message-square"></i><span>Chats</span></div>
                <div class="wechat-nav-item active"><i data-lucide="users"></i><span>Contacts</span></div>
                <div class="wechat-nav-item" id="nav-btn-moments-ct"><i data-lucide="compass"></i><span>Moments</span></div>
                <div class="wechat-nav-item" id="nav-btn-me-ct"><i data-lucide="user"></i><span>Me</span></div>
            </div>
        </div>

        <div class="ct-page" id="ct-page-profile">
            <header class="ct-header" style="background:transparent; border:none;">
                <button class="ct-icon-btn ct-back-btn"><i data-lucide="chevron-left"></i></button>
                <button class="ct-icon-btn" id="btn-goto-edit"><i data-lucide="more-horizontal"></i></button>
            </header>
            <div class="ct-body" id="ct-profile-render-area"></div>
        </div>

        <div class="ct-page" id="ct-page-editor">
            <header class="ct-header">
                <button class="ct-icon-btn ct-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="ct-header-title" id="editor-title">编辑角色</span>
                <button class="ct-text-btn" id="btn-save-role">保存</button>
            </header>
            <div class="ct-body">
                <div class="ct-form-group">
                    <div class="ct-form-row">
                        <span class="ct-form-label">头像</span>
                        <div class="ct-avatar-upload" id="role-avatar-preview" style="border-radius:50%;"><i data-lucide="camera" style="color:#8E8E93;"></i></div>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">锁脸</span>
                        <div class="ct-avatar-upload" id="role-face-preview" style="border-radius:8px;"><i data-lucide="scan-face" style="color:#8E8E93;"></i></div>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">昵称</span>
                        <input type="text" class="ct-input" id="role-name" placeholder="填写昵称">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">备注</span>
                        <input type="text" class="ct-input" id="role-remark" placeholder="填写备注">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">当前关系</span>
                        <select class="ct-select" id="role-relation" dir="rtl">
                            <option value="陌生人">陌生人</option>
                            <option value="普通朋友" selected>普通朋友</option>
                            <option value="恋人">恋人</option>
                            <option value="家人">家人</option>
                        </select>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">所在地</span>
                        <input type="text" class="ct-input" id="role-city" placeholder="填写所在城市">
                    </div>
                </div>

                <div style="padding: 0 16px 8px 32px; font-size:12px; color:#8E8E93;">私密档案</div>
                <div class="ct-form-group">
                    <div class="ct-form-row">
                        <span class="ct-form-label">微信号</span>
                        <input type="text" class="ct-input" id="role-wechat" placeholder="填写微信号">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">手机号</span>
                        <input type="text" class="ct-input" id="role-phone" placeholder="填写手机号">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">身份证号</span>
                        <input type="text" class="ct-input" id="role-idcard" placeholder="填写身份证号">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">银行卡信息</span>
                        <input type="text" class="ct-input" id="role-bank" placeholder="填写银行卡信息">
                    </div>
                </div>
                
                <div style="padding: 0 16px 8px 32px; font-size:12px; color:#8E8E93;">核心设定 (供 AI 读取)</div>
                <div class="ct-form-group">
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">性格与说话方式</span>
                        <textarea class="ct-textarea" id="role-personality" placeholder="描述角色的性格特征..."></textarea>
                    </div>
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">背景故事/职业</span>
                        <textarea class="ct-textarea" id="role-bgstory" placeholder="描述角色的背景和经历..."></textarea>
                    </div>
                </div>
                
                <button class="ct-btn-large" id="btn-delete-role" style="display:none; margin: 16px; color:#1C1C1E; font-weight: 700;">删除角色</button>
            </div>
            
            <input type="file" id="ct-avatar-uploader" accept="image/*" style="display:none;">
            <input type="file" id="ct-face-uploader" accept="image/*" style="display:none;">
        </div>
    `;
    lucide.createIcons({ root: container });

    // 2. 底栏跳转
    document.getElementById('nav-btn-chats').addEventListener('click', () => { container.style.display = 'none'; window.openApp('chat'); });
    document.getElementById('nav-btn-moments-ct').addEventListener('click', () => alert('朋友圈功能开发中'));
    document.getElementById('nav-btn-me-ct').addEventListener('click', () => alert('个人中心功能开发中'));

    // 3. 数据管理
    let wuyoRoles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
    let currentEditRoleId = null; let currentProfileRoleId = null;

    const renderContactList = () => {
        const listArea = document.getElementById('ct-list-render-area');
        if (wuyoRoles.length === 0) { listArea.innerHTML = `<div style="text-align:center; padding:60px 16px; color:#8E8E93; font-size:14px;">暂无角色。<br>点击右上角添加您的第一个专属 AI 角色。</div>`; return; }
        let html = '';
        wuyoRoles.forEach(role => {
            const avatarStyle = role.avatar ? `background-image: url(${role.avatar});` : '';
            const avatarInner = role.avatar ? '' : `<i data-lucide="user"></i>`;
            const displayName = role.remark ? `${role.remark} <span style="font-size:14px; color:#8E8E93; margin-left:4px;">(${role.name})</span>` : role.name;
            html += `<div class="ct-list-item" onclick="window.openRoleProfile('${role.id}')"><div class="ct-list-avatar" style="${avatarStyle}">${avatarInner}</div><div class="ct-list-name">${displayName}</div></div>`;
        });
        listArea.innerHTML = html; lucide.createIcons({ root: listArea });
    };

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
                    <div class="ct-profile-name">${displayName}</div>
                    ${realNameHtml}
                    <div class="ct-tag-row">
                        <span class="ct-tag">${role.relationship || '朋友'}</span>
                        ${role.city ? `<span class="ct-tag">${role.city}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="ct-group">
                ${role.wechat ? `<div class="ct-row"><div class="ct-row-label">微信号</div><div class="ct-row-value">${role.wechat}</div></div>` : ''}
                ${role.phone ? `<div class="ct-row"><div class="ct-row-label">手机号</div><div class="ct-row-value">${role.phone}</div></div>` : ''}
                ${role.idcard ? `<div class="ct-row"><div class="ct-row-label">身份证号</div><div class="ct-row-value">${role.idcard}</div></div>` : ''}
                ${role.bank ? `<div class="ct-row"><div class="ct-row-label">银行卡</div><div class="ct-row-value">${role.bank}</div></div>` : ''}
            </div>

            <!-- 💥 朋友圈展示入口 -->
            <div class="ct-group">
                <div class="ct-row" style="align-items: center; justify-content: space-between; cursor: pointer;" onclick="alert('进入角色朋友圈...')">
                    <div style="display:flex; align-items:center; gap: 16px;">
                        <span style="font-size:15px; color:#1C1C1E; font-weight: 500;">朋友圈</span>
                        <div style="display:flex; gap:8px;">
                            ${role.faceImg ? `<div style="width:40px; height:40px; border-radius:8px; background:#E5E5EA; background-image:url(${role.faceImg}); background-size:cover;"></div>` : `<div style="width:40px; height:40px; border-radius:8px; background:#F2F2F7; display:flex; justify-content:center; align-items:center; color:#8E8E93; font-size:12px;">...</div>`}
                        </div>
                    </div>
                    <i data-lucide="chevron-right" style="width:16px; height:16px; color:#8E8E93;"></i>
                </div>
            </div>

            <div class="ct-group">
                <div class="ct-row"><div class="ct-row-label">性格设定</div><div class="ct-row-value">${role.personality || '未设置'}</div></div>
                <div class="ct-row"><div class="ct-row-label">背景故事</div><div class="ct-row-value">${role.bgStory || '未设置'}</div></div>
            </div>
            
            <button class="ct-btn-large" onclick="window.chatWithRole('${role.id}')" style="margin-top:24px;"><i data-lucide="message-square"></i> 发消息</button>
            <button class="ct-btn-large" onclick="window.openMemoryFromProfile('${role.id}', '${role.name}')"><i data-lucide="brain-circuit"></i> AI 长期记忆</button>
        `;
        lucide.createIcons({ root: profileArea });
        document.getElementById('ct-page-profile').classList.add('active');
    };

    window.chatWithRole = (roleId) => { container.style.display = 'none'; document.getElementById('home-screen').style.display = 'none'; window.openApp('chat'); if(window.openChatDetail) window.openChatDetail(roleId); };
    
    window.openMemoryFromProfile = (roleId, roleName) => { 
        container.style.display = 'none'; 
        window.openApp('memory'); 
        setTimeout(() => { if(window.openMemory) window.openMemory(roleId, roleName, 'contacts'); }, 100); 
    };

    const openEditor = (roleId = null) => {
        currentEditRoleId = roleId; const titleEl = document.getElementById('editor-title'); const delBtn = document.getElementById('btn-delete-role'); 
        const preview = document.getElementById('role-avatar-preview'); const facePreview = document.getElementById('role-face-preview');
        
        if (roleId) {
            const role = wuyoRoles.find(r => r.id === roleId); titleEl.textContent = '编辑角色'; delBtn.style.display = 'block';
            if(role.avatar) preview.style.backgroundImage = `url(${role.avatar})`; else preview.style.backgroundImage = '';
            if(role.faceImg) facePreview.style.backgroundImage = `url(${role.faceImg})`; else facePreview.style.backgroundImage = '';
            document.getElementById('role-name').value = role.name || '';
            document.getElementById('role-remark').value = role.remark || '';
            document.getElementById('role-relation').value = role.relationship || '普通朋友';
            document.getElementById('role-city').value = role.city || '';
            document.getElementById('role-wechat').value = role.wechat || '';
            document.getElementById('role-phone').value = role.phone || '';
            document.getElementById('role-idcard').value = role.idcard || '';
            document.getElementById('role-bank').value = role.bank || '';
            document.getElementById('role-personality').value = role.personality || '';
            document.getElementById('role-bgstory').value = role.bgStory || '';
        } else {
            titleEl.textContent = '新建角色'; delBtn.style.display = 'none'; preview.style.backgroundImage = ''; facePreview.style.backgroundImage = '';
            document.querySelectorAll('.ct-input, .ct-textarea').forEach(el => el.value = '');
            document.getElementById('role-relation').value = '普通朋友';
        }
        document.getElementById('ct-page-editor').classList.add('active');
    };

    document.getElementById('btn-goto-create').addEventListener('click', () => openEditor(null));
    document.getElementById('btn-goto-edit').addEventListener('click', () => openEditor(currentProfileRoleId));
    document.querySelectorAll('.ct-back-btn').forEach(btn => { btn.addEventListener('click', (e) => e.target.closest('.ct-page').classList.remove('active')); });

    // 头像与锁脸上传
    let tempAvatar = ''; let tempFace = '';
    document.getElementById('role-avatar-preview').addEventListener('click', () => document.getElementById('ct-avatar-uploader').click());
    document.getElementById('ct-avatar-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { tempAvatar = event.target.result; document.getElementById('role-avatar-preview').style.backgroundImage = `url(${tempAvatar})`; }; reader.readAsDataURL(file); }
    });

    document.getElementById('role-face-preview').addEventListener('click', () => document.getElementById('ct-face-uploader').click());
    document.getElementById('ct-face-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { tempFace = event.target.result; document.getElementById('role-face-preview').style.backgroundImage = `url(${tempFace})`; }; reader.readAsDataURL(file); }
    });

    document.getElementById('btn-save-role').addEventListener('click', () => {
        const name = document.getElementById('role-name').value.trim(); if(!name) return alert("昵称不能为空哦！");

        const roleData = {
            id: currentEditRoleId || 'char_' + Date.now().toString(36),
            name: name, remark: document.getElementById('role-remark').value.trim(),
            relationship: document.getElementById('role-relation').value, city: document.getElementById('role-city').value.trim(),
            wechat: document.getElementById('role-wechat').value.trim(), phone: document.getElementById('role-phone').value.trim(),
            idcard: document.getElementById('role-idcard').value.trim(), bank: document.getElementById('role-bank').value.trim(),
            personality: document.getElementById('role-personality').value.trim(), bgStory: document.getElementById('role-bgstory').value.trim(),
            avatar: tempAvatar || (currentEditRoleId ? wuyoRoles.find(r=>r.id===currentEditRoleId).avatar : ''),
            faceImg: tempFace || (currentEditRoleId ? wuyoRoles.find(r=>r.id===currentEditRoleId).faceImg : '')
        };

        if (currentEditRoleId) { const idx = wuyoRoles.findIndex(r => r.id === currentEditRoleId); wuyoRoles[idx] = roleData; } else { wuyoRoles.unshift(roleData); }

        localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles)); tempAvatar = ''; tempFace = ''; renderContactList();
        document.getElementById('ct-page-editor').classList.remove('active'); if(currentEditRoleId) window.openRoleProfile(currentEditRoleId); 
    });

    document.getElementById('btn-delete-role').addEventListener('click', () => {
        if(confirm("确定要删除这个角色吗？聊天记录和回忆也将一同清除！")) {
            wuyoRoles = wuyoRoles.filter(r => r.id !== currentEditRoleId); localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles));
            const globalChat = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {}; delete globalChat[currentEditRoleId]; localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChat));
            renderContactList(); document.getElementById('ct-page-editor').classList.remove('active'); document.getElementById('ct-page-profile').classList.remove('active');
        }
    });
    renderContactList();
})();
