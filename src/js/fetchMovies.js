const API_KEY="9f7c5da3425a9d17909027ad2b61278f"
const GENRES_STORAGE='genres-names'

function fetchMovies(name) {
  return fetch(`
    https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${name}&page=1&include_adult=false`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(response => response)

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
      localStorage.setItem(GENRES_STORAGE, JSON.stringify(genres))
    })

}

export { GENRES_STORAGE}
export { fetchMovies }
export { fetchGenres }

