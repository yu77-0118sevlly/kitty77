(function() {
    const container = document.getElementById('contacts-app');
    if (!container) return;

    // 1. 初始化 DOM：加入返回桌面的按钮，清空多余占位符，增加高级私密字段
    container.innerHTML = `
        <div class="ct-page root active" id="ct-page-list">
            <header class="ct-header">
                <!-- 💥 修复：左上角的返回系统桌面按钮 -->
                <button class="ct-icon-btn" onclick="window.closeApp('contacts')"><i data-lucide="chevron-left"></i></button>
                <span class="ct-header-title">Contacts</span>
                <button class="ct-icon-btn" id="btn-goto-create"><i data-lucide="user-plus"></i></button>
            </header>
            <div class="ct-body">
                <div class="ct-search-bar">
                    <i data-lucide="search" style="width:16px; height:16px; color:#8E8E93; margin-right:8px;"></i>
                    <input type="text" class="ct-search-input" placeholder="Search">
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
                <span class="ct-header-title" id="editor-title">Profile Settings</span>
                <button class="ct-text-btn" id="btn-save-role">Save</button>
            </header>
            <div class="ct-body">
                <div class="ct-form-group">
                    <div class="ct-form-row">
                        <span class="ct-form-label">Avatar</span>
                        <div class="ct-avatar-upload" id="role-avatar-preview"><i data-lucide="camera" style="color:#8E8E93;"></i></div>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">Name</span>
                        <input type="text" class="ct-input" id="role-name" placeholder="Name">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">Remark</span>
                        <input type="text" class="ct-input" id="role-remark" placeholder="Remark">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">Relation</span>
                        <select class="ct-select" id="role-relation">
                            <option value="Stranger">Stranger</option>
                            <option value="Friend" selected>Friend</option>
                            <option value="Lover">Lover</option>
                            <option value="Family">Family</option>
                        </select>
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">City</span>
                        <input type="text" class="ct-input" id="role-city" placeholder="City">
                    </div>
                </div>

                <div style="padding: 0 16px 8px 32px; font-size:12px; color:#8E8E93;">Private Info (私密档案)</div>
                <div class="ct-form-group">
                    <div class="ct-form-row">
                        <span class="ct-form-label">WeChat ID</span>
                        <input type="text" class="ct-input" id="role-wechat" placeholder="WeChat ID">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">Phone</span>
                        <input type="text" class="ct-input" id="role-phone" placeholder="Phone Number">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">ID Card</span>
                        <input type="text" class="ct-input" id="role-idcard" placeholder="ID Card Number">
                    </div>
                    <div class="ct-form-row">
                        <span class="ct-form-label">Bank Info</span>
                        <input type="text" class="ct-input" id="role-bank" placeholder="Bank Account">
                    </div>
                </div>
                
                <div style="padding: 0 16px 8px 32px; font-size:12px; color:#8E8E93;">AI Core Setup (核心设定)</div>
                <div class="ct-form-group">
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">Personality</span>
                        <textarea class="ct-textarea" id="role-personality" placeholder="Personality & Tone..."></textarea>
                    </div>
                    <div class="ct-form-row vertical">
                        <span class="ct-form-label">Background</span>
                        <textarea class="ct-textarea" id="role-bgstory" placeholder="Background Story..."></textarea>
                    </div>
                </div>
                
                <button class="ct-btn-large" id="btn-delete-role" style="display:none; margin: 16px; color:#1C1C1E; font-weight: 700;">Delete Contact</button>
            </div>
            <input type="file" id="ct-avatar-uploader" accept="image/*" style="display:none;">
        </div>
    `;
    lucide.createIcons({ root: container });

    // 2. 底栏跳转
    document.getElementById('nav-btn-chats').addEventListener('click', () => { container.style.display = 'none'; window.openApp('chat'); });
    document.getElementById('nav-btn-moments-ct').addEventListener('click', () => alert('Moments (开发中)'));
    document.getElementById('nav-btn-me-ct').addEventListener('click', () => alert('Me (开发中)'));

    // 3. 数据管理
    let wuyoRoles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
    let currentEditRoleId = null; let currentProfileRoleId = null;

    const renderContactList = () => {
        const listArea = document.getElementById('ct-list-render-area');
        if (wuyoRoles.length === 0) {
            listArea.innerHTML = `<div style="text-align:center; padding:60px 16px; color:#8E8E93; font-size:14px;">No contacts yet.<br>Click the plus icon to add your first AI.</div>`; return;
        }
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
        const realNameHtml = role.remark ? `<div class="ct-profile-remark">Name: ${role.name}</div>` : '';
        
        const profileArea = document.getElementById('ct-profile-render-area');
        profileArea.innerHTML = `
            <div class="ct-profile-top">
                <div class="ct-profile-avatar" style="${avatarStyle}"></div>
                <div class="ct-profile-info">
                    <div class="ct-profile-name">${displayName}</div>
                    ${realNameHtml}
                    <div class="ct-tag-row">
                        <span class="ct-tag">${role.relationship || 'Friend'}</span>
                        ${role.city ? `<span class="ct-tag">${role.city}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="ct-group">
                ${role.wechat ? `<div class="ct-row"><div class="ct-row-label">WeChat ID</div><div class="ct-row-value">${role.wechat}</div></div>` : ''}
                ${role.phone ? `<div class="ct-row"><div class="ct-row-label">Phone</div><div class="ct-row-value">${role.phone}</div></div>` : ''}
                ${role.idcard ? `<div class="ct-row"><div class="ct-row-label">ID Card</div><div class="ct-row-value">${role.idcard}</div></div>` : ''}
                ${role.bank ? `<div class="ct-row"><div class="ct-row-label">Bank Info</div><div class="ct-row-value">${role.bank}</div></div>` : ''}
                <div class="ct-row"><div class="ct-row-label">Personality</div><div class="ct-row-value">${role.personality || 'Not set'}</div></div>
                <div class="ct-row"><div class="ct-row-label">Background</div><div class="ct-row-value">${role.bgStory || 'Not set'}</div></div>
            </div>
            
            <button class="ct-btn-large" onclick="window.chatWithRole('${role.id}')"><i data-lucide="message-square"></i> Send Message</button>
            <button class="ct-btn-large" onclick="window.openMemoryFromProfile('${role.id}', '${role.name}')"><i data-lucide="brain-circuit"></i> AI Memory</button>
        `;
        lucide.createIcons({ root: profileArea });
        document.getElementById('ct-page-profile').classList.add('active');
    };

    window.chatWithRole = (roleId) => { container.style.display = 'none'; document.getElementById('home-screen').style.display = 'none'; window.openApp('chat'); if(window.openChatDetail) window.openChatDetail(roleId); };
    window.openMemoryFromProfile = (roleId, roleName) => { container.style.display = 'none'; window.openApp('memory'); setTimeout(() => { if(window.openMemory) window.openMemory(roleId, roleName); }, 100); };

    const openEditor = (roleId = null) => {
        currentEditRoleId = roleId; const titleEl = document.getElementById('editor-title'); const delBtn = document.getElementById('btn-delete-role'); const preview = document.getElementById('role-avatar-preview');
        
        if (roleId) {
            const role = wuyoRoles.find(r => r.id === roleId); titleEl.textContent = 'Edit Profile'; delBtn.style.display = 'block';
            if(role.avatar) preview.style.backgroundImage = `url(${role.avatar})`; else preview.style.backgroundImage = '';
            document.getElementById('role-name').value = role.name || '';
            document.getElementById('role-remark').value = role.remark || '';
            document.getElementById('role-relation').value = role.relationship || 'Friend';
            document.getElementById('role-city').value = role.city || '';
            document.getElementById('role-wechat').value = role.wechat || '';
            document.getElementById('role-phone').value = role.phone || '';
            document.getElementById('role-idcard').value = role.idcard || '';
            document.getElementById('role-bank').value = role.bank || '';
            document.getElementById('role-personality').value = role.personality || '';
            document.getElementById('role-bgstory').value = role.bgStory || '';
        } else {
            titleEl.textContent = 'New Contact'; delBtn.style.display = 'none'; preview.style.backgroundImage = '';
            document.querySelectorAll('.ct-input, .ct-textarea').forEach(el => el.value = '');
            document.getElementById('role-relation').value = 'Friend';
        }
        document.getElementById('ct-page-editor').classList.add('active');
    };

    document.getElementById('btn-goto-create').addEventListener('click', () => openEditor(null));
    document.getElementById('btn-goto-edit').addEventListener('click', () => openEditor(currentProfileRoleId));
    document.querySelectorAll('.ct-back-btn').forEach(btn => { btn.addEventListener('click', (e) => e.target.closest('.ct-page').classList.remove('active')); });

    let tempAvatar = '';
    document.getElementById('role-avatar-preview').addEventListener('click', () => document.getElementById('ct-avatar-uploader').click());
    document.getElementById('ct-avatar-uploader').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (event) => { tempAvatar = event.target.result; document.getElementById('role-avatar-preview').style.backgroundImage = `url(${tempAvatar})`; }; reader.readAsDataURL(file); }
    });

    document.getElementById('btn-save-role').addEventListener('click', () => {
        const name = document.getElementById('role-name').value.trim(); if(!name) return alert("Name cannot be empty!");

        const roleData = {
            id: currentEditRoleId || 'char_' + Date.now().toString(36),
            name: name, remark: document.getElementById('role-remark').value.trim(),
            relationship: document.getElementById('role-relation').value, city: document.getElementById('role-city').value.trim(),
            wechat: document.getElementById('role-wechat').value.trim(), phone: document.getElementById('role-phone').value.trim(),
            idcard: document.getElementById('role-idcard').value.trim(), bank: document.getElementById('role-bank').value.trim(),
            personality: document.getElementById('role-personality').value.trim(), bgStory: document.getElementById('role-bgstory').value.trim(),
            avatar: tempAvatar || (currentEditRoleId ? wuyoRoles.find(r=>r.id===currentEditRoleId).avatar : '')
        };

        if (currentEditRoleId) { const idx = wuyoRoles.findIndex(r => r.id === currentEditRoleId); wuyoRoles[idx] = roleData; } else { wuyoRoles.unshift(roleData); }

        localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles)); tempAvatar = ''; renderContactList();
        document.getElementById('ct-page-editor').classList.remove('active'); if(currentEditRoleId) window.openRoleProfile(currentEditRoleId); 
    });

    document.getElementById('btn-delete-role').addEventListener('click', () => {
        if(confirm("Delete this contact? All chat history will be lost.")) {
            wuyoRoles = wuyoRoles.filter(r => r.id !== currentEditRoleId); localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles));
            const globalChat = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {}; delete globalChat[currentEditRoleId]; localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChat));
            renderContactList(); document.getElementById('ct-page-editor').classList.remove('active'); document.getElementById('ct-page-profile').classList.remove('active');
        }
    });
    renderContactList();
})();
