REFERENCIAS

Aca dejo todo lo que consulte y use para hacer el portafolio del curso IF7102 Multimedios (UCR, I Ciclo 2026). El framework que elegi fue Vue 3.

Como aprendi Vue

Antes de empezar no habia usado Vue, asi que me apoye en varios tutoriales y sobre todo en la documentacion oficial. El video que me sirvio de punto de partida fue este de crear un portafolio con Vue:
https://youtu.be/2h2Sr0ZJvyE?si=TNxCFRtwbuwg6x0N

De la documentacion oficial estuve leyendo bastante, sobre todo estas partes:

Quick start de Vue 3, https://vuejs.org/guide/quick-start
Composition API y script setup, https://vuejs.org/api/sfc-script-setup.html
Reactividad con ref, computed y watch, https://vuejs.org/guide/essentials/reactivity-fundamentals.html
Props, https://vuejs.org/guide/components/props.html
Lifecycle hooks (onMounted, onUnmounted), https://vuejs.org/api/composition-api-lifecycle.html
Composables, https://vuejs.org/guide/reusability/composables.html
La guia de Vite, https://vite.dev/guide/
Y como maneja Vite los assets con new URL e import.meta.url, https://vite.dev/guide/assets.html

Documentacion de MDN

Para varias APIs del navegador que use en los composables y componentes me apoye en MDN:

Fetch API, https://developer.mozilla.org/es/docs/Web/API/Fetch_API
IntersectionObserver, que use para los reveals al hacer scroll y para el scrollspy, https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API
ResizeObserver, para reacomodar el subrayado del nav, https://developer.mozilla.org/es/docs/Web/API/ResizeObserver
requestAnimationFrame, para el spotlight que sigue al mouse, https://developer.mozilla.org/es/docs/Web/API/Window/requestAnimationFrame
matchMedia y prefers-reduced-motion, https://developer.mozilla.org/es/docs/Web/CSS/@media/prefers-reduced-motion
prefers-color-scheme para el tema dia y noche, https://developer.mozilla.org/es/docs/Web/CSS/@media/prefers-color-scheme
localStorage para guardar el tema y el idioma, https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
backface-visibility y transform 3D para las tarjetas que se voltean, https://developer.mozilla.org/es/docs/Web/CSS/backface-visibility
background-clip text para los titulos con degradado, https://developer.mozilla.org/es/docs/Web/CSS/background-clip
animation-timeline scroll() para la barra de progreso sin JavaScript, https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
light-dark() para los colores del tema, https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
color-mix() para sacar tonos de los colores de marca, https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
View Transitions, para el fundido al cambiar de tema, https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
El elemento search, que envuelve el filtro de proyectos, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search

Medios y licencias

La foto de perfil (src/assets/images/foto-perfil.jpeg) es mia. El audio donde me presento (src/assets/audio/presentacion.mp3) lo grabe yo, y el video de introduccion (src/assets/video/intro.mp4) tambien es de produccion propia. El video lo comprimi para que pesara menos y cargara mas rapido en la pagina.

Recursos de terceros con licencia libre que use:

Ionicons para los iconos de interfaz, licencia MIT, https://ionic.io/ionicons
Devicon para los logos de las tecnologias, licencia MIT, https://devicon.dev
Google Fonts, use Playfair Display para los titulos y DM Sans para el texto, las dos con SIL Open Font License 1.1

Proyectos que muestro en la galeria

Los dos proyectos de la galeria son trabajos reales mios. Scrum Poker lo hice yo, es una app de planning poker en tiempo real con Vue y Firebase (https://cavalari2599.github.io/Scrum-Poker/). La guia turistica de Costa Rica fue un proyecto en grupo hecho con Web Components, donde a mi me toco la galeria de imagenes y el mapa (https://naillel.github.io/proyecto-guia-turistica-vite/).

De donde saque las animaciones

La mayoria de los efectos los adapte de la coleccion de animaciones CSS de Prismic, que me parecio muy buena guia:
https://prismic.io/blog/css-animations

De ahi saque ideas para el dock estilo OS, el subrayado que se desliza en el nav, el efecto de las imagenes, el texto que aparece letra por letra y la maquina de escribir, la barra de lectura y los reveals con Intersection Observer, y los skeletons de carga.

El boton de descargar CV (el del efecto fizzy) esta basado en el Fizzy CSS Button de Jamie Coulter en CodePen (https://codepen.io/jcoulterdesign). El original estaba en HAML y SCSS, asi que lo pase a CSS normal y a Vue, cambiando los bucles de SCSS por variables CSS calculadas en el componente, y lo adapte a los colores de mi pagina.

Uso de inteligencia artificial

Use Claude (de Anthropic) como apoyo durante el desarrollo. Me sirvio para entender mejor conceptos de Vue como los componentes, props, composables y el ciclo de vida, para refactorizar el codigo hacia componentes y composables reutilizables, para depurar errores de build como las rutas de los assets con Vite, para mejorar la accesibilidad (prefers-reduced-motion, focus visible, etiquetas ARIA), para portar el boton fizzy de SCSS a Vue, para elegir e implementar animaciones a partir de las guias de Prismic, para optimizar los medios (comprimir el video y la foto) y sacar las capturas de los proyectos, y para redactar este archivo y el README. Todo el codigo lo fui revisando y entendiendo, y puedo explicar el porque de cada parte del framework que use.
