import Swiper, {Navigation} from 'swiper'

const programs = new Swiper('.programs__slider', {
  modules: [Navigation],
  slidesPerView: 1,
  navigation: {
    nextEl: '.programs__btn-next',
    prevEl: '.programs__btn-prev',
  },
  breakpoints: {
    1025: {
      slidesPerView: 3,
    },
    577: {
      slidesPerView: 2,
    }
  }
})
