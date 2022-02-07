// FT-14 По нажатию на кнопку "Watched" показываются просмотренные фильмы пользователя.
//  Данные о просмотренных фильмах берутся из local - storage(watched - storage ?)

// FT-15 По нажатию на кнопку "Queue" показываются фильмы добавленные в очередь пользователя.
//  Данные о добавленных фильмах берутся из local - storage(queue - storage ?)

// TODO <<Это касается модалки>>
//  Перерендевать библиотеку, когда нажали на delete и удалять фильм из "Watched" или "Queue",
//  а также удалять элемент массива из watched - storage и queue - storage

import movieListMarkupHbs from './templates/movie-list.hbs';
import movieListMarkupHbs from './templates/librery.hbs';

const refs = {
  watchedList: document.querySelector('#watched'),
  queueList: document.querySelector('#queue'),
};

refs.watchedList.addEventListener('submit', listWatchedMarkup());
refs.queueList.addEventListener('submit', listQueueMarkup());

function listWatchedMarkup(params) {
  refs.watchedList.insertAdjacentHTML('beforeend', movieListMarkupHbs(params));
}

function listQueueMarkup(params) {
  refs.watchedList.insertAdjacentHTML('beforeend', movieListMarkupHbs(params));
}
