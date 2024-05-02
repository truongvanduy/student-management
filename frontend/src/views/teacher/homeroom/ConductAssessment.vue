<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import homeroomService from '@/services/homeroom.service'
import { translate } from '@/utils/translator.util'
import { toDMY } from '@/utils/date.util'
import MdFloatingActionButton from '@/components/buttons/MdFloatingActionButton.vue'

const router = useRouter()
const route = useRoute()
const { query } = route
const snackbar = useSnackbar()
const loading = ref(true)

const students = ref([])
const semester = ref(1)
const conductRefs = ref([])
const modifiedConducts = ref({})

onMounted(async () => {
  try {
    loading.value = true

    const { yearId, classId } = query
    students.value = await homeroomService.getConducts({
      yearId,
      classId,
      semesterId: semester.value
    })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
})

function handleSemesterChange(e) {
  semester.value = e.target.activeTabIndex + 1
}

function handleViewScoreClick(id) {
  router.push({
    name: 'teacher.homeroom.scores',
    params: { id },
    query: {
      yearId: query.yearId
    }
  })
}

watch([semester], async (newSemester) => {
  try {
    loading.value = true

    const { yearId, classId } = query
    students.value = await homeroomService.getConducts({
      yearId,
      classId,
      semesterId: newSemester
    })
    console.log(students.value)
    modifiedConducts.value = {}
    conductRefs.value = []
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
})

function handleConductModify(index, data) {
  modifiedConducts.value[index] = data
  console.log(modifiedConducts.value)
}

async function handleSaveChanges() {
  try {
    const conducts = Object.values(modifiedConducts.value)
    await homeroomService.saveConducts({ conducts })
    snackbar.show({
      type: 'success',
      message: 'Đã lưu thay đổi'
    })
    modifiedConducts.value = {}
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
}
</script>

<template>
  <div
    class="conduct-view"
    style="--content-max-width: 80rem"
  >
    <md-tabs @change="handleSemesterChange">
      <md-secondary-tab>Học kì I</md-secondary-tab>
      <md-secondary-tab>Học kì II</md-secondary-tab>
    </md-tabs>
    <!-- Loading progress indicator -->
    <md-linear-progress
      v-show="loading"
      indeterminate
    />

    <!-- Score table -->
    <table class="table table-solid mt-10 mx-auto">
      <thead>
        <tr>
          <th>STT</th>
          <th style="text-wrap: nowrap">Họ và tên đệm</th>
          <th>Tên</th>
          <th>Giới tính</th>
          <th>Ngày sinh</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in students"
          :key="`semester${semester}-${student.id}`"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ translate(student.sex) }}</td>
          <td>{{ toDMY(student.dateOfBirth) }}</td>
          <td>
            <div class="table-actions">
              <md-text-button @click="handleViewScoreClick(student.id)"
                >Viết nhận xét</md-text-button
              >

              <md-outlined-select
                :key="`select-semester${semester}-${student.id}-${student?.conducts[0]?.conduct || ''}`"
                class="ml-4"
                label="Đánh giá hạnh kiểm"
                ref="conductRefs"
                :value="student?.conducts[0]?.conduct || null"
                @change="
                  () =>
                    handleConductModify(index, {
                      studentId: student.id,
                      yearId: parseInt(query.yearId),
                      semesterId: semester,
                      conduct: conductRefs[index].value
                    })
                "
              >
                <md-select-option value="good">
                  <div slot="headline">
                    {{ translate('good') }}
                  </div>
                </md-select-option>
                <md-select-option value="fair">
                  <div slot="headline">
                    {{ translate('fair') }}
                  </div>
                </md-select-option>
                <md-select-option value="average">
                  <div slot="headline">
                    {{ translate('average') }}
                  </div>
                </md-select-option>
                <md-select-option value="weak">
                  <div slot="headline">
                    {{ translate('weak') }}
                  </div>
                </md-select-option>
              </md-outlined-select>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <MdFloatingActionButton
    icon="check"
    label="Lưu thay đổi"
    variant="primary"
    @click="handleSaveChanges"
  ></MdFloatingActionButton>
</template>

<style lang="scss" src="@/assets/scss/components/_table.scss"></style>
<style lang="scss" scoped>
.conduct-view {
  display: flex;
  flex-direction: column;
  margin-inline: 0;
}
</style>
