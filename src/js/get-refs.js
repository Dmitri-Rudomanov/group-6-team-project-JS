export default function getRefs() {
  return {
    searchForm: document.querySelector('.search-form'),
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
    bodyHtml: document.querySelector('body'),
    genresInModal: document.querySelector('.data-genres'),
    errorMessage: document.querySelector('.error-message'),
  };
}
