import './sass/main.scss';
import { fetchGenres, fetchMovies, fetchPopularity } from './js/fetchMovies';
//import { fetchGenres } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
// import countryMarkupHbs from './templates/movie.hbs';
import movieListMarkupHbs from './templates/movie-list.hbs';
import modalMarkupHbs from './templates/modal.hbs';

import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  movieList: document.querySelector('.movie-list'),
  movieModal: document.querySelector('.backdrop'),
  movieItem: document.querySelector('.movie-item'),
  closeModalBtn: document.querySelector('.btn-close'),
};

console.log(refs.movieList);

refs.searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

fetchMarkupPopularityForDay();

function fetchMarkupPopularityForDay() {
  fetchPopularity().then(({ results }) => {
    listMarkup(results);
    fetchGenres();
    setTimeout(() => genresCheck(results.genre_ids), 300);
  });
}
refs.movieList.addEventListener('click', toggleModal);
refs.closeModalBtn.addEventListener('click', toggleModal);

function toggleModal() {
  console.log('click');
  console.log(modalMarkup());

  refs.movieModal.classList.toggle('is-hidden');
}

function onSearchInput(e) {
  if (e.target.value !== '') {
    const movieInput = e.target.value.trim();
    fetchMovies(movieInput).then(({ results }) => {
      listMarkup(results);
      fetchGenres();
      setTimeout(() => genresCheck(results.genre_ids), 300);
    });
  } else {
    clearArea();
  }
}
console.log(refs.movieItem);
function listMarkup(r) {
  const markup = movieListMarkupHbs(r);
  refs.movieList.innerHTML = markup;
}

function modalMarkup() {
  const modalMarkup = modalMarkupHbs();
  refs.movieModal.insertAdjacentHTML('beforeend', modalMarkup);
}

function genresCheck(ids) {
  let genreHtml = document.querySelectorAll('.genre');
  console.log(genreHtml);
  let genreData;
  let storageItem = localStorage.getItem(GENRES_STORAGE);
  let parsedStorage = JSON.parse(storageItem);
  console.log(parsedStorage);
  for (let item of genreHtml) {
    genreData = item.dataset.genres.split(',');
    console.log(genreData);
    for (let i of parsedStorage) {
      if (genreData.includes(i.id.toString())) {
        item.textContent += `${i.name},`;
      }
    }
  }
}
