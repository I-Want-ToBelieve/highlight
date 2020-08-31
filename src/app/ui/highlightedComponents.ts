import './css/highlighted.scss'

export const highlightedComponents = (
  text: string,
  color = 'purple'
): string => {
  return `<span class="dexter-highlighted ${color}">${text}</span>`
}
