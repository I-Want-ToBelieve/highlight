declare module 'toastify-js' {
  // https://github.com/apvarun/toastify-js
  interface T {
    showToast: () => void
  }
  function Toastify (options: {
    text: string
    duration?: number
    destination?: string
    newWindow?: boolean
    close?: boolean
    gravity?: 'top' | 'bottom'
    position?: 'left' | 'center' | 'right'
    stopOnFocus?: boolean
    backgroundColor?: string
  }): T
  export = Toastify
}
