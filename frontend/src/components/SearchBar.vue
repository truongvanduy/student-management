<script setup>
import MdIcon from '@/components/icons/MdIcon.vue'
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Tìm kiếm'
  }
})
const emit = defineEmits(['submit', 'update:modelValue'])

function updateModelValue(e) {
  emit('update:modelValue', e.target.value)
}

function submit() {
  emit('submit')
}
</script>
<template>
  <form
    action="#"
    method="get"
    class="search"
  >
    <md-outlined-text-field
      type="search"
      name="q"
      :value="modelValue"
      @input="updateModelValue"
      @keyup.enter="submit"
      :placeholder="placeholder"
    >
      <MdIcon slot="leading-icon">search</MdIcon>
    </md-outlined-text-field>
  </form>
</template>

<style lang="scss" src="../assets/scss/components/_search.scss"></style>
