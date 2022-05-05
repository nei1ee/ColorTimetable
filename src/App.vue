<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

onLaunch(() => {
  // #ifdef MP-WEIXIN || MP-QQ
  const systemInfo: UniApp.GetSystemInfoResult & UniApp.OnThemeChangeCallbackResult = uni.getSystemInfoSync() as any
  appStore.darkMode = systemInfo?.theme === 'dark'
  appStore.statusBarHeight = systemInfo.statusBarHeight as number
  appStore.menuButtonBounding = uni.getMenuButtonBoundingClientRect()
  uni.onThemeChange((res: UniApp.OnThemeChangeCallbackResult) => {
    appStore.darkMode = res.theme === 'dark'
  })
  // #endif

  // #ifdef H5
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  appStore.darkMode = colorScheme.matches
  colorScheme.addEventListener('change', (e: MediaQueryListEvent) => {
    appStore.darkMode = e.matches
  })
  // The data is obtained from iphone13 miniprogram but statusBarHeight, top and bottom values are subtracted from the statusBarHeight value
  appStore.statusBarHeight = 0
  appStore.menuButtonBounding = { width: 87, height: 32, left: 281, top: 4, right: 368, bottom: 36 }
  // #endif
})
onShow(() => {
})
onHide(() => {
})
</script>

<style></style>
