import { fetchForID } from './fetchMovies';
import modalMarkupHbs from '../templates/modal.hbs';
import getRefs from './get-refs';
import { GENRES_STORAGE } from '../js/fetchMovies';
import { convertGenres } from '../index';
const refs = getRefs();
let id = null;

export { onClickInItem, onClickBackdrop };

function onClickInItem(e) {
  if (e.target.className === 'movie-img') {
    id = e.target.parentNode.id;
    onOpenModal(id);
  }
}

function onOpenModal(id) {
  window.addEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.remove('is-hidden');
  refs.bodyHtml.classList.add('body-overflow');
  modalMarkup(id);
}

function onCloseModal() {
  window.removeEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.add('is-hidden');
  refs.bodyHtml.classList.remove('body-overflow');
  refs.movieModal.innerHTML = '';
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

// =======================Рисует Модалку по ID===============================
function modalMarkup(id) {
  fetchForID(id).then(results => {
    // =======================Достаём жанры из объекта============================
    const genres = results.genres;
    console.log(results);
    const genresNames = [];
    for (const genre of genres) {
      genresNames.push(genre.name);
    }
    // =======================Рисуем=====================================
    const genresValue = genresNames.join(',');
    const markup = `<div class="modal modal--transform" data-modal >
    <button class="btn-close" type="button" data-modal-close>
        <svg class="btn-close__icon" width="30" height="30">
            <path d="M8 8L22 22" stroke="black" stroke-width="2" />
            <path d="M8 22L22 8" stroke="black" stroke-width="2" />
        </svg>
    </button>
    <div class="modal-container">
        <div class="modal-poster">    
        <picture>
      <source srcset="https://image.tmdb.org/t/p/w300_and_h450_bestv2${results.poster_path} 1x" media="(max-width: 600px)" sizes="(min-width: 480px) 480px, 100vw">
      <source srcset="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${results.poster_path} 2x" media="(min-width: 600px)" sizes="(min-width: 800px) 800px, 100vw">
      <img class="movie-img movie-img__modal" src="https://image.tmdb.org/t/p/original${results.poster_path}" alt="Original poster:${results.title}">
    </picture>
    </div>
    <div class="modal-content">
        <h2 class="modal-title">${results.title}</h2>
        <table class="modal-table">
            <tbody>
                <tr>
                    <td class="nomination">Vote/Votes</td>
                    <td class="data"><span class="raiting">${results.vote_average}</span><span class="raiting-slesh">/</span>${results.vote_count}</td>
                </tr>

                <tr>
                    <td class="nomination">Popularity</td>
                    <td class="data">${results.popularity}</td>
                </tr>

                <tr>
                    <td class="nomination">Original Title</td>
                    <td class="data">${results.original_title}</td>
                </tr>

                <tr>
                    <td class="nomination nomination-genres">Genre</td>
                        <td class="data data-genres">${genresValue}</td>
                </tr>
            </tbody>
        </table>
        <h3 class="description-title">ABOUT</h3>
        <p class="text-description">${results.overview}</p>
        <div class="btn-container"><button class="btn-watched" type="submit"><span class='btn-watched__text'>ADD TO WATCHED</span></button>
        <button class="btn-queue" type="submit"><span class='btn-queue__text'>ADD TO QUEUE</span></button></div>
    </div>
    </div>
</div>`;
    // =========================Добавляем в DOM================
    refs.movieModal.insertAdjacentHTML('beforeend', markup);
  });
}
