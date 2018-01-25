<template>
  <div class="action-object">
    <component v-if="config.handler.type === 'component'" :is="config.handler.options.component.name.replace(/\./g, '_')" :config="config.handler.options.component.config" :value="componentValue">
    </component>
    <slot v-else></slot>
  </div>
</template>

<script>
import { ncformUtils } from "ncform-common";

export default {
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
  },
  created() {
    this.dealComponentValue();
  },
  data() {
    return {
      componentValue: {}
    };
  },
  methods: {
    dealComponentValue() {
      if (this.config.handler.type === "component") {
        const values = this.config.handler.options.component.value;
        for (let key in values) {
          this.$data.componentValue[key] = ncformUtils.smartAnalyze(
            values[key],
            {
              data: [
                {
                  symbol: "$item",
                  value: this.item
                },
                {
                  symbol: "$selected",
                  value: this.selected
                }
              ]
            }
          );
        }
      }
    }
  }
};
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.action-object{
  display: inline-block;
}
</style>
