<script setup>
import ContentHeader from '@/components/ContentHeader.vue'
import studentService from '@/services/student.service'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { id } = defineProps({
  id: {
    type: String,
    default: ''
  }
})

// Load data
const years = ref([])
const grades = ref([])
const classOrder = ref([])
const existingStudent = ref(null)
const snackbar = useSnackbar()

const loading = ref(true)
const router = useRouter()

onMounted(async () => {
  try {
    loading.value = true
    const result = await studentService.create()
    classOrder.value = result?.categories
    years.value = result?.authors
    grades.value = result?.publishers

    // Display existing student
    if (id !== '') {
      existingStudent.value = await studentService.get(id)
      console.log(existingStudent.value)

      firstName.value = existingStudent.value?.title || ''
      lastName.value = existingStudent.value?.lastName || ''
      dateOfBirth.value = existingStudent.value?.publishedDate || ''
      phoneNumber.value = existingStudent.value?.quantity || ''
      address.value = existingStudent.value?.description || ''
    }
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: error?.response?.data?.message || 'Có lỗi xảy ra'
    })
    router.go(-1)
  }
  loading.value = false
})

// Handle input
const form = ref(null)
const firstName = ref('')
const lastName = ref()
const dateOfBirth = ref('')
const placeOfBirth = ref('')
const phoneNumber = ref('')
const address = ref('')

async function handleSubmit() {
  const formData = new FormData()
  formData.set('_id', id)
  formData.set('firstName', firstName.value)
  formData.set('lastName', lastName.value)
  formData.set('dateOfBirth', dateOfBirth.value)
  formData.set('phoneNumber', phoneNumber.value)
  formData.set('address', address.value)
  try {
    loading.value = true

    let response = ''
    if (!id) {
      response = await studentService.store(formData)
    } else {
      response = await studentService.update(id, formData)
    }
    router.push({ name: 'admin.students' })
    snackbar.show({
      type: 'success',
      message: response?.message || 'Thêm sách thành công'
    })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
}
</script>

<template>
  <md-linear-progress
    indeterminate
    v-if="loading"
  ></md-linear-progress>
  <template v-else>
    <ContentHeader></ContentHeader>
    <div
      class="container"
      style="--container-width: 36rem"
    >
      <h2 class="fs-2 mb-4">{{ id ? 'Cập nhật học sinh' : 'Thêm học sinh mới' }}</h2>

      <!-- Form -->
      <form
        @submit.prevent="handleSubmit"
        ref="form"
        class="form flow"
        style="--flow-spacer: 2rem"
      >
        <section class="form-section">
          <h3 class="fs-4">Thông tin cá nhân</h3>
          <!-- Name -->
          <div class="form-control">
            <md-outlined-text-field
              style="flex: 2"
              id="lastName"
              label="Họ và tên đệm"
              name="lastName"
              class="form-text-field"
              v-model="lastName"
            />
            <md-outlined-text-field
              style="flex: 1"
              id="firstName"
              label="Tên"
              name="firstName"
              class="form-text-field"
              v-model="firstName"
            />
          </div>

          <div class="form-control">
            <!-- Publish date -->
            <md-outlined-text-field
              type="date"
              label="Ngày sinh"
              name="dateOfBirth"
              v-model="dateOfBirth"
            />
            <md-outlined-text-field
              style="flex: 1"
              type="text"
              label="Nơi sinh"
              name="placeOfBirth"
              v-model="placeOfBirth"
            />
          </div>

          <!-- PhoneNumber -->
          <div class="form-control">
            <md-outlined-text-field
              class="w-full"
              name="phoneNumber"
              label="Số điện thoại"
              v-model="phoneNumber"
            ></md-outlined-text-field>
          </div>

          <!-- Address -->
          <div class="form-control">
            <md-outlined-text-field
              class="w-full"
              name="address"
              label="Địa chỉ"
              v-model="address"
            ></md-outlined-text-field>
          </div>
        </section>

        <!-- Class Assignment -->
        <section class="form-section">
          <h3 class="fs-4">Thông tin lớp học</h3>

          <div class="form-control">
            <md-outlined-select
              v-if="years && years.length > 0"
              class="ml-auto"
              label="Năm học"
            >
              <md-select-option
                v-for="(year, index) in years"
                :key="year.id"
                :value="year.id"
                :selected="index === years.length - 1 ? 'selected' : undefined"
                @click="activeYear = year.id"
              >
                <div slot="headline">{{ year.year }}</div>
              </md-select-option>
            </md-outlined-select>
          </div>
        </section>
        <!-- Submit button -->
        <md-filled-button type="submit"> Thêm </md-filled-button>
      </form>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.form {
  &-section {
    // padding: 1.5rem;
    // border: 1px solid var(--md-sys-color-outline-variant);
    // border-radius: var(--catalog-shape-xl);

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &-control {
    display: flex;
    width: 100%;
    gap: 1rem;
  }
  &-text-field {
    width: 100%;
  }
  &-dropdown,
  &-textarea {
    width: 100%;
  }
  &-date {
    margin-left: auto;
    width: min(100%, 15ch);
  }
  &-preview {
    height: 58px;
    width: 50px;
    border: 1px solid #888;
    border-radius: 4px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-image {
    padding: 1rem;
    border: 1px solid #888;
    border-radius: 4px;
    width: 100%;
    font-size: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
}
</style>
