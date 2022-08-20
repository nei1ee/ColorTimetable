export type UToastType = 'default' | 'success' | 'error' | 'warning' | 'primary'

export interface UToastOptions {
  type?: UToastType
  message: string
  duration?: number
}
