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
  refs.bodyHtml.classList.add('body-overflow');
  modalMarkup(id);
}

function onCloseModal() {
  window.removeEventListener('keydown', onEscKeyDown);
  refs.movieModal.classList.add('is-hidden');
  refs.bodyHtml.classList.remove('body-overflow');
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

let names = null;
// =======================Рисует Модалку по ID===============================
function modalMarkup(id) {
  fetchForID(id)
    .then()
    .then(results => {
      names = results.genres.map(genre => genre.name);
      for (const name of names) {
        console.log(name);
        refs.movieModal.insertAdjacentHTML('beforeend', modalMarkupHbs(results, name));
      }

      console.log(names);
    });
}
// =======================Рисует жанры в модалке============================
console.log(names);
