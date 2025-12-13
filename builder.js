/* SLIDER AUTO */
let slides = document.querySelectorAll('.slide');
let i = 0;

setInterval(() => {
  slides[i].classList.remove('active');
  i = (i + 1) % slides.length;
  slides[i].classList.add('active');
}, 5000);

/* slider auto – home page only */
let slides=document.querySelectorAll('.slide');
let i=0;
if(slides.length){
  setInterval(()=>{
    slides[i].classList.remove('active');
    i=(i+1)%slides.length;
    slides[i].classList.add('active');
  },5000);
}