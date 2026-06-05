<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'
import { useTypewriter } from '../composables/useTypewriter.js'

const props = defineProps({
  cvRuta: { type: String, default: '' },
})

const { t } = useI18n('about')

// ── Nombre en letras (split text) para entrada escalonada ──────
// Espacios → no-break space para conservar el hueco al animar inline-block.
const nombreLetras = computed(() => [...t.value.nombre].map((c) => (c === ' ' ? ' ' : c)))

// ── Rol con efecto máquina de escribir (respeta reduced-motion) ─
const { output: rolEscrito, escribiendo: rolEscribiendo } = useTypewriter(() => t.value.rol)

// ── Assets ────────────────────────────────────────────────────
// new URL + import.meta.url: Vite resuelve y hashea cada asset en build,
// manteniéndolos dentro de src/assets (sin moverlos a public).
const fotoUrl = new URL('../assets/images/foto-perfil.jpeg', import.meta.url).href
const posterUrl = new URL('../assets/images/poster.jpeg', import.meta.url).href
const audioUrl = new URL('../assets/audio/presentacion.mp3', import.meta.url).href
const videoUrl = new URL('../assets/video/intro.mp4', import.meta.url).href

// ── Reveal al entrar al viewport ──────────────────────────────
const { target: seccionRef, isRevealed } = useScrollReveal({ threshold: 0.1 })

// ── Audio ─────────────────────────────────────────────────────
const audioRef = ref(null)
const reproduciendo = ref(false)

function toggleAudio() {
  const audio = audioRef.value
  if (!audio) return

  if (reproduciendo.value) {
    audio.pause()
    reproduciendo.value = false
    return
  }

  audio
    .play()
    .then(() => {
      reproduciendo.value = true
    })
    .catch((error) => {
      console.error('No se pudo reproducir el audio:', error)
      reproduciendo.value = false
    })
}

// ── Descarga de CV ────────────────────────────────────────────
// Los retrasos coinciden con la animación del botón (la descarga
// dispara cuando el "fizzy" termina, el reset deja el botón listo de nuevo).
const DOWNLOAD_DELAY_MS = 4700
const RESET_DELAY_MS = 5200

const cvCheckbox = ref(null)
const descargando = ref(false)

function onCvClick() {
  if (descargando.value) return
  descargando.value = true

  setTimeout(() => {
    // import.meta.url resuelve el PDF dentro de src/assets/data en dev y build.
    const link = document.createElement('a')
    link.href = new URL(`../assets/data/${props.cvRuta}`, import.meta.url).href
    link.download = props.cvRuta || ''
    link.click()
  }, DOWNLOAD_DELAY_MS)

  setTimeout(() => {
    if (cvCheckbox.value) cvCheckbox.value.checked = false
    descargando.value = false
  }, RESET_DELAY_MS)
}

// ── Partículas del botón CV ───────────────────────────────────
// Sustituye a los bucles SCSS: cada partícula lleva sus valores
// (posición, color, tiempos, destino) en variables CSS calculadas aquí.
const SPOT_COUNT = 52
const randInt = (max) => Math.floor(Math.random() * max) + 1 // 1..max

const particles = Array.from({ length: SPOT_COUNT }, (_, idx) => {
  const i = idx + 1

  // Posición base por grupo (el último grupo que cubre el índice gana).
  let left
  let top
  if (i <= 19) {
    left = -25 + i * 12
    top = 50
  } else if (i <= 39) {
    left = -255 + i * 12
    top = -12
  } else if (i <= 45) {
    left = 204
    top = -488 + i * 12
  } else {
    left = -10
    top = -568 + i * 12
  }

  // Destino de la explosión por grupo.
  let endX
  let endY
  if (i <= 19) {
    endX = -20 + i * 2
    endY = 30
  } else if (i <= 39) {
    endX = -50 + i * 2
    endY = -30
  } else if (i <= 45) {
    endX = 40
    endY = -86 + i * 2
  } else {
    endX = -40
    endY = -99 + i * 2
  }

  return {
    left,
    top,
    endX,
    endY,
    padBase: randInt(3) + 2,
    hue: randInt(60) + 10,
    sat: 57 - randInt(10),
    originX: 90 - randInt(10),
    originY: 20 - randInt(10),
    dur: 1 + randInt(10) / 10,
    pad: randInt(20) / 4 + 2,
    activeTop: 16 - randInt(10),
    durRotate: 4 + randInt(4) / 10,
    delRotate: 0.25 + randInt(12) / 10,
    delSpot: randInt(10) / 10,
  }
})

function spotStyle(p) {
  return {
    '--left': `${p.left}px`,
    '--top': `${p.top}px`,
    '--pad-base': `${p.padBase}px`,
    '--h': p.hue,
    '--s': `${p.sat}%`,
    '--tx': `${p.originX}px`,
    '--ty': `${p.originY}px`,
    '--dur': `${p.dur}s`,
    '--pad': `${p.pad}px`,
    '--active-top': `${p.activeTop}px`,
    '--dur-rotate': `${p.durRotate}s`,
    '--del-rotate': `${p.delRotate}s`,
    '--del-spot': `${p.delSpot}s`,
    '--end-x': `${p.endX}px`,
    '--end-y': `${p.endY}px`,
  }
}

// ── Efecto zonas 3x3 sobre la foto ────────────────────────────
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
  zonaActiva.value ? desplazamientos[zonaActiva.value] : 'translate(0, 0)',
)

function setZona(n) {
  zonaActiva.value = n
}
function resetZona() {
  zonaActiva.value = 0
}
</script>

<template>
  <section id="sobre-mi" class="section" ref="seccionRef">
    <div class="container">

      <div class="about-grid">

        <!-- Columna izquierda: foto -->
        <div class="hero-wrap reveal" :class="{ active: isRevealed }">
          <div class="hero-img">
            <img
              class="foto"
              :src="fotoUrl"
              :alt="t.fotoAlt"
              width="256"
              height="320"
              :style="{ transform: fotoTransform }"
            />
            <div class="zonas">
              <div
                v-for="n in 9"
                :key="n"
                class="zona"
                @mouseenter="setZona(n)"
                @mouseleave="resetZona"
              ></div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: texto + audio + CV -->
        <div class="about-texto">
          <p class="saludo-small">{{ t.saludo }}</p>
          <h1 class="hero-nombre" :aria-label="t.nombre">
            <span
              v-for="(letra, i) in nombreLetras"
              :key="i"
              class="letra"
              aria-hidden="true"
              :style="{ animationDelay: `${i * 0.06}s` }"
            >{{ letra }}</span>
          </h1>
          <p class="rol" :class="{ escribiendo: rolEscribiendo }" aria-live="off">{{ rolEscrito }}</p>
          <p class="bio">{{ t.bio }}</p>

          <!-- Fila de botones -->
          <div class="botones-fila">

            <button
              class="btn-audio"
              type="button"
              :class="{ activo: reproduciendo }"
              :aria-pressed="reproduciendo"
              @click="toggleAudio"
            >
              <!-- Ecualizador animado mientras suena; icono play/pause si no -->
              <span v-if="reproduciendo" class="eq" aria-hidden="true">
                <i></i><i></i><i></i><i></i>
              </span>
              <ion-icon v-else name="play" aria-hidden="true"></ion-icon>
              {{ reproduciendo ? t.pausar : t.escuchar }}
            </button>

            <div class="cv-wrapper">
              <input ref="cvCheckbox" type="checkbox" id="cv-check" />
              <label for="cv-check" @click="onCvClick">
                <div class="button_inner">
                  <ion-icon name="log-in-outline" class="l"></ion-icon>
                  <span class="t">{{ t.descargarCv }}</span>
                  <span>
                    <ion-icon name="checkmark-outline" class="tick"></ion-icon>
                  </span>
                  <div class="b_l_quad">
                    <div
                      v-for="(p, idx) in particles"
                      :key="idx"
                      class="button_spots"
                      :style="spotStyle(p)"
                    ></div>
                  </div>
                </div>
              </label>
            </div>

          </div>

          <audio
            ref="audioRef"
            :src="audioUrl"
            preload="none"
            @ended="reproduciendo = false"
          ></audio>

        </div>

      </div>

      <!-- Video -->
      <div class="video-wrap">
        <h3 class="video-titulo">{{ t.video }}</h3>
        <div class="video-container">
          <video
            controls
            preload="none"
            class="video-player"
            :poster="posterUrl"
          >
            <source :src="videoUrl" type="video/mp4">
          </video>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
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
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.reveal {
  opacity: 0;
  transform: translateY(3.75rem) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

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

/* Flotación suave en reposo — solo si el usuario no pidió menos movimiento. */
@media (prefers-reduced-motion: no-preference) {
  .hero-img { animation: hero-float 6s ease-in-out infinite; }
}
@keyframes hero-float {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -0.5rem; }
}

.foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  border-radius: 1rem;
  /* Desaturada en reposo, a color al pasar el cursor (image hover effect) */
  filter: grayscale(0.85) contrast(1.02);
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1),
              filter 0.5s ease;
  z-index: 1;
}
.hero-img:hover .foto {
  filter: grayscale(0) contrast(1);
}

.zonas {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 2;
}
.zona {
  cursor: default;
}

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

/* Nombre: cada letra entra de abajo con retardo escalonado (split text) */
.hero-nombre .letra {
  display: inline-block;
  opacity: 0;
  animation: letra-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes letra-in {
  from { opacity: 0; transform: translateY(0.6em) rotate(6deg); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-nombre .letra { opacity: 1; animation: none; }
}

.rol {
  min-height: 1.5em;
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}
/* Cursor parpadeante mientras escribe (máquina de escribir) */
.rol.escribiendo::after {
  content: '';
  display: inline-block;
  width: 0.6ch;
  height: 1.1em;
  margin-left: 0.1em;
  vertical-align: -0.15em;
  background: var(--sunset-orange);
  animation: caret-blink 0.8s steps(1) infinite;
}
@keyframes caret-blink {
  50% { opacity: 0; }
}

.bio {
  white-space: pre-line;
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

/* Botón audio */
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
.btn-audio ion-icon { font-size: 1.05rem; }
.btn-audio:hover,
.btn-audio.activo {
  background-color: var(--sunset-orange);
  color: #fff;
}
.btn-audio:active { transform: scale(0.96); }
.btn-audio:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 3px;
}
/* Pulso suave mientras reproduce */
.btn-audio.activo {
  animation: audio-pulse 1.6s ease-in-out infinite;
}
@keyframes audio-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232, 89, 60, 0.45); }
  50%      { box-shadow: 0 0 0 0.5rem rgba(232, 89, 60, 0); }
}

/* Ecualizador animado (barras) dentro del botón al reproducir */
.eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 1.05rem;
}
.eq i {
  width: 3px;
  height: 100%;
  border-radius: 1px;
  background: currentColor;
  transform-origin: bottom;
  animation: eq-bar 0.9s ease-in-out infinite;
}
.eq i:nth-child(2) { animation-delay: 0.2s; }
.eq i:nth-child(3) { animation-delay: 0.4s; }
.eq i:nth-child(4) { animation-delay: 0.1s; }
@keyframes eq-bar {
  0%, 100% { transform: scaleY(0.3); }
  50%      { transform: scaleY(1); }
}

/* Accesibilidad: sin loops perpetuos si se pide menos movimiento */
@media (prefers-reduced-motion: reduce) {
  .btn-audio.activo { animation: none; }
  .eq i { animation: none; transform: scaleY(0.6); }
}

/* ── Botón CV Fizzy ── */
.cv-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
/* Oculto visualmente pero enfocable por teclado (no display:none). */
.cv-wrapper input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.cv-wrapper input:focus-visible + label .button_inner {
  outline: 2px solid var(--sunset-gold);
  outline-offset: 3px;
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
}
.button_inner span.t {
  position: relative;
  top: 0;
  opacity: 1;
  left: -0.6rem;
  transition: left 0.4s 0.1s;
}
.button_inner .l {
  position: relative;
  left: -1.2rem;
  top: 0.1rem;
  color: var(--sunset-orange);
  font-size: 1.4rem;
  opacity: 0;
  transition: left 0.3s 0s, top 0.3s 0s, opacity 0.3s 0s;
}
.button_inner:hover {
  color: #1a0f0a;
  background: var(--sunset-gold);
  box-shadow: 0 17px 18px -14px rgba(0, 0, 0, 0.3);
}
.button_inner:hover span.t {
  left: 1rem;
  transition: left 0.4s;
}
.button_inner:hover .l {
  top: 0.1rem;
  opacity: 1;
  transition: left 0.3s 0s, top 0.3s 0.1s, opacity 0.3s 0.1s;
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

/* Partículas: posición y aspecto base desde variables CSS por partícula */
.button_spots {
  position: absolute;
  border-radius: 100px;
  opacity: 0;
  left: var(--left);
  top: var(--top);
  padding: var(--pad-base);
  transform-origin: var(--tx) var(--ty);
  background: hsl(var(--h), var(--s), 65%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.12);
  transition: all var(--dur);
}

/* Fizz en hover (como el original "super fizzy"): las partículas
   burbujean en bucle alrededor del botón mientras el cursor está encima. */
.button_inner:hover .button_spots {
  animation: spot 0.7s var(--del-spot) linear infinite;
}

/* Estado activado */
input:checked + label .button_inner {
  background: transparent;
  transform: rotate(90deg);
  width: 3rem;
  border-radius: 100px;
  box-shadow: 0 0 0 440px rgba(0, 0, 0, 0);
  animation: finalbox 0.4s 4.42s cubic-bezier(0.39, 2.01, 0.27, 0.75) forwards;
}
input:checked + label .button_inner span.t {
  opacity: 0;
  top: 1.25rem;
}
input:checked + label .l {
  left: 0.875rem;
  opacity: 1;
  top: 0.2rem;
  animation: bajar 1s 0.25s infinite, final 0.2s 4s forwards;
}
input:checked + label .tick {
  transform: scale(0) rotate(-90deg);
  top: 0;
  animation: tick-anim 0.3s 4.7s forwards;
}
input:checked + label .button_spots {
  top: var(--active-top) !important;
  left: -34px !important;
  opacity: 0;
  padding: var(--pad) !important;
  animation:
    spew 1s 0.3s forwards,
    rotate var(--dur-rotate) var(--del-rotate) linear infinite,
    final 0.2s 4s forwards,
    spot 0.7s var(--del-spot) linear infinite !important;
}

/* Una sola keyframe: el destino lo aporta cada partícula vía --end-x/--end-y */
@keyframes spot {
  from {
    opacity: 0;
  }
  to {
    transform: translateY(var(--end-y)) translateX(var(--end-x));
    opacity: 0.6;
  }
}

@keyframes bajar {
  from { transform: translateY(0); }
  to   { transform: translateY(6px); }
}
@keyframes spew {
  from { opacity: 0; }
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
  to { width: 3rem; }
}
@keyframes tick-anim {
  to { transform: scale(1) rotate(-90deg); }
}

/* ── Video ── */
.video-wrap {
  text-align: center;
}

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

/* ── Responsive ── */
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

  .hero-wrap {
    align-items: center;
  }

  .bio {
    margin-inline: auto;
  }

  .botones-fila {
    justify-content: center;
  }
}
</style>
