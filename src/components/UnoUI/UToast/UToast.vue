<script setup lang="ts">
import type { UToastOptions, UToastType } from './types'

const { customBarHeight } = storeToRefs(useAppStore())

const timer = ref<number | undefined>(undefined)
const show = ref(false)
const notifyType = ref<UToastType>('default')
const message = ref('')

const handleShowToast = (options: UToastOptions) => {
  const { type = 'default', message: _message = 'Unable to connect to the server.', duration = 2000 } = options
  clearTimeout(timer.value)
  show.value = true
  notifyType.value = type
  message.value = _message
  timer.value = setTimeout(() => {
    show.value = false
    clearTimeout(timer.value)
    timer.value = undefined
  }, duration) as unknown as number
}

defineExpose({
  handleShowToast,
})

const ToastClass = {
  default: 'bg-gray-5 border-gray-2',
  success: 'bg-green-5 border-green-3',
  error: 'bg-red-5 border-red-3',
  warning: 'bg-orange-5 border-orange-3',
  primary: 'bg-blue-5 border-blue-3',
}
</script>

<template>
  <div
    v-if="show"
    class="z-100 fixed flex justify-center items-center top-0 bottom-0 left-0 right-0"
  >
    <div
      class="flex justify-center items-center py-2 px-4 rounded-lg border animate-fade-in-up animate-duration-200 text-white"
      :class="ToastClass[notifyType]"
    >
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
</style>
