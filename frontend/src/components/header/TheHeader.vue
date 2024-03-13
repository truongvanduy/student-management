<script setup>
import SearchBar from './SearchBar.vue'
import NavigationButton from '../navigation/NavigationButton.vue'
import MdIconButton from '../buttons/MdIconButton.vue'
import ThemePicker from './ThemePicker.vue'
import UserMenu from './UserMenu.vue'
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
          <md-icon-button>
            <md-icon class="material-symbols-rounded">home</md-icon>
          </md-icon-button>
        </router-link>
      </div>
    </div>
    <!-- Search -->
    <SearchBar />
    <!-- End -->
    <div class="header-end">
      <UserMenu />
      <ThemePicker />
    </div>
  </header>
</template>
