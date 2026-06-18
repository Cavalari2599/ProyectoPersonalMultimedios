import { ref, computed, watch } from 'vue'
import { messages } from '../i18n/messages.js'

const SUPPORTED = ['es', 'en']
const STORAGE_KEY = 'portfolio-locale'

// Idioma inicial: preferencia guardada > 'es'.
function initialLocale() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return SUPPORTED.includes(saved) ? saved : 'es'
}

// Estado de idioma compartido por toda la app (singleton de módulo).
const locale = ref(initialLocale())

// Sincroniza el atributo lang del documento y persiste el idioma activo.
watch(
  locale,
  (value) => {
    document.documentElement.lang = value
    localStorage.setItem(STORAGE_KEY, value)
  },
  { immediate: true },
)

/**
 * Acceso al idioma activo y a las traducciones.
 * @param {string} [namespace] Sección de mensajes a exponer (p. ej. 'about').
 *                             Sin namespace devuelve el árbol completo del idioma.
 */
export function useI18n(namespace) {
  function toggleLocale() {
    const index = SUPPORTED.indexOf(locale.value)
    locale.value = SUPPORTED[(index + 1) % SUPPORTED.length]
  }

  const t = computed(() => {
    const tree = messages[locale.value]
    return namespace ? tree[namespace] : tree
  })

  return { locale, toggleLocale, t }
}
