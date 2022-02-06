import { fetchForID } from './fetchMovies';
import modalMarkupHbs from '../templates/modal.hbs';
import del from '../templates/del.hbs';
import delqueue from '../templates/delqueue.hbs';
import allbtn from '../templates/allbtn.hbs';
import getRefs from './get-refs';
import { QUEUE_FILMS_LIST, WATCHED_FILMS_LIST, addQueueFilm, addWatchedFilm } from '../index';
const refs = getRefs();
let id = null;

export { onClickInItem, onClickBackdrop, onOpenModal };

function onClickInItem(e) {
  // console.log(QUEUE_FILMS_LIST);
  // console.log(WATCHED_FILMS_LIST);
  // let watchedset = document.querySelector('#qwer');
  // console.log(e);

  if (
    e.target.className === 'movie-img' ||
    e.target.nodeName === 'P' ||
    e.target.nodeName === 'SPAN' ||
    e.target.className === 'movie-link__content' ||
    e.target.className === 'movie-item__genre'
  ) {
    id = e.target.parentElement.id;
    onOpenModal(id);
  }
}

// console.log(id);

function onOpenModal(id) {
  window.addEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.remove('is-hidden');
  refs.bodyHtml.classList.add('body-overflow');
  // if (WATCHED_FILMS_LIST.includes(id)) {
  //   console.log('DELETE FROM WATCHED');
  // }
  modalMarkup(id);
  // refs.movieModal.addEventListener('click', () => {
  //   console.log('Parent click handler');
  // });
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
    console.log(WATCHED_FILMS_LIST);
    console.log(QUEUE_FILMS_LIST);
    console.log(id);
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

// =======================Рисует жанры в модалке============================
