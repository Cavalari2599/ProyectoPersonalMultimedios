import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Marca cuál sección está visible para resaltar el enlace activo del nav.
 * Usa IntersectionObserver (sin listeners de scroll en el hilo principal).
 * @param {string[]} ids IDs de las secciones a observar, en orden.
 * @returns {{ activeId: import('vue').Ref<string> }}
 */
export function useScrollSpy(ids) {
  const activeId = ref(ids[0] ?? '')
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeId.value = entry.target.id
        }
      },
      // La "línea de lectura" está en el tercio superior del viewport.
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onUnmounted(() => observer?.disconnect())

  return { activeId }
}
