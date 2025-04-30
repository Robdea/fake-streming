<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { fetchContentByName } from '../services/api';
import CardMovie from '../components/CardMovie.vue';

const route = useRoute();
const content = ref([])

async function getData(phrase) {
    try {
        const data = await fetchContentByName(phrase);
        const formatted = data.map(c => ({
            info: c,
            route: "video" in c,
            key: c.id
        }));
        return formatted;
    } catch (error) {
        console.error("An error occurred during the search.", error);
        return []; // evita que se retorne undefined
    }
}
onMounted(async () => {
    if (route.query.phrase) {
        content.value = await getData(route.query.phrase);
    }
});

watch(() => route.query.phrase, async (newPhrase) => {
    content.value = await getData(newPhrase);
});
</script>

<template>
    <div class="container">
        <h2>Result for "{{ route.query.phrase }}".</h2>

        <section class="container-ul-content">
            <ul>
                <li v-for="con in content" :key="con.key">
                    <CardMovie 
                    :dataMovie="con.info"
                    :nameRoute="con.route"
                    />
                </li>
            </ul>
        </section>
    </div>
</template>


<style scoped>
.container{
    margin-top: 6rem;
    margin-left: var(--margin-left);
}
h2{
    font-size: 1.7rem;
    font-weight: 500;
    margin-bottom: 2rem;
}

ul{
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    width: 85%;
    gap: 1.2rem;
}

.container-ul-content{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

li{
    width: 95%;
}

@media (max-width: 768px) {
    ul{
        
        grid-template-columns: 1fr 1fr 1fr ;
        padding: 0;
    }
    h2{
        font-size: 1.3rem;
        margin-left: 2rem;
    }
    .container{
    margin-top: 6rem;
    margin-left: 0;
    }
}


</style>