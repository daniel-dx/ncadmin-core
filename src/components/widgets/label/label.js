
import widgetMixin from "../mixin.js";

/**
 * <label></label>
 */
export default {

  mixins: [widgetMixin],

  /* ====================== 生命周期 ====================== */

  created() {
    // 在这里做一些跟DOM无关的初始化, 比如获取初始化数据
    let filterFn = this.$data.mergeConfig.filterFn;
    if (filterFn && typeof(filterFn) === 'function') {
      this.$data.modelVal = filterFn.apply(null, [this.value].concat(this.$data.mergeConfig.filterFnParam || []));
    } else {
      this.$data.modelVal = this.value;
    }
  },

  mounted() {
    // 在这里做一些跟DOM有关的初始化

  },

  destroyed() {
    // 在这里销毁无用的资源，比如setTimeout返回的值

  },

  /* ====================== 引用组件 ====================== */

  components: {

  },

  /* ====================== 数据绑定 ====================== */

  props: {
    
  },

  data() {
    return {
      modelVal: '',
      defaultConfig: {
        color: '', // 字体颜色
        class: '', // css类名
        filterFn: null, // filter function
        filterFnParam: [], // filter function parameters
      }
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {
  },

  watch: {

  }
}
