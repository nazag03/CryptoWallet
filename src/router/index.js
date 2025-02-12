import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import TradeView from '@/views/TradeView.vue';
import HistoryView from '@/views/HistoryView.vue';
import AnalysisView from '@/views/AnalysisView.vue';

const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};

const routes = [
  { path: '/', component: LoginView },
  { 
    path: '/TradeView', 
    component: TradeView, 
  },
  { 
    path: '/history', 
    component: HistoryView, 
   
  },
  { 
    path: '/analysis', 
    component: AnalysisView, 
    beforeEnter: (to, from, next) => {
      isAuthenticated() ? next() : next('/');
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
