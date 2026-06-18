Portfolio Multimedia Personal — Carlos Daniel

Este es mi proyecto personal para el curso IF7102 Multimedios, de la carrera de Informatica Empresarial en la UCR Sede de Guanacaste, I Ciclo 2026. De las opciones que daban elegi la primera, que era hacer un portafolio multimedia de uno mismo.

Basicamente es un portafolio de una sola pagina donde me presento con foto, audio y un video, muestro algunos proyectos en los que he trabajado, las tecnologias que manejo y mis datos de contacto. Tambien le puse tema claro y oscuro y se puede cambiar entre español e ingles.

Sobre el framework

Para la parte de investigacion habia que aprender un framework por cuenta propia y elegi Vue 3. La verdad lo escogi porque era el que se veia mas parecido a lo que ya habiamos visto en el curso con HTML, CSS y JS por separado, y porque la documentacion estaba bastante clara. Lo trabaje con la Composition API y el script setup, y use Vite para el build.

Que tiene el proyecto

Esta separado en componentes, uno por cada seccion: el nav de arriba, la parte de presentacion, la galeria de proyectos, las tecnologias y el contacto, mas un pie de pagina. Los datos de los proyectos, tecnologias y contacto no estan quemados en el codigo sino que los cargo desde un archivo portfolio.json con fetch, y de ahi los paso a los componentes con props y los recorro con v-for.

Aparte de eso le fui agregando varias cosas que me costaron pero queria probar: el cambio de idioma y de tema que se guardan en el navegador, animaciones cuando uno hace scroll, las tarjetas de proyecto que se voltean, un dock de tecnologias que crece segun donde este el mouse, el boton de descargar CV con el efecto de burbujitas, el fondo de estrellas y el efecto de maquina de escribir en el rol. Trate de que todas las animaciones respetaran la opcion de reducir movimiento del sistema para que no molesten a quien la tenga activada.

Como correrlo

Hace falta tener Node instalado (version 18 o mas). Despues:

pnpm install para instalar las dependencias
pnpm run dev para levantar el servidor de desarrollo
pnpm run build para generar la version de produccion
pnpm run preview para ver el build ya compilado

El dev queda en http://localhost:5173

Los proyectos que muestro

En la galeria puse trabajos reales mios. Uno es Scrum Poker, una app de planning poker en tiempo real que hice con Vue y Firebase. El otro es una guia turistica de Costa Rica que fue un proyecto en equipo hecho con Web Components, donde yo me encargue de la galeria de imagenes y el mapa. Los dos tienen su demo en linea enlazada desde la tarjeta.

Lo multimedia

La foto de perfil, el audio donde me presento y el video de introduccion son todos mios, hechos por mi. El detalle de las demas fuentes que use (fuentes de letra, iconos, etc) y todo lo que consulte para aprender esta en el archivo REFERENCIAS.md.

Autor

Carlos Daniel (Cava), estudiante de Informatica Empresarial, UCR Sede de Guanacaste. Curso IF7102 Multimedios, I Ciclo 2026.
