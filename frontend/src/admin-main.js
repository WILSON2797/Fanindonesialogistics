import { createApp } from 'vue';
import AppAdmin from './AppAdmin.vue';

// Create and mount Vue Admin application
const app = createApp(AppAdmin);
app.config.globalProperties.$baseDir = window.BASE_DIR || '';
app.mount('#app');
