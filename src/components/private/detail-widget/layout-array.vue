<template>
  <div class="layout-array">
    <el-row>
      <template v-for="item in valueData">
        <slot :item-config="config.items" :item-value="item">
        </slot>
      </template>
    </el-row>
  </div>
</template>
<script>
import widgetMixin from "./mixin.js";
export default {
  mixins: [widgetMixin],
  created() {
    this.$data.valueData = this.analyze(this.config.value);
  },
  data() {
    return {
      valueData: []
    };
  }
};
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.layout-array {
  width: 100%;
}
</style>