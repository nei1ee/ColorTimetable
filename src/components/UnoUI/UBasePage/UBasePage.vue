<script setup lang="ts">
import type { UNotifyOptions } from '../UNotify/types'

const { darkMode, customBarHeight, statusBarHeight } = storeToRefs(useAppStore())
const { pageReset } = usePageStore()
const {
  showNavBar, showBackAction, showCustomAction, pageTitle, notifyRef: _notifyRef,
} = storeToRefs(usePageStore())

const handleNavigateBack = () => uni.navigateBack({})

const notifyRef = ref<{ handleShowNotify: (options: UNotifyOptions) => {} }>()

onMounted(() => _notifyRef.value = notifyRef.value)
onShow(() => _notifyRef.value = notifyRef.value)
onHide(() => pageReset())
</script>

<template>
  <div class="font-mono relative text-base" :class="darkMode ? 'dark' : ''">
    <div class="bg-base color-base">
      <!-- custom navigation bar -->
      <div
        v-if="showNavBar" class="bg-primary text-white w-full top-0 z-200 fixed"
        :style="{ height: `${customBarHeight}px` }"
      >
        <div :style="{ 'padding-top': `${statusBarHeight}px`, 'height': `${customBarHeight - statusBarHeight}px` }">
          <div class="h-full text-center px-6 relative">
            <div
              v-if="showBackAction || showCustomAction"
              class="flex h-full text-xl left-4 absolute justify-center items-center"
            >
              <slot name="navAction">
                <div
                  v-if="showBackAction && !showCustomAction" class="i-carbon-chevron-left"
                  @click="handleNavigateBack"
                />
              </slot>
            </div>
            <div class="flex h-full text-lg justify-center items-center">
              <slot name="navContent">
                {{ pageTitle }}
              </slot>
            </div>
          </div>
        </div>
      </div>
      <UNotify ref="notifyRef" />
      <!-- page container -->
      <div
        class="overflow-auto"
        :style="{ 'height': `calc(100vh - ${customBarHeight}px)`, 'padding-top': `${customBarHeight}px` }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

