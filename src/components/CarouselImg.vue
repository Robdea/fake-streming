<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Icons from '../assets/Icons.vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    listData: Array,
    nameRoute: Boolean,
});

const posterPath = "https://image.tmdb.org/t/p/w500/"
const currentIndex = ref(0);
let isBttnClick = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const isMobile = ref(window.innerWidth <= 700);

const currentItem = computed(() => {
    if(!props.listData || props.listData.length === 0) return null
    return props.listData[currentIndex.value] 
})

function prev() {
    isBttnClick.value = true;
    if(currentIndex.value <= 0){
        currentIndex.value = props.listData.length -1;
    }else{
        currentIndex.value--; 
    }
}

function next() {
    isBttnClick.value = true;
    if (currentIndex.value < props.listData.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
}

function getOverview(item) {
    const LIMIT_CHAR = 20;
    const data = item.overview.split(" ");
    if(data <= LIMIT_CHAR) return item.overview;
    return data.slice(0, LIMIT_CHAR).join(" ") + "...";
}

function handleTouchStart(e) {
    if (!isMobile.value) return;
    touchStartX.value = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (!isMobile.value) return;
    touchEndX.value = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (!isMobile.value) return;
    
    const threshold = 50; 
    
    if (touchStartX.value - touchEndX.value > threshold) {
        next();
    } else if (touchEndX.value - touchStartX.value > threshold) {
        prev();
    }
}

let interval = null;

onMounted(() => {
    const checkScreenSize = () => {
        isMobile.value = window.innerWidth <= 700;
    };
    
    window.addEventListener('resize', checkScreenSize);
    
    if(isBttnClick.value === false){
        interval = setInterval(() => {
            next();
        }, 9000);
    }
    
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
});

onUnmounted(() => {
    clearInterval(interval);
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.removeEventListener('touchstart', handleTouchStart);
        carousel.removeEventListener('touchmove', handleTouchMove);
        carousel.removeEventListener('touchend', handleTouchEnd);
    }
});

const routeName = computed(() => {
    return props.nameRoute ? "MovieInfo" : "TvShowInfo";
});

const category = computed(() => {
    return props.nameRoute ? "movie" : "tv";
});
</script>

<template>
    <section class="container">
        <div class="carousel-wrapper">
            <div class="carousel" v-if="currentItem">
                <RouterLink :to="{name: routeName, params:{id:currentItem.id, category:category}}" class="card-movie">
                    <div class="info">
                        <h2 v-if="currentItem.title !== undefined">{{ currentItem.title }}</h2>
                        <h2 v-else>{{ currentItem.name }}</h2>
                        <section>
                            <label class="vote-average" :class="{
                                positive: currentItem.vote_average > 7.9, 
                                negative: currentItem.vote_average <= 7.9}" >
                                {{ currentItem.vote_average }}
                            </label>
                            <label v-if="currentItem.adult"> +13</label>
                            <label v-else>All</label>
                        </section>
                        
                        <p class="overview">{{ getOverview(currentItem) }}</p>
                        <button>
                            <Icons class="info-icon" typeIcon="info"/>
                        </button>
                    </div>
                    <div class="poster">
                        <img :src="posterPath + currentItem.backdrop_path" />
                    </div>
                </RouterLink>
            </div>

            <div class="scroll-button" v-if="!isMobile">
                <button @click="prev" class="left"><Icons class="left-icon" typeIcon="left"/></button>
                <button @click="next" class="right"><Icons class="right-icon" typeIcon="right"/></button>
            </div>
        </div>

        <div class="circles">
            <div v-for="(point, index) in listData" :key="point.id">
                <label :class="{active: index === currentIndex}"></label>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  width: 100%;
}

.poster {
  position: relative;
  width: 40vw;
  height: 50vh;
  overflow: hidden;
}

.card-movie{
    display: flex;
    flex-direction: row;
    color: #f7f7f7;
    gap: 40px;
    text-decoration: none;
    margin-left: var(--margin-left);
}

.poster{
    display: flex;
    justify-content: end;
    flex: 1;
    align-content: end;
}

.carousel img{
  width: 100%;
  border-radius: 8px;
  margin-bottom: 10px;
  -webkit-mask-image: radial-gradient(circle, rgb(0, 0, 0) 35%, rgba(0, 0, 0, 0) 100%);
  mask-image: radial-gradient(circle, rgb(0, 0, 0) 35%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-button {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none; 
  z-index: 20;
}

.scroll-button button{
  background-color: #00000000;
  border-style: none;
}

.scroll-button button:hover {
  transform: scale(1.1);
}

.positive{
    color: rgb(103, 199, 108);
}

.negative{
    color: rgb(226, 175, 119);
}

.scroll-button .left,
.scroll-button .right {
  pointer-events: all;
  cursor: pointer;
}
.right{
    margin-right: 7px;
}

.left-icon, .right-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 50%;
}

.info-icon{
    width: 70px;
    height: 70px;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
    cursor: pointer;
}

.info-icon:hover{
    background-color: #f4f4f4;
    border-radius: 50px;
    transform: scale(1.1);
    color: #111111;
}

.info{
    z-index: 10;
    display: grid;
    align-self: flex-end;
    width: 30%;
    font-size: 1.4rem;
    padding-top: 50px;
}

h2{
    margin: 0;
    padding: 0;
    margin-bottom: 0.9rem;
}

.info section{
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    justify-self: start;
}

.info label{
    font-size: 0.9rem;
    padding: 0.3rem;
    border-radius: 10px;
    font-weight: 500;
}

.info button{
    display: flex;
    padding: 0;
    margin: 0;
    background-color: #00000000;
    border-style: none;
    justify-self: start;
}

.info label{
    background-color: #5f5f5fd1;
}

.info p{
    font-size: 1.1rem;
}

.plusIcon{
    width: 40px;
    height: 40px;
    background-color: #5252526c;
    padding: 9px;
    border-radius: 50%;
    cursor: pointer;
}

.circles{
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: .3em;
    gap: 0.6rem;
}

.circles label{
    width: 13px;
    display: inline-block; 
    height: 13px;
    background-color: aqua;
    border-radius: 50%;
    background-color: #c3c3c376;
    transition: background-color 0.3s ease;
}

.circles label.active {
  background-color: #f7f7f7;
  border-radius: 20px;
  width: 20px;
}

@media (max-width: 768px) {
    .container{
        margin-top: 6rem;
        width: 100%;
    }
    .info-icon{
        margin-top: 10px;
    }
    .overview{
        display: none;
    }
    .card-movie {
        touch-action: manipulation; 
    }
    .carousel-wrapper{
        width: 100%;
        height: 100%;
        align-items: start;
        justify-content: start;
    }
    .scroll-button{
        display: none;
    }

    .poster {
      height: auto;
      justify-content: center;
      position: absolute;
      padding: 0;
      margin: 0;
      width: 97%;
      height: 230px;
    }
  
    .poster img {
      width: 100%;
      margin: 0;
      padding: 0;
      object-fit: cover;
      height: auto;
    }
  
    .info {
      width: 60%;
      padding-left: 1rem;
      font-size: 1rem;
    }
  
    .info-icon {
      width: 40px;
      height: 40px;
    }
  
    .left-icon, .right-icon {
      width: 40px;
      height: 40px;
    }
  
    h2 {
      font-size: 1.2rem;
    }
  
    .info p {
      font-size: 0.95rem;
    }
  
    .circles label {
      width: 10px;
      height: 10px;
    }
  
    .circles label.active {
      width: 15px;
    }
  }
  
</style>
