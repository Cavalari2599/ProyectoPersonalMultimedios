<script setup>
import HeaderNav from './components/HeaderNav.vue'
import AboutMe from './components/AboutMe.vue'
import GallerySection from './components/GallerySection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import PageFooter from './components/PageFooter.vue'
import StarryBackground from './components/StarryBackground.vue'
import { usePortfolioData } from './composables/usePortfolioData.js'
import { useMouseSpotlight } from './composables/useMouseSpotlight.js'
import { useScrolled } from './composables/useScrolled.js'

const { proyectos, tecnologias, contacto, cvRuta, cargando } = usePortfolioData()
const { x: spotX, y: spotY, visible: spotVisible } = useMouseSpotlight()
const { sentinel, scrolled } = useScrolled()
</script>

<template>
  <div id="portfolio">
    <StarryBackground :cursor-x="spotX" :cursor-y="spotY" :cursor-active="spotVisible" />

    <!-- Centinela: mientras es visible, la página no se ha desplazado. -->
    <div ref="sentinel" class="scroll-sentinel" aria-hidden="true"></div>

    <!-- Indicador de lectura: progreso de scroll en CSS puro
         (animation-timeline). Decorativo: oculto a tecnologías de apoyo. -->
    <div class="scroll-progress" aria-hidden="true">
      <div class="scroll-progress-bar"></div>
    </div>

    <div
      class="spotlight"
      :style="{
        transform: `translate3d(${spotX}px, ${spotY}px, 0) translate(-50%, -50%)`,
        opacity: spotVisible ? 1 : 0,
      }"
      aria-hidden="true"
    ></div>

    <HeaderNav :scrolled="scrolled" />

    <main>
      <AboutMe :cv-ruta="cvRuta" />
      <GallerySection :proyectos="proyectos" :cargando="cargando" />
      <SkillsSection :tecnologias="tecnologias" />
      <ContactSection :contacto="contacto" />
    </main>

    <PageFooter :contacto="contacto" />
  </div>
</template>

<style scoped>
#portfolio {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  position: relative;
}
main {
  flex: 1;
}

.scroll-sentinel {
  position: absolute;
  top: 0;
  width: 1px;
  height: 10px;
  pointer-events: none;
  visibility: hidden;
}

/* Indicador de lectura (barra de progreso de scroll) */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.1875rem;
  z-index: 200;
  background: transparent;
  pointer-events: none;
}
.scroll-progress-bar {
  height: 100%;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--sunset-orange), var(--sunset-gold));
}
/* Mejora progresiva: la barra crece ligada al scroll del documento,
   sin JavaScript. Donde no hay soporte queda oculta (scaleX(0)). */
@supports (animation-timeline: scroll()) {
  .scroll-progress-bar {
    animation: progress-grow linear both;
    animation-timeline: scroll();
  }
}
@keyframes progress-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

.spotlight {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 37.5rem;
  height: 37.5rem;
  border-radius: 50%;
  will-change: transform;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--sunset-gold) 7%, transparent) 0%,
    color-mix(in srgb, var(--sunset-orange) 4%, transparent) 40%,
    transparent 70%
  );
  z-index: 0;
  transition: var(--transition-opacity);
}
</style>
