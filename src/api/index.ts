import axios, { AxiosPromise } from 'axios'
import config from '../config'
import { AUTH_TOKEN } from '../config/secrets'
import { DictionaryData, EquipmentDetailsData, KeywordBody } from '../types'

export type AxiosReturn<Data> = Promise<AxiosPromise<Data>>

const request = axios.create({
  baseURL: config.baseUrl,
})
request.defaults.headers.common.Authorization = `Bearer ${AUTH_TOKEN}`

const versioning = (api: string): string => `${config.apiVersion}${api}`

export async function getDictionary (): AxiosReturn<DictionaryData> {
  return await request(versioning('/GetDictionary'))
}
export async function getEquipmentDetails (
  keyword: string
): AxiosReturn<EquipmentDetailsData> {
  return await request(versioning(`/EquipmentDetails/${keyword}`))
}
export async function AddKeyword (
  data: KeywordBody
): AxiosReturn<DictionaryData> {
  return await request.post(versioning('/AddKeyword'), data)
}
export async function RejectKeyword (
  data: KeywordBody
): AxiosReturn<DictionaryData> {
  return await request.post(versioning('/RejectKeyword'), data)
}
