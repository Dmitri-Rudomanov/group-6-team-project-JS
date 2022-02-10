import { fetchForID } from './fetchMovies';
import modalMarkupHbs from '../templates/modal.hbs';
import del from '../templates/del.hbs';
import delqueue from '../templates/delqueue.hbs';
import allbtn from '../templates/allbtn.hbs';
import getRefs from './get-refs';
import { QUEUE_FILMS_LIST, WATCHED_FILMS_LIST, DATA_MOVIES_STORAGE } from '../index';
import searchElement from '../components/search-movie';

export { onClickInItem, onClickBackdrop, onOpenModal, currentId };

const refs = getRefs();
let currentId = null;

function onClickInItem(e) {
  if (
    e.target.className === 'movie-img' ||
    e.target.nodeName === 'P' ||
    e.target.nodeName === 'SPAN' ||
    e.target.className === 'movie-link__content' ||
    e.target.className === 'movie-item__genre'
  ) {
    currentId = e.target.parentElement.id;

    // console.log(`id выбранного фильма >>`, currentId);
    onOpenModal(currentId);
  }
}

function onOpenModal(currentId) {
  window.addEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.remove('is-hidden');
  refs.bodyHtml.classList.add('body-overflow');

  // console.log(`выбранный фильм >>`, searchElement(currentId, DATA_MOVIES_STORAGE));

  modalMarkup(currentId, searchElement(currentId, DATA_MOVIES_STORAGE));
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

    if (results.poster_path === null) {
      results.poster_path = '/5QFzdUGc5lBn0VaS4RgfkNqjZEp.jpg'
    }
    if (!QUEUE_FILMS_LIST.includes(id) && WATCHED_FILMS_LIST.includes(id)) {
      refs.movieModal.insertAdjacentHTML('beforeend', del(results));
    } else if (!WATCHED_FILMS_LIST.includes(id) && QUEUE_FILMS_LIST.includes(id)) {
      refs.movieModal.insertAdjacentHTML('beforeend', delqueue(results));
    } else if (QUEUE_FILMS_LIST.includes(id) && WATCHED_FILMS_LIST.includes(id)) {
      refs.movieModal.insertAdjacentHTML('beforeend', allbtn(results));
    } else {
      refs.movieModal.insertAdjacentHTML('beforeend', modalMarkupHbs(results));
    }
  });
}
