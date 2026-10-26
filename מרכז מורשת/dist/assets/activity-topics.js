document.querySelectorAll('.activity-group').forEach(group=>{
 const button=group.querySelector('.activity-topics-toggle');
 const panel=group.querySelector('.activity-subtopics');
 if(!button||!panel)return;
 const setOpen=open=>{
  group.classList.toggle('is-open',open);
  button.setAttribute('aria-expanded',String(open));
  panel.inert=!open;
  button.querySelector('span').textContent=open?'סגירת הנושאים':(button.dataset.closedLabel||'לגלות את הפעילויות');
  button.querySelector('.topic-toggle-mark').textContent=open?'−':'+';
 };
 button.addEventListener('click',()=>setOpen(!group.classList.contains('is-open')));
 group.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)setOpen(true)});
 group.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'&&!panel.contains(document.activeElement))setOpen(false)});
 group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))setOpen(false)});
 group.addEventListener('keydown',event=>{if(event.key==='Escape'){if(panel.contains(document.activeElement))button.focus();setOpen(false)}});
 document.addEventListener('pointerdown',event=>{if(!group.contains(event.target))setOpen(false)});
});
