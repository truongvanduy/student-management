<script setup>
import { ref } from 'vue'
import MdIcon from '../icons/MdIcon.vue'

const form = ref(null)
const searchField = ref(null)

function onEnter(e) {
  if (e.key === 'Enter') {
    form.value.submit()
  }
}
</script>
<template>
  <form
    ref="form"
    action="#"
    method="get"
    class="search"
  >
    <md-outlined-text-field
      ref="searchField"
      name="search"
      :onkeyup="onEnter"
      on
      placeholder="Search for books"
    >
      <md-icon-button
        type="submit"
        slot="trailing-icon"
      >
        <MdIcon>search</MdIcon>
      </md-icon-button>
    </md-outlined-text-field>
  </form>
</template>

<style lang="scss" src="../../assets/scss/components/_search.scss"></style>
