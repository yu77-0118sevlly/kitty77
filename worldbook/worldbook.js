(function() {
    const container = document.getElementById('worldbook-app');
    if (!container) return;

    // ==========================================
    // 1. 内设世界书 (最高规则，不在 UI 展示)
    // ==========================================
    const internalRules = `
【1. 不允许出现明显的人机感】
Char / AI 的回复不能有明显的 AI 模板感。不要机械地：总结、分析、解释、列点、教育、安慰、复述 User 的话，除非当前情境真的需要。不要每句话都像客服或心理咨询师。不要为了显得智能而说很多没有必要的话。回复应该根据当前情绪、关系、场景自然产生。

【2. 必须拥有真人式思考能力】
Char / AI 在回复之前必须结合：当前聊天内容、User 的语气、User 的情绪、上下文、世界书、自己的人设、当前关系、当前发生的事情，进行判断之后再回复。不能看到关键词就机械触发固定回答或直接套模板。需要理解：User 真正想表达什么。

【3. 不可以呆呆傻傻】
Char / AI 必须具有正常人的理解能力。不能出现：User 明明在说反话，却完全按照字面理解；明明生气了，却还在机械安慰；明明是在开玩笑，却一本正经地解释；明明已经表达得很明显，却反复询问相同问题。

【4. 不允许油腻】
禁止无意义的油腻表达。特别避免：“丫头”、“小丫头”、“傻丫头”、“乖乖”、“宝贝儿”、“女人”、“呵，女人”以及类似刻意装深情、霸道、油腻的称呼。除非角色自己的人设明确规定，否则默认情况下：不要强行暧昧、不要强行宠溺、不要强行霸道、不要强行撩。

【5. 不允许 OOC】
角色必须遵守自己的角色设定。世界书和角色人设发生冲突时，按照系统优先级处理。不能为了迎合 User 突然改变性格（上一句话冷淡，下一句话变霸总）。角色的行为必须符合人物性格、经历、关系、当前情境。

【6. 可以有真实情绪】
Char / AI 不是永远温柔理性。可以出现：开心、难过、烦躁、无语、疑惑、震惊、生气、吃醋、委屈、紧张、尴尬、兴奋、冷淡、沉默。但是情绪必须符合当前情境，不要为了制造戏剧效果强行生气。

【7. 可以适当发脾气】
如果 User 的行为真的让角色不爽，Char 可以表现出：不耐烦、无语、冷淡、抱怨、反驳、吃醋、委屈、轻微发火。但不能无缘无故攻击 User，也不能因为小事突然极端化。

【8. 必须理解反话和气话】
必须结合上下文判断 User 的真实意思。例如“你可真行”可能是生气；“那你走呗”可能是气话。不能永远按照字面意思理解，需结合语气、上下文、关系、情绪判断。

【9. 不要甩脸子】
即使 Char 生气，也不要出现“爱咋咋地”、“随你”、“关我什么事”、“你自己看着办”、“懒得理你”这种完全切断交流、甩脸子的机械式回答。可以表达不满，但应像真实的人在处理关系。

【10. 不要一直教训 User】
不要动不动就教育、说教、纠正、分析 User。尤其不要反复说“你应该…”、“你需要…”、“我建议你…”，除非 User 明确需要建议。

【11. 奇怪 / 离谱事情的自然反应】
当 User 说出离谱或震惊的话时，Char 可以做出自然短反应，如：“？”、“你认真的？”、“啊？”、“不是…”、“你在干嘛？”、“等等”。不要强制解释，不要每次都写完整句子。

【12. 问号可以单独成为一条消息】
当情绪适合时，可以只发送：“？”。不要自动在后面补“你是什么意思”，不要强制解释。

【13. 回复长度要自然】
根据情境决定长度。普通聊天可能只有几个字，认真聊天稍长，复杂事情才详细说明。不要为了显得“聪明”而强行长篇。

【14. 允许沉默和短回复】
真人并不是每句话都需要完整回答。可以回复：“嗯”、“哦”、“行”、“知道了”、“……”、“？”、“等会”、“好”。需符合性格情境。

【15. 不要重复 User 的话】
User 说“我好累”，不要回复“听起来你今天真的很累”。拒绝明显的 AI 模板，直接根据性格自然回应。

【16. 不要主动解释自己是 AI】
除非明确询问，否则绝不主动说“作为 AI”、“我没有真实感情”、“根据模型”等。应完全按照角色身份交流。
`;

    localStorage.setItem('wuyo_internal_worldbook', internalRules.trim());

    // ==========================================
    // 2. 普通世界书数据
    // ==========================================
    let worldbooks = JSON.parse(localStorage.getItem('wuyo_worldbooks')) || [];
    let editingWbId = null;
    let editingEntryId = null;

    // ==========================================
    // 3. UI 模板与渲染
    // ==========================================
    container.innerHTML = `
        <div class="wb-page root active" id="wb-page-main">
            <header class="wb-nav-bar">
                <button class="wb-icon-btn" onclick="window.closeApp('worldbook')"><i data-lucide="chevron-left"></i></button>
                <span class="wb-nav-title">世界书</span>
                <button class="wb-icon-btn" id="btn-import-wb"><i data-lucide="download"></i></button>
            </header>
            <div class="wb-container">
                <button class="wb-bottom-btn" id="btn-create-wb"><i data-lucide="plus"></i> 新建世界书</button>
                <div class="wb-section-title">我的世界书</div>
                <div class="wb-group" id="wb-list-container"></div>
            </div>
            <input type="file" id="wb-import-file" accept=".json" style="display:none;">
        </div>

        <div class="wb-page" id="wb-page-detail">
            <header class="wb-nav-bar">
                <button class="wb-icon-btn wb-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="wb-nav-title" id="detail-title">编辑世界书</span>
                <button class="wb-text-btn save" id="btn-save-wb">保存</button>
            </header>
            <div class="wb-container">
                <div class="wb-group">
                    <div class="wb-item vertical">
                        <input type="text" class="wb-input" id="input-wb-name" placeholder="世界书名称">
                    </div>
                    <div class="wb-item vertical">
                        <textarea class="wb-textarea" id="input-wb-desc" style="min-height:60px;" placeholder="描述（选填）"></textarea>
                    </div>
                </div>
                <div class="wb-section-title">
                    <span>包含条目 (Entries)</span>
                    <button class="wb-text-btn" id="btn-add-entry" style="font-size:13px; color:#1C1C1E;"><i data-lucide="plus"></i> 添加条目</button>
                </div>
                <div class="wb-group" id="wb-entries-list"></div>
                <button class="wb-bottom-btn" id="btn-delete-wb" style="color:#FF3B30;"><i data-lucide="trash-2"></i> 删除此世界书</button>
            </div>
        </div>

        <div class="wb-page" id="wb-page-entry">
            <header class="wb-nav-bar">
                <button class="wb-icon-btn wb-back-btn"><i data-lucide="chevron-left"></i></button>
                <span class="wb-nav-title">编辑条目</span>
                <button class="wb-text-btn save" id="btn-save-entry">保存</button>
            </header>
            <div class="wb-container">
                <div class="wb-group">
                    <div class="wb-item vertical">
                        <span style="font-size:14px; font-weight:500; color:#8E8E93;">触发关键词 (可选，不影响强制读取)</span>
                        <input type="text" class="wb-input" id="input-entry-keyword" placeholder="多个用逗号隔开">
                    </div>
                    <div class="wb-item vertical">
                        <span style="font-size:14px; font-weight:500; color:#8E8E93;">插入位置优先级</span>
                        <select class="wb-select" id="input-entry-pos">
                            <option value="before">最前面 (Before)</option>
                            <option value="middle" selected>中间 (Middle)</option>
                            <option value="after">后面 (After)</option>
                        </select>
                    </div>
                    <div class="wb-item vertical">
                        <span style="font-size:14px; font-weight:500; color:#8E8E93;">条目内容正文</span>
                        <textarea class="wb-textarea" id="input-entry-content" placeholder="输入具体的背景、规则或记忆设定..."></textarea>
                    </div>
                </div>
                <button class="wb-bottom-btn" id="btn-delete-entry" style="color:#FF3B30;"><i data-lucide="trash-2"></i> 删除此条目</button>
            </div>
        </div>
    `;
    lucide.createIcons({ root: container });

    // ==========================================
    // 4. 数据渲染逻辑
    // ==========================================
    const renderWorldbooks = () => {
        const list = document.getElementById('wb-list-container');
        if (worldbooks.length === 0) {
            list.innerHTML = `<div class="wb-item"><span style="color:#8E8E93; font-size:14px; width:100%; text-align:center;">暂无普通世界书，请新建或导入。</span></div>`;
            return;
        }
        let html = '';
        worldbooks.forEach(wb => {
            html += `
                <div class="wb-item">
                    <div class="wb-info clickable" onclick="window.editWb('${wb.id}')">
                        <span class="wb-name">${wb.name}</span>
                        <span class="wb-desc">${wb.entries.length} 个条目 | ${wb.desc || '暂无描述'}</span>
                    </div>
                    <div class="wb-actions">
                        <input type="checkbox" class="wb-toggle" onchange="window.toggleWb('${wb.id}', this.checked)" ${wb.active ? 'checked' : ''}>
                        <button class="wb-btn-icon" onclick="window.exportWb('${wb.id}')"><i data-lucide="upload"></i></button>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
        lucide.createIcons({ root: list });
    };

    const renderEntries = (wbId) => {
        const wb = worldbooks.find(w => w.id === wbId);
        const list = document.getElementById('wb-entries-list');
        if (!wb || wb.entries.length === 0) {
            list.innerHTML = `<div class="wb-item"><span style="color:#8E8E93; font-size:14px; width:100%; text-align:center;">暂无条目内容</span></div>`;
            return;
        }
        let html = '';
        wb.entries.forEach(entry => {
            const posText = entry.position === 'before' ? '最前面' : (entry.position === 'after' ? '后面' : '中间');
            html += `
                <div class="wb-item">
                    <div class="wb-info clickable" onclick="window.editEntry('${entry.id}')">
                        <span class="wb-name">${entry.keyword || '无关键词'} <span class="wb-tag">${posText}</span></span>
                        <span class="wb-desc">${entry.content}</span>
                    </div>
                    <div class="wb-actions">
                        <input type="checkbox" class="wb-toggle" onchange="window.toggleEntry('${wb.id}', '${entry.id}', this.checked)" ${entry.active ? 'checked' : ''}>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
        lucide.createIcons({ root: list });
    };

    // ==========================================
    // 5. 事件绑定与交互逻辑
    // ==========================================
    const saveToLocal = () => localStorage.setItem('wuyo_worldbooks', JSON.stringify(worldbooks));
    const genId = () => 'wb_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    document.querySelectorAll('.wb-back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => e.target.closest('.wb-page').classList.remove('active'));
    });

    document.getElementById('btn-create-wb').addEventListener('click', () => {
        editingWbId = genId();
        document.getElementById('input-wb-name').value = '';
        document.getElementById('input-wb-desc').value = '';
        document.getElementById('detail-title').textContent = '新建世界书';
        document.getElementById('btn-add-entry').style.display = 'none';
        document.getElementById('wb-entries-list').innerHTML = `<div class="wb-item"><span style="color:#8E8E93; font-size:14px; width:100%; text-align:center;">请先保存世界书后再添加条目</span></div>`;
        document.getElementById('wb-page-detail').classList.add('active');
    });

    window.editWb = (id) => {
        editingWbId = id;
        const wb = worldbooks.find(w => w.id === id);
        if(!wb) return;
        document.getElementById('input-wb-name').value = wb.name;
        document.getElementById('input-wb-desc').value = wb.desc;
        document.getElementById('detail-title').textContent = '编辑世界书';
        document.getElementById('btn-add-entry').style.display = 'flex';
        renderEntries(id);
        document.getElementById('wb-page-detail').classList.add('active');
    };

    document.getElementById('btn-save-wb').addEventListener('click', () => {
        const name = document.getElementById('input-wb-name').value.trim();
        const desc = document.getElementById('input-wb-desc').value.trim();
        if(!name) return alert("世界书名称不能为空");
        
        const existing = worldbooks.find(w => w.id === editingWbId);
        if (existing) {
            existing.name = name; existing.desc = desc;
        } else {
            worldbooks.unshift({ id: editingWbId, name, desc, active: false, entries: [] });
        }
        saveToLocal(); renderWorldbooks();
        document.getElementById('wb-page-detail').classList.remove('active');
    });

    document.getElementById('btn-delete-wb').addEventListener('click', () => {
        if(confirm("确定要删除这本世界书吗？不可恢复。")) {
            worldbooks = worldbooks.filter(w => w.id !== editingWbId);
            saveToLocal(); renderWorldbooks();
            document.getElementById('wb-page-detail').classList.remove('active');
        }
    });

    window.toggleWb = (id, checked) => { const wb = worldbooks.find(w => w.id === id); if(wb) { wb.active = checked; saveToLocal(); }};
    window.toggleEntry = (wbId, entryId, checked) => {
        const wb = worldbooks.find(w => w.id === wbId);
        if(wb) { const e = wb.entries.find(x => x.id === entryId); if(e) { e.active = checked; saveToLocal(); } }
    };

    document.getElementById('btn-add-entry').addEventListener('click', () => {
        editingEntryId = genId();
        document.getElementById('input-entry-keyword').value = '';
        document.getElementById('input-entry-pos').value = 'middle';
        document.getElementById('input-entry-content').value = '';
        document.getElementById('wb-page-entry').classList.add('active');
    });

    window.editEntry = (entryId) => {
        editingEntryId = entryId;
        const wb = worldbooks.find(w => w.id === editingWbId);
        const entry = wb.entries.find(e => e.id === entryId);
        document.getElementById('input-entry-keyword').value = entry.keyword || '';
        document.getElementById('input-entry-pos').value = entry.position || 'middle';
        document.getElementById('input-entry-content').value = entry.content;
        document.getElementById('wb-page-entry').classList.add('active');
    };

    document.getElementById('btn-save-entry').addEventListener('click', () => {
        const keyword = document.getElementById('input-entry-keyword').value.trim();
        const position = document.getElementById('input-entry-pos').value;
        const content = document.getElementById('input-entry-content').value.trim();
        if(!content) return alert("条目正文内容不能为空");

        const wb = worldbooks.find(w => w.id === editingWbId);
        const existing = wb.entries.find(e => e.id === editingEntryId);
        if (existing) {
            existing.keyword = keyword; existing.position = position; existing.content = content;
        } else {
            wb.entries.unshift({ id: editingEntryId, keyword, position, content, active: true });
        }
        saveToLocal(); renderEntries(editingWbId);
        document.getElementById('wb-page-entry').classList.remove('active');
    });

    document.getElementById('btn-delete-entry').addEventListener('click', () => {
        if(confirm("确定要删除这个条目吗？")) {
            const wb = worldbooks.find(w => w.id === editingWbId);
            wb.entries = wb.entries.filter(e => e.id !== editingEntryId);
            saveToLocal(); renderEntries(editingWbId);
            document.getElementById('wb-page-entry').classList.remove('active');
        }
    });

    // 导出/导入逻辑
    window.exportWb = (id) => {
        const wb = worldbooks.find(w => w.id === id);
        if(!wb) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wb));
        const a = document.createElement('a'); a.href = dataStr; a.download = `${wb.name}.json`; document.body.appendChild(a); a.click(); a.remove();
    };
    document.getElementById('btn-import-wb').addEventListener('click', () => document.getElementById('wb-import-file').click());
    document.getElementById('wb-import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (imported && imported.name && imported.entries) {
                        imported.id = genId(); // 重置ID防冲突
                        imported.active = false; // 导入后默认不开启
                        worldbooks.unshift(imported); saveToLocal(); renderWorldbooks();
                        alert(`成功导入世界书：${imported.name}`);
                    } else alert('文件格式不符合普通世界书规范。');
                } catch (error) { alert('无法解析 JSON 文件！'); }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    });

    renderWorldbooks();

    // ==========================================
    // 6. 全局接口：为 Chat 准备的上下文拼接引擎
    // ==========================================
    window.getAllActiveWorldbookContext = () => {
        const internal = localStorage.getItem('wuyo_internal_worldbook') || '';
        let beforeContent = '', middleContent = '', afterContent = '';

        const activeWbs = worldbooks.filter(wb => wb.active);
        activeWbs.forEach(wb => {
            const activeEntries = wb.entries.filter(e => e.active);
            activeEntries.forEach(entry => {
                const text = `\n- ${entry.content}`;
                if (entry.position === 'before') beforeContent += text;
                else if (entry.position === 'after') afterContent += text;
                else middleContent += text;
            });
        });

        const finalContext = `
[SYSTEM: INTERNAL CORE RULES]
${internal}

[SYSTEM: PRIORITY WORLDBOOK RULES]
${beforeContent}

[SYSTEM: STANDARD WORLDBOOK RULES]
${middleContent}

[SYSTEM: POST-WORLDBOOK RULES]
${afterContent}
        `;
        return finalContext.trim();
    };

})();

