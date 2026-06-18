import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // El sitio se publica en GitHub Pages bajo /ProyectoPersonalMultimedios/,
  // así que los assets deben resolverse desde esa subruta (si no, dan 404).
  base: '/ProyectoPersonalMultimedios/',
  plugins: [
    vue({
      // ion-icon es un web component (ionicons) y search es un elemento
      // HTML nativo que esta versión del compilador aún no reconoce:
      // ambos deben renderizarse como elementos, no como componentes Vue.
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'ion-icon' || tag === 'search',
        },
      },
    }),
  ],
})
