import widgetMixin from "../mixin.js";

/**
 * <image></image>
 */
export default {

  mixins: [widgetMixin],

  /* ====================== 生命周期 ====================== */

  created() {
    // 在这里做一些跟DOM无关的初始化, 比如获取初始化数据

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
      maxWidth: ''
    }
  },

  /* ====================== 事件处理 ====================== */

  methods: {

  },

  watch: {

  }
}
