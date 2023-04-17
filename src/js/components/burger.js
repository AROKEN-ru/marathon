const btn = document.querySelector('[data-burger="btn"]')
const menu = document.querySelector('[data-burger="menu"]')
const linksParent = document.querySelector('.header__menu')
const body = document.body

const burgerOpen = () => {
  btn.classList.toggle('burger--active')
  menu.classList.toggle('header__menu--active')
}

const burgerClose = () => {
  btn.classList.remove('burger--active')
  menu.classList.remove('header__menu--active')
}


linksParent.addEventListener('click', event => {
  if (event.target && event.target.tagName === 'A') {
    console.log(1)
    burgerClose()
  }
})
btn.addEventListener('click', burgerOpen)
