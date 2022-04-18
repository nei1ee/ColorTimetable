import { defineStore } from 'pinia'
import { store } from '@/store'

interface MenuButtonBoundingClientRect {
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
}

const defaultBounding = { width: 87, height: 32, left: 281, top: 48, right: 368, bottom: 80 }

export const useAppStore = defineStore(
  'app',
  () => {
    const darkMode = ref(false)
    const statusBarHeight = ref(44)
    const menuButtonBounding = ref<MenuButtonBoundingClientRect>(defaultBounding)
    const customBarHeight = computed(() =>
      menuButtonBounding.value.bottom + menuButtonBounding.value.top - statusBarHeight.value)

    return {
      darkMode,
      statusBarHeight,
      customBarHeight,
      menuButtonBounding,
    }
  })

// Need to be used outside the setup
export function useAppStoreWidthOut() {
  return useAppStore(store)
}
