<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    dataMovie:{},
    nameRoute:  Boolean,
});

const posterPath = "https://image.tmdb.org/t/p/w500/";
const isHovered = ref(false);

function handlerHover() {
    isHovered.value = true
}

function cutOverview() {
    const LIMIT_CHAR = 10;
    const data = props.dataMovie.overview.split(" ");
    if(data <= LIMIT_CHAR) return props.dataMovie.overview;
    return data.slice(0, LIMIT_CHAR).join(" ") + "...";
}

function getYear() {
    const year = props.dataMovie.release_date !== undefined ? props.dataMovie.release_date.split("-") : props.dataMovie.first_air_date.split("-") 
    return year.slice(0,1).join()
}

function handlerMouseLeave() {
    isHovered.value = false
}

const routeName = computed(() => {
    return props.nameRoute ? "MovieInfo" : "TvShowInfo";
});

const namePoster = computed(()=>{
    return props.dataMovie.title ? props.dataMovie.title : props.dataMovie.name
})

const category = computed(() => {
    return props.nameRoute ? "movie" : "tv";
});

</script>

<template>
    <section
    @mouseenter="handlerHover"
    @mouseleave="handlerMouseLeave" 
    :class="{hover: isHovered}"
    >
        <RouterLink class="card-movie" :to="{name: routeName, params:{id:dataMovie.id, category:category}}">
            <img :src="posterPath + dataMovie.poster_path" :alt="namePoster +' poster'">
            <div v-if="isHovered" class="info" >
                <h4>{{ namePoster }}</h4>
                <div class="more-info">
                    <p>{{ getYear() }}</p>
                    <label v-if="dataMovie.adult === true">+13</label>
                    <label v-else>All</label>
                </div>
                <p>{{ cutOverview() }}</p>
            </div>
        </RouterLink>
            
    </section>
</template>

<style  scoped>
    img{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border-radius: 10px;
    }

    .card-movie{
        width: 14vw;
        min-width: 90px;
        height: 29vh;
        min-height: 100px;
    }

    section{
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        transition: transform 0.3s ease;
    }

    .more-info{
        display: flex;
        flex-direction: row;
        gap: 13px;
        font-size: 0.8rem;
    }

    .more-info label{
        background-color: #3b3b3b;
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 4px;
    }

    .info{
        top: 1;
        background-color: var(--main-background-color);
        color: white;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 1rem;
        padding-top: 0px;
        border-end-end-radius: 10px;
        border-end-start-radius: 10px;
        gap: 4px;
    }

    .info h4{
        margin: 0;
        margin-top: 8px;
        font-size: 1.1rem;
    }
    .info p{
        padding: 0px;
        margin: 0px;
    }

    .hover{
        transform: scale(1.1);
        transition: transform 0.2s ease;
        z-index: 22;
        box-shadow: 1px 3px 10px 5px #000000;
    }
</style>
