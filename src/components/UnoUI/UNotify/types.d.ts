export type UNotifyType = 'default' | 'success' | 'error' | 'warning' | 'primary'

export interface UNotifyOptions {
  type?: UNotifyType
  message: string
  duration?: number
}
