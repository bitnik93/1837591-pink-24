var navMain = document.querySelector('.main-nav');
navMain.classList.remove('main-nav--no-js');
var navToggle = document.querySelector('.main-nav__toggle');


navToggle.addEventListener('click', () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.remove('main-nav--opened');
    navMain.classList.add('main-nav--closed');
  }
});
