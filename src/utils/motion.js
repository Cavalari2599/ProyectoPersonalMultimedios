/**
 * Indica si el usuario ha pedido reducir el movimiento del sistema
 * (Accesibilidad: prefers-reduced-motion).
 * @returns {boolean}
 */
export function prefiereMenosMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
