(function() {
    const container = document.getElementById('contacts-app');
    if (!container) return;

    // 💥 终极防崩溃：把 HTML 模板写死，确保容器和按钮一定存在，彻底告别白屏！
    const contactsHTML = `
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

    container.innerHTML = contactsHTML;
    if (window.lucide) {
        lucide.createIcons({ root: container });
    }

    // 💥 防护罩：即使某一行报错，也会在屏幕上显示出来，并且不会白屏
    try {
        initContactsLogic();
    } catch (err) {
        console.error("【联系人模块绑定失败】", err);
        container.innerHTML += `<div style="padding:20px; text-align:center; color:red; z-index:99999; position:absolute; top:50px;">安全模式：界面加载成功，但功能绑定发生错误。</div>`;
    }

    function initContactsLogic() {
        // 安全绑定事件的小工具，防止找不到按钮报错
        const safeBind = (id, event, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, fn);
        };

        // 2. 底栏跳转
        safeBind('nav-btn-chats', 'click', () => { container.style.display = 'none'; window.openApp('chat'); });
        safeBind('nav-btn-moments-ct', 'click', () => alert('朋友圈功能开发中'));
        safeBind('nav-btn-me-ct', 'click', () => alert('个人中心功能开发中'));

        // 3. 数据管理
        let wuyoRoles = [];
        try {
            wuyoRoles = JSON.parse(localStorage.getItem('wuyo_roles')) || [];
        } catch(e) {
            wuyoRoles = [];
        }
        
        let currentEditRoleId = null; 
        let currentProfileRoleId = null;

        const renderContactList = () => {
            const listArea = document.getElementById('ct-list-render-area');
            if (!listArea) return;
            if (wuyoRoles.length === 0) { 
                listArea.innerHTML = `<div style="text-align:center; padding:60px 16px; color:#8E8E93; font-size:14px;">暂无角色。<br>点击右上角添加您的第一个专属 AI 角色。</div>`; 
                return; 
            }
            let html = '';
            wuyoRoles.forEach(role => {
                const avatarStyle = role.avatar ? `background-image: url(${role.avatar});` : '';
                const avatarInner = role.avatar ? '' : `<i data-lucide="user"></i>`;
                const displayName = role.remark ? `${role.remark} <span style="font-size:14px; color:#8E8E93; margin-left:4px;">(${role.name})</span>` : role.name;
                html += `<div class="ct-list-item" onclick="window.openRoleProfile('${role.id}')"><div class="ct-list-avatar" style="${avatarStyle}">${avatarInner}</div><div class="ct-list-name">${displayName}</div></div>`;
            });
            listArea.innerHTML = html; 
            if (window.lucide) lucide.createIcons({ root: listArea });
        };

        window.openRoleProfile = (roleId) => {
            const role = wuyoRoles.find(r => r.id === roleId);
            if(!role) return;
            currentProfileRoleId = roleId;
            
            const avatarStyle = role.avatar ? `background-image: url(${role.avatar});` : '';
            const displayName = role.remark || role.name;
            const realNameHtml = role.remark ? `<div class="ct-profile-remark">昵称：${role.name}</div>` : '';
            
            let faceBox = role.faceImg 
                ? `<div style="width:40px; height:40px; border-radius:8px; background-color:#E5E5EA; background-image:url(${role.faceImg}); background-size:cover; background-position:center;"></div>` 
                : `<div style="width:40px; height:40px; border-radius:8px; background-color:#F2F2F7; display:flex; justify-content:center; align-items:center; color:#8E8E93; font-size:12px;">...</div>`;

            const profileArea = document.getElementById('ct-profile-render-area');
            if(!profileArea) return;
            
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

                <div class="ct-group">
                    <div class="ct-row" style="align-items: center; justify-content: space-between; cursor: pointer;" onclick="alert('朋友圈功能开发中...')">
                        <div style="display:flex; align-items:center; gap: 16px;">
                            <span class="ct-row-label">朋友圈</span>
                            <div style="display:flex; gap:8px;">${faceBox}</div>
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
            if (window.lucide) lucide.createIcons({ root: profileArea });
            document.getElementById('ct-page-profile').classList.add('active');
        };

        window.chatWithRole = (roleId) => { 
            container.style.display = 'none'; 
            const home = document.getElementById('home-screen');
            if(home) home.style.display = 'none'; 
            window.openApp('chat'); 
            setTimeout(() => {
                if(window.openChatDetail) window.openChatDetail(roleId); 
            }, 100);
        };
        
        window.openMemoryFromProfile = (roleId, roleName) => { 
            container.style.display = 'none'; 
            window.openApp('memory'); 
            setTimeout(() => { if(window.openMemory) window.openMemory(roleId, roleName, 'contacts'); }, 100); 
        };

        const openEditor = (roleId = null) => {
            currentEditRoleId = roleId; 
            const titleEl = document.getElementById('editor-title'); 
            const delBtn = document.getElementById('btn-delete-role'); 
            const preview = document.getElementById('role-avatar-preview'); 
            const facePreview = document.getElementById('role-face-preview');
            
            if (roleId) {
                const role = wuyoRoles.find(r => r.id === roleId); 
                if (titleEl) titleEl.textContent = '编辑角色'; 
                if (delBtn) delBtn.style.display = 'block';
                if(role.avatar && preview) preview.style.backgroundImage = `url(${role.avatar})`; 
                else if(preview) preview.style.backgroundImage = '';
                
                if(role.faceImg && facePreview) facePreview.style.backgroundImage = `url(${role.faceImg})`; 
                else if(facePreview) facePreview.style.backgroundImage = '';
                
                const setValue = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; };
                setValue('role-name', role.name);
                setValue('role-remark', role.remark);
                setValue('role-relation', role.relationship || '普通朋友');
                setValue('role-city', role.city);
                setValue('role-wechat', role.wechat);
                setValue('role-phone', role.phone);
                setValue('role-idcard', role.idcard);
                setValue('role-bank', role.bank);
                setValue('role-personality', role.personality);
                setValue('role-bgstory', role.bgStory);
            } else {
                if (titleEl) titleEl.textContent = '新建角色'; 
                if (delBtn) delBtn.style.display = 'none'; 
                if (preview) preview.style.backgroundImage = ''; 
                if (facePreview) facePreview.style.backgroundImage = '';
                document.querySelectorAll('.ct-input, .ct-textarea').forEach(el => el.value = '');
                const rel = document.getElementById('role-relation');
                if (rel) rel.value = '普通朋友';
            }
            const editorPage = document.getElementById('ct-page-editor');
            if(editorPage) editorPage.classList.add('active');
        };

        safeBind('btn-goto-create', 'click', () => openEditor(null));
        safeBind('btn-goto-edit', 'click', () => openEditor(currentProfileRoleId));
        
        document.querySelectorAll('.ct-back-btn').forEach(btn => { 
            btn.addEventListener('click', (e) => {
                const page = e.target.closest('.ct-page');
                if (page) page.classList.remove('active');
            }); 
        });

        let tempAvatar = ''; let tempFace = '';
        
        safeBind('role-avatar-preview', 'click', () => {
            const uploader = document.getElementById('ct-avatar-uploader');
            if(uploader) uploader.click();
        });
        
        safeBind('ct-avatar-uploader', 'change', (e) => {
            const file = e.target.files[0]; 
            if (file) { 
                const reader = new FileReader(); 
                reader.onload = (event) => { 
                    tempAvatar = event.target.result; 
                    const preview = document.getElementById('role-avatar-preview');
                    if (preview) preview.style.backgroundImage = `url(${tempAvatar})`; 
                }; 
                reader.readAsDataURL(file); 
            }
        });

        safeBind('role-face-preview', 'click', () => {
            const uploader = document.getElementById('ct-face-uploader');
            if(uploader) uploader.click();
        });
        
        safeBind('ct-face-uploader', 'change', (e) => {
            const file = e.target.files[0]; 
            if (file) { 
                const reader = new FileReader(); 
                reader.onload = (event) => { 
                    tempFace = event.target.result; 
                    const preview = document.getElementById('role-face-preview');
                    if(preview) preview.style.backgroundImage = `url(${tempFace})`; 
                }; 
                reader.readAsDataURL(file); 
            }
        });

        safeBind('btn-save-role', 'click', () => {
            const nameEl = document.getElementById('role-name');
            const name = nameEl ? nameEl.value.trim() : ''; 
            if(!name) return alert("昵称不能为空哦！");

            const getValue = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

            const roleData = {
                id: currentEditRoleId || 'char_' + Date.now().toString(36),
                name: name, 
                remark: getValue('role-remark'),
                relationship: getValue('role-relation') || '普通朋友', 
                city: getValue('role-city'),
                wechat: getValue('role-wechat'), 
                phone: getValue('role-phone'),
                idcard: getValue('role-idcard'), 
                bank: getValue('role-bank'),
                personality: getValue('role-personality'), 
                bgStory: getValue('role-bgstory'),
                avatar: tempAvatar || (currentEditRoleId ? (wuyoRoles.find(r=>r.id===currentEditRoleId)?.avatar || '') : ''),
                faceImg: tempFace || (currentEditRoleId ? (wuyoRoles.find(r=>r.id===currentEditRoleId)?.faceImg || '') : '')
            };

            if (currentEditRoleId) { 
                const idx = wuyoRoles.findIndex(r => r.id === currentEditRoleId); 
                if(idx !== -1) wuyoRoles[idx] = roleData; 
            } else { 
                wuyoRoles.unshift(roleData); 
            }

            localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles)); 
            tempAvatar = ''; tempFace = ''; 
            renderContactList();
            
            const editorPage = document.getElementById('ct-page-editor');
            if(editorPage) editorPage.classList.remove('active'); 
            
            if(currentEditRoleId) window.openRoleProfile(currentEditRoleId); 
        });

        safeBind('btn-delete-role', 'click', () => {
            if(confirm("确定要删除这个角色吗？聊天记录和回忆也将一同清除！")) {
                wuyoRoles = wuyoRoles.filter(r => r.id !== currentEditRoleId); 
                localStorage.setItem('wuyo_roles', JSON.stringify(wuyoRoles));
                
                let globalChat = {};
                try { globalChat = JSON.parse(localStorage.getItem('wuyo_global_chat_data')) || {}; } catch(e){}
                delete globalChat[currentEditRoleId]; 
                localStorage.setItem('wuyo_global_chat_data', JSON.stringify(globalChat));
                
                renderContactList(); 
                const editorPage = document.getElementById('ct-page-editor');
                const profilePage = document.getElementById('ct-page-profile');
                if(editorPage) editorPage.classList.remove('active'); 
                if(profilePage) profilePage.classList.remove('active');
            }
        });
        
        renderContactList();
    }
})();
