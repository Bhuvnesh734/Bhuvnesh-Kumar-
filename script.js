document.addEventListener('DOMContentLoaded',()=>{

/* 1. PRELOADER */
const preloader=document.getElementById('preloader');
window.addEventListener('load',()=>{setTimeout(()=>preloader.classList.add('done'),500);});
setTimeout(()=>preloader.classList.add('done'),2000);

/* 2. THEME TOGGLE */
const root=document.documentElement;
const themeToggle=document.getElementById('themeToggle');
const themeToggleMobile=document.getElementById('themeToggleMobile');
function applyTheme(theme){
if(theme==='dark'){
root.setAttribute('data-theme','dark');
updateThemeIcons('fa-sun');
}else{
root.removeAttribute('data-theme');
updateThemeIcons('fa-moon');
}
}
function updateThemeIcons(iconClass){
[themeToggle,themeToggleMobile].forEach(btn=>{
if(!btn)return;
const i=btn.querySelector('i');
if(i)i.className='fa-solid '+iconClass;
});
}
function toggleTheme(){
const isDark=root.getAttribute('data-theme')==='dark';
const next=isDark?'light':'dark';
applyTheme(next);
try{localStorage.setItem('portfolio-theme',next);}catch(e){}
}
let savedTheme='light';
try{savedTheme=localStorage.getItem('portfolio-theme')||'light';}catch(e){}
applyTheme(savedTheme);
themeToggle&&themeToggle.addEventListener('click',toggleTheme);
themeToggleMobile&&themeToggleMobile.addEventListener('click',toggleTheme);

/* 3. MOBILE MENU */
const menuToggle=document.getElementById('menuToggle');
const menuClose=document.getElementById('menuClose');
const overlayMenu=document.getElementById('overlayMenu');
menuToggle&&menuToggle.addEventListener('click',()=>overlayMenu.classList.add('open'));
menuClose&&menuClose.addEventListener('click',()=>overlayMenu.classList.remove('open'));
overlayMenu&&overlayMenu.querySelectorAll('a').forEach(a=>{
a.addEventListener('click',()=>overlayMenu.classList.remove('open'));
});

/* 4. SCROLL PROGRESS */
const scrollProgress=document.getElementById('scrollProgress');
function updateScrollProgress(){
const scrollTop=window.scrollY;
const docHeight=document.documentElement.scrollHeight-window.innerHeight;
const pct=docHeight>0?(scrollTop/docHeight)*100:0;
if(scrollProgress)scrollProgress.style.width=pct+'%';
}

/* 5. SCROLLSPY */
const sections=document.querySelectorAll('.section');
const spineLinks=document.querySelectorAll('.spine-link');
const navLinks=document.querySelectorAll('.nav-link');
function updateActiveSection(){
let current=sections[0]?sections[0].id:'';
const scrollPos=window.scrollY+window.innerHeight*0.35;
sections.forEach(sec=>{
if(scrollPos>=sec.offsetTop)current=sec.id;
});
spineLinks.forEach(link=>{
link.classList.toggle('active',link.getAttribute('href')==='#'+current);
});
navLinks.forEach(link=>{
link.classList.toggle('active',link.getAttribute('href')==='#'+current);
});
}

/* 6. BACK TO TOP */
const backToTop=document.getElementById('backToTop');
function updateBackToTop(){
if(backToTop)backToTop.classList.toggle('show',window.scrollY>500);
}
backToTop&&backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('scroll',()=>{
updateScrollProgress();
updateActiveSection();
updateBackToTop();
});
updateScrollProgress();
updateActiveSection();
updateBackToTop();

/* 7. REVEAL */
const revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
const revealObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add('in-view');
revealObserver.unobserve(entry.target);
}
});
},{threshold:0.15});
revealEls.forEach(el=>revealObserver.observe(el));
}else{
revealEls.forEach(el=>el.classList.add('in-view'));
}

/* 8. TYPING EFFECT */
const typedRole=document.getElementById('typedRole');
const roles=['things for the web','clean interfaces','fast experiences','useful products'];
let roleIndex=0;
let charIndex=0;
let deleting=false;
function typeLoop(){
if(!typedRole)return;
const current=roles[roleIndex];
if(!deleting){
charIndex++;
typedRole.textContent=current.slice(0,charIndex);
if(charIndex===current.length){
deleting=true;
setTimeout(typeLoop,1400);
return;
}
}else{
charIndex--;
typedRole.textContent=current.slice(0,charIndex);
if(charIndex===0){
deleting=false;
roleIndex=(roleIndex+1)%roles.length;
}
}
setTimeout(typeLoop,deleting?40:70);
}
if(typedRole)typeLoop();

/* 9. STAT COUNTERS */
const statNumbers=document.querySelectorAll('.stat-number');
if('IntersectionObserver' in window){
const statObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
animateCounter(entry.target);
statObserver.unobserve(entry.target);
}
});
},{threshold:0.4});
statNumbers.forEach(el=>statObserver.observe(el));
}else{
statNumbers.forEach(el=>el.textContent=el.getAttribute('data-target')||0);
}
function animateCounter(el){
const target=parseInt(el.getAttribute('data-target'),10)||0;
const duration=1400;
const start=performance.now();
function step(now){
const progress=Math.min((now-start)/duration,1);
const eased=1-Math.pow(1-progress,3);
el.textContent=Math.round(eased*target);
if(progress<1)requestAnimationFrame(step);
}
requestAnimationFrame(step);
}

/* 10. SKILL BARS */
const barFills=document.querySelectorAll('.bar-fill');
if('IntersectionObserver' in window){
const barObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
const pct=entry.target.getAttribute('data-percent');
entry.target.style.width=pct+'%';
barObserver.unobserve(entry.target);
}
});
},{threshold:0.3});
barFills.forEach(el=>barObserver.observe(el));
}else{
barFills.forEach(el=>el.style.width=(el.getAttribute('data-percent')||0)+'%');
}

/* 11. TABS */
document.querySelectorAll('[data-tabs]').forEach(group=>{
const buttons=group.querySelectorAll('.tab-btn');
const panels=group.querySelectorAll('.tab-panel');
buttons.forEach(btn=>{
btn.addEventListener('click',()=>{
buttons.forEach(b=>b.classList.remove('active'));
panels.forEach(p=>p.classList.remove('active'));
btn.classList.add('active');
const target=group.querySelector('[data-panel="'+btn.dataset.tab+'"]');
if(target){
target.classList.add('active');
target.querySelectorAll('.bar-fill').forEach(fill=>{
const pct=fill.getAttribute('data-percent');
fill.style.width=pct+'%';
});
}
});
});
});

/* 12. PROJECT FILTER */
const filterButtons=document.querySelectorAll('.filter-btn');
const projectCards=document.querySelectorAll('.project-card');
filterButtons.forEach(btn=>{
btn.addEventListener('click',()=>{
filterButtons.forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const filter=btn.getAttribute('data-filter');
projectCards.forEach(card=>{
const match=filter==='all'||card.getAttribute('data-category')===filter;
card.classList.toggle('hide',!match);
});
});
});

/* 13. PROJECT MODAL */
const projectModal=document.getElementById('projectModal');
const modalTitle=document.getElementById('modalTitle');
const modalDesc=document.getElementById('modalDesc');
const modalTags=document.getElementById('modalTags');
const modalClose=document.getElementById('modalClose');
document.querySelectorAll('[data-open-modal]').forEach(btn=>{
btn.addEventListener('click',()=>{
const card=btn.closest('.project-card');
if(!card||!projectModal)return;
if(modalTitle)modalTitle.textContent=card.getAttribute('data-title')||'Project';
if(modalDesc)modalDesc.textContent=card.getAttribute('data-desc')||'';
if(modalTags){
const tags=(card.getAttribute('data-tags')||'').split(',');
modalTags.innerHTML=tags.map(t=>'<span>'+t.trim()+'</span>').join('');
}
projectModal.classList.add('open');
projectModal.setAttribute('aria-hidden','false');
});
});
function closeProjectModal(){
if(!projectModal)return;
projectModal.classList.remove('open');
projectModal.setAttribute('aria-hidden','true');
}
modalClose&&modalClose.addEventListener('click',closeProjectModal);
projectModal&&projectModal.addEventListener('click',e=>{
if(e.target===projectModal)closeProjectModal();
});

/* 14. TESTIMONIAL SLIDER */
const testiTrack=document.getElementById('testiTrack');
const testiCards=testiTrack?testiTrack.querySelectorAll('.testi-card'):[];
const testiDots=document.getElementById('testiDots');
let testiIndex=0;
if(testiCards.length){
testiCards.forEach((_,i)=>{
const dot=document.createElement('span');
if(i===0)dot.classList.add('active');
dot.addEventListener('click',()=>goToTesti(i));
if(testiDots)testiDots.appendChild(dot);
});
function goToTesti(i){
testiIndex=(i+testiCards.length)%testiCards.length;
testiTrack.style.transform='translateX(-'+(testiIndex*100)+'%)';
testiTrack.style.transition='transform 0.5s ease';
if(testiDots)[...testiDots.children].forEach((d,idx)=>d.classList.toggle('active',idx===testiIndex));
}
const testiPrev=document.getElementById('testiPrev');
const testiNext=document.getElementById('testiNext');
testiPrev&&testiPrev.addEventListener('click',()=>goToTesti(testiIndex-1));
testiNext&&testiNext.addEventListener('click',()=>goToTesti(testiIndex+1));
let autoplay=setInterval(()=>goToTesti(testiIndex+1),6000);
const slider=testiTrack.closest('.testi-slider');
if(slider){
slider.addEventListener('mouseenter',()=>clearInterval(autoplay));
slider.addEventListener('mouseleave',()=>{
autoplay=setInterval(()=>goToTesti(testiIndex+1),6000);
});
}
}

/* 15. BLOG SEARCH */
const blogSearch=document.getElementById('blogSearch');
const blogCards=document.querySelectorAll('.blog-card');
const blogEmpty=document.getElementById('blogEmpty');
blogSearch&&blogSearch.addEventListener('input',()=>{
const q=blogSearch.value.trim().toLowerCase();
let visibleCount=0;
blogCards.forEach(card=>{
const title=(card.getAttribute('data-title')||card.querySelector('h3')?.textContent||'').toLowerCase();
const match=title.includes(q);
card.classList.toggle('hide',!match);
if(match)visibleCount++;
});
if(blogEmpty)blogEmpty.hidden=visibleCount!==0;
});

/* 16. BLOG ARTICLES */
const articles={
article1:{
title:'GHEE POD — 5g Single-Serve Ghee',
date:'Aug 2026',
content:`
<img src="images/GheePod.jpg" alt="Web Development" class="article-image">
<p>My journey into web development started with a simple curiosity about how websites work.</p>
<h3>The Beginning</h3>
<p>I started learning HTML and CSS to understand how websites are structured and designed.</p>
<h3>Learning JavaScript</h3>
<p>After learning the basics, I started exploring JavaScript and discovered how websites can become interactive and dynamic.</p>
<h3>Building Projects</h3>
<p>Building real projects helped me understand concepts much better than simply watching tutorials.</p>
<h3>What I Learned</h3>
<p>The biggest lesson I learned is that consistency and practical experience are extremely important when learning programming.</p>
`
},
article2:{
title:'What I Learned From Building Projects',
date:'Aug 2026',
content:`
<img src="blog-images/projects.jpg" alt="Programming Projects" class="article-image">
<p>Working on projects has been one of the most important parts of my learning journey.</p>
<h3>Learning By Doing</h3>
<p>Projects force you to solve real problems instead of simply memorizing concepts.</p>
<h3>Problem Solving</h3>
<p>Every project brings new errors and challenges. Solving those problems gradually improves your programming skills.</p>
<h3>Improving With Every Project</h3>
<p>Each project teaches something new and helps improve the quality of the next project.</p>
`
},
article3:{
title:'Building My Portfolio Website',
date:'Aug 2026',
content:`
<img src="blog-images/portfolio.jpg" alt="Portfolio Website" class="article-image">
<p>A portfolio website is a great way for a developer to showcase their skills, projects and experience.</p>
<h3>Designing The Website</h3>
<p>I wanted the website to look modern while keeping the interface simple and easy to navigate.</p>
<h3>Using HTML, CSS and JavaScript</h3>
<p>HTML was used for the structure, CSS for the visual design and JavaScript for interactive features.</p>
<h3>The Final Result</h3>
<p>The final website brings together my projects, skills and experience in one place.</p>
`
}
};
const articleModal=document.getElementById('articleModal');
const articleModalClose=document.getElementById('articleModalClose');
const articleTitle=document.getElementById('articleTitle');
const articleDate=document.getElementById('articleDate');
const articleContent=document.getElementById('articleContent');
document.querySelectorAll('[data-open-article]').forEach(button=>{
button.addEventListener('click',()=>{
const card=button.closest('.blog-card');
if(!card)return;
const article=articles[card.dataset.article];
if(!article||!articleModal)return;
if(articleTitle)articleTitle.textContent=article.title;
if(articleDate)articleDate.textContent=article.date;
if(articleContent)articleContent.innerHTML=article.content;
articleModal.classList.add('active');
articleModal.setAttribute('aria-hidden','false');
document.body.style.overflow='hidden';
});
});
function closeArticle(){
if(!articleModal)return;
articleModal.classList.remove('active');
articleModal.setAttribute('aria-hidden','true');
document.body.style.overflow='';
}
articleModalClose&&articleModalClose.addEventListener('click',closeArticle);
articleModal&&articleModal.addEventListener('click',event=>{
if(event.target===articleModal)closeArticle();
});

/* 17. FAQ */
document.querySelectorAll('.accordion-item').forEach(item=>{
const head=item.querySelector('.accordion-head');
const body=item.querySelector('.accordion-body');
if(!head||!body)return;
head.addEventListener('click',()=>{
const isOpen=item.classList.contains('open');
item.parentElement.querySelectorAll('.accordion-item').forEach(other=>{
other.classList.remove('open');
const otherBody=other.querySelector('.accordion-body');
if(otherBody)otherBody.style.maxHeight=null;
});
if(!isOpen){
item.classList.add('open');
body.style.maxHeight=body.scrollHeight+'px';
}
});
});

/* 18. TOAST */
const toast=document.getElementById('toast');
let toastTimer;
function showToast(message,icon){
if(!toast)return;
toast.innerHTML='<i class="fa-solid '+(icon||'fa-circle-check')+'"></i><span>'+message+'</span>';
toast.classList.add('show');
clearTimeout(toastTimer);
toastTimer=setTimeout(()=>toast.classList.remove('show'),3200);
}

/* 19. CONTACT FORM */
const contactForm=document.getElementById('contactForm');
contactForm&&contactForm.addEventListener('submit',e=>{
e.preventDefault();
let valid=true;
contactForm.querySelectorAll('.form-group').forEach(group=>{
const input=group.querySelector('input, textarea');
const errorEl=group.querySelector('.form-error');
if(!input)return;
let message='';
if(!input.value.trim()){
message='This field is required.';
}else if(input.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())){
message='Enter a valid email address.';
}
group.classList.toggle('error',!!message);
if(errorEl)errorEl.textContent=message;
if(message)valid=false;
});
if(valid){
showToast('Message sent successfully.','fa-paper-plane');
contactForm.reset();
}else{
showToast('Please fix the highlighted fields.','fa-triangle-exclamation');
}
});

/* 20. NEWSLETTER */
const newsletterForm=document.getElementById('newsletterForm');
newsletterForm&&newsletterForm.addEventListener('submit',e=>{
e.preventDefault();
showToast('Subscribed. Thanks for joining!','fa-bell');
newsletterForm.reset();
});

/* 21. COPY EMAIL */
const copyEmail=document.getElementById('copyEmail');
copyEmail&&copyEmail.addEventListener('click',async()=>{
const emailElement=document.getElementById('emailText');
if(!emailElement)return;
const email=emailElement.textContent.trim();
try{
await navigator.clipboard.writeText(email);
showToast('Email copied to clipboard.','fa-copy');
}catch(e){
showToast('Could not copy email.','fa-triangle-exclamation');
}
});

/* 22. FOOTER YEAR */
const yearEl=document.getElementById('year');
if(yearEl)yearEl.textContent=new Date().getFullYear();

/* 23. SMOOTH ANCHOR SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener('click',e=>{
const id=anchor.getAttribute('href');
if(id&&id.length>1){
const target=document.querySelector(id);
if(target){
e.preventDefault();
target.scrollIntoView({behavior:'smooth',block:'start'});
}
}
});
});

/* 24. ESCAPE KEY */
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){
closeProjectModal();
closeArticle();
}
});

});
