(function() {
    const container = document.getElementById('memory-app');
    if (!container) return;

    container.innerHTML = `
        <div class="mem-page root active" id="mem-page-list">
            <header class="mem-header">
                <!-- 💥 修复点：修改了这里的返回 ID，不再写死跳回桌面 -->
                <button class="mem-icon-btn" id="mem-main-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-main-title">AI Memory</span>
                <button class="mem-icon-btn" id="mem-btn-add"><i data-lucide="plus"></i></button>
            </header>
            <div class="mem-body" id="mem-list-area"></div>
        </div>

        <div class="mem-page" id="mem-page-editor">
            <header class="mem-header">
                <button class="mem-icon-btn" id="mem-btn-back"><i data-lucide="chevron-left"></i></button>
                <span class="mem-title" id="mem-edit-title">New Memory</span>
                <button class="mem-text-btn" id="mem-btn-save">Save</button>
            </header>
            <div class="mem-body">
                <textarea class="mem-textarea" id="mem-input" placeholder="Enter important events or rules for AI to remember forever..."></textarea>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    let currentRole = null;
    let memories = JSON.parse(localStorage.getItem('wuyo_memories')) || {};
    let editingId = null;
    let sourceApp = 'chat'; // 💥 记录是从哪个 App 跳过来的，默认是 chat

    const formatTime = (ts) => { const d = new Date(ts); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; };

    const renderList = () => {
        const listArea = document.getElementById('mem-list-area');
        if(!currentRole || !memories[currentRole] || memories[currentRole].length === 0) {
            listArea.innerHTML = `<div style="text-align:center; padding:60px 16px; color:#8E8E93; font-size:14px;">No memory yet.<br><br>Write down important events, and the AI will never forget them.</div>`; return;
        }
        let html = '';
        memories[currentRole].forEach(mem => {
            html += `<div class="mem-item"><div class="mem-item-text">${mem.text.replace(/\n/g, '<br>')}</div><div class="mem-item-bottom"><span class="mem-item-time">${formatTime(mem.time)}</span><div class="mem-actions"><span class="mem-action-btn" onclick="window.editMemory('${mem.id}')"><i data-lucide="edit-2" style="width:14px;"></i>Edit</span><span class="mem-action-btn danger" onclick="window.deleteMemory('${mem.id}')"><i data-lucide="trash-2" style="width:14px;"></i>Delete</span></div></div></div>`;
        });
        listArea.innerHTML = html; lucide.createIcons({ root: listArea });
    };

    // 💥 修复点：接收 source 参数
    window.openMemory = (roleId, roleName, source) => {
        currentRole = roleId;
        sourceApp = source || 'chat'; // 记录从哪里来的
        document.getElementById('mem-main-title').textContent = roleName ? `${roleName}'s Memory` : 'AI Memory';
        document.getElementById('mem-page-list').classList.add('active');
        renderList();
    };

    // 💥 修复点：返回上一个 App，而不是无脑回桌面
    document.getElementById('mem-main-back-btn').addEventListener('click', () => {
        container.style.display = 'none';
        const sourceContainer = document.getElementById(sourceApp + '-app');
        if (sourceContainer) sourceContainer.style.display = 'block';
        else document.getElementById('home-screen').style.display = 'flex';
    });

    document.getElementById('mem-btn-add').addEventListener('click', () => { editingId = null; document.getElementById('mem-input').value = ''; document.getElementById('mem-edit-title').textContent = 'New Memory'; document.getElementById('mem-page-editor').classList.add('active'); });
    window.editMemory = (id) => { editingId = id; const mem = memories[currentRole].find(m => m.id === id); if(mem) { document.getElementById('mem-input').value = mem.text; document.getElementById('mem-edit-title').textContent = 'Edit Memory'; document.getElementById('mem-page-editor').classList.add('active'); } };
    window.deleteMemory = (id) => { if(confirm('Delete this memory?')) { memories[currentRole] = memories[currentRole].filter(m => m.id !== id); localStorage.setItem('wuyo_memories', JSON.stringify(memories)); renderList(); } };

    document.getElementById('mem-btn-save').addEventListener('click', () => {
        const text = document.getElementById('mem-input').value.trim(); if(!text) return alert("Content cannot be empty!");
        if(!memories[currentRole]) memories[currentRole] = [];
        if(editingId) { const mem = memories[currentRole].find(m => m.id === editingId); if(mem) { mem.text = text; mem.time = Date.now(); } } 
        else { memories[currentRole].unshift({ id: 'mem_'+Date.now(), text: text, time: Date.now() }); }
        localStorage.setItem('wuyo_memories', JSON.stringify(memories)); document.getElementById('mem-page-editor').classList.remove('active'); renderList();
    });

    document.getElementById('mem-btn-back').addEventListener('click', () => { document.getElementById('mem-page-editor').classList.remove('active'); });

    window.getMemoryContext = (roleId) => {
        if(!roleId || !memories[roleId] || memories[roleId].length === 0) return '';
        const memText = memories[roleId].map(m => `- ${m.text}`).join('\n');
        return `[SYSTEM: LONG-TERM MEMORY]\n以下是 User 与你之间发生的核心记忆，请你永远记住并基于此进行交流：\n${memText}`;
    };
})();
