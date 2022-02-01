// import './sass/main.scss';
// import { fetchGenres, fetchMovies } from './js/fetchMovies';
// //import { fetchGenres } from './js/fetchMovies';
// import { GENRES_STORAGE } from './js/fetchMovies';
// // import countryMarkupHbs from './templates/movie.hbs';
// import movieListMarkupHbs from './templates/movie-list.hbs';

// var debounce = require('lodash.debounce');
// const DEBOUNCE_DELAY = 300;
// const refs = {
//     searchBox: document.querySelector("#search-box"),
//     movieList: document.querySelector(".movie-list"),
// }

// refs.searchBox.addEventListener("input", debounce(onSearchInput, DEBOUNCE_DELAY))

// function onSearchInput(e) {
//     if (e.target.value !== "") {
//         const movieInput = e.target.value.trim()
//         fetchMovies(movieInput)
//             .then(({ results }) => {
//                 listMarkup(results);
//                 fetchGenres();
//                 setTimeout(() => genresCheck(results.genre_ids), 300)
//             }
//             )
//     }
//     else {
//         clearArea()
//     }
// }
// function listMarkup(r) {
//     const markup = movieListMarkupHbs(r)
//     refs.movieList.innerHTML = markup
// }
// function genresCheck(ids) {
//     let genreHtml = document.querySelectorAll('.genre')
//     // console.log(genreHtml)
//     let genreData
//     let storageItem = localStorage.getItem(GENRES_STORAGE)
//     let parsedStorage = JSON.parse(storageItem)
//     // console.log(parsedStorage)
//     for (let item of genreHtml) {
//         genreData = item.dataset.genres.split(',')
//         // console.log(genreData)
//         for (let i of parsedStorage) {
//             if (genreData.includes(i.id.toString())) {
//                 item.textContent += `${i.name},`
//             }
//         }
//     }
// }

// ==========================================
// =============код с скроллом ниже==========
// ==========================================

import './sass/main.scss';
import { fetchGenres, fetchMovies, fetchPopularity } from './js/fetchMovies';
//import { fetchGenres } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
// import countryMarkupHbs from './templates/movie.hbs';
import movieListMarkupHbs from './templates/movie-list.hbs';
import modalMarkupHbs from './templates/modal.hbs';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 600;

// ====объявление глобальных переменных: текст запроса. страницы. кол страниц. ====
let QUERY = undefined;
let PAGE = 1;
let totalPages = undefined;

const refs = {
  searchBox: document.querySelector('#search-box'),
  movieList: document.querySelector('.movie-list'),
  movieModal: document.querySelector('.backdrop'),
  movieItem: document.querySelector('.movie-item'),
  closeModalBtn: document.querySelector('.btn-close'),
  sentinel: document.querySelector('#sentinel'),
};

// ===================Ищет популярные=====================

refs.searchBox.addEventListener('input', debounce(onSearchInputs, DEBOUNCE_DELAY));

fetchMarkupPopularityForWeek();

function fetchMarkupPopularityForWeek() {
  fetchPopularity()
    .then(processGenres)
    .then(({ results, total_pages }) => {
      totalPages = total_pages;
      // ==очистка перед отрисовкой=====
      clearMovieContainer();
      appendMovieMarkup(results);
    });
}

// ==============================Открывает-Закрывает Модалку==========================
refs.movieList.addEventListener('click', onClickInItem);
refs.movieModal.addEventListener('click', onClickBackdrop);

function onClickInItem(e) {
  if (e.target.className === 'movie-img') {
    onOpenModal();
  }
}

function onOpenModal() {
  window.addEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.remove('is-hidden');
  modalMarkup();
}

function onCloseModal() {
  window.removeEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.add('is-hidden');
}

function onClickBackdrop(e) {
  if (
    e.target === e.currentTarget ||
    e.target.nodeName === 'path' ||
    e.target.nodeName === 'svg' ||
    e.target.className === 'btn-close'
  ) {
    onCloseModal();
  }
}

function onEscKeyDown(e) {
  if (e.code === 'Escape') {
    onCloseModal();
  }
}
// =======================Рисует Модалку===============================
function modalMarkup() {
  const modalMarkup = modalMarkupHbs();
  refs.movieModal.insertAdjacentHTML('beforeend', modalMarkup);
}
// =====================================================================
refs.searchBox.addEventListener('input', debounce(onSearchInputs, DEBOUNCE_DELAY));

// =======первоначальный разовый запрос жанров и сохранение ==========

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
        // ==очистка перед отрисовкой=====
        clearMovieContainer();
        appendMovieMarkup(results);
      });
  } else {
    QUERY = undefined;
    fetchMarkupPopularityForWeek();
  }
}

// =======добавление разметки и отрисовка==============
function appendMovieMarkup(r) {
  refs.movieList.insertAdjacentHTML('beforeend', movieListMarkupHbs(r));
}
// ========очистка страницы===========
function clearMovieContainer() {
  refs.movieList.innerHTML = '';
}
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
  // console.log(response)
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

// =======дозагрузка бесконечным скроллом=================
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && QUERY !== undefined) {
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
    }
  });
};

// ========наблюдатель скролла============
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);
