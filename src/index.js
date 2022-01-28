import './sass/main.scss';
import { fetchMovies } from './js/fetchMovies';
//import { fetchGenres } from './js/fetchMovies';
import { GENRES_STORAGE } from './js/fetchMovies';
// import countryMarkupHbs from './templates/movie.hbs';
import movieListMarkupHbs from './templates/movie-list.hbs';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
    searchBox: document.querySelector("#search-box"),
    movieList: document.querySelector(".movie-list"),
}

refs.searchBox.addEventListener("input",debounce(onSearchInput,DEBOUNCE_DELAY))

function onSearchInput(e) { 
    if (e.target.value !== "") {
        const movieInput = e.target.value.trim()
        fetchMovies(movieInput)
            .then(({results}) =>
            {
                listMarkup(results); 
                setTimeout(()=>genresCheck(results.genre_ids),600)
                }
            )
    }
    else { 
    clearArea()
    }

}


function listMarkup(r) { 
    const markup = movieListMarkupHbs(r)
    refs.movieList.innerHTML = markup
}

function genresCheck(ids) { 
    let genreHtml = document.querySelectorAll('.genre')
    console.log(genreHtml)
    let genreData
    let storageItem = localStorage.getItem(GENRES_STORAGE)
    let parsedStorage = JSON.parse(storageItem)
    console.log(parsedStorage)
    for (let item of genreHtml) { 
        genreData=item.dataset.genres.split(',')
        console.log(genreData)
        for (let i of parsedStorage) { 
            if (genreData.includes(i.id.toString())) { 
                item.insertAdjacentHTML('beforebegin',`${i.name};`)
            }
        }
    }
}
