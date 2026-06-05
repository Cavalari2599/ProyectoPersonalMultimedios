<script setup>
import HeaderNav from './components/HeaderNav.vue'
import AboutMe from './components/AboutMe.vue'
import GallerySection from './components/GallerySection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'
import { usePortfolioData } from './composables/usePortfolioData.js'
import { useMouseSpotlight } from './composables/useMouseSpotlight.js'
import { useScrollProgress } from './composables/useScrollProgress.js'

const { proyectos, tecnologias, contacto, cvRuta, cargando } = usePortfolioData()
const { x: spotX, y: spotY, visible: spotVisible } = useMouseSpotlight()
const { progress, scrolled } = useScrollProgress()
</script>

<template>
  <div id="portfolio">
    <!-- Indicador de lectura: barra de progreso de scroll -->
    <div class="scroll-progress" role="progressbar" aria-label="Progreso de lectura"
      :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
      <div class="scroll-progress-bar" :style="{ transform: `scaleX(${progress})` }"></div>
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

.spotlight {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 37.5rem;
  height: 37.5rem;
  border-radius: 50%;
  will-change: transform;
  background: radial-gradient(circle, rgba(242, 166, 35, 0.07) 0%, rgba(232, 89, 60, 0.04) 40%, transparent 70%);
  z-index: 0;
  transition: var(--transition-opacity);
}
</style>
