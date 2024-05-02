<script setup>
import SearchBar from './SearchBar.vue'
import NavigationButton from '../navigation/NavigationButton.vue'
import ThemePicker from './ThemePicker.vue'
import UserMenu from './UserMenu.vue'
import LogoWithText from '../logos/LogoWithText.vue'
import { computed } from 'vue'

const user = computed(() => JSON.parse(localStorage.getItem('user')))
</script>

<template>
  <header class="header">
    <!-- Start -->
    <div class="header-start">
      <NavigationButton
        class="toggle-menu"
        type="toggleMenu"
      />
      <NavigationButton
        class="toggle-expand"
        type="toggleExpand"
      />
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <div class="logo">
            <LogoWithText />
          </div>
        </router-link>
      </div>
    </div>
    <!-- Search -->
    <!-- <SearchBar /> -->
    <!-- End -->
    <div class="header-end">
      <!-- Sign in button -->
      <router-link
        class="header-sign-in"
        :to="{ name: 'login.email' }"
      >
        <md-filled-button v-if="!user"> Đăng nhập </md-filled-button>
      </router-link>

      <!-- User menu -->
      <UserMenu v-if="user" />
      <!-- Theme picker -->
      <ThemePicker />
    </div>
  </header>
</template>
