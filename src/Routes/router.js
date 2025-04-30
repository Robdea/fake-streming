import { createRouter, createWebHistory  } from 'vue-router'

import NotFound from '../components/NotFound.vue';
import MovieInfoPage from '../views/MovieInfoPage.vue';
import MoviesPage from '../views/MoviesPage.vue';
import TvShowPage from '../views/TvShowPage.vue';
import SearchPage from '../views/SearchPage.vue';

const routes = [
  { path: '/', name:"Movies", component: MoviesPage },
  { path: '/tv', name:"TvShows", component: TvShowPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path:"/detail/:id/:category", name:"MovieInfo", component:MovieInfoPage},
  { path:"/detail/:id/:category", name:"TvShowInfo", component:MovieInfoPage},
  { path:"/search", name:"Search", component:SearchPage}
]

export const router = createRouter({
  history: createWebHistory (),
    routes,
});
