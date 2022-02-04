import './sass/main.scss';
import { fetchGenres, fetchMovies, fetchPopularity } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
import movieListMarkupHbs from './templates/movie-list.hbs';
import modalMarkupHbs from './templates/modal.hbs';
import getRefs from './js/get-refs';
import { onHomePageLoading, onLibraryPageLoading } from './js/site-load';
import { onClickInItem, onClickBackdrop } from './js/modal';
import { appendMovieMarkup, clearMovieContainer, clearForm } from './js/add-remove-markup';

export { fetchMarkupPopularityForWeek };

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 600;

// ====объявление глобальных переменных: текст запроса. страницы. кол страниц. ref'ов ====
let QUERY = undefined;
let PAGE = 1;
let totalPages = undefined;
const refs = getRefs();

refs.sitePage.classList.add('js-page-header__home');
refs.homePageBtn.classList.add('js-navigation__button--current');
refs.libPageBtnNav.classList.add('js-visually-hidden');
refs.libBtnWatched.classList.add('js-library__button--current');

refs.searchBox.addEventListener('input', debounce(onSearchInputs, DEBOUNCE_DELAY));
refs.siteLogo.addEventListener('click', onHomePageLoading);
refs.homePageBtn.addEventListener('click', onHomePageLoading);
refs.libPageBtn.addEventListener('click', onLibraryPageLoading);
refs.searchBox.addEventListener('focus', clearForm);

//===== Отмена обновления страницы при клике на Enter ====
refs.searchBox.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});

// ==============================Открывает-Закрывает Модалку==========================
refs.movieList.addEventListener('click', onClickInItem);
refs.movieModal.addEventListener('click', onClickBackdrop);

// =======первоначальный разовый запрос жанров и сохранение ==========
fetchGenres();
//==== Загрузка и отрисовка популярных фильмов ====
fetchMarkupPopularityForWeek();

// ===================Ищет популярные=====================
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
