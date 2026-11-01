(() => {
 const query=document.getElementById('recipe-query'),community=document.getElementById('recipe-community');
 if(!query||!community)return;
 const recipes=[...document.querySelectorAll('.recipe')];
 const normalize=s=>s.normalize('NFKC').replace(/[\u0591-\u05C7]/g,'').toLowerCase();
 function filter(){
  const terms=normalize(query.value).trim().split(/\s+/).filter(Boolean);
  let count=0;
  recipes.forEach(recipe=>{const text=normalize(recipe.textContent);const visible=(!community.value||recipe.dataset.community===community.value)&&terms.every(term=>text.includes(term));recipe.hidden=!visible;if(visible)count++;});
  document.getElementById('recipe-results').textContent=count===1?'מתכון אחד':`${count} מתכונים`;
  document.querySelector('.recipe-empty').hidden=!!count;
 }
 query.addEventListener('input',filter);community.addEventListener('change',filter);
 function openHash(){const target=document.getElementById(location.hash.slice(1));if(target?.classList.contains('recipe'))target.open=true;}
 window.addEventListener('hashchange',openHash);openHash();
})();
