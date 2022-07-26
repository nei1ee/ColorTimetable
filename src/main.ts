import { createSSRApp } from 'vue'
import App from './App.vue'

// modules
import { setupPinia } from '~/modules/pinia'

import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)

  // Configure store
  // https://pinia.vuejs.org/
  setupPinia(app)

  return {
    app,
  }
}
