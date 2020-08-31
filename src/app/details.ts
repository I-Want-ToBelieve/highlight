import '../styles/details.scss'
import { parse } from 'query-string'
import { getEquipmentDetails } from '../api'
import { handleError } from '../utils'

async function main (): Promise<void> {
  const keyword = parse(location.search).keyword as string
  const details = await getEquipmentDetails(
    'keyword' /* Production mode should be deleted */ ?? encodeURI(keyword)
  )

  const title = document.querySelector('#title') as Element
  const image = document.querySelector('#picture > img') as HTMLImageElement
  const introduce = document.querySelector('#introduce') as Element

  title.textContent = details.data.data[0].title
  image.src =
    '../image/motor.png' /* Production mode should be deleted */ ??
    details.data.data[0].image
  introduce.innerHTML = details.data.data[0].content.toString()
}

window.addEventListener('load', (event) => {
  main().catch((error) => void handleError(error))
})
