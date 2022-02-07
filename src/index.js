// =============код с скроллом ниже==========
// ==========================================

import './sass/main.scss';
import { fetchGenres, fetchMovies, fetchPopularity, fetchLibrery } from './js/fetchMovies';
//import { fetchGenres } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
import movieListMarkupHbs from './templates/movie-list.hbs';
import modalMarkupHbs from './templates/modal.hbs';
// import modalMarkupHbsDelete from '../templates/modalBtnDelete.hbs';
import getRefs from './js/get-refs';

import { onClickInItem, onClickBackdrop, onOpenModal } from './js/modal';
import {
  onHomePageLoading,
  onLibraryPageLoading,
  onQueuePageLoading,
  onWatchedPageLoading,
} from './js/site-load';
import {
  appendMovieMarkup,
  clearMovieContainer,
  clearForm,
  fillForm,
} from './js/add-remove-markup';

export { fetchMarkupPopularityForWeek, addQueueFilm, addWatchedFilm };
export { QUEUE_FILMS_LIST, WATCHED_FILMS_LIST };
var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 600;

// ====объявление глобальных переменных: текст запроса. страницы. кол страниц. ref'ов ====
let QUERY = undefined;
let PAGE = 1;
let totalPages = undefined;
const refs = getRefs();

// ===================Ищет популярные=====================

refs.sitePage.classList.add('js-page-header__home');
refs.homePageBtn.classList.add('js-navigation__button--current');
refs.libPageBtnNav.classList.add('js-visually-hidden');
refs.libBtnWatched.classList.add('js-library__button--current');

refs.searchBox.addEventListener('input', debounce(onSearchInputs, DEBOUNCE_DELAY));
refs.siteLogo.addEventListener('click', onHomePageLoading);
refs.homePageBtn.addEventListener('click', onHomePageLoading);
refs.libPageBtn.addEventListener('click', onLibraryPageLoading);
refs.libBtnQueue.addEventListener('click', onQueuePageLoading);
refs.libBtnWatched.addEventListener('click', onWatchedPageLoading);
refs.searchBox.addEventListener('focus', clearForm);
refs.searchBox.addEventListener('blur', fillForm);

//===== Отмена обновления страницы при клике на Enter ====
refs.searchBox.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});

// ==============================Открывает-Закрывает Модалку==========================

// ======================Открывает-Закрывает Модалку========

refs.movieList.addEventListener('click', onClickInItem);
refs.movieModal.addEventListener('click', onClickBackdrop);
// ==============перезагрузка при переходе на главную страницу====================
const resetHomePage = document.getElementById('home');
resetHomePage.addEventListener('click', resetPageHome);
function resetPageHome() {
  location.reload();
}

//==== Загрузка и отрисовка популярных фильмов ====

// ===================Ищет популярные=====================

refs.siteLogo.addEventListener('click', onLogoClick);
function onLogoClick() {
  fetchMarkupPopularityForWeek();
}
// =====================================
fetchMarkupPopularityForWeek();

function fetchMarkupPopularityForWeek() {
  PAGE = 1;
  fetchPopularity(PAGE)
    .then(processGenres)
    .then(({ results, total_pages }) => {
      totalPages = total_pages;
      clearMovieContainer();
      appendMovieMarkup(results);
    });
}

// =======первоначальный разовый запрос жанров и сохранение ======
fetchGenres();

// ========первая загрузка по кнопке========
function onSearchInputs(e) {
  if (e.target.value !== '') {
    QUERY = e.target.value.trim();
    PAGE = 1;
    fetchMovies(QUERY, PAGE)
      .then(processGenres)
      .then(({ results, total_pages }) => {
        totalPages = total_pages;
        //====обработка некорректного запроса====
        if (results.length === 0) {
          refs.errorMessage.classList.remove('js-visually-hidden');
          return;
        }
        refs.errorMessage.classList.add('js-visually-hidden');
        // ==очистка перед отрисовкой=====
        clearMovieContainer();
        appendMovieMarkup(results);
      });
  } else {
    QUERY = undefined;
    refs.errorMessage.classList.add('js-visually-hidden');
    fetchMarkupPopularityForWeek();
  }
}

// =====всплывающий клик на добавление фильмов==============
refs.movieModal.addEventListener('mousedown', function (e) {
  let classes = e.target.className;
  if ((classes = '.btn-watched')) {
    let liClick = document.getElementsByTagName('button');
    for (var i = 0; i < liClick.length; i++) {
      if (liClick[i].matches('.btn-watched')) {
        liClick[i].addEventListener('click', addWatchedFilm);
      }
    }
  }
  if ((classes = '.btn-queue')) {
    // let classes = e.target.className;
    let liClick2 = document.getElementsByTagName('button');
    for (var i = 0; i < liClick2.length; i++) {
      if (liClick2[i].matches('.btn-queue')) {
        liClick2[i].addEventListener('click', addQueueFilm);
      }
    }
  }
});
// =====всплывающий клик на удаление фильмов==============
refs.movieModal.addEventListener('mousedown', function (e) {
  let classes = e.target.className;
  if ((classes = '.btn-watched_close')) {
    let liClick = document.getElementsByTagName('button');
    for (var i = 0; i < liClick.length; i++) {
      if (liClick[i].matches('.btn-watched_close')) {
        liClick[i].addEventListener('click', removeWatchedFilm);
      }
    }
  }
  if ((classes = '.btn-queue_close')) {
    let liClick2 = document.getElementsByTagName('button');
    for (var i = 0; i < liClick2.length; i++) {
      if (liClick2[i].matches('.btn-queue_close')) {
        liClick2[i].addEventListener('click', removeQueueFilm);
      }
    }
  }
});
// ===========клик на запросы для добавления в библиотеки=============
refs.libBtnWatched.addEventListener('click', watchedMyLibrery);
refs.libBtnQueue.addEventListener('click', queueMyLibrery);
// =======================LocalStorage===============================
let WATCHED_FILMS_LIST = [];
let QUEUE_FILMS_LIST = [];

readWatchedListFromLocalStorage();
readQueueListFromLocalStorage();
// ==========функции на добавление===================
function addWatchedFilm(e) {
  const filmID = this.value;
  WATCHED_FILMS_LIST.push(filmID);
  WATCHED_FILMS_LIST = Array.from(new Set(WATCHED_FILMS_LIST));
  saveWatchedListToLocalStorage(WATCHED_FILMS_LIST);
  if (WATCHED_FILMS_LIST.includes(filmID)) {
    e.target.textContent = 'DELETE FROM WATCHED';
    e.target.className = 'btn-watched_close';
  } else {
    e.target.textContent = 'ADD TO WATCHED';
    e.target.className = 'btn-watched';
  }
}
function addQueueFilm(e) {
  const filmID = this.value;
  QUEUE_FILMS_LIST.push(filmID);
  QUEUE_FILMS_LIST = Array.from(new Set(QUEUE_FILMS_LIST));
  saveFilmQueueToLocalStorage(QUEUE_FILMS_LIST);
  if (QUEUE_FILMS_LIST.includes(filmID)) {
    e.target.textContent = 'DELETE FROM QUEUE';
    e.target.className = 'btn-queue_close';
  } else {
    e.target.textContent = 'ADD TO QUEUE';
    e.target.className = 'btn-queue';
  }
}
// =======функции на удаление================
function removeWatchedFilm(e) {
  const filmID = this.value;
  if (WATCHED_FILMS_LIST.includes(filmID)) {
    const filmIndex = WATCHED_FILMS_LIST.indexOf(filmID);
    WATCHED_FILMS_LIST.splice(filmIndex, 1);
  }
  saveWatchedListToLocalStorage(WATCHED_FILMS_LIST);
  if (!WATCHED_FILMS_LIST.includes(filmID)) {
    e.target.textContent = 'ADD TO WATCHED';
    e.target.className = 'btn-watched';
  } else {
    e.target.textContent = 'DELETE FROM WATCHED';
    e.target.className = 'btn-watched_close';
  }
  // =========перезагрузка после удаления===========
  watchedMyLibrery();
}
function removeQueueFilm(e) {
  const filmID = this.value;
  if (QUEUE_FILMS_LIST.includes(filmID)) {
    const filmIndex = QUEUE_FILMS_LIST.indexOf(filmID);
    QUEUE_FILMS_LIST.splice(filmIndex, 1);
  }
  saveFilmQueueToLocalStorage(QUEUE_FILMS_LIST);
  if (!QUEUE_FILMS_LIST.includes(filmID)) {
    e.target.textContent = 'ADD TO QUEUE';
    e.target.className = 'btn-queue';
  } else {
    e.target.textContent = 'DELETE FROM QUEUE';
    e.target.className = 'btn-queue_close';
  }
  // =========перезагрузка после удаления========
  queueMyLibrery();
}
// ===============LocalStorage=================
function saveWatchedListToLocalStorage(watchedFilmsList) {
  localStorage.setItem('watchedFilms-id', JSON.stringify(watchedFilmsList));
}

function saveFilmQueueToLocalStorage(queueFilmsList) {
  localStorage.setItem('queueFilms-id', JSON.stringify(queueFilmsList));
}

function readWatchedListFromLocalStorage() {
  WATCHED_FILMS_LIST = JSON.parse(localStorage.getItem('watchedFilms-id') || '[]');
}

function readQueueListFromLocalStorage() {
  QUEUE_FILMS_LIST = JSON.parse(localStorage.getItem('queueFilms-id') || '[]');
}

// ===============запросы на сервер для библиотек=========================
function watchedMyLibrery() {
  let watchedlifeLibrery = [];
  clearMovieContainer();
  for (let i = 0; i < WATCHED_FILMS_LIST.length; i++) {
    let ID = WATCHED_FILMS_LIST[i];
    fetchLibrery(ID).then(results => {
      watchedlifeLibrery.push(results);
      // console.log(results)
      // console.log(watchedlifeLibrery)
      appendMovieMarkup([results]);
    });
  }
}
export { watchedMyLibrery };

function queueMyLibrery() {
  let queuelifeLibrery = [];
  clearMovieContainer();
  for (let i = 0; i < QUEUE_FILMS_LIST.length; i++) {
    let ID = QUEUE_FILMS_LIST[i];
    // console.log('queueClikLifeFilms[i]-', ID)
    fetchLibrery(ID).then(results => {
      queuelifeLibrery.push(results);
      appendMovieMarkup([results]);
    });
  }
}

export { queueMyLibrery };

// ===========обработка строки жанров===============
function processGenres(response) {
  for (let i = 0; i < response.results.length; i++) {
    // =======вызывается функция convertGenres которая ниже и присваивается ее результат=======
    let readableGenres = convertGenres(response.results[i].genre_ids);
    // console.log(readableGenres)
    if (readableGenres.length > 3) {
      readableGenres = readableGenres.slice(0, 2);
      readableGenres.push('...Other');
    }
    response.results[i].genres = readableGenres.join(', ');
  }
  // console.log(response);
  // =======из response используется genres при отрисовке=========
  return response;
}
// ======присвоить название жанров по id========
function convertGenres(genre_ids) {
  let resultGenre = [];
  let storageItem = localStorage.getItem(GENRES_STORAGE);
  let genreMapping = JSON.parse(storageItem);
  for (let i = 0; i < genre_ids.length; i++) {
    for (let k = 0; k < genreMapping.length; k++) {
      if (genre_ids[i] === genreMapping[k].id) {
        resultGenre.push(genreMapping[k].name);
        break;
      }
    }
  }
  // console.log(resultGenre);
  return resultGenre;
}
// ======================слежения какая вкладка открыта для подключения скролла=================================
const HOME_PAGE = 'HOME';
const LIBRARY_PAGE = 'LIBRARY';

let currentPage = HOME_PAGE;
const navigationButtons = document.querySelectorAll('.navigation__button');

navigationButtons.forEach(function (button) {
  button.addEventListener('click', onNavigationButtonCLICK);
});

function onNavigationButtonCLICK(e) {
  const button = e.target;
  if (button.id === 'home') {
    currentPage = HOME_PAGE;
  } else if (button.id === 'library') {
    currentPage = LIBRARY_PAGE;
  }
}

// =======дозагрузка бесконечным скроллом=================
const onEntry = entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      // =====остановка дозагрузки если это библиотеки=====
      return;
    }
    if (currentPage !== HOME_PAGE) {
      return;
    }

    if (QUERY !== undefined) {
      // console.log('Пора грузить еще');
      // ======следующая страница=========
      PAGE += 1;
      // ======последняя страница=========
      if (PAGE > totalPages) {
        // console.log('pages out');
        return;
      }
      fetchMovies(QUERY, PAGE)
        .then(processGenres)
        .then(({ results }) => {
          appendMovieMarkup(results);
        });
    } else {
      // console.log('Пора грузить еще');
      PAGE += 1;
      if (PAGE > totalPages) {
        return;
      }
      fetchPopularity(PAGE)
        .then(processGenres)
        .then(({ results }) => {
          appendMovieMarkup(results);
        });
    }
  });
};
// ========наблюдатель скролла============
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);

// =================ADD-DELETE Modal Button==============

// function onTextContenInBtnModalQueue(e) {
//   if (QUEUE_FILMS_LIST.includes(filmID) && onOpenModal) {
//     e.target.textContent = 'DELETE FROM QUEUE';
//   } else {
//     e.target.textContent = 'ADD TO QUEUE';
//   }
// }

// function onTextContenInBtnModalWatched(e) {
//   if (WATCHED_FILMS_LIST.includes(filmID) && onOpenModal) {
//     e.target.textContent = 'DELETE FROM WATCHED';
//   } else {
//     e.target.textContent = 'ADD TO WATCHED';
//   }
// }
// =========сохранение в localStorage отложенных :фильмы смотреть и фильмы в очередь=============
// =======фильмы смотреть:let arr_1watchedFilms, фильмы в очередь: let arr_2queueFilms=====

// let watchClikLifeFilms = [];
// console.log('watchClikLifeFilms-', watchClikLifeFilms)
// let queueClikLifeFilms = [];
// // console.log('queueClikLifeFilms-', queueClikLifeFilms)

// // ==фильмы смотреть================
// watchClikLifeFilms.push(JSON.parse(localStorage.getItem('watchedFilms-id')));
// let watchLife = watchClikLifeFilms.flat(Infinity);
// if (watchLife[0] === null) {
//   watchLife = watchLife.slice(1);
// }
// let arr_1watchedFilms = Array.from(new Set(watchLife));
// localStorage.setItem('watchedFilms-id', JSON.stringify(arr_1watchedFilms));
// console.log('arr_1watchedFilms-смотреть', arr_1watchedFilms);

// // ==фильмы в очередь===============
// queueClikLifeFilms.push(JSON.parse(localStorage.getItem('queueFilms-id')));
// let queueLife = queueClikLifeFilms.flat(Infinity);
// if (queueLife[0] === null) {
//   queueLife = queueLife.slice(1);
// }
// let arr_2queueFilms = Array.from(new Set(queueLife));
// localStorage.setItem('queueFilms-id', JSON.stringify(arr_2queueFilms));
// // console.log('arr_2queueFilms-в очередь', arr_2queueFilms);

// function myFunctionClickWatched() {
//   // ====выбираю фильмы по id смотреть======
//   watchClikLifeFilms.push(this.value)
//   console.log(this.value)
//   localStorage.setItem('watchedFilms-id', JSON.stringify(watchClikLifeFilms));
// }

// function myFunctionClickQueue() {
//   // ====выбираю фильмы по id в очередь======
//   queueClikLifeFilms.push(this.value)
//   localStorage.setItem('queueFilms-id', JSON.stringify(queueClikLifeFilms));
// }

// // =================================================

// // ====================watchedlifeLibrery======================
// function watchedMyLibrery(id) {
//   console.log('watchClikLifeFilms-', watchClikLifeFilms)
//   let watchedlifeLibrery = []
//   for (let i = 0; i < watchClikLifeFilms.length; i++) {
//     let ID = watchClikLifeFilms[i];
//     console.log('watchClikLifeFilms[i]-', ID)
//     for (let k = 0; k < ID.length; k++) {
//       fetchLibrery(ID[k])
//         .then(results => {
//           watchedlifeLibrery.push(results);
//           clearMovieContainer();
//           appendMovieMarkup(watchedlifeLibrery);
//         })
//     }
//   }
//   console.log('watchedlifeLibrery-', watchedlifeLibrery)
// }

// // ====================queuelifeLibrery======================
// function queueMyLibrery(id) {
//   let queuelifeLibrery = []
//   for (let i = 0; i < queueClikLifeFilms.length; i++) {
//     let ID = queueClikLifeFilms[i];
//     // console.log('queueClikLifeFilms[i]-', ID)
//     for (let k = 0; k < ID.length; k++) {
//       fetchLibrery(ID[k])
//         .then(results => {
//           queuelifeLibrery.push(results);
//           clearMovieContainer();
//           appendMovieMarkup(queuelifeLibrery);
//         });
//     }
//   }
//   // console.log('queuelifeLibrery-', queuelifeLibrery)
// }

// =================================================

const btnScrollToTop = document.getElementById('btnScrollToTop');

btnScrollToTop.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});
window.addEventListener('scroll', e => {
  const currentValue = window.scrollY;
  const value = document.documentElement.clientHeight;

  if (currentValue > value) {
    btnScrollToTop.classList.remove('is-hidden');
  } else {
    btnScrollToTop.classList.add('is-hidden');
  }
});
