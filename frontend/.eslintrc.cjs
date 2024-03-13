/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: ['src/**/*.vue'],
      rules: {
        'vue/no-deprecated-slot-attribute': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
