<script setup lang="ts">
interface Props {
  type?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
  bg?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  type: () => 'default',
  bg: () => '',
  icon: () => '',
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
    class="rounded-lg text-white flex justify-center items-center gap-1 py-2 block my-2"
    :class="[bg ? bg : bgColor[type]]" hover-class="grayscale-20" :hover-stay-time="150" @tap="handleTap"
  >
    <slot name="icon">
      <div v-if="icon" :class="icon" />
    </slot>
    <slot />
  </div>
</template>

<style scoped>
</style>
