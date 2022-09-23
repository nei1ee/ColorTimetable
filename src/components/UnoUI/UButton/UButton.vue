<script setup lang="ts">
interface Props {
  type?: 'default' | 'success' | 'error' | 'warning' | 'primary'
  bg?: string
  icon?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: () => 'default',
  bg: () => '',
  icon: () => '',
  disabled: () => false,
})

const emit = defineEmits(['click'])

const handleTap = () => emit('click')

const bgColor = {
  default: 'bg-gray-5',
  success: 'bg-green-5',
  error: 'bg-red-5',
  warning: 'bg-orange-5',
  primary: 'bg-blue-5',
}
</script>

<template>
  <button
    class="rounded-lg text-white text-base flex justify-center items-center shadow py-2"
    :class="[bg ? bg : bgColor[type], icon ? 'gap-1' : '']" hover-class="grayscale-20" :hover-stay-time="150"
    @tap="handleTap"
  >
    <slot name="icon">
      <div v-if="icon" :class="icon" />
    </slot>
    <slot />
  </button>
</template>

<style scoped>
</style>
