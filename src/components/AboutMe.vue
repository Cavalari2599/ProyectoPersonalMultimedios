<script setup>
import { ref, inject, computed, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  cvRuta: { type: String, default: '' }
})
const lang = inject('lang')
const reproduciendo = ref(false)
const audioRef   = ref(null)
const seccionRef = ref(null)

// ── Reveal al entrar al viewport ──────────────────────────────
const revealed = ref(false)

function onScroll() {
  if (!seccionRef.value) return
  const rect = seccionRef.value.getBoundingClientRect()
  const vh   = window.innerHeight
  if (!revealed.value && rect.top < vh * 0.9) {
    revealed.value = true
  }
}
function onCvClick() {
  setTimeout(() => {
    // Descarga el archivo
    const link = document.createElement('a')
    link.href = `/src/assets/data/${props.cvRuta}`
    link.download = ''
    link.click()
  }, 4700)

  setTimeout(() => {
    // Resetea el checkbox para que la animación vuelva al estado inicial
    const checkbox = document.getElementById('cv-check')
    if (checkbox) checkbox.checked = false
  }, 5200)
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => { window.removeEventListener('scroll', onScroll) })

// ── Efecto zonas 3x3 ─────────────────────────────────────────
const zonaActiva = ref(0)

const desplazamientos = {
  1: 'translate(-12px, -12px)',
  2: 'translate(0,     -12px)',
  3: 'translate( 12px, -12px)',
  4: 'translate(-12px,  0)',
  5: 'translate(0,      0)',
  6: 'translate( 12px,  0)',
  7: 'translate(-12px,  12px)',
  8: 'translate(0,      12px)',
  9: 'translate( 12px,  12px)',
}

const fotoTransform = computed(() =>
  zonaActiva.value ? desplazamientos[zonaActiva.value] : 'translate(0, 0)'
)

function setZona(n)  { zonaActiva.value = n }
function resetZona() { zonaActiva.value = 0 }

// ── Audio ─────────────────────────────────────────────────────
const textos = {
  es: {
    saludo:   'Hola, soy',
    nombre:   'Tu Nombre',
    rol:      'Estudiante de Informática Empresarial · UCR · Sede Guanacaste',
    bio:      'Escribe aquí tu presentación personal. De dónde sos, qué estudiás y qué encontrará el visitante en este portfolio.',
    escuchar: '▶ Escuchar presentación',
    pausar:   '⏸ Pausar',
    video:    'Video de introducción',
    fotoAlt:  'Foto de perfil',
  },
  en: {
    saludo:   "Hi, I'm",
    nombre:   'Your Name',
    rol:      'Business Informatics Student · UCR · Guanacaste Campus',
    bio:      'Write your personal introduction here. Where you are from, what you study and what visitors will find in this portfolio.',
    escuchar: '▶ Listen to intro',
    pausar:   '⏸ Pause',
    video:    'Introduction video',
    fotoAlt:  'Profile photo',
  }
}
const t = computed(() => textos[lang.value])

function toggleAudio() {
  if (!audioRef.value) return
  if (reproduciendo.value) {
    audioRef.value.pause()
    reproduciendo.value = false
  } else {
    audioRef.value.play()
    reproduciendo.value = true
  }
}
</script>

<template>
  <section id="sobre-mi" class="section" ref="seccionRef">
    <div class="container">

      <div class="about-grid">

        <!-- Columna izquierda: foto -->
        <div class="hero-wrap reveal" :class="{ active: revealed }">
          <div class="hero-img">
            <img
              class="foto"
              :src="'/src/assets/images/foto-perfil.jpeg'"
              :alt="t.fotoAlt"
              :style="{ transform: fotoTransform }"
            />
            <div class="zonas">
              <div class="zona" @mouseenter="setZona(1)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(2)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(3)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(4)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(5)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(6)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(7)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(8)" @mouseleave="resetZona"></div>
              <div class="zona" @mouseenter="setZona(9)" @mouseleave="resetZona"></div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: texto + audio + CV -->
        <div class="about-texto">
          <p class="saludo-small">{{ t.saludo }}</p>
          <h1>{{ t.nombre }}</h1>
          <p class="rol">{{ t.rol }}</p>
          <p class="bio">{{ t.bio }}</p>

          <!-- Fila de botones -->
          <div class="botones-fila">

            <button
              class="btn-audio"
              :class="{ activo: reproduciendo }"
              @click="toggleAudio"
            >
              {{ reproduciendo ? t.pausar : t.escuchar }}
            </button>

            <div class="cv-wrapper">
              <input type="checkbox" id="cv-check" />
              <label for="cv-check" @click="onCvClick">
                <div class="button_inner">
                  <ion-icon name="log-in-outline" class="l"></ion-icon>
                  <span class="t">{{ lang === 'es' ? 'Descargar CV' : 'Download CV' }}</span>
                  <span>
                    <ion-icon name="checkmark-outline" class="tick"></ion-icon>
                  </span>
                  <div class="b_l_quad">
                    <div v-for="n in 52" :key="n" class="button_spots"></div>
                  </div>
                </div>
              </label>
            </div>

          </div>

          <audio
            ref="audioRef"
            :src="'/src/assets/audio/presentacion.mp3'"
            @ended="reproduciendo = false"
          ></audio>

          <p class="placeholder-aviso">
            🎙 Audio: <code>/src/assets/audio/presentacion.mp3</code>
          </p>
        </div>

      </div>

      <!-- Video -->
      <div class="video-wrap">
        <h3 class="video-titulo">{{ t.video }}</h3>
        <div class="video-container">
          <video
            controls
            class="video-player"
            :poster="'/src/assets/images/poster.jpeg'"
          >
            <source :src="'/src/assets/video/intro.mp4'" type="video/mp4">
          </video>
          <p class="placeholder-aviso">
            🎬 Video: <code>/src/assets/video/intro.mp4</code>
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>

/* ── Layout principal ── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;
}

.hero-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.reveal {
  opacity: 0;
  transform: translateY(3.75rem) scale(0.95);
  transition: opacity   0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active { opacity: 1; transform: translateY(0) scale(1); }

.hero-img {
  position: relative;
  width: 16rem;
  height: 20rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--color-border),
              0 0 20px rgba(232, 89, 60, 0);
  transition: box-shadow 0.4s ease;
}

.hero-img:hover {
  box-shadow: 0 0 0 1px rgba(232, 89, 60, 0.6),
              0 0 30px rgba(232, 89, 60, 0.3),
              0 0 60px rgba(242, 166, 35, 0.15);
}

.foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 1rem;
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1;
}

.zonas {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 2;
}
.zona { cursor: default; }

/* ── Texto ── */
.saludo-small {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--sunset-orange);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 0.75rem;
}

.rol {
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.bio {
  color: var(--color-muted);
  max-width: 30rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

/* ── Fila de botones ── */
.botones-fila {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

/* Botón audio — UNA sola declaración */
.btn-audio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  height: 3rem;
  border: 1.5px solid var(--sunset-orange);
  border-radius: 999px;
  background: transparent;
  color: var(--sunset-orange);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-audio:hover,
.btn-audio.activo { background-color: var(--sunset-orange); color: #fff; }

/* ── Botón CV Fizzy ── */
.cv-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  input { display: none; }
}

.button_inner {
  border-radius: 999px;
  position: relative;
  width: 12rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: 2px solid var(--sunset-gold);
  color: var(--sunset-gold);
  font-family: var(--font-body);
  text-align: center;
  transition: all 0.3s, box-shadow 0.2s, transform 0.2s 0.2s;
  overflow: visible;

  span.t {
    position: relative;
    top: 0;
    opacity: 1;
    left: -0.6rem;
    transition: left 0.4s 0.1s;
  }

  .l {
    position: relative;
    left: -1.2rem;
    top: 0.1rem;
    color: var(--sunset-orange);
    font-size: 1.4rem;
    opacity: 0;
    transition: left 0.3s 0s, top 0.3s 0s, opacity 0.3s 0s;
  }

  &:hover {
    color: #1a0f0a;
    background: var(--sunset-gold);
    box-shadow: 0 17px 18px -14px rgba(0, 0, 0, 0.3);

    span.t {
      left: 1rem;
      transition: left 0.4s;
    }

    .l {
      top: 0.1rem;
      opacity: 1;
      transition: left 0.3s 0s, top 0.3s 0.1s, opacity 0.3s 0.1s;
    }
  }
}

.tick {
  position: absolute;
  left: 0;
  right: 0;
  transform: scale(0) rotate(-90deg);
  color: var(--sunset-gold);
  margin: auto;
  font-size: 1.4rem;
}

/* Partículas posicionadas en 4 grupos */
.b_l_quad .button_spots {
  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      padding: #{random(3) + 2}px;
      left: #{-25 + ($i * 12)}px;
      top: 50px;
    }
  }
  @for $i from 20 through 40 {
    &:nth-child(#{$i}) {
      padding: #{random(3) + 2}px;
      left: #{-255 + ($i * 12)}px;
      top: -12px;
    }
  }
  @for $i from 40 through 46 {
    &:nth-child(#{$i}) {
      padding: #{random(3) + 2}px;
      left: 204px;
      top: #{-488 + ($i * 12)}px;
    }
  }
  @for $i from 46 through 52 {
    &:nth-child(#{$i}) {
      padding: #{random(3) + 2}px;
      left: -10px;
      top: #{-568 + ($i * 12)}px;
    }
  }
}

.button_spots {
  position: absolute;
  border-radius: 100px;
  opacity: 0;

  @for $i from 1 through 52 {
    &:nth-of-type(#{$i}) {
      $h: random(60) + 10;
      $s: 57 - random(10);
      $tx: 90 - random(10);
      $ty: 20 - random(10);
      $dur: 1 + random(10) / 10;
      transform-origin: #{$tx}px #{$ty}px;
      background: hsl($h, $s * 1%, 65%);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.12);
      transition: all #{$dur}s;
    }
  }
}

/* Estado activado */
input:checked + label {
  .button_inner {
    background: transparent;
    transform: rotate(90deg);
    width: 3rem;
    border-radius: 100px;
    box-shadow: 0 0 0 440px rgba(0, 0, 0, 0);
    animation: finalbox 0.4s 4.42s cubic-bezier(0.39, 2.01, 0.27, 0.75) forwards;

    span.t {
      opacity: 0;
      top: 1.25rem;
    }
  }

  .l {
    left: 0.875rem;
    opacity: 1;
    top: 0.2rem;
    animation: bajar 1s 0.25s infinite, final 0.2s 4s forwards;
  }

  .tick {
    transform: scale(0) rotate(-90deg);
    top: 0;
    animation: tick-anim 0.3s 4.7s forwards;
  }

  .button_spots {
    opacity: 1;

    @for $i from 0 through 52 {
      &:nth-of-type(#{$i}) {
        top: #{16 - random(10)}px !important;
        left: -34px !important;
        opacity: 0;
        padding: #{random(20) / 4 + 2}px !important;
        animation:
          spew 1s 0.3s forwards,
          rotate #{4 + random(4) / 10}s #{0.25 + random(12) / 10}s linear infinite,
          final 0.2s 4s forwards,
          spot-#{$i} 0.7s #{random(10) / 10}s linear infinite !important;
      }
    }
  }
}

/* Keyframes de partículas */
@for $i from 1 through 20 {
  @keyframes spot-#{$i} {
    from { opacity: 0; }
    to   { transform: translateY(30px) translateX(#{-20px + $i * 2}); opacity: 0.6; }
  }
}
@for $i from 20 through 40 {
  @keyframes spot-#{$i} {
    from { opacity: 0; }
    to   { transform: translateY(-30px) translateX(#{-50px + $i * 2}); opacity: 0.6; }
  }
}
@for $i from 40 through 45 {
  @keyframes spot-#{$i} {
    from { opacity: 0; }
    to   { transform: translateY(#{-86px + $i * 2}) translateX(40px); opacity: 0.6; }
  }
}
@for $i from 46 through 54 {
  @keyframes spot-#{$i} {
    from { opacity: 0; }
    to   { transform: translateY(#{-99px + $i * 2}) translateX(-40px); opacity: 0.6; }
  }
}

@keyframes bajar {
  from { transform: translateY(0);   }
  to   { transform: translateY(6px); }
}
@keyframes spew {
  from { opacity: 0;   }
  to   { opacity: 0.8; }
}
@keyframes rotate {
  from { opacity: 0.8; }
  to   { transform: rotate(360deg); opacity: 0.8; }
}
@keyframes final {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes finalbox {
  from {}
  to   { width: 3rem; }
}
@keyframes tick-anim {
  from {}
  to   { transform: scale(1) rotate(-90deg); }
}

/* ── Video ── */
.video-wrap { text-align: center; }

.video-titulo {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: var(--color-muted);
}

.video-container {
  position: relative;
  max-width: 50rem;
  margin-inline: auto;
}

.video-player {
  width: 100%;
  border-radius: var(--radius);
  background: var(--color-surface2);
  border: 2px dashed var(--color-border);
  min-height: 18rem;
}

.placeholder-aviso {
  color: var(--color-muted);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.placeholder-aviso code {
  color: var(--sunset-gold);
  background: var(--color-surface2);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
}

/* Media queries al final */
@media (width <= 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-img {
    width: 12rem;
    height: 15rem;
    margin-inline: auto;
  }
  .bio { margin-inline: auto; }
  .botones-fila { justify-content: center; }
}
</style>