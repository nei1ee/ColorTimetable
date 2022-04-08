<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

onLaunch(() => {
  const systemInfo: UniApp.GetSystemInfoResult & UniApp.OnThemeChangeCallbackResult = uni.getSystemInfoSync() as any
  appStore.setDarkMode(systemInfo?.theme === 'dark')
  appStore.setStatusBarHeight(systemInfo.statusBarHeight as number)
  appStore.setMenuButtonBounding(uni.getMenuButtonBoundingClientRect() as any)
  uni.onThemeChange((res: UniApp.OnThemeChangeCallbackResult) => {
    appStore.setDarkMode(res.theme === 'dark')
  })
})
onShow(() => {
})
onHide(() => {
})
</script>
<style></style>
