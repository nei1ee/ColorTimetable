import { pinia } from '~/modules/pinia'
import type { UNotifyOptions } from '~/components/UNotify/types'

interface PageConfig {
  showNavBar?: boolean
  showBackAction?: boolean
  showCustomAction?: boolean
  pageTitle?: string
}

export const usePageStore = defineStore(
  'page',
  () => {
    const showNavBar = ref(true)
    const showBackAction = ref(false)
    const showCustomAction = ref(false)
    const pageTitle = ref('')
    const notifyRef = ref<{ handleShowNotify: (options: UNotifyOptions) => {} }>()

    const setPageConfig = (config: PageConfig) => {
      const {
        showNavBar: _showNavBar = true, showBackAction: _showBackAction = false,
        showCustomAction: _showCustomAction = false, pageTitle: _pageTitle = '',
      } = config

      showNavBar.value = _showNavBar
      showBackAction.value = _showBackAction
      showCustomAction.value = _showCustomAction
      pageTitle.value = _pageTitle
    }

    const showNotify = (options: UNotifyOptions) => notifyRef.value!.handleShowNotify(options)

    const pageReset = () => {
      showNavBar.value = true
      showBackAction.value = false
      showCustomAction.value = false
      pageTitle.value = ''
      notifyRef.value = undefined
    }

    return {
      setPageConfig,
      showNavBar,
      pageTitle,
      showBackAction,
      showCustomAction,
      notifyRef,
      showNotify,
      pageReset,
    }
  })

// Need to be used outside the setup
export function usePageStoreWidthOut() {
  return usePageStore(pinia)
}
