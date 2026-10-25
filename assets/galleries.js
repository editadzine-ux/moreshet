(() => {
 const photos=[...document.querySelectorAll('[data-photo]')], dialog=document.querySelector('.gallery-viewer');
 if(!dialog||!photos.length)return;
 const image=dialog.querySelector('.viewer-image'),caption=dialog.querySelector('.viewer-caption'),counter=dialog.querySelector('.viewer-counter'),original=dialog.querySelector('.viewer-original');
 let current=0,trigger=null,previousOverflow='';
 function show(index){current=(index+photos.length)%photos.length;const item=photos[current];image.src=item.href;image.alt=item.dataset.caption;caption.textContent=item.dataset.caption;counter.textContent=`${current+1} / ${photos.length}`;original.href=item.href;}
 photos.forEach((photo,index)=>photo.addEventListener('click',event=>{event.preventDefault();trigger=photo;show(index);previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.querySelector('.viewer-close').focus();}));
 dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.viewer-prev').addEventListener('click',()=>show(current-1));
 dialog.querySelector('.viewer-next').addEventListener('click',()=>show(current+1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(current-1);}if(event.key==='ArrowLeft'){event.preventDefault();show(current+1);}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;if(trigger)trigger.focus();image.removeAttribute('src');});
 let start=null;
 image.addEventListener('touchstart',e=>{start=e.touches[0].clientX;},{passive:true});
 image.addEventListener('touchend',e=>{if(start===null)return;const delta=e.changedTouches[0].clientX-start;if(Math.abs(delta)>55)show(current+(delta>0?1:-1));start=null;},{passive:true});
})();
