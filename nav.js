/* Responsive navigation and Skills dropdown behavior */
(() => {
  const menuButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const skillsItem = document.querySelector('.has-dropdown');
  const dropdownButton = document.querySelector('.dd-toggle');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    });
  }
  if (skillsItem && dropdownButton) {
    dropdownButton.addEventListener('click', (event) => {
      event.preventDefault();
      const open = !skillsItem.classList.contains('open');
      skillsItem.classList.toggle('open', open);
      dropdownButton.setAttribute('aria-expanded', String(open));
    });
  }
})();
