<script setup>
import { useRouter } from 'vue-router'
import AuthenticationLayout from '@/layouts/AuthenticationLayout.vue'
import studentService from '@/services/student.service'
import { onMounted, ref } from 'vue'
import MdIcon from '@/components/icons/MdIcon.vue'
const { email } = defineProps({
  email: String
})
const router = useRouter()
const loading = ref(false)

const user = ref({})
const password = ref('')

onMounted(async () => {
  if (email) {
    try {
      loading.value = true
      const response = await studentService.getByEmail(email)
      user.value = response.data
    } catch (err) {
      console.log(err)
    }
    loading.value = false
  } else {
    console.log('No email')
  }
  console.log(password)
  password.value.$el.focus()
})

const errorMessage = ref('')

async function handleSignIn() {
  try {
    loading.value = true
    console.log(user.value.email)
    const response = await studentService.login({
      email: user.value?.email,
      password: password.value
    })

    const { authenticated, student } = response.data

    if (authenticated) {
      localStorage.setItem('student', JSON.stringify(student))
      router.push({
        name: 'profile'
      })
    }
  } catch (error) {
    console.log(error)
    errorMessage.value = error.response?.data?.message || 'Đã có lỗi xảy ra'
    loading.value = false
  }

  loading.value = false
}
</script>
<template>
  <AuthenticationLayout :loading="loading">
    <template #title>Chào mừng</template>

    <template #greeting>
      <md-assist-chip
        v-if="!loading"
        class="chip"
        :label="user?.email ? user.email : ''"
        @click="
          router.push({
            name: 'login.email',
            query: {
              email: user?.email ? user.email : ''
            }
          })
        "
      >
        <MdIcon
          slot="icon"
          :style="'filled'"
          >account_circle</MdIcon
        >
      </md-assist-chip>
    </template>

    <template #form>
      <!-- Form fields -->

      <input
        type="hidden"
        class="auth-form-text-field"
        name="email"
        :value="user?.email"
      />

      <md-outlined-text-field
        class="auth-form-text-field"
        type="password"
        label="Mật khẩu"
        name="password"
        v-model="password"
        @keyup.enter="handleSignIn"
        :error="errorMessage && !loading ? true : undefined"
        :error-text="errorMessage"
        autocomplete="new-password"
        autofocus
      ></md-outlined-text-field>

      <!-- Form suggest -->
      <div class="auth-form-suggest">
        <router-link to="/">Bạn quên mật khẩu?</router-link>
      </div>

      <!-- Form actions -->
      <div class="auth-form-action">
        <md-filled-button
          :disabled="loading ? 'disabled' : undefined"
          @click.prevent="handleSignIn"
          >Tiếp theo</md-filled-button
        >
      </div>
    </template>
  </AuthenticationLayout>
</template>

<style lang="scss">
.chip md-icon {
  font-size: 1.125rem;
}
</style>
