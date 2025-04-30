<script setup>
import { onMounted, ref, watch} from 'vue';
import { useRoute } from 'vue-router';
import {fetchByGenre,  fetchMovieByIdAsync} from "../services/api.js"
import SessionBar from '../components/SessionBar.vue';

const route = useRoute();
const movieData = ref({});
const posterPath = "https://image.tmdb.org/t/p/w500/"

const dataSection = ref([])
const isForMovie = ref(true)
const year = ref("")

async function loadMoreGenres () {
    isForMovie.value = route.params.category === "movie" ? true : false       
    
    for (const genre of movieData.value.genres) {
        const data = await fetchByGenre(genre.id, isForMovie.value, parseInt(route.params.id));
        
        dataSection.value.push({
            genreName: genre.name,
            genreId: genre.id,
            moviesData: data,
            route: isForMovie.value
        });
    }
}


onMounted(async () =>{
    try {
        movieData.value = await fetchMovieByIdAsync(route.params.id, route.params.category);
        const data = movieData.value.release_date !== undefined ? movieData.value.release_date.split("-") : movieData.value.first_air_date.split("-") 
    
        year.value = data.slice(0,1).join()
        await loadMoreGenres();
        console.log(movieData.value);

    } catch (error) {
        throw new Error("Error");
    }
});
/*
When the user selects another content, the observer detects the new id and 
will search for the information of that content.
*/
watch(() => route.params.id, async (newId) => {
  movieData.value = await fetchMovieByIdAsync(newId, route.params.category);
  dataSection.value = [];
  await loadMoreGenres();
});

</script>

<template>
    <div class="container">
        <div>
            <section class="info">
                <h1 v-if="movieData.title !== undefined">{{ movieData.title }}</h1>          
                <h1 v-else>{{ movieData.name }}</h1>          
                <label class="vote-average" :class="{
                    positive: movieData.vote_average > 7.9, 
                    negative: movieData.vote_average <= 7.9}" >
                    {{ movieData.vote_average }}
                </label>
                
                <p class="overview">{{ movieData.overview }}</p>          
                <div class="more-info">
                    <label>{{ year }}</label>                      
                    <label v-if="movieData.adult === true">+13</label>
                    <label v-else>All</label>                
                </div>
                <div>
                    <ul class="list-genre" v-if="movieData.genres !== undefined">
                        <li v-for="genre in movieData.genres" :key="genre.id">
                            {{ genre.name }}
                        </li>
                    </ul>   
                </div>
            </section>

            <div class="poster-wrapper">
                <img class="poster" :src="posterPath + movieData.poster_path" alt="">
            </div>

        </div>
        <section class="container-ul-content">
            <ul class="section-genre" v-for="section in dataSection" :key="section.genreId">
                <SessionBar
                    :genreName="section.genreName"
                    :listMovie="section.moviesData"
                    :nameRoute="section.route"
                />
            </ul>
        </section>
    </div>
</template>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    margin-top: 5rem;
}
.container-ul-content{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.vote-average{
    font-weight: 900;
}

.positive{
    color: rgb(103, 199, 108);
}

.negative{
    color: rgb(226, 175, 119);
}

.more-info{
    gap: 0.4rem;
}

.list-genre{
    list-style:none;
    margin:0;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
}

.list-genre li{
    background-color: rgba(54, 54, 54, 0.854);
    padding: 0.3rem;
    font-weight: 600;
    border-radius: 9px;
}


.overview{
    font-size: 1.2rem;
    font-weight: 500;
    padding: 0.3rem 0;
    margin: 0;
}

.poster{
    width: 50%;
    height: 68%;
    position: absolute;
    display: flex;
    right: 0;
    left: 1;
    margin-right: 10rem;
    border-radius: 20px;
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 20%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgb(0, 0, 0) 40%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%);
}

h1{
    font-size: 4.4rem;
    margin: 0;
    padding: 0;
    padding: 0.5rem 0 ;
    text-align: left;
}

.container div{
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
}

@media (max-width: 768px) {
    .container div{
        margin-bottom: 0;
    }
    .section-genre {
        padding: 0;
        margin: 0;
    }
    .list-genre{
        font-size: 0.7rem;
        padding: 0.3rem;
    }
    h1{
        font-size: 2rem;
    }
    .info .overview{
        font-size: 0.7rem;
    }
    .poster{
        margin-right: 0.4rem;
    }
}

.info{
    display: flex;
    flex-direction: column;
    z-index: 20;
    margin-left: var( --margin-left);
    width: 40%;
    text-align: justify;
}

</style>
