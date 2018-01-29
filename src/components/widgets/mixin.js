import extend from 'extend';

export default {

  created() {
    this.$data.mergeConfig = extend(true, {}, this.$data.defaultConfig, this.config);

    this.$watch('config', () => {
      this.$data.mergeConfig = extend(true, {}, this.$data.defaultConfig, this.config);
    })
  },

  props: ["config", "value"],

  data() {
    return {
      mergeConfig: {},
      defaultConfig: {}
    }
  }
}