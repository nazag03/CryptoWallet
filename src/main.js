import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';

// Crear la aplicación Vue
const app = createApp(App);

// Usar Pinia para el manejo de estado global
app.use(createPinia());

// Usar Vue Router para la navegación de las vistas
app.use(router);

// Montar la aplicación en el DOM
app.mount('#app');
