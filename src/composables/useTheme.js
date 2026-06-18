import { nextTick, ref, watch } from 'vue'
import { prefiereMenosMovimiento } from '../utils/motion.js'

const STORAGE_KEY = 'portfolio-theme'

// Tema inicial: preferencia guardada > preferencia del sistema > 'night'.
function initialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'day' || saved === 'night') return saved
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return prefersLight ? 'day' : 'night'
}

// Estado de tema compartido por toda la app (singleton de módulo).
const theme = ref(initialTheme())

// Refleja el tema activo en el atributo data-theme y lo persiste.
// El CSS resuelve los colores con light-dark() según ese atributo.
watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_KEY, value)
  },
  { immediate: true },
)

export function useTheme() {
  function cambiarTema() {
    theme.value = theme.value === 'night' ? 'day' : 'night'
  }

  // View Transition: fundido suave entre temas donde el navegador lo
  // soporta; cambio directo si no, o si el usuario pide menos movimiento.
  function toggleTheme() {
    if (!document.startViewTransition || prefiereMenosMovimiento()) {
      cambiarTema()
      return
    }
    document.startViewTransition(async () => {
      cambiarTema()
      await nextTick()
    })
  }

  return { theme, toggleTheme }
}
