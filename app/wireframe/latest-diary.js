function decorateDiary(){
 const base='https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@1ffb34c752ecf5d402f04cfb4b392c77f57c54bc/assets/';
 const names={breakfast:['Croissant','croissant'],lunch:['Bowl with spoon','bowl_with_spoon'],dinner:['Pot of food','pot_of_food'],'snack-icon':['Red apple','red_apple'],trash:['Wastebasket','wastebasket']};
 const im=(folder,name)=>'<img class="ms-emoji" alt="" aria-hidden="true" src="'+base+encodeURIComponent(folder)+'/Color/'+name+'_color.svg">';
 document.querySelectorAll('.category-icon').forEach(e=>{const key=Object.keys(names).find(k=>e.classList.contains(k));if(key)e.innerHTML=im(...names[key]);});
 document.querySelectorAll('.trash').forEach(e=>{e.innerHTML='';e.style.backgroundImage=diaryTrash;});
 const nav=[['Bust in silhouette','bust_in_silhouette'],['Fork and knife with plate','fork_and_knife_with_plate'],['Bookmark tabs','bookmark_tabs'],['Memo','memo']];
 document.querySelectorAll('.icon-pending').forEach((e,i)=>e.innerHTML=im(...nav[i%4]));
 document.querySelectorAll('.ai-image').forEach(e=>{const img=document.createElement('img');img.src=diaryRice;img.alt='Hạt gạo pixel';img.className='rice-icon';e.replaceChildren(img);});
}
