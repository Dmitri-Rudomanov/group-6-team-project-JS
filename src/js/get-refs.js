export default function getRefs() {
  return {
    searchBox: document.querySelector('#search-box'),
    movieList: document.querySelector('.movie-list'),
    movieModal: document.querySelector('.backdrop'),
    movieItem: document.querySelector('.movie-item__vote-average'),
    closeModalBtn: document.querySelector('.btn-close'),
    sentinel: document.querySelector('#sentinel'),
    siteLogo: document.querySelector('.header-logo'),
    sitePage: document.querySelector('.page-header'),
    homePageBtn: document.querySelector('#home'),
    libPageBtn: document.querySelector('#library'),
    homePageForm: document.querySelector('.search-form'),
    libPageBtnNav: document.querySelector('.lib-nav'),
    libBtnWatched: document.querySelector('#watched'),
    libBtnQueue: document.querySelector('#queue'),
    // =================кнопки на добавление и удаление через классы index.js page-117=========
    libAddWatched: document.querySelector('.btn-watched'),
    libAddQueue: document.querySelector('.btn-queue'),
    libCloseWatched: document.querySelector('.btn-watched_close'),
    libCloseQueue: document.querySelector('.btn-queue_close'),
  };
}
