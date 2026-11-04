(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const revealTargets=$$('.section-heading,.process-steps>li,.service,.story-image,.story-copy,.gallery-item,.questions>div,.visit-copy,.location-card,.demo-card,.review-notes>h2');
 if(!motion.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'});
  revealTargets.forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${(i%3)*65}ms`);el.classList.add('reveal-ready');observer.observe(el)});
  motion.addEventListener('change',e=>{if(e.matches){observer.disconnect();revealTargets.forEach(el=>el.classList.add('is-revealed'))}});
 }

 const theme=$('.theme-toggle');
 function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';if(theme){theme.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);theme.setAttribute('aria-pressed',String(dark));$('.theme-label',theme).textContent=dark?'Light':'Dark';}}
 syncTheme();theme?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('demo-theme',next)}catch{}syncTheme()});
 const menu=$('.menu-toggle'),nav=$('.site-header nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',`${open?'Close':'Open'} navigation`);menu.textContent=open?'×':'☰'});$$('a',nav||document.createElement('div')).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.textContent='☰'}));
 $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('[data-filter]',button.parentElement).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const items=$$('.gallery-item,.demo-card');items.forEach(item=>item.hidden=filter!=='All'&&item.dataset.category!==filter);const count=$('#demo-count');if(count)count.textContent=`${items.filter(i=>!i.hidden).length} concepts`;}));
 $$('[data-mood]').forEach(button=>button.addEventListener('click',()=>{$$('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#mood-word').textContent=button.dataset.mood}));
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));$$('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
 const lightbox=$('#lightbox');$$('[data-photo]').forEach(b=>b.addEventListener('click',()=>{$('img',lightbox).src=b.dataset.photo;$('img',lightbox).alt=b.dataset.caption;$('p',lightbox).textContent=b.dataset.caption;lightbox.showModal()}));
 const dialog=$('#inquiry'),form=$('#inquiry-form'),result=$('#inquiry-result');let summaryText='';
 function edit(){form.hidden=false;result.hidden=true;}
 $$('[data-inquiry],[data-service]').forEach(b=>b.addEventListener('click',()=>{edit();if(b.dataset.service)form.elements.service.value=b.dataset.service;dialog.showModal()}));
 const date=$('input[type=date]');if(date){const d=new Date();date.min=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const fields=new FormData(form),dl=$('#summary');dl.replaceChildren();const labels={service:'Service',details:document.body.dataset.kind==='device'?'Device':document.body.dataset.kind==='auto'?'Vehicle':'Preferred date',location:'Location',name:'Name',email:'Email',message:'Notes'};summaryText=`${document.body.dataset.business}\nINQUIRY PREVIEW — NOT SENT\nNo appointment, availability, or price is confirmed.\n\n`;for(const [key,value]of fields){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=labels[key]||key;dd.textContent=value;dl.append(dt,dd);summaryText+=`${labels[key]||key}: ${value}\n`;}form.hidden=true;result.hidden=false;dialog.scrollTop=0;$('#download-inquiry').focus();});
 $('#edit-inquiry')?.addEventListener('click',()=>{edit();form.elements.service.focus()});
 $('#download-inquiry')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([summaryText],{type:'text/plain'})),a=document.createElement('a');a.href=url;a.download='inquiry-preview-not-sent.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 dialog?.addEventListener('close',()=>{form.reset();edit();$('#summary').replaceChildren();summaryText='';});
})();
