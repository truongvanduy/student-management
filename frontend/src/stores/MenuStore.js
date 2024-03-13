import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    isOpened: false,
    isExpanded: true
  }),
  actions: {
    toggleMenu() {
      this.isOpened = !this.isOpened
      // if (this.isOpened) {
      //   this.isExpanded = true
      // }
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    }
  }
})
