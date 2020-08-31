import { stringify } from 'query-string'
import { OpenNewTabMessage } from '../types'
import { getDictionary } from '../api'
import { handleError } from '../utils'

chrome.runtime.onMessage.addListener(
  (message: OpenNewTabMessage, sender, sendResponse) => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(`details.html?${stringify(message)}`),
    })
    sendResponse({
      message,
      sender,
    })
  }
)

async function main (): Promise<void> {
  const dictionary = await getDictionary()
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
      dictionary: dictionary.data.data,
      color: 'purple',
    })
  })
}

main().catch((error) => void handleError(error))
