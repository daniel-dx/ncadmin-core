<template>
  <el-col class="detail-recursion" :span="columns">
    <!-- 对象 -->
    <component v-if="config.properties" :is="config.widget?'layout-'+config.widget : defaultWidget.object" :config="config" :value="value"  :root-data="rootValue">
      <template slot-scope="props">
        <detail-recursion :config="props.itemConfig" :value="props.itemValue" :root-data="rootValue">
        </detail-recursion>
      </template>
    </component>

    <!-- 数组 -->
    <component v-else-if="config.items" :is="config.widget?'layout-'+config.widget : defaultWidget.array" :config="config" :value="value" :root-data="rootValue">
      <template slot-scope="props">
        <detail-recursion :config="props.itemConfig" :value="props.itemValue" :root-data="rootValue">
        </detail-recursion>
      </template>
    </component>

    <!-- 具体展示控件 -->
    <component v-else :is="config.widget?'control-'+config.widget : defaultWidget.label" :config="config" :value="value" :root-data="rootValue" />

  </el-col>
</template>
<script>
import widgetMixin from "./mixin.js";
import widgets from "./widget.js";
export default {
  name: "detail-recursion",
  components: {
    ...widgets
  },
  mixins: [widgetMixin],
  data() {
    return {
      defaultWidget: {
        object: "layout-object",
        array: "layout-array",
        label: "control-label"
      }
    };
  },
  computed: {
    columns() {
      return this.config.columns ? this.config.columns * 2 : 24;
    },
    rootValue() {
      return this.rootData || this.value;
    }
  }
};
</script>

<style lang="sass" rel="stylesheet/scss">
.detail-recursion{
  font-size: 14px;
  line-height: 30px;
}
</style>
