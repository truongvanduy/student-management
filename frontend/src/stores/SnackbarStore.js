import { defineStore } from 'pinia'

export const useSnackbar = defineStore('snackBarStore', {
  state: () => ({
    isOpened: false,
    message: '',
    type: 'success',
    timeout: null
  }),
  actions: {
    getElement() {
      this.element = document.querySelector('.snackbar')
    },
    show(settings = {}) {
      // close previous snackbar
      clearTimeout(this.timeout)
      this.close()

      // show new snackbar
      this.setType(settings.type || this.type || 'success')
      this.addMessage(settings.message || this.message || 'Default content')
      this.open()
      const timeout = setTimeout(() => {
        this.close()
      }, 3000)

      // save timeout for further clearing
      this.timeout = timeout
    },
    open() {
      this.isOpened = true
    },
    close() {
      this.isOpened = false
    },
    setType(type) {
      this.type = type
    },
    addMessage(message) {
      this.message = message
    }
  }
})
