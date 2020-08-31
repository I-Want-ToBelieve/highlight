export interface OpenNewTabMessage {
  keyword: string
}

export type ExpressionType = 'regEx' | 'keyword' | 'rejectedKeyword'
export interface WordEntry {
  expression: string
  description: string
  type: ExpressionType
}
export interface DictionaryData {
  data: WordEntry[]
  Status: string
}
export interface Error {
  status: number
  message: string
}
export interface EquipmentDetailsData {
  data: Array<{
    title: string
    image: string
    content: string
  }>
  Status: string
}
export interface KeywordBody {
  keyword: string[] | string
}

export type Colors = 'greenyellow' | 'green' | 'red' | 'purple' | 'blue'
