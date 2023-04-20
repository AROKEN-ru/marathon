const btn = document.querySelector('[data-burger="btn"]')
const menu = document.querySelector('[data-burger="menu"]')
const linksParent = document.querySelector('.header__menu')
const body = document.body

const burgerOpen = () => {
  btn.classList.toggle('burger--active')
  menu.classList.toggle('header__menu--active')
  body.classList.toggle('body--fixed')
}

const burgerClose = () => {
  btn.classList.remove('burger--active')
  menu.classList.remove('header__menu--active')
  body.classList.remove('body--fixed')
}


linksParent.addEventListener('click', event => {
  if (event.target && event.target.tagName === 'A') {
    burgerClose()
  }
})
btn.addEventListener('click', burgerOpen)
