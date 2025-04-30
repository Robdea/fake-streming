<script setup>
import { ref, onMounted } from 'vue';
import { fetchCurrentReleaseMovie, fetchGenreAsync, fetchByGenre } from '../services/api';
import CarouselImg from '../components/CarouselImg.vue';
import SessionBar from '../components/SessionBar.vue';

const currentMovies = ref([]);
const allGenres = ref([]);

const dataSection = ref([])

const loader = ref(null); // Para el IntersectionObserver
const displayedCount = ref(0); 

async function loadMoreGenres () {
    const nextBatch = allGenres.value.slice(displayedCount.value, displayedCount.value + 3);

    for (const genre of nextBatch) {
        const data = await fetchByGenre(genre.id);
        
        dataSection.value.push({
            genreName: genre.name,
            genreId: genre.id,
            moviesData: data,
            route: true
        });
    }
    
    displayedCount.value += nextBatch.length;
}

onMounted(async () =>{
    try {
        currentMovies.value = await fetchCurrentReleaseMovie();
        allGenres.value = await fetchGenreAsync();

        await loadMoreGenres();
        //Lazy loading
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreGenres();
            }
        });
        if (loader.value) observer.observe(loader.value);
    } catch (error) {
        console.error(error);
    }
});


</script>

<template>
    <CarouselImg 
    :nameRoute="true"
    :listData="currentMovies"
    />
    <section class="container-info">
        <ul>
            <li class="section-genre" v-for="section in dataSection" :key="section.genreId">
                <SessionBar
                    :genreName="section.genreName"
                    :listMovie="section.moviesData"
                    :nameRoute="section.route"
                />
            </li>
    
            <div v-if="displayedCount === allGenres.length" ref="loader" class="loader"></div>
            <div v-else ref="loader" class="loader">See more</div>
        </ul>

    </section>
</template>

<style scoped>
.section-genre{
    margin: 0;
    padding: 0;
}

ul{
    list-style: none;
    padding: 0;
    margin: 0;
}
.loader{
    font-size: 1.3rem;
    font-weight: 500;
}
section{
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1.3rem;
}
.container-info{
    margin-left:var(--margin-left)
}

@media (max-width: 768px) {
    .container-info{
        margin-left:0
    }

}
</style>