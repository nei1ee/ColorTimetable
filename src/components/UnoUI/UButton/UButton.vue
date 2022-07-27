<script setup lang="ts">
interface Props {
  type?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
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
  default: 'bg-grey-5',
  success: 'bg-green-5',
  danger: 'bg-red-5',
  warning: 'bg-orange-5',
  primary: 'bg-blue-5',
}
</script>

<template>
  <div
    class="rounded-lg text-white flex justify-center items-center py-3 block my-3 shadow"
    :class="[bg ? bg : bgColor[type], icon ? 'gap-1' : '']" hover-class="grayscale-20" :hover-stay-time="150" @tap="handleTap"
  >
    <slot name="icon">
      <div v-if="icon" :class="icon" />
    </slot>
    <slot />
  </div>
</template>

<style scoped>
</style>
