<script setup>
import { RouterLink } from 'vue-router';
import Icons from "../assets/Icons.vue"
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';    

const router = useRouter(); 
const modalSearch = ref("");
const inputSearch = ref("");
const isScrolled = ref(false)
const clear = ref(false);

function showModalSearch() {
    modalSearch.value.showModal();
    document.body.style.overflow = 'hidden'; 
}

function closeModalSearch(event) {
    if(event.target === modalSearch.value){
        modalSearch.value.close();
        document.body.style.overflow = '';
    }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

watch(inputSearch, (newValue) =>{
    newValue.length > 0 ? clear.value = true : clear.value = false
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handlerClear() {
    inputSearch.value = "";
    clear.value = false;
}

function searchContent(e) {
    e.preventDefault();
    const validValue = inputSearch.value.trim();
    if(validValue !== ""){
        router.push({name:"Search", query:{phrase:inputSearch.value}});
        modalSearch.value.close();
        document.body.style.overflow = '';
    }
}

</script>
<template>
    <header :class="{scrolled:isScrolled}">
        <nav class="sections">
            <RouterLink to="/" class="link">Movies</RouterLink>
            <RouterLink to="/tv" class="link">TV shows</RouterLink>
        </nav>
        <div>
            <button class="button-search" @click="showModalSearch">
                <Icons typeIcon="search" class="search-icon"/>
            </button>
            <dialog @click="closeModalSearch" class="modal-search" ref="modalSearch">
                <div>
                    <form @submit="searchContent">
                        <section>
                            <span>
                                <Icons typeIcon="search" class="search-icon"/>
                            </span>
                            <input required v-model="inputSearch" placeholder="Search"/>    
                        </section>

                        <button type="button" @click="handlerClear" class="clear-bttn" v-if="clear === true">Clear</button>
                    </form>
                </div>
            </dialog>
        </div>
    </header>
</template>


<style scoped>
.modal-search::backdrop{
    background-color: rgba(14, 18, 34, 0.55);
}

.clear-bttn{
    background-color: #00000000;
    border-style: none;
    margin-right: 0.8rem;
    font-weight: 500;
    font-size: 1.1rem;
    border-radius: 5px;
    transition: background 0.3s ease;
}

.clear-bttn:hover{
    background-color: #f0f0f0;
    color: #0e0e0e;
}

.modal-search{
  position: fixed;
  top: 10%; 
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  border: none;
  border-radius: 8px;
  padding: 1.4rem;
  z-index: 1000;
  background-color: #1a1a28;
  width: 46%;
  min-width: 300px;
}

form{
    display: flex;
    flex-direction: row;
    background-color: #343441;
    gap: 0.7rem;
    padding: 0.5rem;
    border-radius: 30px;
    justify-content: space-between;
    min-width: 140px;
}

form section{
    display: flex;
    flex-direction: row;
    gap: 0.4rem;
}

form input{
    border-style: none;
    outline: none;
    background-color: #eeeeee00;
    font-size: 1.2rem;
    width: 30vw;
    max-width: 180px;
}

.router-link-active {
  background-color: #313238f3;
  border-radius: 10px;
}

header{
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%); 
    padding: 10px 20px;
    gap: 2rem;
    background-color: transparent;
    border-end-start-radius: 20px;
    border-end-end-radius: 20px;
    z-index: 10;
    transition: background-color 0.3s ease;
    width: max-content; 
}

.button-search{
    background-color: #ededed00;
    border-style: none;
    display: flex;
    justify-self: end;
    align-self: flex-end;
    cursor: pointer;
    border-radius: 50px;
    padding: 5px;
}

.button-search:hover{
    background-color: #ededed;
    color: rgb(9, 9, 9);
}

.button-search{
    background-color: #ededed00;
    border-style: none;
    display: flex;
    margin-top: 10px;
    justify-self: end;
    align-self: flex-end;
}


@media (max-width: 768px) {
    dialog{
        width: 90%;
    }
    .sections .link{
        font-size: 0.9rem;
    }
}


.scrolled {
  background-color: rgba(39, 39, 39, 0.799); 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sections{
    display: flex;
    gap: 1rem;
}

.search-icon{
    width: 30px;
    height: 30px;
}

.link{
    font-style: none;
    text-decoration: none;
    color: #ededed;
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;
    font-weight: 500;
    font-size: 1.1rem;
}

.link:hover{
    background-color: #ededed;
    color: rgb(9, 9, 9);
}
</style>