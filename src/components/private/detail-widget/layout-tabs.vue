<template>
  <div class="layout-tabs">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="(item, index) in valueData" :label="config.items.label+(index+1)" :name="index+''" :key="index">
        <slot :item-config="config.items" :item-value="item"></slot>
      </el-tab-pane>
    </el-tabs>
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
      valueData: [],
      activeName: 0
    };
  },
  methods: {
    deleteLabel(obj) {
      obj = JSON.parse(JSON.stringify(obj));
      delete obj.label;
      return obj;
    }
  }
};
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.layout-tabs {
}
</style>