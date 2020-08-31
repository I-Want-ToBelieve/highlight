import '../styles/context.scss'
import '../styles/toastify.scss'
import { getDictionary, RejectKeyword, AddKeyword } from '../api'
import { WordEntry, DictionaryData } from '../types'
import { menu } from './ui/menu'
import { dialog } from './ui/dialog'
import { highlightedComponents } from './ui/highlightedComponents'
import { addKeyDialog } from './ui/addKeyDialog'
import config from '../config'
import {
  handleError,
  toastifyFailure,
  toastifySucceed,
  useWalkTextNode,
} from '../utils'
import { AxiosResponse } from 'axios'

function getExpressions (
  wordEntry: WordEntry[]
): {
  expressions: RegExp[]
  rejectedKeywords: string[]
} {
  const rejectedKeywords: string[] = []
  const expressions = wordEntry
    .filter((it) => {
      if (it.type === 'rejectedKeyword') {
        rejectedKeywords.push(it.expression)
        return false
      } else {
        return true
      }
    })
    .map((it) => {
      if (it.type === 'regEx') {
        return new RegExp(`(${it.expression})`, 'gi')
      } /* if (it.type === 'keyword') */ else {
        return new RegExp(`(${it.expression})`)
      }
    })

  return { expressions, rejectedKeywords }
}

async function replaceDOMText (wordEntry: WordEntry[]): Promise<void> {
  return await new Promise((resolve, reject) => {
    const { expressions, rejectedKeywords } = getExpressions(wordEntry)
    if (expressions.length === 0) resolve()

    chrome.storage.sync.get(['color'], (data) => {
      // replace
      useWalkTextNode(document.body)
        .filter(
          (it) =>
            it.textContent?.trim().length !== 0 &&
            it.parentNode !== null &&
            it.parentNode.nodeName.toUpperCase() !== 'SVG'
        )
        .map((it) => {
          const parentNode = it.parentNode as Element
          if (parentNode === null) return void 0

          let string = parentNode.innerHTML
          if (string.includes('<svg')) return void 0

          expressions.forEach((it) => {
            string = string.replace(it, (match_, p1, offset_, string_) => {
              if (rejectedKeywords.includes(p1)) return p1
              return highlightedComponents(p1, data.color)
            })
          })

          parentNode.innerHTML = string
        })
      resolve()
    })
  })
}

async function main (): Promise<void> {
  const expiresIn = config.expiresIn

  if (expiresIn === 0) {
    const dictionary = await getDictionary()

    chrome.storage.sync.set({ dictionary: dictionary.data.data })
  }

  chrome.storage.sync.get(['dictionary'], (data) => {
    const dictionary = data.dictionary

    replaceDOMText(dictionary)
      .then(() => {
        menu()

        dialog({
          yes () {
            RejectKeyword({ keyword: (window as any).dexterKeyword })
              .then(() => {
                toastifySucceed(
                  'Keywords rejected success, Please refresh the page to see the effect.'
                )
              })
              .catch((error) => {
                toastifyFailure('Failed to reject the keyword.')
                void handleError(error)
              })
          },
        })

        addKeyDialog({
          yes (keyword) {
            AddKeyword({
              keyword,
            })
              .then((data) => {
                toastifySucceed(
                  'Keywords added success, Please refresh the page to see the effect.'
                )
                chrome.storage.sync.set({
                  dictionary: ((data as unknown) as AxiosResponse<
                    DictionaryData
                  >).data.data,
                })
              })
              .catch((error) => {
                toastifyFailure('Keyword addition failure.')
                void handleError(error)
              })
          },
        })
      })
      .catch((error) => console.error(error))
  })
}

main().catch((error) => void handleError(error))
