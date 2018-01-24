<template>
  <div class="layout-object">
    <div v-if="titleShow(config)" class="label" :style="titleStyle()">{{config.label}}</div>
    <div class="content">
      <el-row>
        <el-col v-for="item in config.properties" :span="columns(item)" style="margin:5px 0;">
          <div class="flexBox">
            <div v-if="propertyLabelShow(item)" class="labelArea" :style="labelStyle()">
              {{item.label}}
            </div>
            <div class="flex">
              <el-row>
                <slot :item-config="item" :item-value="objectValue"></slot>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import widgetMixin from "./mixin.js";
import _get from "lodash-es/get"
export default {
  mixins: [widgetMixin],
  created() {
    this.$data.objectValue = this.analyze(this.config.value);
  },
  data() {
    return {
      objectValue: {}
    };
  },
  methods: {
    labelStyle() {
      return {
        width: _get(this.config, 'widgetConfig.labelWidth', '72px'),
        color: _get(this.config, 'widgetConfig.labelColor', '#777')
      }
    },
    titleStyle() {
      return {
        color: _get(this.config, 'widgetConfig.titleColor', '#409eff'),
        borderLeft: `3px solid ${_get(this.config, 'widgetConfig.titleColor', '#409eff')}`
      }
    },
    propertyLabelShow(item){
      return item.label && _get(item, "widgetConfig.showOwnLabel", true);
    },
    titleShow(config){
      return config.label && _get(config, "widgetConfig.showTitle", true);;
    },
    columns(item){
      return item.columns ? item.columns * 2 : 24;
    }
  }
};
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.layout-object {
  .content {
    // border: 1px solid #ebeef5;
    // padding: 10px;
  }
  .label {
    border-bottom: 1px solid #ebeef5;
    border-left: 3px solid #409eff;
    line-height: 30px;
    padding: 0 0 0 15px;
    color: #409eff;
  }

  .labelArea {
    width: 72px;
    padding-right: 12px;
    text-align: right;
    line-height: 30px;
  }

  .flexBox {
    display: flex;
  }
  .flex {
    flex: 1;
  }
}
</style>