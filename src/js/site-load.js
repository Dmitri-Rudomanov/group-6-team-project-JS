import getRefs from './get-refs';
import { fetchMarkupPopularityForWeek } from '../index';
import { clearMovieContainer } from './add-remove-markup';
import { watchedMyLibrery, queueMyLibrery } from '../index';

const refs = getRefs();

//=====подключение стилей при навигации по страницам=====
function onHomePageLoading() {
  fetchMarkupPopularityForWeek();
  refs.sitePage.classList.replace('js-page-header__library', 'js-page-header__home');
  refs.libPageBtn.classList.remove('js-navigation__button--current');
  refs.homePageBtn.classList.add('js-navigation__button--current');
  refs.homePageForm.classList.remove('js-visually-hidden');
  refs.libPageBtnNav.classList.add('js-visually-hidden');

  // ==========index-js-199==================
  clearMovieContainer();
  refs.searchBox.placeholder = 'Search for movies...';
}

function onLibraryPageLoading() {
  refs.searchForm.reset();
  refs.sitePage.classList.replace('js-page-header__home', 'js-page-header__library');
  refs.homePageBtn.classList.remove('js-navigation__button--current');
  refs.libPageBtn.classList.add('js-navigation__button--current');
  refs.libPageBtnNav.classList.remove('js-visually-hidden');
  refs.homePageForm.classList.add('js-visually-hidden');
  refs.errorMessage.classList.add('js-visually-hidden');
  onWatchedPageLoading()
  watchedMyLibrery();
}

function onWatchedPageLoading() {
  refs.libBtnQueue.classList.remove('js-library__button--current');
  refs.libBtnWatched.classList.add('js-library__button--current');
}
function onQueuePageLoading() {
  refs.libBtnQueue.classList.add('js-library__button--current')
  refs.libBtnWatched.classList.remove('js-library__button--current')
  refs.errorMessage.classList.add('js-visually-hidden');
}

export { onHomePageLoading, onLibraryPageLoading, onQueuePageLoading, onWatchedPageLoading };
