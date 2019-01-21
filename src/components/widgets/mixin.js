import extend from 'extend';
import axios from 'axios';

export default {

  created() {
    if (!this.$http) {
      this.$http = this.$axios || this.axios || axios;
    }
    
    this.$data.mergeConfig = extend(true, {}, this.$data.defaultConfig, this.config);

    this.$watch('config', () => {
      this.$data.mergeConfig = extend(true, {}, this.$data.defaultConfig, this.config);
    })
  },

  props: {
    config: [Object, Function],
    value: [String, Number, Boolean, Object, Array, Function],
  },

  data() {
    return {
      mergeConfig: {},
      defaultConfig: {}
    }
  }
}