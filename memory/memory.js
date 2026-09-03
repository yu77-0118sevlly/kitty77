(function() {
    const container = document.getElementById('memory-app');
    if (!container) return;

    container.innerHTML = `
        <div class="mem-page root active" id="mem-page-list">
            <header class="mem-header">
                <button class="mem-icon-btn" onclick="window.closeApp('memory')"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-main-title">长期记忆</span>
                <button class="mem-icon-btn" id="mem-btn-add"><i data-lucide="plus"></i></button>
            </header>
            <div class="mem-body" id="mem-list-area"></div>
        </div>

        <div class="mem-page" id="mem-page-editor">
            <header class="mem-header">
                <button class="mem-icon-btn" id="mem-btn-back"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-edit-title">添加记忆</span>
                <button class="mem-text-btn" id="mem-btn-save">保存</button>
            </header>
            <div class="mem-body">
                <textarea class="mem-textarea" id="mem-input" placeholder="输入你想让 AI 永远记住的重要事件或规则..."></textarea>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    let currentRole = null;
    let memories = JSON.parse(localStorage.getItem('wuyo_memories')) || {};
    let editingId = null;

    const formatTime = (ts) => {
        const d = new Date(ts);
        return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
    };

    const renderList = () => {
        const listArea = document.getElementById('mem-list-area');
        if(!currentRole || !memories[currentRole] || memories[currentRole].length === 0) {
            listArea.innerHTML = `<div style="text-align:center; padding:60px 16px; color:#8E8E93; font-size:13px;">暂无记忆内容<br><br>写下你想让 AI 永远记住的事情，<br>它就不会再“失忆”了。</div>`;
            return;
        }
        let html = '';
        memories[currentRole].forEach(mem => {
            html += `
                <div class="mem-item">
                    <div class="mem-item-text">${mem.text.replace(/\n/g, '<br>')}</div>
                    <div class="mem-item-bottom">
                        <span class="mem-item-time">${formatTime(mem.time)}</span>
                        <div class="mem-actions">
                            <span class="mem-action-btn" onclick="window.editMemory('${mem.id}')"><i data-lucide="edit-2" style="width:14px;"></i>编辑</span>
                            <span class="mem-action-btn danger" onclick="window.deleteMemory('${mem.id}')"><i data-lucide="trash-2" style="width:14px;"></i>删除</span>
                        </div>
                    </div>
                </div>
            `;
        });
        listArea.innerHTML = html;
        lucide.createIcons({ root: listArea });
    };

    // 暴露给 Chat 模块的启动接口
    window.openMemory = (roleId, roleName) => {
        currentRole = roleId;
        document.getElementById('mem-main-title').textContent = roleName ? `${roleName} 的记忆` : '长期记忆';
        document.getElementById('mem-page-list').classList.add('active');
        renderList();
    };

    document.getElementById('mem-btn-add').addEventListener('click', () => {
        editingId = null;
        document.getElementById('mem-input').value = '';
        document.getElementById('mem-edit-title').textContent = '添加记忆';
        document.getElementById('mem-page-editor').classList.add('active');
    });

    window.editMemory = (id) => {
        editingId = id;
        const mem = memories[currentRole].find(m => m.id === id);
        if(mem) {
            document.getElementById('mem-input').value = mem.text;
            document.getElementById('mem-edit-title').textContent = '编辑记忆';
            document.getElementById('mem-page-editor').classList.add('active');
        }
    };

    window.deleteMemory = (id) => {
        if(confirm('确定删除这条记忆吗？')) {
            memories[currentRole] = memories[currentRole].filter(m => m.id !== id);
            localStorage.setItem('wuyo_memories', JSON.stringify(memories));
            renderList();
        }
    };

    document.getElementById('mem-btn-save').addEventListener('click', () => {
        const text = document.getElementById('mem-input').value.trim();
        if(!text) return alert("内容不能为空");
        if(!memories[currentRole]) memories[currentRole] = [];
        
        if(editingId) {
            const mem = memories[currentRole].find(m => m.id === editingId);
            if(mem) { mem.text = text; mem.time = Date.now(); }
        } else {
            memories[currentRole].unshift({ id: 'mem_'+Date.now(), text: text, time: Date.now() });
        }
        localStorage.setItem('wuyo_memories', JSON.stringify(memories));
        document.getElementById('mem-page-editor').classList.remove('active');
        renderList();
    });

    document.getElementById('mem-btn-back').addEventListener('click', () => {
        document.getElementById('mem-page-editor').classList.remove('active');
    });

    // 💥 供 Chat 调用的全局接口：将记忆注入给 AI
    window.getMemoryContext = (roleId) => {
        if(!roleId || !memories[roleId] || memories[roleId].length === 0) return '';
        const memText = memories[roleId].map(m => `- ${m.text}`).join('\n');
        return `[SYSTEM: LONG-TERM MEMORY]\n以下是 User 与你之间发生的绝对事实与核心记忆，你必须永远记住并基于此进行交流：\n${memText}`;
    };
})();
