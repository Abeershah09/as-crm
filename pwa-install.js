(function pwaEntry(){
'use strict';
let pending=null;
let updated=false;
const $=id=>document.getElementById(id);
const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const status=()=>installed()?'Installed':pending?'Ready to install':'Use browser install menu';
function refresh(){
  document.querySelectorAll('.as-pwa-install').forEach(b=>b.style.display=installed()?'none':'');
  if($('asPwaInstallStatus'))$('asPwaInstallStatus').textContent=status();
}
function guidance(){
  const ua=navigator.userAgent,android=/Android/i.test(ua),iphone=/iPhone|iPad|iPod/i.test(ua),edge=/Edg\//.test(ua);
  const info=android?'Open AS CRM in Google Chrome → tap ⋮ → Install app / Add to Home screen.':
             iphone?'Open AS CRM in Safari → Share → Add to Home Screen → Open as Web App → Add.':
             edge?'In Microsoft Edge click the install icon in the address bar, or ⋯ → More tools → Apps → Install this site as an app.':
             'On Windows open AS CRM in Microsoft Edge → ⋯ → More tools → Apps → Install this site as an app.';
  const bg=document.createElement('div');bg.className='as-pwa-dialog';bg.setAttribute('role','dialog');bg.setAttribute('aria-modal','true');
  const card=document.createElement('div');card.className='as-pwa-guide';
  const heading=document.createElement('h3');heading.textContent='Install AS CRM';
  const p=document.createElement('p');p.textContent=info;
  const detail=document.createElement('p');detail.textContent='No APK or EXE needed. Use the same Supabase login on both devices. Offline viewing is limited; cloud sync needs internet.';
  const close=document.createElement('button');close.type='button';close.className='btn primary';close.textContent='Got it';close.onclick=()=>bg.remove();
  card.append(heading,p,detail,close);bg.append(card);bg.addEventListener('click',e=>{if(e.target===bg)bg.remove();});document.body.append(bg);close.focus();
}
async function install(){
  if(installed())return;
  if(!pending){guidance();return;}
  const ev=pending;pending=null;refresh();
  try{await ev.prompt();if(ev.userChoice)await ev.userChoice;}catch(e){console.warn('PWA install:',e);guidance();}
}
async function checkUpdates(){
  const b=$('asPwaCheckUpdates'),result=$('asPwaUpdateStatus');
  if(b)b.disabled=true;
  try{
    if(!navigator.onLine)throw Error('Internet required to check for updates.');
    const reg=await navigator.serviceWorker?.getRegistration('./');
    if(!reg)throw Error('Open AS CRM online, refresh the page and try again.');
    await reg.update();
    if(result)result.textContent=updated||reg.waiting?'Update ready. Save work, then reopen or refresh the app.':'Update check completed. Reopen the app if a new version is available.';
  }catch(e){if(result)result.textContent=e.message||String(e);}
  finally{if(b)b.disabled=false;}
}
function updateNotice(){
  updated=true;
  if($('asPwaUpdateNotice'))return;
  const div=document.createElement('div');div.id='asPwaUpdateNotice';div.className='as-pwa-update';
  const txt=document.createElement('span');txt.textContent='AS CRM update ready. Save your work before reloading.';
  const btn=document.createElement('button');btn.className='btn small primary';btn.textContent='Reload';btn.onclick=()=>location.reload();
  const later=document.createElement('button');later.className='btn small';later.textContent='Later';later.onclick=()=>div.remove();
  div.append(txt,btn,later);document.body.append(div);
}
function controls(){
  const mobile=document.querySelector('.mobile-header .quick-actions'),desktop=document.querySelector('.sidebar .side-bottom');
  if(mobile){const b=document.createElement('button');b.className='backup-action as-pwa-install';b.type='button';b.textContent='Install';b.onclick=install;mobile.prepend(b);}
  if(desktop){const b=document.createElement('button');b.className='btn as-pwa-install as-pwa-sidebar';b.type='button';b.textContent='Install AS CRM';b.onclick=install;desktop.prepend(b);}
  refresh();
}
window.addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();pending=ev;refresh();});
window.addEventListener('appinstalled',()=>{pending=null;refresh();});
let wasControlled=!!navigator.serviceWorker?.controller;
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(wasControlled)updateNotice();wasControlled=true;});
const style=document.createElement('style');
style.textContent='.as-pwa-sidebar{width:100%;justify-content:center;margin-bottom:16px;background:#edf2ff;color:#315dd5}.as-pwa-dialog{position:fixed;inset:0;z-index:450;background:#0b1c3699;padding:16px;display:grid;place-items:center}.as-pwa-guide{background:#fff;padding:24px;border-radius:16px;box-shadow:0 20px 60px #07152e40;width:min(440px,100%)}.as-pwa-guide h3{font-size:20px;margin:0 0 14px}.as-pwa-guide p{font-size:13px;line-height:1.7;color:#52627a}.as-pwa-update{position:fixed;bottom:15px;left:50%;transform:translateX(-50%);max-width:96vw;z-index:350;background:#172444;color:white;border-radius:12px;padding:12px 15px;display:flex;align-items:center;flex-wrap:wrap;gap:10px;font-size:12px;box-shadow:0 8px 26px #11223d50}@media(max-width:700px){.as-pwa-update{bottom:85px}.mobile-header .quick-actions{gap:5px}.mobile-header .as-pwa-install{min-height:36px;padding:7px 9px;font-size:11px}}';
document.head.append(style);
window.ASPWA={install,checkUpdates,installed,status};
controls();
})();
