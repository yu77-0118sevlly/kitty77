/* ==========================================
   Chat App - 终极极简黑白灰高级样式 (含高级交互)
========================================== */
#chat-app {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #F4F4F7; color: #1C1C1E; z-index: 9999;
    display: flex; flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
    -webkit-tap-highlight-color: transparent;
}

.chat-container { display: flex; flex-direction: column; height: 100%; position: relative; }

/* 顶部导航 */
.chat-header {
    flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;
    height: calc(env(safe-area-inset-top, 44px) + 56px);
    padding-top: env(safe-area-inset-top, 44px); padding: env(safe-area-inset-top, 44px) 16px 0 16px;
    background: rgba(244, 244, 247, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 0.5px solid rgba(0,0,0,0.05); z-index: 10;
}
.chat-title-area { display: flex; flex-direction: column; align-items: center; }
.chat-title { font-size: 16px; font-weight: 600; color: #1C1C1E; }
.chat-status { font-size: 11px; color: #34C759; font-weight: 500; margin-top: 2px;}
.chat-icon-btn { background: none; border: none; font-size: 20px; color: #1C1C1E; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; }

/* 消息列表 */
.chat-messages {
    flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px;
    -webkit-overflow-scrolling: touch; scroll-behavior: smooth; position: relative;
}
.chat-empty { text-align: center; color: #8E8E93; font-size: 13px; margin-top: 40px; }
.chat-timestamp { text-align: center; font-size: 11px; color: #8E8E93; margin-top: 8px; margin-bottom: -8px; font-weight: 500;}

/* 气泡 */
.chat-bubble-wrapper { display: flex; width: 100%; flex-direction: column; position: relative; }
.chat-bubble-wrapper.left { align-items: flex-start; }
.chat-bubble-wrapper.right { align-items: flex-end; }
.chat-bubble {
    max-width: 75%; padding: 12px 16px; border-radius: 20px; font-size: 15px; 
    line-height: 1.5; word-wrap: break-word; position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: filter 0.2s;
    user-select: none; -webkit-user-select: none; /* 禁用系统默认选中，启用自定义长按 */
}
.chat-bubble:active { filter: brightness(0.9); }
.chat-bubble.user { background: #1C1C1E; color: #FFFFFF; border-bottom-right-radius: 4px; }
.chat-bubble.ai { background: #FFFFFF; color: #1C1C1E; border-bottom-left-radius: 4px; }

/* 打字机动画 */
.typing-indicator { display: flex; gap: 4px; padding: 6px 4px; align-items: center; justify-content: center; height: 24px;}
.typing-dot { width: 6px; height: 6px; background: #8E8E93; border-radius: 50%; animation: typing 1.4s infinite ease-in-out both; }
.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

/* 底部输入框 */
.chat-input-area {
    flex-shrink: 0; padding: 10px 12px calc(env(safe-area-inset-bottom, 20px) + 10px) 12px;
    background: #F4F4F7; border-top: 0.5px solid rgba(0,0,0,0.05);
    display: flex; align-items: flex-end; gap: 8px; z-index: 10;
}
.chat-ext-btn { background: none; border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #1C1C1E; flex-shrink: 0; margin-bottom: 3px; cursor: pointer; }
.chat-input {
    flex: 1; background: #FFFFFF; border: none; border-radius: 20px;
    padding: 10px 16px; font-size: 15px; color: #1C1C1E; max-height: 120px; resize: none; outline: none;
    line-height: 1.4; margin: 0 4px;
}
.chat-send-btn {
    background: #34C759; border: none; width: 60px; height: 36px; border-radius: 18px;
    display: flex; justify-content: center; align-items: center; color: #FFF; font-weight: 600; font-size: 14px;
    transition: all 0.2s; flex-shrink: 0; margin-bottom: 2px;
    opacity: 0; width: 0; padding: 0; overflow: hidden; pointer-events: none;
}
.chat-send-btn.active { opacity: 1; width: 60px; pointer-events: auto; cursor: pointer; }

/* ==========================================
   💥 新增：长按上下文菜单 (Context Menu)
========================================== */
.chat-context-menu {
    position: fixed; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); display: flex; flex-direction: row; overflow: hidden; z-index: 10000;
    opacity: 0; pointer-events: none; transition: opacity 0.2s; transform: translate(-50%, -10px);
}
.chat-context-menu.show { opacity: 1; pointer-events: auto; }
.ctx-item { padding: 12px 18px; font-size: 14px; font-weight: 500; color: #1C1C1E; display: flex; flex-direction: column; align-items: center; gap: 4px; border-right: 0.5px solid rgba(0,0,0,0.05); cursor: pointer;}
.ctx-item:last-child { border-right: none; }
.ctx-item i { width: 18px; height: 18px; }
.ctx-item:active { background: rgba(0,0,0,0.05); }
.ctx-item.danger { color: #FF3B30; }

/* ==========================================
   💥 新增：右上角设置上拉面板 (Action Sheet)
========================================== */
.chat-drawer-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4);
    z-index: 10001; opacity: 0; pointer-events: none; transition: opacity 0.3s;
}
.chat-drawer-overlay.show { opacity: 1; pointer-events: auto; }
.chat-drawer {
    position: absolute; bottom: 0; left: 0; width: 100%; background: #F2F2F7;
    border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 20px 16px env(safe-area-inset-bottom, 20px) 16px;
    transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; gap: 8px;
}
.chat-drawer-overlay.show .chat-drawer { transform: translateY(0); }
.drawer-btn {
    width: 100%; padding: 16px; background: #FFF; border: none; font-size: 16px; font-weight: 500; color: #1C1C1E;
    border-radius: 14px; display: flex; justify-content: center; align-items: center; cursor: pointer;
}
.drawer-btn:active { background: #E5E5EA; }
.drawer-btn.danger { color: #FF3B30; }
.drawer-btn.cancel { margin-top: 8px; font-weight: 600; }
