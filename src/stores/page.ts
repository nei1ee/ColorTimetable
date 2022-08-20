import { pinia } from '~/modules/pinia'
import type { UNotifyOptions } from '~/components/UnoUI/UNotify/types'
import type { UToastOptions } from '~/components/UnoUI/UToast/types'

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
    const toastRef = ref<{ handleShowToast: (options: UToastOptions) => {} }>()

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

    const showToast = (options: UToastOptions) => toastRef.value!.handleShowToast(options)

    const pageReset = () => {
      showNavBar.value = true
      showBackAction.value = false
      showCustomAction.value = false
      pageTitle.value = ''
      notifyRef.value = undefined
      toastRef.value = undefined
    }

    return {
      setPageConfig,
      showNavBar,
      pageTitle,
      showBackAction,
      showCustomAction,
      notifyRef,
      toastRef,
      showNotify,
      showToast,
      pageReset,
    }
  })

// Need to be used outside the setup
export function usePageStoreWidthOut() {
  return usePageStore(pinia)
}
