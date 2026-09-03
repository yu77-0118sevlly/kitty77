window.ChatViewTemplate = `
    <!-- 1. 聊天列表页 -->
    <div class="chat-page root active" id="chat-page-list">
        <header class="chat-header">
            <div style="width:32px;"></div><span class="chat-header-title">微信</span><button class="chat-icon-btn"><i data-lucide="plus-circle"></i></button>
        </header>
        <div class="chat-search-bar"><i data-lucide="search"></i><input type="text" class="chat-search-input" placeholder="搜索"></div>
        <div class="chat-list-container" id="chat-list-render-area"></div>
        <div class="wechat-bottom-nav">
            <div class="wechat-nav-item active"><i data-lucide="message-square"></i><span>Chats</span></div>
            <div class="wechat-nav-item" id="nav-btn-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
            <div class="wechat-nav-item" onclick="alert('功能开发中')"><i data-lucide="compass"></i><span>Moments</span></div>
            <div class="wechat-nav-item" onclick="alert('功能开发中')"><i data-lucide="user"></i><span>Me</span></div>
        </div>
    </div>

    <!-- 2. 聊天详情页 -->
    <div class="chat-page" id="chat-page-detail">
        <header class="chat-header">
            <div class="chat-header-left" id="chat-back-to-list">
                <button class="chat-icon-btn" style="padding:0;"><i data-lucide="chevron-left"></i></button>
                <div class="chat-header-avatar" id="header-ai-avatar"></div>
                <div class="chat-title-area"><span class="chat-title" id="chat-char-name">AI</span><span class="chat-status" id="chat-status-text">在线</span></div>
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
            <button class="chat-ext-btn" id="chat-ext-ai" title="强制回复"><i data-lucide="bot"></i></button>
            <button class="chat-ext-btn" id="chat-ext-plus"><i data-lucide="plus"></i></button>
            <button class="chat-send-btn" id="chat-send-btn">发送</button>
        </div>
        
        <!-- 双击浮窗 -->
        <div class="chat-context-menu" id="chat-context-menu">
            <div class="ctx-item" id="ctx-btn-quote">引用</div><div class="ctx-item" id="ctx-btn-copy">复制</div><div class="ctx-item" id="ctx-btn-recall">撤回</div>
            <div class="ctx-item" id="ctx-btn-delete">删除</div><div class="ctx-item" id="ctx-btn-purge" style="color:#FF3B30;">彻底删除</div><div class="ctx-item" id="ctx-btn-multiselect">多选</div>
        </div>
        
        <!-- 多选底栏 -->
        <div class="chat-multiselect-bar" id="chat-multiselect-bar" style="display:none;">
            <button class="ms-action-btn" id="ms-btn-delete-all">删除所选</button>
            <button class="ms-action-btn cancel" id="ms-btn-cancel">取消</button>
        </div>
    </div>

    <!-- 3. 主设置页 -->
    <div class="chat-page" id="chat-page-settings" style="z-index: 20;">
        <header class="chat-header">
            <button class="chat-icon-btn" id="chat-settings-back"><i data-lucide="chevron-left"></i></button>
            <span class="chat-header-title">聊天设置</span>
            <button id="settings-save-btn" style="font-size:16px; font-weight:600; color:#1C1C1E; background:none; border:none; cursor:pointer; padding:4px;">保存</button>
        </header>
        <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
            <div class="settings-list-group">
                <div class="settings-list-item" id="settings-btn-profile"><span>角色主页</span><i data-lucide="chevron-right"></i></div>
                <div class="settings-list-item" id="settings-btn-memory"><span>AI 长期记忆</span><i data-lucide="chevron-right"></i></div>
                <div class="settings-list-item" id="settings-btn-advanced"><span>异地模式与翻译</span><i data-lucide="chevron-right"></i></div>
                <div class="settings-list-item" id="settings-btn-behavior"><span>角色行为与进阶设定</span><i data-lucide="chevron-right"></i></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">常规设置</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>置顶聊天</span><label class="ios-switch"><input type="checkbox" id="chat-pinned-toggle"><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>消息免打扰</span><label class="ios-switch"><input type="checkbox" id="chat-mute-toggle"><span class="ios-slider"></span></label></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">双头像与签名</div>
            <div class="settings-list-group">
                <div class="settings-list-item" id="set-user-avatar-btn"><span>我的头像</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-user-av"></div></div>
                <div class="settings-list-item" id="set-ai-avatar-btn"><span>AI 头像</span><div style="width:32px; height:32px; border-radius:8px; background:#E5E5EA; background-size:cover; background-position:center;" id="preview-ai-av"></div></div>
                <div style="padding: 16px; display:flex; flex-direction:column; gap:8px;"><span style="font-size:14px; color:#8E8E93;">浪漫标语</span><input type="text" id="couple-sign-input" style="padding:10px 14px; border-radius:10px; border:0.5px solid #E5E5EA; background:#F4F4F7; font-size:15px; outline:none;" placeholder="我会爱你很久很久"></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">气泡样式与背景</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>显示用户头像</span><label class="ios-switch"><input type="checkbox" id="show-user-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>显示 AI 头像</span><label class="ios-switch"><input type="checkbox" id="show-ai-avatar-toggle" checked><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>气泡颜色</span><input type="color" id="bubble-color-picker" value="#FFFFFF" style="width:36px; height:24px; border:none; background:none; cursor:pointer;"></div>
                <div class="settings-list-item"><span>气泡大小</span><select id="bubble-fontsize-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;"><option value="13px">小 (13px)</option><option value="14px" selected>标准 (14px)</option><option value="16px">大 (16px)</option></select></div>
                <div class="settings-list-item"><span>气泡圆角</span><select id="bubble-radius-select" style="border:none; background:transparent; font-size:15px; color:#8E8E93; outline:none; text-align:right;"><option value="8px">锐利 (8px)</option><option value="14px" selected>适中 (14px)</option><option value="22px">圆润 (22px)</option></select></div>
                <div class="settings-list-item" id="set-bg-img-btn"><span>聊天背景图</span><span style="font-size:14px; color:#8E8E93;" id="bg-img-status">点击上传</span></div>
                <div class="settings-list-item" id="import-theme-preset"><span>导入预设代码</span><i data-lucide="chevron-right"></i></div>
            </div>
            <div class="settings-list-group"><div class="settings-list-item danger" id="settings-btn-clear">清空聊天记录</div></div>
        </div>
    </div>

    <!-- 4. 异地模式与翻译页 (海量地区与方言选择) -->
    <div class="chat-page" id="chat-page-advanced-settings" style="z-index: 30;">
        <header class="chat-header"><button class="chat-icon-btn" id="advanced-settings-back"><i data-lucide="chevron-left"></i></button><span class="chat-header-title">异地模式与翻译</span><div style="width:32px;"></div></header>
        <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">异地模式 (同步当地时间与天气)</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>我的时区</span>
                    <select id="user-timezone-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="Asia/Shanghai">北京时间 (中国大陆)</option>
                        <option value="Asia/Hong_Kong">香港时间 (中国香港)</option>
                        <option value="Asia/Taipei">台北时间 (中国台湾)</option>
                        <option value="Asia/Tokyo">东京时间 (日本)</option>
                        <option value="Asia/Seoul">首尔时间 (韩国)</option>
                        <option value="Asia/Singapore">新加坡时间</option>
                        <option value="Asia/Bangkok">曼谷时间 (泰国)</option>
                        <option value="Asia/Dubai">迪拜时间 (阿联酋)</option>
                        <option value="Europe/London">伦敦时间 (英国)</option>
                        <option value="Europe/Paris">巴黎时间 (法国)</option>
                        <option value="Europe/Berlin">柏林时间 (德国)</option>
                        <option value="Europe/Moscow">莫斯科时间 (俄罗斯)</option>
                        <option value="America/New_York">纽约时间 (美东)</option>
                        <option value="America/Chicago">芝加哥时间 (美中)</option>
                        <option value="America/Los_Angeles">洛杉矶/旧金山 (美西)</option>
                        <option value="America/Toronto">多伦多时间 (加拿大)</option>
                        <option value="America/Vancouver">温哥华时间 (加拿大)</option>
                        <option value="Australia/Sydney">悉尼时间 (澳洲东部)</option>
                        <option value="Australia/Melbourne">墨尔本时间 (澳洲东部)</option>
                        <option value="Pacific/Auckland">奥克兰时间 (新西兰)</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>TA 的时区</span>
                    <select id="ai-timezone-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="Asia/Shanghai">北京时间 (中国大陆)</option>
                        <option value="Asia/Hong_Kong">香港时间 (中国香港)</option>
                        <option value="Asia/Taipei">台北时间 (中国台湾)</option>
                        <option value="Asia/Tokyo">东京时间 (日本)</option>
                        <option value="Asia/Seoul">首尔时间 (韩国)</option>
                        <option value="Asia/Singapore">新加坡时间</option>
                        <option value="Asia/Bangkok">曼谷时间 (泰国)</option>
                        <option value="Asia/Dubai">迪拜时间 (阿联酋)</option>
                        <option value="Europe/London">伦敦时间 (英国)</option>
                        <option value="Europe/Paris">巴黎时间 (法国)</option>
                        <option value="Europe/Berlin">柏林时间 (德国)</option>
                        <option value="Europe/Moscow">莫斯科时间 (俄罗斯)</option>
                        <option value="America/New_York">纽约时间 (美东)</option>
                        <option value="America/Chicago">芝加哥时间 (美中)</option>
                        <option value="America/Los_Angeles">洛杉矶/旧金山 (美西)</option>
                        <option value="America/Toronto">多伦多时间 (加拿大)</option>
                        <option value="America/Vancouver">温哥华时间 (加拿大)</option>
                        <option value="Australia/Sydney">悉尼时间 (澳洲东部)</option>
                        <option value="Australia/Melbourne">墨尔本时间 (澳洲东部)</option>
                        <option value="Pacific/Auckland">奥克兰时间 (新西兰)</option>
                    </select>
                </div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">跨语言与翻译</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>TA 的语言</span>
                    <select id="ai-language-select" style="border:none; background:transparent; font-size:14px; color:#8E8E93; outline:none; text-align:right;">
                        <option value="default">默认 (简体中文)</option>
                        <option value="Traditional Chinese">繁体中文</option>
                        <option value="Cantonese">粤语 (Cantonese)</option>
                        <option value="Sichuanese">四川话</option>
                        <option value="Northeastern Mandarin">东北话</option>
                        <option value="English">英语 (English)</option>
                        <option value="Japanese">日语 (日本語)</option>
                        <option value="Korean">韩语 (한국어)</option>
                        <option value="French">法语 (Français)</option>
                        <option value="German">德语 (Deutsch)</option>
                        <option value="Spanish">西班牙语 (Español)</option>
                        <option value="Russian">俄语 (Русский)</option>
                        <option value="Italian">意大利语 (Italiano)</option>
                        <option value="Portuguese">葡萄牙语 (Português)</option>
                        <option value="Arabic">阿拉伯语 (العربية)</option>
                    </select>
                </div>
                <div class="settings-list-item"><span>自动翻译</span><label class="ios-switch"><input type="checkbox" id="auto-translate-toggle"><span class="ios-slider"></span></label></div>
            </div>
        </div>
    </div>

    <!-- 5. 角色行为与进阶设定页 -->
    <div class="chat-page" id="chat-page-behavior-settings" style="z-index: 30;">
        <header class="chat-header"><button class="chat-icon-btn" id="behavior-settings-back"><i data-lucide="chevron-left"></i></button><span class="chat-header-title">行为与设定</span><div style="width:32px;"></div></header>
        <div style="flex:1; overflow-y:auto; padding-top:16px; padding-bottom:40px;">
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">回复长度限制 (留空则不限)</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>最少回复句数</span><input type="number" id="bh-min-sentences" placeholder="如: 1" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
                <div class="settings-list-item"><span>最多回复句数</span><input type="number" id="bh-max-sentences" placeholder="如: 3" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">主动交互与免打扰</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>允许主动发消息</span><label class="ios-switch"><input type="checkbox" id="bh-proactive-toggle"><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>触发间隔(分钟)</span><input type="number" id="bh-proactive-interval" placeholder="30" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none; width:80px;"></div>
                <div class="settings-list-item"><span>免打扰开始</span><input type="time" id="bh-dnd-start" value="23:00" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none;"></div>
                <div class="settings-list-item"><span>免打扰结束</span><input type="time" id="bh-dnd-end" value="08:00" style="border:none; background:transparent; text-align:right; font-size:15px; color:#8E8E93; outline:none;"></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">专属局部世界书 (仅当前角色)</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>开启局部世界书</span><label class="ios-switch"><input type="checkbox" id="bh-localwb-toggle"><span class="ios-slider"></span></label></div>
                <div class="settings-list-item" id="bh-localwb-import-btn"><span>导入 JSON 文件</span><span style="font-size:13px;color:#8E8E93;" id="localwb-status">未导入</span></div>
            </div>
            
            <div style="padding: 0 16px 8px 24px; font-size:12px; color:#8E8E93;">聊天显示交互</div>
            <div class="settings-list-group">
                <div class="settings-list-item"><span>显示消息时间戳</span><label class="ios-switch"><input type="checkbox" id="bh-timestamp-toggle" checked><span class="ios-slider"></span></label></div>
                <div class="settings-list-item"><span>角色心声 (点头像查看)</span><label class="ios-switch"><input type="checkbox" id="bh-innervoice-toggle"><span class="ios-slider"></span></label></div>
            </div>
        </div>
    </div>

    <!-- 6. 心声浮窗 -->
    <div id="inner-voice-modal" class="iv-modal-overlay">
        <div class="iv-modal-box">
            <div class="iv-modal-title" id="iv-modal-title">心声</div>
            <div class="iv-modal-content" id="iv-modal-content">解析中...</div>
            <button class="iv-modal-close" id="iv-modal-close">关闭</button>
        </div>
    </div>

    <input type="file" id="couple-avatar-uploader" accept="image/*" style="display:none;">
    <input type="file" id="chat-bg-uploader" accept="image/*" style="display:none;">
    <input type="file" id="localwb-uploader" accept=".json" style="display:none;">
`;
