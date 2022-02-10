import movieListMarkupHbs from '../templates/movie-list.hbs';
import getRefs from './get-refs';

const refs = getRefs();

export { appendMovieMarkup, clearMovieContainer, clearForm,fillForm};

// =======добавление разметки и отрисовка==============
function appendMovieMarkup(r) {
  refs.movieList.insertAdjacentHTML('beforeend', movieListMarkupHbs(r));
}
// ========очистка страницы===========
function clearMovieContainer() {
  refs.movieList.innerHTML = '';
}

function clearForm() {
  refs.searchBox.placeholder = '';
}
function fillForm() {
  refs.searchBox.placeholder = 'Search for movies...';
}
