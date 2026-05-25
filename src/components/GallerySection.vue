<script setup>
import { inject, computed } from 'vue'

const lang = inject('lang')

const textos = {
  es: { titulo: 'Mis Proyectos', vacio: 'Cargando proyectos...' },
  en: { titulo: 'My Projects',   vacio: 'Loading projects...'   }
}
const t = computed(() => textos[lang.value])

defineProps({
  proyectos: { type: Array, default: () => [] }
})
</script>

<template>
  <section id="galeria" class="section">
    <div class="container">
      <h2 class="section-title">{{ t.titulo }}</h2>

      <!-- Grid auto-fill: responsive sin media query extra -->
      <div class="galeria-grid">
        <article v-for="proyecto in proyectos" :key="proyecto.id" class="tarjeta">
          <div class="tarjeta-img">
            <!--
              Las imágenes van en /public/
              Mientras no las tengas, se muestra un placeholder
            -->
            <div class="img-placeholder">
              <span>🖼 {{ proyecto.titulo }}<br><small>/public/{{ proyecto.imagen }}</small></span>
            </div>
            <div class="tarjeta-overlay" aria-hidden="true">
              <span class="categoria">{{ proyecto.categoria }}</span>
            </div>
          </div>

          <div class="tarjeta-info">
            <h3>{{ lang === 'es' ? proyecto.titulo      : proyecto.tituloEn      }}</h3>
            <p>{{  lang === 'es' ? proyecto.descripcion : proyecto.descripcionEn }}</p>
          </div>
        </article>
      </div>

      <p v-if="proyectos.length === 0" class="vacio" role="status">{{ t.vacio }}</p>
    </div>
  </section>
</template>

<style scoped>
.galeria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr));
  gap: 1.75rem;
}

.tarjeta {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform      0.3s ease,
              box-shadow     0.3s ease,
              border-color   0.3s ease;
}
.tarjeta:hover {
  transform: translateY(-0.375rem);
  box-shadow: var(--shadow-lg);
  border-color: rgba(232, 89, 60, 0.3);
}

.tarjeta-img { position: relative; overflow: hidden; }

/* Placeholder de imagen */
.img-placeholder {
  width: 100%;
  height: 13.125rem;
  background: var(--color-surface2);
  border-bottom: 1px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-muted);
  font-size: 0.85rem;
  line-height: 1.6;
  transition: var(--transition-transform);
}
.tarjeta:hover .img-placeholder { transform: scale(1.02); }

.tarjeta-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  background: linear-gradient(to top, rgba(15,10,24,0.7), transparent 60%);
  opacity: 0;
  transition: var(--transition-opacity);
}
.tarjeta:hover .tarjeta-overlay { opacity: 1; }

.categoria {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sunset-gold);
  background: rgba(15,10,24,0.6);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(242,166,35,0.4);
}

.tarjeta-info { padding: 1.25rem; }
.tarjeta-info h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
.tarjeta-info p  { color: var(--color-muted); font-size: 0.9rem; line-height: 1.5; }

.vacio { margin-top: 2rem; text-align: center; color: var(--color-muted); }
</style>