<script setup>
import MdIconButton from '@/components/buttons/MdIconButton.vue'
import MdFloatingActionButton from '@/components/buttons/MdFloatingActionButton.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MdIcon from '@/components/icons/MdIcon.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useSnackbar } from '@/stores/SnackbarStore'
import studentService from '@/services/student.service'
import getErrorMessage from '@/utils/getErrorMessage.util'

// Init state
const loading = ref(true)
const books = ref([])
const SERVER_BASE_URL = ref(import.meta.env.VITE_SERVER_BASE_URL)
const snackbar = useSnackbar()

onMounted(async () => {
  try {
    loading.value = true

    books.value = await studentService.getAll()
  } catch (error) {
    console.error(error)
    snackbar.show({
      type: 'error',
      message: error.response.data.message || 'Có lỗi xảy ra'
    })
  }
  loading.value = false
})

// Hanlde search
const searchText = ref('')

async function updateBookList() {
  try {
    loading.value = true

    books.value = await studentService.getAll({ q: searchText.value })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: error.response.data.message || 'Có lỗi xảy ra'
    })
  }
  loading.value = false
}

// Handle actions
const router = useRouter()
function showCreate() {
  router.push({ name: 'admin.books.create' })
}

function handleEditClick(id) {
  router.push({ name: 'admin.books.edit', params: { id } })
}

const dialogOpen = ref(false)
const bookId = ref(null)
function openDialog(id) {
  dialogOpen.value = true
  bookId.value = id
}
function closeDialog() {
  dialogOpen.value = false
}

// Trigger reload content on successful deletetion
const reload = ref(false)

async function handleDeleteClick() {
  dialogOpen.value = false

  try {
    loading.value = true
    const response = await studentService.delete(bookId.value)
    reload.value = true
    snackbar.show({
      type: 'success',
      message: response?.message || 'Xoá sách thành công'
    })
  } catch (error) {
    console.log(error)
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
}

watch(reload, async () => {
  await updateBookList()
  reload.value = false
})
</script>

<template>
  <md-linear-progress
    v-if="loading"
    indeterminate
  ></md-linear-progress>
  <div
    v-else
    class="container flow"
  >
    <h1 class="fs-2">Quản lý sách</h1>

    <!-- Search -->
    <SearchBar
      class="ml-auto"
      v-model="searchText"
      @submit="() => updateBookList()"
    ></SearchBar>

    <!-- Result table -->
    <table
      v-if="books.length > 0"
      class="table table-solid table-book"
    >
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên sách</th>
          <th style="text-wrap: nowrap">Số lượng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(book, index) in books"
          :key="book._id"
        >
          <td class="text-center">{{ index + 1 }}</td>
          <td>
            <div class="book-row">
              <div class="book-img">
                <img
                  :src="SERVER_BASE_URL + book.imageSource"
                  alt=""
                />
              </div>
              <div class="book-content">
                <h6 class="fs-6">
                  {{ book.title }}
                </h6>
                <p>{{ book.authors }}</p>
              </div>
            </div>
          </td>
          <td class="text-center">{{ book.quantity }}</td>
          <td>
            <div class="book-row">
              <MdIconButton @click="() => handleEditClick(book._id)">edit</MdIconButton>
              <MdIconButton @click="() => openDialog(book._id)">delete</MdIconButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No result -->
    <div
      v-else
      class="fs5"
    >
      Không tìm thấy sách. Vui lòng thử lại với từ khóa khác.
    </div>
  </div>

  <!-- Confirm Dialog -->
  <md-dialog
    style="max-width: 320px"
    :open="dialogOpen"
  >
    <div slot="headline">Xác nhận xóa</div>
    <MdIcon slot="icon">delete_outline</MdIcon>
    <form
      id="form"
      slot="content"
      method="dialog"
    >
      Sách bị xóa sẽ không thể khôi phục lại, bạn có chắc chắn muốn tiếp tục?
    </form>
    <div slot="actions">
      <md-text-button
        form="form"
        value="delete"
        @click="handleDeleteClick"
        >Delete</md-text-button
      >
      <md-filled-tonal-button
        form="form"
        value="cancel"
        autofocus
        @click="closeDialog"
        >Cancel</md-filled-tonal-button
      >
    </div>
  </md-dialog>

  <!-- Add FAB -->
  <MdFloatingActionButton
    :icon="'add'"
    :size="'large'"
    :label="'add'"
    :variant="'secondary'"
    @click="showCreate"
  ></MdFloatingActionButton>
</template>

<style lang="scss" scoped>
.table-book {
  width: 100%;
}
.book {
  &-row {
    display: flex;
    gap: 0.5rem;
  }
  &-img {
    width: 3rem;
    height: 4rem;
    flex-shrink: 0;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
