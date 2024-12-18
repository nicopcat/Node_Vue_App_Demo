import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
console.log(process.env.NODE_ENV);

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')