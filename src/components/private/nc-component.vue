<template>
  <component v-bind:is="compName" :config="configVal" :value="compVal">
  </component>
</template>

<script>
import { ncformUtils } from "ncform-common";

export default {
  props: {
    compName: {
      type: String,
      required: true
    },
    config: Object,
    value: [String, Number, Boolean, Object, Array],

    smartData: {
      type: Object,
      default() {
        return {
          $item: {} // symbol: value
        }
      }
    }
  },
  computed: {
    compVal() {
      return ncformUtils.smartAnalyze(this.value, {
        data: Object.keys(this.smartData).map(key => {
          return {
            symbol: key,
            value: this.smartData[key]
          }
        })
      });
    },
    configVal() {
      if (this.config) {
        let newConfig = {};
        Object.keys(this.config).forEach(cKey => {
          newConfig[cKey] = ncformUtils.smartAnalyze(this.config[cKey], {
            data: Object.keys(this.smartData).map(key => {
              return {
                symbol: key,
                value: this.smartData[key]
              }
            })
          });
        })
        return newConfig;
      }
    }
  }
};
</script>