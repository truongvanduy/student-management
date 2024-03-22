<script setup>
import LogoWithoutText from '@/components/logos/LogoWithoutText.vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  formMethod: {
    type: String,
    default: 'GET'
  },
  formAction: {
    type: String,
    default: '#'
  }
})
</script>
<template>
  <div class="auth-wrapper container">
    <section class="auth mx-4">
      <!-- Loading indicator -->
      <md-linear-progress
        v-if="loading"
        class="auth-progress"
        indeterminate
      ></md-linear-progress>

      <div class="auth-header">
        <LogoWithoutText />
      </div>

      <div class="auth-body">
        <div class="auth-display">
          <h1 class="fs-2 auth-title">
            <slot name="title"></slot>
          </h1>
          <slot name="greeting"></slot>
        </div>
        <form
          class="auth-form flow"
          :method="formMethod"
          :action="formAction"
        >
          <slot name="form"></slot>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.auth {
  padding: 2.25rem;
  padding-top: 0;
  border-radius: var(--catalog-shape-xl);
  background-color: var(--md-sys-color-surface-container-lowest);
  flex: 1;

  &-wrapper {
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-header {
    width: 3.2rem;
    margin-top: 2.25rem;
    margin-bottom: 1.25rem;
  }
  &-body {
    --col-gap: 2rem;

    display: flex;
    justify-content: space-between;
    column-gap: var(--col-gap);
    flex-wrap: wrap;

    container: auth / inline-size;

    & > * {
      flex: 1;
      min-width: 18rem;
    }
  }
  &-display {
    --flow-spacer: 0.5rem;
  }
  &-title {
    font-weight: normal;
  }
  &-form {
    --flow-spacer: 1rem;
    text-align: end;

    &-text-field {
      text-align: left;
      width: 100%;
      max-width: 30rem;
    }
    &-suggest {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      column-gap: 0.5rem;

      text-align: right;

      margin-top: 0.5rem;
    }
  }
}

/**
  * Responsive:
  * - 38rem: 2 * content-min-width(18rem) + gap(2rem)
  * - 44.5rem: 38rem + 2 * padding-inline(2.25rem) + 2 * margin-inline(1rem)
*/

@container auth (width < 38rem) {
  .auth-form {
    text-align: left;
    margin-top: calc(var(--col-gap) / 1.5);
    max-width: 22rem;
    min-width: unset;
  }
}

@media screen and (width < 44.5rem) {
  .auth {
    max-width: 25rem;
    padding: 0 1.5rem 1.5rem;
  }
}

@media screen and (width < 25rem) {
  :root {
    background-color: var(--md-sys-color-surface-container-lowest);
  }
  .auth {
    padding: 0 0 1rem;
    max-width: unset;
  }
}
</style>
