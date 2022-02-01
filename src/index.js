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
import getRefs from './js/get-refs';
import { onHomePageLoading, onLibraryPageLoading } from './js/site-load';
import { onClickInItem, onClickBackdrop } from './js/modal';
import { appendMovieMarkup, clearMovieContainer } from './js/add-remove-markup';

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

// ==============================Открывает-Закрывает Модалку==========================
refs.movieList.addEventListener('click', onClickInItem);
refs.movieModal.addEventListener('click', onClickBackdrop);

fetchMarkupPopularityForWeek();

// function fetchMarkupPopularityForWeek() {
//   fetchPopularity()
//             .then(processGenres)
//             .then(({ results, total_pages }) => {
//                 totalPages = total_pages;
//                 // ==очистка перед отрисовкой=====
//                 clearMovieContainer();
//                 appendMovieMarkup(results);
//             }
//             );
// }

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
    if (entry.isIntersecting) {
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
