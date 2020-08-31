import '../styles/options.scss'
import '../styles/toastify.scss'
import $ from 'jquery'
import { getDictionary, AddKeyword, RejectKeyword } from '../api'
import {
  addKeyDialog,
  showPanel as ShowAddKeyDialogPanel,
} from '../app/ui/addKeyDialog'
import { DictionaryData } from '../types'
import { AxiosResponse } from 'axios'
import { handleError, toastifySucceed, toastifyFailure } from '../utils'

function onUpdateDictionary (): void {
  const updateDictionary = async (): Promise<AxiosResponse<DictionaryData>> => {
    const dictionary = await getDictionary()

    chrome.storage.sync.set({ dictionary: dictionary.data.data })
    return dictionary
  }

  const updateBtn = $('#update-dictionary')
  updateBtn.on('click', (event) => {
    updateDictionary()
      .then((data) => {
        initTable(data)
      })
      .catch((error) => void handleError(error))
  })
}

function onAddKeyword (): void {
  addKeyDialog({
    yes (keyword) {
      AddKeyword({
        keyword,
      })
        .then((data) => {
          toastifySucceed('Keywords added success.')
          initTable((data as unknown) as AxiosResponse<DictionaryData>)
          chrome.storage.sync.set({
            dictionary: ((data as unknown) as AxiosResponse<DictionaryData>)
              .data.data,
          })
        })
        .catch((error) => {
          toastifyFailure('Keyword addition failure.')
          handleError(error)
        })
    },
  })

  const AddKeywordsBtn = $('#add-keywords')
  AddKeywordsBtn.on('click', (event) => {
    ShowAddKeyDialogPanel()
  })
}

async function createTable (): Promise<void> {
  getDictionary()
    .then((data) => {
      initTable((data as unknown) as AxiosResponse<DictionaryData>)
    })
    .catch((error) => void handleError(error))
}

function initTable (dictionary: AxiosResponse<DictionaryData>): void {
  const table = $('#keywords-table')
  const tbody = table.find('tbody')

  const generateThead = (): void => {
    const html = dictionary.data.data
      .map((it) => {
        const action =
          it.type === 'keyword'
            ? 'delete'
            : it.type === 'rejectedKeyword'
            ? 'add'
            : 'no action'
        const thead = { ...it, action }
        const html = `
            <tr>
              <td>${thead.expression}</td>
              <td>${thead.type}</td>
              <td><a class="${thead.action}" data-keyword="${thead.expression}">${thead.action}</></td>
              <td>${thead.description}</td>
            </tr>`

        return html
      })
      .join('')

    tbody.html(html)
  }

  generateThead()
  setTimeout(() => {
    const table = $('#keywords-table')
    const addBtn = table.find('a.add')
    const deleteBtn = table.find('a.delete')

    addBtn.on('click', function () {
      AddKeyword({
        keyword: ($(this).data('keyword') as string).split(','),
      })
        .then(() => {
          void createTable()
        })
        .catch((error) => handleError(error))
    })

    deleteBtn.on('click', function () {
      RejectKeyword({
        keyword: $(this).data('keyword'),
      })
        .then(() => {
          void createTable()
        })
        .catch((error) => handleError(error))
    })
  }, 0)
}

function changeColor (color: string): void {
  $('.bg-color').css('background-color', color)
  $('.text-color').css('color', color)
  $('button.fill').attr('data-color', color)
}

function initTabs (): void {
  let clickedTab = $('.tabs > .active')
  const tabWrapper = $('.tab__content')
  let activeTab = tabWrapper.find('.active')
  let activeTabHeight = activeTab.outerHeight()!

  activeTab.show()

  tabWrapper.height(activeTabHeight)

  $('.tabs > li').on('click', function () {
    $('.tabs > li').removeClass('active')

    $(this).addClass('active')

    clickedTab = $('.tabs .active')

    activeTab.fadeOut(250, function () {
      $('.tab__content > li').removeClass('active')

      const clickedTabIndex = clickedTab.index()

      $('.tab__content > li')
        .eq(clickedTabIndex)
        .addClass('active')

      activeTab = $('.tab__content > .active')

      activeTabHeight = activeTab.outerHeight()!

      tabWrapper
        .stop()
        .delay(50)
        .animate(
          {
            height: activeTabHeight,
          },
          250,
          function () {
            activeTab.delay(50).fadeIn(250)
          }
        )
    })
  })

  const colorButton = $('.colors li')

  colorButton.on('click', function () {
    $('.colors > li').removeClass('active-color')

    $(this).addClass('active-color')

    const newColor = $(this).attr('data-color')!
    const colorName = $(this).attr('data-color-name')!

    chrome.storage.sync.set({ color: colorName })

    changeColor(newColor)
  })
}

function initBgColor (): void {
  chrome.storage.sync.get(['color'], (data) => {
    const color = data.color as string
    const activeEle = $(`.colors li[data-color-name=${color}]`)
    const hex = activeEle.attr('data-color')!

    changeColor(hex)
    activeEle.addClass('active-color')
  })
}

$(document).ready(function () {
  // init bgColor
  initBgColor()
  // init tabs
  initTabs()
  // init Table
  void createTable()
  // init Update Dictionary button
  onUpdateDictionary()
  // init Add Keyword button
  onAddKeyword()
})
