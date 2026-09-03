window.ChatViewTemplate = `
    <!-- 聊天列表页 -->
    <div class="chat-page root active" id="chat-page-list">
        <header class="chat-header">
            <div style="width:32px;"></div>
            <span class="chat-header-title">微信</span>
            <button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
        </header>
        <div class="chat-search-bar">
            <i data-lucide="search"></i>
            <input type="text" class="chat-search-input" placeholder="搜索">
        </div>
        <div class="chat-list-container" id="chat-list-render-area"></div>
        <div class="wechat-bottom-nav">
            <div class="wechat-nav-item active"><i data-lucide="message-square"></i><span>Chats</span></div>
            <div class="wechat-nav-item" id="nav-btn-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
            <div class="wechat-nav-item" onclick="alert('朋友圈功能开发中')"><i data-lucide="compass"></i><span>Moments</span></div>
            <div class="wechat-nav-item" onclick="alert('个人中心功能开发中')"><i data-lucide="user"></i><span>Me</span></div>
        </div>
    </div>

    <!-- 聊天详情页 -->
    <div class="chat-page" id="chat-page-detail">
        <header class="chat-header">
            <div class="chat-header-left" id="chat-back-to-list">
                <button class="chat-icon-btn" style="padding:0;"><i data-lucide="chevron-left"></i></button>
                <div class="chat-header-avatar" id="header-ai-avatar"></div>
                <div class="chat-title-area">
                    <span class="chat-title" id="chat-char-name">AI</span>
                    <span class="chat-status" id="chat-status-text">在线</span>
                </div>
            </div>
            <button class="chat-icon-btn" id="chat-btn-settings"><i data-lucide="more-horizontal"></i></button>
        </header>
        
        <div class="chat-messages" id="chat-message-list"></div>

        <div class="chat-quote-bar" id="chat-quote-bar" style="display:none;">
            <div class="quote-bar-content"><span id="quote-bar-text"></span></div>
            <button class="quote-close-btn" id="quote-close-btn"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
        </div>

        <div class="chat-input-area" id="chat-input-area">
            <button class="chat-ext-btn"><i data-lucide="mic"></i></button>
            <textarea class="chat-input" id="chat-textarea" placeholder="发消息..." rows="1"></textarea>
            <button class="chat-ext-btn" id="chat-ext-ai" title="强制 AI 回复"><i data-lucide="bot"></i></button>
            <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
            <button class="chat-send-btn" id="chat-send-btn">发送</button>
        </div>
        
        <!-- 精致防溢出小浮窗菜单 (无图标两排网格) -->
        <div class="chat-context-menu" id="chat-context-menu">
            <div class="ctx-item" id="ctx-btn-quote">引用</div>
            <div class="ctx-item" id="ctx-btn-copy">复制</div>
            <div class="ctx-item" id="ctx-btn-recall">撤回</div>
            <div class="ctx-item" id="ctx-btn-delete">删除</div>
            <div class="ctx-item" id="ctx-btn-purge" style="color:#FF3B30;">彻底删除</div>
            <div class="ctx-item" id="ctx-btn-multiselect">多选</div>
        </div>

        <!-- 多选底部操作栏 -->
        <div class="chat-multiselect-bar" id="chat-multiselect-bar" style="display:none;">
            <button class="ms-action-btn" id="ms-btn-delete-all">删除所选</button>
            <button class="ms-action-btn cancel" id="ms-btn-cancel">取消</button>
        </div>
    </div>

    <!-- 独立美化与设置页面 -->
    <div class="chat-page" id="chat-page-settings">
        <header class="chat-header">
            <button class="chat-icon-btn" id="chat-settings-back"><i data-lucide="chevron-left"></i></button>
            <span class="chat-header-title">聊天与气泡美化</span>
            <button id="settings-save-btn" style="font-size:16px; font-weight:600; color:#1C1C1E; background:none; border:none; cursor:pointer; padding:4px;">保存</button>
        </header>
        <div style="flex:1; overflow-y:auto; padding-top:16px;">
            <div class="settings-list-group">
                <div class="settings-list-item" id="settings-btn-profile"><span>角色主页</span><i data-lucide="chevron-right"></i></div>
                <div class="settings-list-item" id="settings-btn-memory"><span>AI 长期记忆</span><i data-lucide="chevron-right"></i></div>
            </div>

            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">聊天常规设置 (置顶与免打扰)</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>置顶聊天</span><label class="ios-switch"><input type="checkbox" id="chat-pinned-toggle"><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>消息免打扰</span><label class="ios-switch"><input type="checkbox" id="chat-mute-toggle"><span class="ios-slider"></span></label></div>
            </div>

            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">异地模式与时间感知 (同步当地天气)</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>我的时区</span>
                    <select id="user-timezone-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="Asia/Shanghai">北京时间 (中国)</option>
                        <option value="Asia/Tokyo">东京时间 (日本)</option>
                        <option value="America/New_York">纽约时间 (美东)</option>
                        <option value="Europe/London">伦敦时间 (英国)</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>TA 的时区</span>
                    <select id="ai-timezone-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="Asia/Shanghai">北京时间 (中国)</option>
                        <option value="Asia/Tokyo">东京时间 (日本)</option>
                        <option value="America/New_York">纽约时间 (美东)</option>
                        <option value="Europe/London">伦敦时间 (英国)</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>TA 的语言</span>
                    <select id="ai-language-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="default">默认 (中文)</option>
                        <option value="English">英语</option>
                        <option value="Japanese">日语</option>
                        <option value="Korean">韩语</option>
                        <option value="French">法语</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>自动翻译</span><label class="ios-switch"><input type="checkbox" id="auto-translate-toggle"><span class="ios-slider"></span></label></div>
            </div>

            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">顶部双头像与浪漫签名自定义</div>
            <div class="settings-list-group">
                <div class="settings-list-item" id="set-user-avatar-btn"><span>我的头像框</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-user-av"></div></div>
                <div class="settings-list-item" id="set-ai-avatar-btn"><span>AI 头像框</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-ai-av"></div></div>
                <div style="padding: 16px; display:flex; flex-direction:column; gap:8px;">
                    <span style="font-size:14px; color:#8E8E93;">浪漫标语</span>
                    <input type="text" id="couple-sign-input" style="padding:10px 14px; border-radius:10px; border:0.5px solid #E5E5EA; background:#F4F4F7; font-size:15px; outline:none;" placeholder="我会爱你很久很久">
                </div>
            </div>

            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">气泡样式、背景与头像显隐</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>显示用户头像</span><label class="ios-switch"><input type="checkbox" id="show-user-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>显示 AI 头像</span><label class="ios-switch"><input type="checkbox" id="show-ai-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>气泡颜色</span><input type="color" id="bubble-color-picker" value="#FFFFFF" style="width:36px; height:24px; border:none; background:none; cursor:pointer;"></div>
                <div class="settings-list-item"><span>气泡大小</span>
                    <select id="bubble-fontsize-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="13px">小 (13px)</option>
                        <option value="14px" selected>标准 (14px)</option>
                        <option value="16px">大 (16px)</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>气泡圆角</span>
                    <select id="bubble-radius-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="8px">锐利 (8px)</option>
                        <option value="14px" selected>适中 (14px)</option>
                        <option value="22px">圆润 (22px)</option>
                    </select>
                </div>
                <div class="settings-list-item" id="set-bg-img-btn"><span>聊天背景图</span><span style="font-size:14px; color:#8E8E93;" id="bg-img-status">点击上传</span></div>
                <div class="settings-list-item" id="import-theme-preset"><span>导入美化预设代码</span><i data-lucide="chevron-right"></i></div>
            </div>
            <div class="settings-list-group"><div class="settings-list-item danger" id="settings-btn-clear">清空聊天记录</div></div>
        </div>
        <input type="file" id="couple-avatar-uploader" accept="image/*" style="display:none;">
        <input type="file" id="chat-bg-uploader" accept="image/*" style="display:none;">
`;
