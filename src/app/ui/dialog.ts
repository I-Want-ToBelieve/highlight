import './css/dialog.scss'
import { mount } from '../../utils'

const html = `
<div class="dexter-container dexter-rejective__key">
  <div class="dexter-middle">
    <div class="dexter-panel dexter-js-panel">
      <div class="dexter-panel__content">
        <h4>Just Checking...</h4>
        <h2>Delete the keyword?</h2>
        <p>
           If you regret it, you can go to the Settings page and add it back.
        </p>
      </div>
      <div class="dexter-panel__flaps">
        <div class="dexter-flap dexter-outer dexter-flap--left"></div>
        <a class="dexter-flap dexter-flap__btn" href="#">YES</a>
        <a class="dexter-flap dexter-flap__btn" href="#">NO</a>
        <div class="dexter-flap dexter-outer dexter-flap--right"></div>
      </div>
    </div>
  </div>
</div>
`

export function hidePanel (): void {
  const panel = document.querySelector(
    '.dexter-rejective__key .dexter-js-panel'
  ) as Element
  panel.classList.remove('is--open')
}

export function showPanel (): void {
  const panel = document.querySelector(
    '.dexter-rejective__key .dexter-js-panel'
  ) as Element
  panel.classList.add('is--open')
}
// On load, init panel
export interface Callbacks {
  yes?: () => unknown
  no?: () => unknown
}
function init ({ yes, no }: Callbacks): void {
  mount(html)

  setTimeout(() => {
    const btns = document.querySelectorAll(
      '.dexter-rejective__key .dexter-flap__btn'
    )
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (event) {
        if (event.target instanceof Element) {
          const text = event.target.textContent
          const { scrollLeft, scrollTop } = document.documentElement
          window.onscroll = function (e: Event) {
            window.scrollTo(scrollLeft, scrollTop)
          }
          if (text === 'YES') {
            yes?.()
          } else {
            no?.()
          }
        }
        hidePanel()
        setTimeout(() => {
          window.onscroll = null
        }, 200)
      })
    }
  }, 0)
}

export function dialog (callback: Callbacks): void {
  init(callback)
}
