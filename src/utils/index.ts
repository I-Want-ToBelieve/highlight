import Toastify from 'toastify-js'

export function useWalkTextNode (el: Element): Element[] {
  let node
  const result = []
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  while ((node = walk.nextNode())) result.push(node)
  return result as Element[]
}

export function mount (html: string): void {
  const range = document.createRange()
  // make the parent of the first div in the document becomes the context node
  range.selectNode(document.body)
  const documentFragment = range.createContextualFragment(html)
  document.body.appendChild(documentFragment)
}

export function handleError (error: Error): void {
  toastifyFailure('Server or network exception please try again later.')
  console.error(error)
}

export function toastifyFailure (message: string): void {
  Toastify({
    text: message,
    backgroundColor: '#f44336',
  }).showToast()
}

export function toastifySucceed (message: string): void {
  Toastify({
    text: message,
    backgroundColor: '#8bc34a',
  }).showToast()
}
