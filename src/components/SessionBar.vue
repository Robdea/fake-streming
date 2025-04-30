<script setup>
import CardMovie from './CardMovie.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Icons from '../assets/Icons.vue';

const props = defineProps({
    genreName: String,
    listMovie: Array,
    nameRoute: Boolean
});

// Tamaño de la vista
const currentIndex = ref(0);
const itemsPerPage = ref(3);

function updateItemsPerPage() {
  const width = window.innerWidth;
  if (width >= 1200) {
    itemsPerPage.value = 5;
  } else if (width >= 608) {
    itemsPerPage.value = 3;
  } else if (width >= 200) {
    itemsPerPage.value = 3;
  }else{
    itemsPerPage.value = 1
  }
}


const visibleMovies = computed(() => {
    return props.listMovie.slice(currentIndex.value, currentIndex.value + itemsPerPage.value);
});

onMounted(() => {
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage);
});

function next() {
    if (currentIndex.value + itemsPerPage.value < props.listMovie.length) {
        currentIndex.value += itemsPerPage.value;
    }
}

function prev() {
    if (currentIndex.value - itemsPerPage.value >= 0) {
        currentIndex.value -= itemsPerPage.value;
    }
}
</script>

<template>
     <li>
        <h2>{{ genreName }}</h2>
        <div class="carousel">
            <button class="left" @click="prev" :disabled="currentIndex === 0">
                <Icons class="left-icon" typeIcon="left"/>
            </button>
            <ul class="movie-carousel">
                <li v-for="data in visibleMovies" :key="data.id">
                    <CardMovie
                    :dataMovie="data" 
                    :nameRoute="nameRoute"
                    />
                </li>
            </ul>
            <button class="right" @click="next" :disabled="currentIndex + itemsPerPage.value >= listMovie.length">
                <Icons class="right-icon" typeIcon="right"/>
            </button>
        </div>
    </li>
</template>

<style  scoped>

.carousel{
    display: flex;
    align-items: center;
    gap: 0.6rem;

}

.left:hover, .right:hover{
    transform: scale(1.1);
}

.left-icon, .right-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.right{
    padding: 0;
    padding-right: 50px;
}

.movie-carousel {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

button {
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

button:disabled {
    opacity: 0.3;
    cursor: default;
}

ul{
    display: flex;
    flex-direction: row;

    scroll-snap-type: x mandatory;
    gap: 1.9rem;
    align-items: start;
    margin: 0;
    padding: 0;
}

li{
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 14px;
}

h2{
    font-size: 1.8rem;
    margin: 0;
}

@media (max-width: 768px) {
    h2{
        font-size: 1.4rem;
    }
    button{
        padding: 0;
    }
    

    .left-icon, .right-icon{
        width: 20px;
        height: 28px;
    }
    .right{
        padding:0;
    }
}

</style>
