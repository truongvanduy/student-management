<script setup>
import ContentHeader from '@/components/ContentHeader.vue'
import studentService from '@/services/student.service'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import { translate } from '@/utils/translator.util'
import { computed, onMounted, ref } from 'vue'
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
const classes = ref([])
const relations = ref(['father', 'mother', 'guardian', 'other'])

const existingStudent = ref(null)
const existingClass = ref(null)
const existingParents = ref([])
const snackbar = useSnackbar()

const loading = ref(true)
const router = useRouter()

onMounted(async () => {
  try {
    let result = null
    loading.value = true
    if (id === '') {
      result = await studentService.create()
    } else {
      result = await studentService.edit(id)
    }
    classes.value = result?.classes
    years.value = result?.years
    grades.value = result?.grades

    year.value = years.value[0].id
    grade.value = grades.value[0].id

    // Display existing student
    if (id !== '') {
      existingStudent.value = result?.student
      existingClass.value = result?.studentClass
      existingParents.value = result?.parents
      console.log(existingClass.value)

      firstName.value = existingStudent.value?.firstName || ''
      lastName.value = existingStudent.value?.lastName || ''
      sex.value = existingStudent.value?.sex || ''
      dateOfBirth.value = existingStudent.value?.dateOfBirth || ''
      placeOfBirth.value = existingStudent.value?.placeOfBirth || ''
      phoneNumber.value = existingStudent.value?.phoneNumber || ''
      address.value = existingStudent.value?.address || ''

      year.value = existingClass.value.yearId || ''
      grade.value = existingClass.value.gradeId || ''
      selectedClass.value = existingClass.value.classOrder || ''

      if (existingParents.value.length > 0) {
        parent1Name.value = existingParents.value[0].fullName || ''
        parent1Phone.value = existingParents.value[0].phoneNumber || ''
        parent1Occupation.value = existingParents.value[0].occupation || ''
        parent1Relation.value = existingParents.value[0].relation || ''
      }
      if (existingParents.value.length > 1) {
        parent2Name.value = existingParents.value[1].fullName || ''
        parent2Phone.value = existingParents.value[1].phoneNumber || ''
        parent2Occupation.value = existingParents.value[1].occupation || ''
        parent2Relation.value = existingParents.value[1].relation || ''
      }
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
// Personal
const firstName = ref('')
const lastName = ref()
const sex = ref()
const dateOfBirth = ref('')
const placeOfBirth = ref('')
const phoneNumber = ref('')
const address = ref('')

// Class
const year = ref(null)
const grade = ref(null)
const selectedClass = ref(null)
const filteredClasses = computed(() => {
  return (
    classes.value
      // filter classes with the given year and grade
      .filter((el) => el.yearId === year.value && el.gradeId === grade.value)
      // Concat grade with class
      .map((el) => ({
        id: el.order,
        name: `${grades.value.find((el) => el.id === grade.value).gradeLevel}.${el.order}`
      }))
  )
})

// Other
const parent1Name = ref()
const parent1Phone = ref()
const parent1Occupation = ref()
const parent1Relation = ref()
const parent2Name = ref()
const parent2Phone = ref()
const parent2Occupation = ref()
const parent2Relation = ref()

async function handleSubmit() {
  const formData = {
    id: id,
    firstName: firstName.value,
    lastName: lastName.value,
    sex: sex.value,
    dateOfBirth: dateOfBirth.value,
    placeOfBirth: placeOfBirth.value,
    phoneNumber: phoneNumber.value,
    address: address.value,
    class: {
      yearId: year.value,
      gradeId: grade.value,
      classOrder: selectedClass.value
    },
    parents: [
      {
        fullName: parent1Name.value,
        phoneNumber: parent1Phone.value,
        occupation: parent1Occupation.value,
        relation: parent1Relation.value
      },
      {
        fullName: parent2Name.value,
        phoneNumber: parent2Phone.value,
        occupation: parent2Occupation.value,
        relation: parent2Relation.value
      }
    ]
  }
  console.log(formData)

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
      message: response.message || 'Thành công'
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
            <md-outlined-select
              class="ml-auto"
              label="Giới tính"
              v-model="sex"
            >
              <md-select-option value="male">
                <div slot="headline">{{ translate('male') }}</div>
              </md-select-option>
              <md-select-option value="female">
                <div slot="headline">{{ translate('female') }}</div>
              </md-select-option>
              <md-select-option value="other">
                <div slot="headline">{{ translate('other') }}</div>
              </md-select-option>
            </md-outlined-select>
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
            <!-- Year selection -->
            <md-outlined-select
              v-if="years && years.length > 0"
              class="ml-auto"
              label="Năm học"
              v-model="year"
            >
              <md-select-option
                v-for="year in years"
                :key="year.id"
                :value="year.id"
              >
                <div slot="headline">{{ year.year }}</div>
              </md-select-option>
            </md-outlined-select>

            <!-- Grade selection -->
            <md-outlined-select
              v-if="grades && grades.length > 0"
              class="ml-auto"
              label="Khối"
              v-model="grade"
            >
              <md-select-option
                v-for="grade in grades"
                :key="grade.id"
                :value="grade.id"
              >
                <div slot="headline">{{ grade.gradeLevel }}</div>
              </md-select-option>
            </md-outlined-select>

            <!-- Class selection -->
            <md-outlined-select
              v-if="filteredClasses && filteredClasses.length > 0"
              class="ml-auto"
              label="Lớp"
              v-model="selectedClass"
            >
              <md-select-option
                v-for="classEl in filteredClasses"
                :key="classEl.id"
                :value="classEl.id"
              >
                <div slot="headline">{{ classEl.name }}</div>
              </md-select-option>
            </md-outlined-select>
          </div>
        </section>

        <!-- Other section -->
        <section class="form-section">
          <h3 class="fs-4">Thông tin khác</h3>
          <!-- Parent 1 -->
          <div class="flow">
            <label
              for="parent1"
              class="fs-5"
              >Cha, mẹ hoặc người giám hộ 1</label
            >
          </div>
          <div class="form-control">
            <!-- Name -->
            <md-outlined-text-field
              style="flex: 1"
              type="text"
              name="pName1"
              label="Họ tên"
              v-model="parent1Name"
            ></md-outlined-text-field>
            <!-- Phone number -->
            <md-outlined-text-field
              type="tel"
              name="pPhone1"
              label="Số điện thoại"
              v-model="parent1Phone"
            ></md-outlined-text-field>
          </div>

          <div class="form-control">
            <!-- Occupation -->
            <md-outlined-text-field
              style="flex: 1"
              type="text"
              name="pOccupation1"
              label="Nghề nghiệp"
              v-model="parent1Occupation"
            ></md-outlined-text-field>

            <!-- Relation -->
            <md-outlined-select
              label="Mối quan hệ với học sinh"
              v-model="parent1Relation"
            >
              <md-select-option
                v-for="(relation, index) in relations"
                :key="index"
                :value="relation"
              >
                <div slot="headline">
                  {{ translate(relation) }}
                </div>
              </md-select-option>
            </md-outlined-select>
          </div>
          <!-- Parent 2 -->
          <div class="flow">
            <label
              for="parent1"
              class="fs-5"
              >Cha, mẹ hoặc người giám hộ 2</label
            >
          </div>
          <div class="form-control">
            <!-- Name -->
            <md-outlined-text-field
              style="flex: 1"
              type="text"
              name="pName2"
              label="Họ tên"
              v-model="parent2Name"
            ></md-outlined-text-field>
            <!-- Phone number -->
            <md-outlined-text-field
              type="tel"
              name="pPhone2"
              label="Số điện thoại"
              v-model="parent2Phone"
            ></md-outlined-text-field>
          </div>

          <div class="form-control">
            <!-- Occupation -->
            <md-outlined-text-field
              style="flex: 1"
              type="text"
              name="pOccupation1"
              label="Nghề nghiệp"
              v-model="parent2Occupation"
            ></md-outlined-text-field>

            <!-- Relation -->
            <md-outlined-select
              label="Mối quan hệ với học sinh"
              v-model="parent2Relation"
            >
              <md-select-option
                v-for="(relation, index) in relations"
                :key="index"
                :value="relation"
              >
                <div slot="headline">
                  {{ translate(relation) }}
                </div>
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
