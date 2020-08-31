import './css/menu.scss'
import { OpenNewTabMessage } from '../../types'
import { mount } from '../../utils'
import { showPanel } from './dialog'
import { showPanel as ShowAddKeyDialogPanel } from './addKeyDialog'

const html = `
  <ul class="dexter-menu">
    <li class="dexter-menu-item">
      <button type="button" class="dexter-menu-btn">
        <span class="dexter-menu-text">View Equipment Details</span>
      </button>
    </li>
    <li class="dexter-menu-item">
      <button type="button" class="dexter-menu-btn">
        <span class="dexter-menu-text">Add new keyword</span>
      </button>
    </li>
    <li class="dexter-menu-item">
      <button type="button" class="dexter-menu-btn">
        <span class="dexter-menu-text">Not a keyword</span>
      </button>
    </li>
  </ul>
`

export function menu (): void {
  mount(html)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const menu = document.querySelector('.dexter-menu') as HTMLElement

  function showMenu (x: number, y: number): void {
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
    menu.classList.add('dexter-menu-show')
  }

  function hideMenu (): void {
    menu.classList.remove('dexter-menu-show')
  }

  function onClick (e: MouseEvent): void {
    e.preventDefault()
    showMenu(e.pageX, e.pageY)
    document.addEventListener('mousedown', onMouseDown, false)
  }

  const highlighted = document.querySelectorAll('.dexter-highlighted')

  Array.from(highlighted).forEach((it) => {
    it.addEventListener('click', (event) => {
      event.preventDefault()
      if (event.target instanceof Element) {
        const text = event.target.textContent!
        ;(window as any).dexterKeyword = text
        onClick(event as MouseEvent)
      }
    })
  })

  setTimeout(() => {
    const btns = document.querySelectorAll('.dexter-menu-item')
    Array.from(btns).forEach((it) => {
      it.addEventListener('mousedown', (event) => {
        if (event.target instanceof Element) {
          let text = ''
          if (event.target.tagName.toUpperCase() === 'SPAN') {
            text = event.target.textContent!
          } else {
            text = event.target.querySelector('span')!.textContent!
          }

          if (text === 'View Equipment Details') {
            const openNewTabMessage: OpenNewTabMessage = {
              keyword: (window as any).dexterKeyword,
            }
            chrome.runtime.sendMessage(openNewTabMessage)
          } else if (text === 'Not a keyword') {
            showPanel()
          } else if (text === 'Add new keyword') {
            ShowAddKeyDialogPanel()
          }
        }
      })
    })
  }, 0)

  function onMouseDown (e: Event): void {
    hideMenu()
    document.removeEventListener('mousedown', onMouseDown)
  }
}
