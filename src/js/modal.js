import { fetchForID } from './fetchMovies';
import modalMarkupHbs from '../templates/modal.hbs';
import getRefs from './get-refs';
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
  modalMarkup(id);
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
function modalMarkup(id) {
  fetchForID(id)
    .then()
    .then(results => {
      refs.movieModal.insertAdjacentHTML('beforeend', modalMarkupHbs(results));
    });
}
