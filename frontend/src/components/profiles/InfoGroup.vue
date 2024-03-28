<script setup>
defineProps(['title', 'supportingText', 'items'])
</script>

<template>
  <div class="info-group flow figure">
    <!-- Basic info -->
    <h3 class="fs-4 pl-4 mb-4 fw-500">{{ title }}</h3>
    <p
      v-if="supportingText"
      class="fs-6 pl-4"
    >
      {{ supportingText }}
    </p>
    <md-list v-if="items?.length > 0">
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <md-divider></md-divider>
        <md-list-item type="text">
          <p
            slot="start"
            class="info-key"
          >
            {{ item.key }}
          </p>
          <p
            slot="headline"
            class="fs-6 info-value"
          >
            {{ item.value }}
          </p>
          <md-assist-chip
            v-if="item?.hasAction"
            slot="end"
            :label="item.actionName"
            @click="item.action"
          ></md-assist-chip>
        </md-list-item>
      </template>
    </md-list>
  </div>
</template>
<style lang="scss">
.info {
  &-group {
    color: var(--md-sys-color-on-surface-variant);
    border: 1px solid var(--md-sys-color-outline-variant);
    padding: 1rem 0 0 0.5rem;
    border-radius: var(--catalog-shape-xl);
    overflow: hidden;

    & md-divider {
      padding-left: 1rem;
    }

    & :host(md-item) {
      padding-block: 0.5rem;
    }

    & > * {
      --flow-spacer: 0.5em;
    }
  }
  &-key {
    flex-basis: 10rem;
  }
  &-value {
    color: var(--md-sys-color-on-surface-variant);
  }
}
</style>
