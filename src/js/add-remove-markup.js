import movieListMarkupHbs from '../templates/movie-list.hbs';
import getRefs from './get-refs';

const refs = getRefs();

export { appendMovieMarkup, clearMovieContainer };

// =======добавление разметки и отрисовка==============
function appendMovieMarkup(r) {
  refs.movieList.insertAdjacentHTML('beforeend', movieListMarkupHbs(r));
}
// ========очистка страницы===========
function clearMovieContainer() {
  refs.movieList.innerHTML = '';
}
