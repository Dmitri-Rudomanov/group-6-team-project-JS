import { fetchForID } from './fetchMovies';
import modalMarkupHbs from '../templates/modal.hbs';
import getRefs from './get-refs';
const refs = getRefs();
let id = null;

export { onClickInItem, onClickBackdrop };

function onClickInItem(e) {
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
    refs.movieModal.insertAdjacentHTML('beforeend', modalMarkupHbs(results));
  });
}

// =======================Рисует жанры в модалке============================
