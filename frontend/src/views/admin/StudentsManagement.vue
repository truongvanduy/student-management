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
import yearService from '@/services/year.service'
import { translate } from '@/utils/translator.util'

// Init state
const loading = ref(true)
const students = ref([])
const years = ref([])
const snackbar = useSnackbar()
const selectedYear = defineModel('selectedYear')

onMounted(async () => {
  try {
    loading.value = true

    years.value = await yearService.getAll()
    selectedYear.value = years.value[years.value.length - 1].id

    students.value = await studentService.getAll({
      yearId: selectedYear.value
    })
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

async function updateStudentList() {
  try {
    loading.value = true

    students.value = await studentService.getAll({
      name: searchText.value,
      yearId: selectedYear.value
    })
    console.log(students.value)
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
}

// Handle actions
const router = useRouter()
function showCreate() {
  router.push({ name: 'admin.students.create' })
}

function handleEditClick(id) {
  router.push({ name: 'admin.students.edit', params: { id } })
}

const dialogOpen = ref(false)
const studentId = ref(null)
function openDialog(id) {
  dialogOpen.value = true
  studentId.value = id
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
    const response = await studentService.delete(studentId.value)

    reload.value = true
    snackbar.show({
      type: 'success',
      message: response?.message || 'Xoá học sinh thành công'
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

watch([reload, selectedYear], async () => {
  await updateStudentList()
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
    <h1 class="fs-2">Quản lý học sinh</h1>

    <div class="facb">
      <!-- Search -->
      <SearchBar
        v-model="searchText"
        :placeholder="'Tìm kiếm học sinh'"
        @submit="() => updateStudentList()"
      ></SearchBar>

      <!-- Year Selection -->
      <md-outlined-select
        v-if="years && years.length > 0"
        class="ml-auto"
        label="Năm học"
        v-model="selectedYear"
      >
        <md-select-option
          v-for="year in years"
          :key="year.id"
          :value="year.id"
        >
          <div slot="headline">{{ year.year }}</div>
        </md-select-option>
      </md-outlined-select>
    </div>

    <!-- Result table -->
    <table
      v-if="students.length > 0"
      class="table table-solid table-full pb-8 mb-20"
    >
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ tên học sinh</th>
          <th>Giới tính</th>
          <th>Ngày sinh</th>
          <th style="text-wrap: nowrap">Lớp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="student in students"
          :key="student.id"
        >
          <td class="text-center">{{ student.id }}</td>
          <td>
            {{ student.lastName + ' ' + student.firstName }}
          </td>
          <td class="text-center">{{ translate(student.sex) }}</td>
          <td class="text-center">{{ student.dateOfBirth }}</td>
          <td
            v-if="student?.student_classes?.length > 0"
            class="text-center"
          >
            {{
              student.student_classes[0].grade.gradeLevel +
              '.' +
              student.student_classes[0].classOrder
            }}
          </td>
          <td
            v-else
            class="text-center"
          ></td>
          <td>
            <div class="student-row">
              <MdIconButton
                class="ml-auto"
                @click="() => handleEditClick(student.id)"
                >edit</MdIconButton
              >
              <MdIconButton @click="() => openDialog(student.id)">delete</MdIconButton>
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
      Thông tin bị xóa sẽ không thể khôi phục lại, bạn có chắc chắn muốn tiếp tục?
    </form>
    <div slot="actions">
      <md-text-button
        form="form"
        value="delete"
        @click="handleDeleteClick"
        >Xóa</md-text-button
      >
      <md-filled-tonal-button
        form="form"
        value="cancel"
        autofocus
        @click="closeDialog"
        >Trở về</md-filled-tonal-button
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
.table-full {
  width: 100%;
}
.student {
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
