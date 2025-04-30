const API_MOVIE = "https://api.themoviedb.org/3/discover/movie?api_key=9333e367e15a73a918b588617af6a42f&page=1"

const API_TV_SHOW = "https://api.themoviedb.org/3/discover/tv?api_key=9333e367e15a73a918b588617af6a42f&page=1";

// get name genres
const GENRE = "https://api.themoviedb.org/3/genre/movie/list?api_key=9333e367e15a73a918b588617af6a42f"
const GENRE_TV_SHOW = "https://api.themoviedb.org/3/genre/tv/list?api_key=9333e367e15a73a918b588617af6a42f"

const fetchCurrentReleaseMovie = async (isForMovies=true) =>{
    try {
        
        let someData = [];
        
        if(isForMovies){
            const res = await fetch(`${API_MOVIE}&release_date.gte=2025-04-01`);
            const data = await res.json();
            for (let i = 0; i < 6; i++) {
                someData.push(data.results[i]);    
            }
        }else{
            const res = await fetch(`${API_TV_SHOW}&language=en-US&sort_by=popularity.desc&first_air_date.gte=2024-12-01&page=1`);
            const data = await res.json();
            for (let i = 0; i < 6; i++) {
                someData.push(data.results[i]);    
            }
        }
        return someData

    } catch (error) {
        return [];
    }
}

const fetchGenreAsync = async (isForMovies=true) =>{
    try {
        if(isForMovies){
            const res = await fetch(GENRE);
            const allGenres = await res.json();
            return allGenres.genres
        }else{
            const res = await fetch(GENRE_TV_SHOW);
            const allGenres = await res.json();
            return allGenres.genres
        }
    } catch (e) {
        return []
    }
}

const fetchSeriesAsync = async () =>{
    try {
        const res = await fetch(API_TV_SHOW);
        const tvShowData = await res.json();

        return tvShowData;
    } catch (error) {
        return []
    }
}

export const fetchMovieByIdAsync = async (movieId, searchBy="movie") =>{
    try {
        const MOVIE_BY_ID = `https://api.themoviedb.org/3/${searchBy}/${movieId}?api_key=9333e367e15a73a918b588617af6a42f&page=1`
        const res = await fetch(MOVIE_BY_ID);
        const dataMovie = await res.json();
        return dataMovie;
    } catch (error) {
        return {}
    }
} 

export const fetchGenreById = async (genreId, searchBy="movie") =>{
    try {
        const MOVIE_BY_ID = `https://api.themoviedb.org/3/genre/${searchBy}/list?api_key=9333e367e15a73a918b588617af6a42f`

        const res = await fetch(MOVIE_BY_ID);
        
        const dataMovie = await res.json();

        return dataMovie.genres.find(d => d.id === genreId);
    } catch (error) {
        return {}
    }
}

const fetchByGenre = async (genre, isForMovies=true, currentId) => {
    try{
        let movieData = [];
        if(isForMovies){
            const res = await fetch(`${API_MOVIE}&with_genres=${genre}`);
            const json = await res.json();
            movieData = json.results
        }
        else{
            const res = await fetch(`${API_TV_SHOW}&language=en-US&with_genres=${genre}`);
            const json = await res.json();
            movieData = json.results
        }
        if(currentId){

            const filteredMovies = movieData.filter(m => m.id !== currentId);
            
            return filteredMovies
        }
        return movieData
    }catch(e){
        return []
    }
}

export const fetchContentByName = async (contentName) => {
    try {
        const API_SEARCH = `https://api.themoviedb.org/3/search/multi?api_key=9333e367e15a73a918b588617af6a42f&query=${contentName}`;
        const res = await fetch(API_SEARCH);
        const json = await res.json();
        const sortedResults = json.results.sort((a, b) => b.popularity - a.popularity);
        return sortedResults;
    } catch (e) {
        return [];
    }
}

export {fetchCurrentReleaseMovie, fetchGenreAsync, fetchByGenre, fetchSeriesAsync}
