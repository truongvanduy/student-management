<script setup>
import { ref } from 'vue'
import MdIcon from '../icons/MdIcon.vue'
import { useRouter } from 'vue-router'

const form = ref(null)
const searchField = ref(null)
const router = useRouter()

function handleSearch() {
  router.push({
    name: 'books',
    query: { q: searchField.value }
  })
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
      type="search"
      v-model="searchField"
      name="q"
      @keyup.enter="handleSearch"
      placeholder="Tìm kiếm sách"
    >
      <MdIcon slot="leading-icon">search</MdIcon>
    </md-outlined-text-field>
  </form>
</template>

<style lang="scss" src="../../assets/scss/components/_search.scss"></style>
