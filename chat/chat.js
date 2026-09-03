(function(){
const container=document.getElementById('chat-app');
if(!container)return;

const STYLE=`
.character-mask{position:absolute;inset:0;background:rgba(0,0,0,.28);z-index:90;display:none;align-items:flex-end}
.character-panel{width:100%;max-height:94%;background:#f7f7f7;border-radius:24px 24px 0 0;overflow:auto;padding:18px;box-sizing:border-box}
.character-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px}
.character-title{font-size:20px;font-weight:700;color:#222}
.character-close{border:0;background:#e9e9e9;width:34px;height:34px;border-radius:50%;font-size:20px}
.character-avatar-preview{width:82px;height:82px;border-radius:22px;background:#ddd center/cover no-repeat;margin:0 auto 14px}
.character-upload{display:block;text-align:center;background:#fff;border-radius:13px;padding:11px;margin-bottom:13px;color:#555;font-size:14px}
.character-field{margin-bottom:11px}
.character-field label{display:block;font-size:12px;color:#777;margin:0 0 5px 4px}
.character-field input,.character-field textarea{width:100%;box-sizing:border-box;border:0;background:#fff;border-radius:13px;padding:11px;font-size:15px;outline:none;color:#222}
.character-field textarea{min-height:78px;resize:none}
.character-save{width:100%;border:0;border-radius:14px;padding:13px;background:#222;color:#fff;font-size:15px}
.character-delete{width:100%;border:0;border-radius:14px;padding:11px;background:#eee;color:#c44;font-size:14px;margin-top:8px}
.character-import{width:100%;border:0;border-radius:14px;padding:11px;background:#e9e9e9;color:#444;font-size:14px;margin-bottom:10px}
.character-item{display:flex;align-items:center;gap:11px;padding:11px 13px;background:#fff;margin:7px 10px;border-radius:17px}
.character-item-avatar{width:52px;height:52px;border-radius:16px;background:#ddd center/cover no-repeat;flex:none}
.character-item-info{flex:1;min-width:0}
.character-item-name{font-size:15px;font-weight:600;color:#222}
.character-item-note{font-size:12px;color:#999;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.character-edit{border:0;background:#eee;border-radius:10px;padding:7px 9px;color:#555}
`;

const style=document.createElement('style');
style.textContent=STYLE;
document.head.appendChild(style);

container.innerHTML=`
<div class="chat-system-close" id="chat-system-close"><i data-lucide="chevron-left"></i></div>

<div id="chat-main-tabs" class="chat-tabs-container">

<div id="chat-tab-chats" class="chat-page active">
<header class="chat-header">
<h1 class="chat-title">Chats</h1>
<button class="chat-icon-btn" id="chat-add-btn"><i data-lucide="plus"></i></button>
</header>
<div class="chat-search-wrap"><div class="chat-search"><i data-lucide="search"></i><span>Search...</span></div></div>
<div class="chat-list" id="chat-list"></div>
</div>

<div id="chat-tab-contacts" class="chat-page">
<header class="chat-header">
<h1 class="chat-title">Contacts</h1>
<button class="chat-icon-btn" id="contact-add-btn"><i data-lucide="plus"></i></button>
</header>
<div class="chat-search-wrap"><div class="chat-search"><i data-lucide="search"></i><span>Search...</span></div></div>
<div class="chat-contacts-list" id="character-list"></div>
</div>

<div id="chat-tab-moments" class="chat-page">
<header class="chat-header"><h1 class="chat-title">Moments</h1></header>
<div class="chat-moments-feed"></div>
</div>

<div id="chat-tab-me" class="chat-page">
<div class="chat-me-header">
<div class="chat-me-info">
<div class="chat-me-avatar"></div>
<div class="chat-me-text"><h2 class="chat-me-name">User</h2><span class="chat-me-id">ID: user</span></div>
</div>
<i data-lucide="qr-code" class="chat-me-qr"></i>
</div>
<div class="chat-me-menu">
<div class="chat-menu-item"><i data-lucide="user"></i><span>Profile</span></div>
<div class="chat-menu-item"><i data-lucide="star"></i><span>Favorites</span></div>
<div class="chat-menu-item"><i data-lucide="settings"></i><span>Settings</span></div>
<div class="chat-menu-item"><i data-lucide="info"></i><span>About</span></div>
</div>
</div>

<nav class="chat-bottom-bar">
<div class="chat-nav-item active" data-target="chat-tab-chats"><i data-lucide="message-square"></i><span>Chats</span></div>
<div class="chat-nav-item" data-target="chat-tab-contacts"><i data-lucide="users"></i><span>Contacts</span></div>
<div class="chat-nav-item" data-target="chat-tab-moments"><i data-lucide="aperture"></i><span>Moments</span></div>
<div class="chat-nav-item" data-target="chat-tab-me"><i data-lucide="user-circle"></i><span>Me</span></div>
</nav>
</div>

<div id="chat-room-page" class="chat-room-container">
<header class="chat-room-header">
<button class="chat-room-back" id="room-back-btn"><i data-lucide="chevron-left"></i></button>
<div class="chat-room-title-area"><span class="chat-room-name" id="room-target-name">Chat</span></div>
<div class="chat-room-placeholder"></div>
</header>
<div class="chat-room-body" id="room-messages-body"></div>
<div class="chat-room-footer">
<div class="chat-room-input-box">
<input type="text" id="room-input" placeholder="Message..." autocomplete="off" enterkeyhint="send">
</div>
<button class="chat-room-send-btn" id="room-send-btn" disabled><i data-lucide="arrow-up"></i></button>
<button class="chat-room-ai-btn" id="room-ai-btn" type="button" title="让 AI 主动回复"><i data-lucide="sparkles"></i></button>
</div>
</div>
`;

if(window.lucide)lucide.createIcons({root:container});

const mainTabs=document.getElementById('chat-main-tabs');
const roomPage=document.getElementById('chat-room-page');
const roomBody=document.getElementById('room-messages-body');
const roomInput=document.getElementById('room-input');
const sendBtn=document.getElementById('room-send-btn');
const aiBtn=document.getElementById('room-ai-btn');
const backBtn=document.getElementById('room-back-btn');
const roomNameEl=document.getElementById('room-target-name');
const closeBtn=document.getElementById('chat-system-close');
const charList=document.getElementById('character-list');
const chatList=document.getElementById('chat-list');

const CHAR_KEY='wuyo_characters';
const MSG_KEY='wuyo_chat_messages';

let currentContact=null;
let currentCharacter=null;
let aiRequesting=false;

function getChars(){
try{return JSON.parse(localStorage.getItem(CHAR_KEY)||'[]')}catch(e){return[]}
}
function saveChars(a){localStorage.setItem(CHAR_KEY,JSON.stringify(a))}
function loadMessages(){
try{return JSON.parse(localStorage.getItem(MSG_KEY)||'{}')}catch(e){return{}}
}
function saveMessages(a){localStorage.setItem(MSG_KEY,JSON.stringify(a))}
function now(){
const d=new Date();
return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function esc(s){
const d=document.createElement('div');
d.textContent=s==null?'':String(s);
return d.innerHTML;
}

function getMessages(name){
const all=loadMessages();
if(!all[name]){
all[name]=[];
saveMessages(all);
}
return all[name];
}

function addMessage(name,msg){
const all=loadMessages();
if(!all[name])all[name]=[];
all[name].push(msg);
saveMessages(all);
}

function renderMessages(name){
const list=getMessages(name);
roomBody.innerHTML=list.map(m=>{
if(m.from==='system')return `<div class="msg-system">${esc(m.text)}</div>`;
return `<div class="msg-row ${m.from==='me'?'me':'them'}"><div class="msg-bubble">${esc(m.text)}</div></div>`;
}).join('');
requestAnimationFrame(()=>roomBody.scrollTop=roomBody.scrollHeight);
}

function openChat(c){
currentCharacter=c;
currentContact=c.name;
roomNameEl.textContent=c.name;
renderMessages(c.name);
mainTabs.style.display='none';
roomPage.style.display='flex';
aiBtn.disabled=false;
}

function getApiConfig(){
try{
const raw=localStorage.getItem('wuyo_config');
if(!raw)return{};
const config=JSON.parse(raw);
const api=config.api||config.apiConfig||config;
return{
url:api.url||api.apiUrl||api.baseUrl||null,
key:api.key||api.apiKey||null,
model:api.model||api.modelName||null,
temperature:typeof api.temperature==='number'?api.temperature:.8
};
}catch(e){return{}}
}

/* ================= 创建/编辑角色 ================= */

const mask=document.createElement('div');
mask.className='character-mask';
mask.innerHTML=`
<div class="character-panel">
<div class="character-top">
<div class="character-title" id="character-title">创建角色</div>
<button class="character-close" id="character-close">×</button>
</div>

<div class="character-avatar-preview" id="char-avatar-preview"></div>

<label class="character-upload">
📷 选择头像
<input id="char-avatar" type="file" accept="image/*" hidden>
</label>

<button class="character-import" id="character-import">📁 导入角色文件（JSON / TXT）</button>
<input id="character-file" type="file" accept=".json,.txt,application/json,text/plain" hidden>

<div class="character-field"><label>姓名</label><input id="char-name" placeholder="角色姓名"></div>
<div class="character-field"><label>备注</label><input id="char-note" placeholder="例如：我的朋友"></div>
<div class="character-field"><label>身份</label><input id="char-identity" placeholder="例如：学生 / 医生 / 骑士"></div>
<div class="character-field"><label>年龄</label><input id="char-age" placeholder="例如：22"></div>
<div class="character-field"><label>人设</label><textarea id="char-persona" placeholder="性格、说话方式、背景、习惯……"></textarea></div>
<div class="character-field"><label>外观描述</label><textarea id="char-appearance" placeholder="发型、眼睛、身材、服装等……"></textarea></div>

<div class="character-field">
<label>锁脸照片</label>
<label class="character-upload">
🔒 导入锁脸照片
<input id="char-face" type="file" accept="image/*" hidden>
</label>
</div>

<button class="character-save" id="char-save">保存角色</button>
<button class="character-delete" id="char-delete">删除角色</button>
</div>
`;
container.appendChild(mask);

let editingId=null;
let avatarData='';
let faceData='';

const $=id=>document.getElementById(id);

function resetEditor(){
editingId=null;
avatarData='';
faceData='';
$('char-name').value='';
$('char-note').value='';
$('char-identity').value='';
$('char-age').value='';
$('char-persona').value='';
$('char-appearance').value='';
$('char-avatar-preview').style.backgroundImage='';
$('character-title').textContent='创建角色';
$('char-delete').style.display='none';
}

function openEditor(id){
resetEditor();

if(id){
const c=getChars().find(x=>x.id===id);
if(!c)return;

editingId=c.id;
avatarData=c.avatar||'';
faceData=c.face||'';

$('char-name').value=c.name||'';
$('char-note').value=c.note||'';
$('char-identity').value=c.identity||'';
$('char-age').value=c.age||'';
$('char-persona').value=c.persona||'';
$('char-appearance').value=c.appearance||'';

$('char-avatar-preview').style.backgroundImage=
avatarData?`url("${avatarData}")`:'';

$('character-title').textContent='编辑角色';
$('char-delete').style.display='block';
}

mask.style.display='flex';
}

function readImage(file,cb){
if(!file)return;
const r=new FileReader();
r.onload=()=>cb(r.result);
r.readAsDataURL(file);
}

$('char-avatar').onchange=e=>{
readImage(e.target.files[0],data=>{
avatarData=data;
$('char-avatar-preview').style.backgroundImage=`url("${data}")`;
});
};

$('char-face').onchange=e=>{
readImage(e.target.files[0],data=>faceData=data);
};

$('character-close').onclick=()=>mask.style.display='none';

$('char-save').onclick=()=>{
const name=$('char-name').value.trim();
if(!name){
alert('请先填写角色姓名');
return;
}

const data={
id:editingId||'char_'+Date.now(),
name,
note:$('char-note').value.trim(),
identity:$('char-identity').value.trim(),
age:$('char-age').value.trim(),
persona:$('char-persona').value.trim(),
appearance:$('char-appearance').value.trim(),
avatar:avatarData,
face:faceData
};

let all=getChars();

if(editingId)all=all.map(x=>x.id===editingId?data:x);
else all.push(data);

saveChars(all);
mask.style.display='none';
renderContacts();
renderChats();
};

$('char-delete').onclick=()=>{
if(!editingId)return;
if(confirm('确定删除这个角色吗？')){
saveChars(getChars().filter(x=>x.id!==editingId));
mask.style.display='none';
renderContacts();
renderChats();
}
};

/* ================= 文件导入 ================= */

$('character-import').onclick=()=>{
$('character-file').click();
};

$('character-file').onchange=async e=>{
const file=e.target.files[0];
if(!file)return;

try{
const text=await file.text();
let data;

if(file.name.toLowerCase().endsWith('.json')){
data=JSON.parse(text);
}else{
data={persona:text};
}

$('char-name').value=data.name||data.character_name||'';
$('char-note').value=data.note||data.remark||'';
$('char-identity').value=data.identity||data.role||'';
$('char-age').value=data.age||'';
$('char-persona').value=data.persona||data.personality||data.description||'';
$('char-appearance').value=data.appearance||data.looks||'';

if(data.avatar)avatarData=data.avatar;
if(data.face)faceData=data.face;

$('char-avatar-preview').style.backgroundImage=
avatarData?`url("${avatarData}")`:'';

alert('角色资料已导入，可以检查后保存啦💕');

}catch(err){
alert('角色文件读取失败，请检查 JSON / TXT 格式。');
}

e.target.value='';
};

/* ================= 联系人 ================= */

function renderContacts(){
const chars=getChars();

if(!chars.length){
charList.innerHTML=`
<div class="chat-letter-divider">Characters</div>
<div class="chat-list-item" id="character-add-empty">
<div class="chat-avatar-small flex-center">＋</div>
<div class="chat-item-content">
<span class="chat-name">创建新角色</span>
</div>
</div>`;
}else{
charList.innerHTML=
`<div class="chat-letter-divider">Characters</div>`+
chars.map(c=>`
<div class="character-item" data-id="${c.id}">
<div class="character-item-avatar"
style="${c.avatar?`background-image:url("${c.avatar}")`:''}">
</div>
<div class="character-item-info">
<div class="character-item-name">${esc(c.name)}</div>
<div class="character-item-note">${esc(c.note||c.identity||'暂无备注')}</div>
</div>
<button class="character-edit" data-edit="${c.id}">编辑</button>
</div>`).join('')+
`
<div class="chat-list-item" id="character-add-item">
<div class="chat-avatar-small flex-center">＋</div>
<div class="chat-item-content">
<span class="chat-name">创建新角色</span>
</div>
</div>`;
}

const add=document.getElementById('character-add-item');
const empty=document.getElementById('character-add-empty');

if(add)add.onclick=()=>openEditor();
if(empty)empty.onclick=()=>openEditor();

charList.querySelectorAll('.character-item').forEach(item=>{
item.onclick=e=>{
if(e.target.closest('[data-edit]'))return;
const c=chars.find(x=>x.id===item.dataset.id);
if(c)openChat(c);
};
});

charList.querySelectorAll('[data-edit]').forEach(btn=>{
btn.onclick=e=>{
e.stopPropagation();
openEditor(btn.dataset.edit);
};
});

if(window.lucide)lucide.createIcons({root:charList});
}

/* ================= Chats ================= */

function renderChats(){
const chars=getChars();

if(!chars.length){
chatList.innerHTML=`
<div class="chat-list-item">
<div class="chat-avatar"></div>
<div class="chat-item-content">
<div class="chat-item-top"><span class="chat-name">暂无角色</span></div>
<div class="chat-item-bottom"><span class="chat-msg">请先创建一个角色</span></div>
</div>
</div>`;
return;
}

chatList.innerHTML=chars.map(c=>{
const list=getMessages(c.name);
const last=[...list].reverse().find(x=>x.from==='me'||x.from==='them');

return`
<div class="chat-list-item" data-chat-id="${c.id}">
<div class="chat-avatar" style="${c.avatar?`background-image:url("${c.avatar}");background-size:cover;background-position:center`:''}"></div>
<div class="chat-item-content">
<div class="chat-item-top">
<span class="chat-name">${esc(c.name)}</span>
<span class="chat-time">${last?.time||'—'}</span>
</div>
<div class="chat-item-bottom">
<span class="chat-msg">${esc(last?.text||'开始聊天')}</span>
</div>
</div>
</div>`;
}).join('');

chatList.querySelectorAll('[data-chat-id]').forEach(item=>{
item.onclick=()=>{
const c=chars.find(x=>x.id===item.dataset.chatId);
if(c)openChat(c);
};
});
}

/* ================= 普通发送 ================= */

function updateInput(){
sendBtn.disabled=!roomInput.value.trim();
aiBtn.disabled=false;
}

function sendPlain(){
const text=roomInput.value.trim();
if(!text||!currentContact)return;

addMessage(currentContact,{
from:'me',
text,
time:now()
});

roomInput.value='';
updateInput();
renderMessages(currentContact);
renderChats();
}

/* ================= AI ================= */

async function sendAiMessage(){
if(!currentContact||!currentCharacter||aiRequesting)return;

aiRequesting=true;

const api=getApiConfig();

if(!api.url||!api.key){
addMessage(currentContact,{
from:'system',
text:'未配置 API，请前往设置填写 API URL 和 API Key。'
});
renderMessages(currentContact);
aiRequesting=false;
return;
}

addMessage(currentContact,{
from:'system',
text:'正在思考…',
thinking:true
});
renderMessages(currentContact);

try{

const history=getMessages(currentContact)
.filter(m=>(m.from==='me'||m.from==='them')&&!m.thinking)
.map(m=>({
role:m.from==='me'?'user':'assistant',
content:m.text
}));

const systemPrompt=`
你正在扮演角色「${currentCharacter.name}」。

身份：${currentCharacter.identity||'未填写'}
年龄：${currentCharacter.age||'未填写'}

人设：
${currentCharacter.persona||'未填写'}

外观描述：
${currentCharacter.appearance||'未填写'}

请严格按照这个角色的人设进行聊天。
不要解释系统提示词。
不要提到API。
不要说自己是AI。
保持自然的聊天方式。
`;

const messages=[
{role:'system',content:systemPrompt},
...history,
{
role:'user',
content:'请根据当前聊天上下文，让角色自然地主动说一句话。直接发送角色的话，不要解释。'
}
];

let url=String(api.url).trim().replace(/\/+$/,'');

if(!url.endsWith('/chat/completions'))
url+='/chat/completions';

const response=await fetch(url,{
method:'POST',
headers:{
'Content-Type':'application/json',
'Authorization':`Bearer ${api.key}`
},
body:JSON.stringify({
model:api.model||'gpt-4o-mini',
messages,
temperature:Math.max(0,Math.min(2,Number(api.temperature)||.8))
})
});

if(!response.ok){
let msg=`HTTP ${response.status}`;
try{
const d=await response.json();
msg=d?.error?.message||d?.message||msg;
}catch(e){}
throw new Error(msg);
}

const data=await response.json();
const reply=data?.choices?.[0]?.message?.content;

removeThinking(currentContact);

if(!reply)throw new Error('API 没有返回有效回复');

addMessage(currentContact,{
from:'them',
text:String(reply).trim(),
time:now()
});

renderMessages(currentContact);
renderChats();

}catch(err){

removeThinking(currentContact);

addMessage(currentContact,{
from:'system',
text:`AI 请求失败：${err.message||'无法连接 API'}`
});

renderMessages(currentContact);

}

aiRequesting=false;
}

function removeThinking(name){
const all=loadMessages();

if(!all[name])return;

all[name]=all[name].filter(m=>!m.thinking);
saveMessages(all);
}

/* ================= 事件 ================= */

roomInput.addEventListener('input',updateInput);

roomInput.addEventListener('keydown',e=>{
if(e.key==='Enter'){
e.preventDefault();
if(roomInput.value.trim())sendPlain();
}
});

sendBtn.addEventListener('click',e=>{
e.preventDefault();
e.stopPropagation();
sendPlain();
});

aiBtn.addEventListener('click',e=>{
e.preventDefault();
e.stopPropagation();
sendAiMessage();
});

document.getElementById('chat-add-btn').onclick=()=>openEditor();
document.getElementById('contact-add-btn').onclick=()=>openEditor();

document.querySelectorAll('.chat-nav-item').forEach(item=>{
item.onclick=()=>{
document.querySelectorAll('.chat-nav-item').forEach(x=>x.classList.remove('active'));
document.querySelectorAll('.chat-page').forEach(x=>x.classList.remove('active'));

item.classList.add('active');

const page=document.getElementById(item.dataset.target);
if(page)page.classList.add('active');

if(item.dataset.target==='chat-tab-contacts')renderContacts();
};
});

backBtn.onclick=e=>{
e.preventDefault();
roomPage.style.display='none';
mainTabs.style.display='block';
currentContact=null;
currentCharacter=null;
roomInput.value='';
updateInput();
renderChats();
};

closeBtn.onclick=e=>{
e.preventDefault();
if(typeof window.closeApp==='function')window.closeApp('chat');
};

updateInput();
renderContacts();
renderChats();

})();