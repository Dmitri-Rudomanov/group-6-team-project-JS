// import './sass/main.scss';
// import { fetchGenres, fetchMovies } from './js/fetchMovies';
// //import { fetchGenres } from './js/fetchMovies';
// import { GENRES_STORAGE } from './js/fetchMovies';
// // import countryMarkupHbs from './templates/movie.hbs';
// import movieListMarkupHbs from './templates/movie-list.hbs';

// var debounce = require('lodash.debounce');
// const DEBOUNCE_DELAY = 300;
// const refs = {
//     searchBox: document.querySelector("#search-box"),
//     movieList: document.querySelector(".movie-list"),
// }

// refs.searchBox.addEventListener("input", debounce(onSearchInput, DEBOUNCE_DELAY))

// function onSearchInput(e) {
//     if (e.target.value !== "") {
//         const movieInput = e.target.value.trim()
//         fetchMovies(movieInput)
//             .then(({ results }) => {
//                 listMarkup(results);
//                 fetchGenres();
//                 setTimeout(() => genresCheck(results.genre_ids), 300)
//             }
//             )
//     }
//     else {
//         clearArea()
//     }
// }
// function listMarkup(r) {
//     const markup = movieListMarkupHbs(r)
//     refs.movieList.innerHTML = markup
// }
// function genresCheck(ids) {
//     let genreHtml = document.querySelectorAll('.genre')
//     // console.log(genreHtml)
//     let genreData
//     let storageItem = localStorage.getItem(GENRES_STORAGE)
//     let parsedStorage = JSON.parse(storageItem)
//     // console.log(parsedStorage)
//     for (let item of genreHtml) {
//         genreData = item.dataset.genres.split(',')
//         // console.log(genreData)
//         for (let i of parsedStorage) {
//             if (genreData.includes(i.id.toString())) {
//                 item.textContent += `${i.name},`
//             }
//         }
//     }
// }


// ==========================================

import './sass/main.scss';
import { fetchGenres, fetchMovies } from './js/fetchMovies';
//import { fetchGenres } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
// import countryMarkupHbs from './templates/movie.hbs';
import movieListMarkupHbs from './templates/movie-list.hbs';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 1300;
// ====объявление глоб перемеррых страницы. кол страниц. текст запроса====
let QUERY = undefined;
let PAGE = 1;
let totalPages = undefined;

const refs = {
    searchBox: document.querySelector("#search-box"),
    movieList: document.querySelector(".movie-list"),
    sentinel: document.querySelector('#sentinel'),
}

refs.searchBox.addEventListener("input", debounce(onSearchInput, DEBOUNCE_DELAY))

// =======запрос жанров и  ==========
fetchGenres();


// ========первая загрузка========
function onSearchInput(e) {
    if (e.target.value !== "") {
        QUERY = e.target.value.trim()
        PAGE = 1;
        fetchMovies(QUERY, PAGE)
            .then(processGenres)
            .then(({ results, total_pages }) => {

                totalPages = total_pages;
                clearMovieContainer();
                appendMovieMarkup(results);
            }
            );
    }
    else {
        QUERY = undefined;
        clearMovieContainer();
    }
}
// function listMarkup(r) {
//     const markup = movieListMarkupHbs(r)
//     refs.movieList.innerHTML = markup
// }

// =======добавление разметки==============
function appendMovieMarkup(r) {
    refs.movieList.insertAdjacentHTML('beforeend', movieListMarkupHbs(r));
}
// ========очистка страницы===========
function clearMovieContainer() {
    refs.movieList.innerHTML = '';
}

// ===========обработка строки жанров===============
function processGenres(response) {
    for (let i = 0; i < response.results.length; i++) {
        let readableGenres = convertGenres(response.results[i].genre_ids);
        if (readableGenres.length > 3) {
            readableGenres = readableGenres.slice(0, 2);
            readableGenres.push('...Other')
        }
        response.results[i].genres = readableGenres.join(', ');

    }
    return response
}

// ======присвоить название жанров========
function convertGenres(genre_ids) {
    let resultGenre = [];
    let storageItem = localStorage.getItem(GENRES_STORAGE);
    let genreMapping = JSON.parse(storageItem);
    for (let i = 0; i < genre_ids.length; i++) {
        for (let k = 0; k < genreMapping.length; k++) {
            if (genre_ids[i] === genreMapping[k].id) {
                resultGenre.push(genreMapping[k].name)
                break;
            }
        }
    }
    return resultGenre
}

// =======дозагрузка=================
const onEntry = entries => {
    entries.forEach(entry => {
        // console.log('entry.isIntersecting-', entry.isIntersecting)

        if (entry.isIntersecting && QUERY !== undefined) {
            // console.log('Пора грузить еще статьи');
            PAGE += 1;
            if (PAGE > totalPages) {
                console.log('pages out');
                return;
            }
            fetchMovies(QUERY, PAGE)
                .then(processGenres)
                .then(({ results }) => {
                    appendMovieMarkup(results);
                }
                );
        }
    });
};

// ========наблюдатель скролла============
const observer = new IntersectionObserver(onEntry, {
    rootMargin: '150px',
});
observer.observe(refs.sentinel);
