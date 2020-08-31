import './css/dialog.scss'
import './css/dialog_addkey.scss'
import { mount } from '../../utils'

const html = `
<div class="dexter-container dexter-add__key">
  <div class="dexter-middle">
    <div class="dexter-panel dexter-js-panel">
      <div class="dexter-panel__content">
        <h4>Add keywords...</h4>
        <h2>Enter keywords:</h2>
        <div class="input__container">
          <div class="group">
            <input type="text" required class="keywords__input">
            <span class="highlight"></span>
            <span class="bar"></span>
            <label>Keywords</label>
          </div>
        </div>
        <p>
           Multiple keywords can be added using comma seprate values. (123, abc, e3p)
        </p>
      </div>
      <div class="dexter-panel__flaps">
        <div class="dexter-flap dexter-outer dexter-flap--left"></div>
        <a class="dexter-flap dexter-flap__btn" href="#">Submit</a>
        <a class="dexter-flap dexter-flap__btn" href="#">Close</a>
        <div class="dexter-flap dexter-outer dexter-flap--right"></div>
      </div>
    </div>
  </div>
</div>
`

function onInput (): void {
  const input = document.querySelector('.keywords__input') as HTMLInputElement

  input.addEventListener('input', (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      verification(event.target.value)
    }
  })
}

function getInputValue (): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const input = document.querySelector('.keywords__input') as HTMLInputElement
  return input.value
}

function clearInputValue (): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const input = document.querySelector('.keywords__input') as HTMLInputElement
  input.value = ''
}

function verification (value: string): boolean {
  const inputContainer = document.querySelector('.input__container') as Element

  if (value.split(',').filter((it) => it.trim() !== '').length > 0) {
    inputContainer.classList.remove('error')
    return true
  } else {
    inputContainer.classList.add('error')
    return false
  }
}

export function hidePanel (): void {
  const panel = document.querySelector(
    '.dexter-add__key .dexter-js-panel'
  ) as Element
  panel.classList.remove('is--open')
}

export function showPanel (): void {
  const panel = document.querySelector(
    '.dexter-add__key .dexter-js-panel'
  ) as Element
  panel.classList.add('is--open')
}
// On load, init panel
export interface Callbacks {
  yes?: (keyword: string[]) => unknown
  no?: () => unknown
}
function init ({ yes, no }: Callbacks): void {
  mount(html)

  setTimeout(() => {
    onInput()
    const btns = document.querySelectorAll('.dexter-add__key .dexter-flap__btn')
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (event) {
        if (event.target instanceof Element) {
          const text = event.target.textContent
          const { scrollLeft, scrollTop } = document.documentElement
          window.onscroll = function (e: Event) {
            window.scrollTo(scrollLeft, scrollTop)
          }
          if (text === 'Submit') {
            const value = getInputValue()
            if (verification(value)) {
              yes?.(
                value
                  .replace('，', ',')
                  .split(',')
                  .filter((it) => it.trim() !== '')
                  .map((it) => it.trim())
              )
            } else {
              window.onscroll = null
              return void 0
            }
          } else {
            no?.()
          }
        }
        hidePanel()
        clearInputValue()
        setTimeout(() => {
          window.onscroll = null
        }, 200)
      })
    }
  }, 0)
}

export function addKeyDialog (callback: Callbacks): void {
  init(callback)
}
