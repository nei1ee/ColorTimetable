<script setup lang="ts">
import type { UNotifyOptions, UNotifyType } from './types'

const { customBarHeight } = storeToRefs(useAppStore())

const timer = ref<number | undefined>(undefined)
const show = ref(false)
const notifyType = ref<UNotifyType>('default')
const message = ref('')

const handleShowNotify = (options: UNotifyOptions) => {
  const { type = 'default', msg = 'Unable to connect to the server.', duration = 2000 } = options
  clearTimeout(timer.value)
  show.value = true
  notifyType.value = type
  message.value = msg
  timer.value = setTimeout(() => {
    show.value = false
    clearTimeout(timer.value)
    timer.value = undefined
  }, duration) as unknown as number
}

defineExpose({
  handleShowNotify,
})

const bgColor = {
  default: 'bg-gray-5',
  success: 'bg-green-5',
  danger: 'bg-red-5',
  warning: 'bg-orange-5',
  primary: 'bg-blue-5',
}
</script>

<template>
  <div
    class="flex h-8 text-white w-full py-1 px-2 transition-all z-100 duration-500 justify-center items-center fixed shadow"
    :class="bgColor[notifyType]"
    :style="{ top: show ? `${customBarHeight}px` : '-100%' }"
  >
    {{ message }}
  </div>
</template>

<style scoped>
</style>
