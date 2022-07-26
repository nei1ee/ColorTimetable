export type UNotifyType = 'default' | 'success' | 'danger' | 'warning' | 'primary'

export interface UNotifyOptions {
  type?: UNotifyType
  msg: string
  duration?: number
}
