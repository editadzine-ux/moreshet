(() => {
 const photos=[...document.querySelectorAll('[data-photo]')], dialog=document.querySelector('.gallery-viewer'),slider=document.querySelector('.album-slider');
 if(!dialog||!slider||!photos.length)return;
 const image=dialog.querySelector('.viewer-image'),caption=dialog.querySelector('.viewer-caption'),counter=dialog.querySelector('.viewer-counter'),original=dialog.querySelector('.viewer-original');
 const main=slider.querySelector('.album-main-image'),track=slider.querySelector('.album-thumbnails'),label=slider.querySelector('.album-slide-caption'),count=slider.querySelector('.album-slide-count'),open=slider.querySelector('.album-image-open');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let current=0,previousOverflow='';
 function show(index,scroll=true){
  current=(index+photos.length)%photos.length;const item=photos[current];
  main.src=item.href;main.alt=item.dataset.caption;label.textContent=item.dataset.caption;
  count.textContent=`${String(current+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  photos.forEach((p,i)=>{if(i===current)p.setAttribute('aria-current','true');else p.removeAttribute('aria-current');});
  image.src=item.href;image.alt=item.dataset.caption;caption.textContent=item.dataset.caption;counter.textContent=`${current+1} / ${photos.length}`;original.href=item.href;
  if(scroll){const r=item.getBoundingClientRect(),b=track.getBoundingClientRect();const delta=r.left<b.left?r.left-b.left-8:r.right>b.right?r.right-b.right+8:0;if(delta)track.scrollBy({left:delta,behavior:reduced?'instant':'smooth'});}
 }
 photos.forEach((photo,index)=>photo.addEventListener('click',event=>{event.preventDefault();show(index);}));
 open.addEventListener('click',()=>{show(current,false);previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();dialog.querySelector('.viewer-close').focus();});
 slider.querySelector('.album-prev').addEventListener('click',()=>show(current-1));
 slider.querySelector('.album-next').addEventListener('click',()=>show(current+1));
 dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.viewer-prev').addEventListener('click',()=>show(current-1));
 dialog.querySelector('.viewer-next').addEventListener('click',()=>show(current+1));
 function keys(event){if(event.key==='ArrowRight'){event.preventDefault();show(current-1);}if(event.key==='ArrowLeft'){event.preventDefault();show(current+1);}if(event.key==='Home'){event.preventDefault();show(0);}if(event.key==='End'){event.preventDefault();show(photos.length-1);}}
 slider.addEventListener('keydown',keys);dialog.addEventListener('keydown',keys);
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;open.focus({preventScroll:true});});
 function swipe(el){let start=null;el.addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});el.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3)show(current+(dx>0?1:-1));start=null;},{passive:true});el.addEventListener('touchcancel',()=>{start=null;},{passive:true});}
 swipe(main);swipe(image);show(0,false);
})();
