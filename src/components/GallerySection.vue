<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'

defineProps({
  proyectos: { type: Array, default: () => [] },
  cargando: { type: Boolean, default: false },
})

const { locale, t } = useI18n('gallery')
const { target: seccionRef, isRevealed } = useScrollReveal({ threshold: 0.1 })

const SKELETON_COUNT = 3

// ── Imágenes de proyecto (drop-in) ────────────────────────────
// Coloca el archivo en src/assets/images/ y su nombre en portfolio.json
// (campo "imagen"). Vite resuelve la ruta; si la imagen no existe,
// la tarjeta cae al placeholder automáticamente.
const imagenesFallidas = ref(new Set())

function imagenUrl(nombre) {
  return new URL(`../assets/images/${nombre}`, import.meta.url).href
}

function mostrarImagen(proyecto) {
  return Boolean(proyecto.imagen) && !imagenesFallidas.value.has(proyecto.id)
}

function onImgError(id) {
  // Reasignar el Set para que Vue detecte el cambio.
  imagenesFallidas.value = new Set(imagenesFallidas.value).add(id)
}
</script>

<template>
  <section id="galeria" class="section" ref="seccionRef">
    <div class="container">
      <h2 class="section-title">{{ t.titulo }}</h2>

      <!-- Grid auto-fill: responsive sin media query extra -->
      <div class="galeria-grid">

        <!-- Estado de carga: skeletons con shimmer -->
        <template v-if="cargando">
          <div v-for="n in SKELETON_COUNT" :key="`sk-${n}`" class="skeleton-card" aria-hidden="true">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line"></div>
              <div class="sk-line short"></div>
            </div>
          </div>
        </template>

        <!-- Tarjetas con volteo 3D (flip) accesibles por teclado -->
        <template v-else>
        <article
          v-for="(proyecto, index) in proyectos"
          :key="proyecto.id"
          class="tarjeta reveal-item"
          :class="{ active: isRevealed }"
          tabindex="0"
          :style="{ transitionDelay: `${index * 0.08}s` }"
          :aria-label="`${locale === 'es' ? proyecto.titulo : proyecto.tituloEn}. ${locale === 'es' ? proyecto.descripcion : proyecto.descripcionEn}`"
        >
          <div class="tarjeta-inner">
            <!-- Cara frontal -->
            <div class="tarjeta-front">
              <div class="tarjeta-img">
                <img
                  v-if="mostrarImagen(proyecto)"
                  class="tarjeta-foto"
                  :src="imagenUrl(proyecto.imagen)"
                  :alt="locale === 'es' ? proyecto.titulo : proyecto.tituloEn"
                  width="300"
                  height="210"
                  loading="lazy"
                  @error="onImgError(proyecto.id)"
                />
                <div v-else class="img-placeholder">
                  <ion-icon name="image-outline" aria-hidden="true"></ion-icon>
                  <span class="ph-titulo">{{ locale === 'es' ? proyecto.titulo : proyecto.tituloEn }}</span>
                </div>
                <div class="tarjeta-overlay" aria-hidden="true">
                  <span class="categoria">{{ proyecto.categoria }}</span>
                </div>
              </div>
              <div class="tarjeta-info">
                <h3>{{ locale === 'es' ? proyecto.titulo : proyecto.tituloEn }}</h3>
                <span class="ver-mas" aria-hidden="true">
                  {{ locale === 'es' ? 'Ver detalle' : 'View detail' }}
                  <ion-icon name="sync-outline"></ion-icon>
                </span>
              </div>
            </div>

            <!-- Cara trasera -->
            <div class="tarjeta-back" aria-hidden="true">
              <span class="categoria">{{ proyecto.categoria }}</span>
              <h3>{{ locale === 'es' ? proyecto.titulo : proyecto.tituloEn }}</h3>
              <p>{{ locale === 'es' ? proyecto.descripcion : proyecto.descripcionEn }}</p>
            </div>
          </div>
        </article>
        </template>
      </div>

      <p v-if="!cargando && proyectos.length === 0" class="vacio" role="status">{{ t.vacio }}</p>
    </div>
  </section>
</template>

<style scoped>
.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr));
  gap: 1.75rem;
}

/* ── Tarjeta con perspectiva para el volteo 3D ── */
.tarjeta {
  height: 22rem;
  perspective: 1200px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.tarjeta:focus-visible {
  outline: 2px solid var(--sunset-orange);
  outline-offset: 4px;
}

/* Entrada escalonada al hacer scroll (stagger via transition-delay inline) */
.reveal-item { opacity: 0; transform: translateY(1.75rem); }
.reveal-item.active { opacity: 1; transform: translateY(0); }

.tarjeta-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.tarjeta:hover .tarjeta-inner,
.tarjeta:focus-within .tarjeta-inner {
  transform: rotateY(180deg);
}

.tarjeta-front,
.tarjeta-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
}

/* Cara frontal */
.tarjeta-front { display: flex; flex-direction: column; }

.tarjeta-img { position: relative; overflow: hidden; }

.tarjeta-foto {
  width: 100%;
  height: 13.125rem;
  object-fit: cover;
  display: block;
}

.img-placeholder {
  width: 100%;
  height: 13.125rem;
  background:
    radial-gradient(circle at 50% 35%, rgba(232, 89, 60, 0.12), transparent 60%),
    var(--color-surface2);
  border-bottom: 1px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  color: var(--color-muted);
  font-size: 0.85rem;
}
.img-placeholder ion-icon {
  font-size: 2.25rem;
  color: var(--sunset-orange);
  opacity: 0.7;
}
.ph-titulo { font-weight: 500; }

.tarjeta-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  background: linear-gradient(to top, rgba(15, 10, 24, 0.7), transparent 60%);
}

.categoria {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sunset-gold);
  background: rgba(15, 10, 24, 0.6);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(242, 166, 35, 0.4);
}

.tarjeta-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1.25rem;
}
.tarjeta-info h3 { font-size: 1.1rem; }
.ver-mas {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: var(--color-muted);
  white-space: nowrap;
}

/* Cara trasera */
.tarjeta-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.75rem;
  background:
    radial-gradient(circle at 80% 0%, rgba(242, 166, 35, 0.12), transparent 55%),
    var(--color-surface2);
}
.tarjeta-back h3 { font-size: 1.25rem; }
.tarjeta-back p { color: var(--color-muted); font-size: 0.92rem; line-height: 1.6; }

/* Resplandor en hover/focus (holográfico) */
.tarjeta:hover .tarjeta-front,
.tarjeta:hover .tarjeta-back,
.tarjeta:focus-within .tarjeta-front,
.tarjeta:focus-within .tarjeta-back {
  border-color: rgba(232, 89, 60, 0.5);
  box-shadow: var(--shadow-lg);
}

/* ── Skeleton de carga ── */
.skeleton-card {
  height: 22rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
}
.sk-img { height: 13.125rem; }
.sk-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sk-line { height: 0.9rem; border-radius: 0.3rem; }
.sk-line.short { width: 60%; }
.sk-img,
.sk-line {
  background: linear-gradient(
    100deg,
    var(--color-surface2) 30%,
    var(--color-border) 50%,
    var(--color-surface2) 70%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.3s linear infinite;
}
@keyframes skeleton-shimmer {
  to { background-position: -200% 0; }
}

.vacio { margin-top: 2rem; text-align: center; color: var(--color-muted); }

/* ── Accesibilidad: sin volteo 3D ni shimmer perpetuo con reduced-motion.
   En su lugar, la cara trasera aparece con un fundido. ── */
@media (prefers-reduced-motion: reduce) {
  .tarjeta-inner { transform: none !important; transition: none; }
  .tarjeta-front,
  .tarjeta-back {
    backface-visibility: visible;
    transition: opacity 0.3s ease;
  }
  .tarjeta-back { transform: none; opacity: 0; }
  .tarjeta:hover .tarjeta-back,
  .tarjeta:focus-within .tarjeta-back { opacity: 1; }
  .tarjeta:hover .tarjeta-front,
  .tarjeta:focus-within .tarjeta-front { opacity: 0; }

  .sk-img,
  .sk-line { animation: none; }
}
</style>
