<template>
  <table class="layout-table" cellspacing="0" cellpadding="0" border="0" >

    <colgroup v-if="config.widgetConfig && config.widgetConfig.colgroup">
      <col v-for="(item, idx) in config.widgetConfig.colgroup" :key="idx" :width="item.width" />
    </colgroup>

    <tbody>
      <!-- 内嵌信息为Object -->
      <template v-if="config.items.properties">
        <tr>
          <th v-for="(item, idx) in config.items.properties" :key="idx">{{item.label}}</th>
        </tr>
        <tr v-for="(item, idx) in valueData" :key="idx">
          <td v-for="(item2, idx) in config.items.properties" :key="idx">
              <!-- 这里的item-value为items.value的值根据数组每一项的值来解析 -->
              <slot :item-config="item2" :item-value="analyze(config.items.value, item)"></slot>
          </td>
        </tr>
      </template>

      <!-- 内嵌信息为其它 -->
      <template v-else>
        <tr v-if="config.label">
          <th>{{config.label}}</th>
        </tr>
        <tr v-for="(item, idx) in valueData" :key="idx"> 
          <td>
            <slot :item-config="config.items" :item-value="item">
            </slot>
          </td>
        </tr>
      </template>
    </tbody>

  </table>
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
.layout-table {
  width: 100%;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  
  th, td{
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    user-select: none;
    text-align: left;
    background-color: #fff;


    padding: 12px 10px;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: top;
    position: relative;
    color: #999;
  }

  td{
    color: #666;
    
  }
}
</style>