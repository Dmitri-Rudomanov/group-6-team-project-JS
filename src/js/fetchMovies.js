
const API_KEY = '9f7c5da3425a9d17909027ad2b61278f';
const GENRES_STORAGE = 'genres-names';

function fetchPopularity() {
  return fetch(`
    https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=en-US&page=1&include_adult=false`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
}

function fetchMovies(name, page = 1) {
  return fetch(`
    https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${name}&page=${page}&include_adult=false`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
}
function fetchGenres() {
  return fetch(`
    https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(({ genres }) => {
      localStorage.setItem(GENRES_STORAGE, JSON.stringify(genres));
    });
}

export { GENRES_STORAGE };
export { fetchMovies };
export { fetchGenres };
export { fetchPopularity };
