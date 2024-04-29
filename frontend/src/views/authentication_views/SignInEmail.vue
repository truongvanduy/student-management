<script setup>
import AuthenticationLayout from '@/layouts/AuthenticationLayout.vue'
import { ref } from 'vue'
import userService from '@/services/user.service'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const email = ref(route.query.email || '')
const userEmail = ref(null)

const errorMessage = ref('')
const router = useRouter()

const loading = ref(false)

const getEmail = async () => {
  try {
    loading.value = true
    const response = await userService.getByEmail(email.value)
    loading.value = false

    userEmail.value = response?.data?.email
    router.push({ name: 'login.password', params: { email: userEmail.value } })
  } catch (err) {
    loading.value = false
    console.log(err)
    errorMessage.value = err.response.data.message || 'Đã có lỗi xảy ra'
  }
}
</script>
<template>
  <AuthenticationLayout :loading="loading">
    <template #title> Đăng nhập </template>

    <template #greeting>
      <p>Nhập địa chỉ email của bạn để tiếp tục</p>
    </template>

    <template #form>
      <md-outlined-text-field
        class="auth-form-text-field"
        type="email"
        label="Email"
        name="email"
        v-model="email"
        @keyup.enter="getEmail"
        :error="errorMessage && !loading ? '' : undefined"
        :error-text="!loading && errorMessage"
        autofocus
      ></md-outlined-text-field>
      <div class="auth-form-suggest"></div>

      <div class="auth-form-action">
        <md-filled-button
          @click.prevent="getEmail"
          :disabled="loading ? 'disabled' : undefined"
          >Tiếp theo</md-filled-button
        >
      </div>
    </template>
  </AuthenticationLayout>
</template>

<style lang="scss" scoped></style>
