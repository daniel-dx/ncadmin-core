<template>
  <div class="action-object">
    <nc-component v-if="config.handler.type === 'component'" :comp-name="config.handler.options.component.name.replace(/\./g, '_')" :value="config.handler.options.component.value" :config="config.handler.options.component.config" :smart-data="{$item: item, $selected: selected}">
    </nc-component>
    <slot v-else></slot>
  </div>
</template>

<script>
import { ncformUtils } from "ncform-common";
import ncComponent from "./nc-component.vue";

export default {
  components: {
    ncComponent,
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    selected: {
      type: [Object, Array],
      default: () => []
    }
  }
};
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.action-object{
  display: inline-block;
}
</style>
