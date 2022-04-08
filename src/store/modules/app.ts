import { defineStore } from 'pinia'
import { store } from '@/store'

type Nullable<T> = T | null

interface MenuButtonBoundingClientRect {
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
}

interface CustomStatusBarState {
  statusBarHeight: number
  customBarHeight: number
}

interface AppState extends CustomStatusBarState {
  menuButtonBounding: Nullable<MenuButtonBoundingClientRect>
  darkMode: boolean
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    statusBarHeight: 0,
    customBarHeight: 0,
    menuButtonBounding: null,
    darkMode: false,
  }),
  getters: {
    getCustomStatusBarState(): CustomStatusBarState {
      return {
        statusBarHeight: this.statusBarHeight,
        customBarHeight: this.customBarHeight,
      }
    },
    getDarkMode(): boolean {
      return this.darkMode
    },
  },
  actions: {
    setStatusBarHeight(height: number) {
      this.statusBarHeight = height
    },
    setMenuButtonBounding(bounding: MenuButtonBoundingClientRect) {
      this.menuButtonBounding = bounding
      this.customBarHeight = bounding.bottom + bounding.top - this.statusBarHeight
    },
    setDarkMode(darkMode: boolean) {
      this.darkMode = darkMode
    },
  },
})

// Need to be used outside the setup
export function useAppStoreWidthOut() {
  return useAppStore(store)
}
