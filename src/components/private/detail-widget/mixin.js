import { ncformUtils } from "ncform-common";

export default {
  props: ["config", "value", "rootData"],
  methods: {
    analyze(val, inputData) {
      const rootData = this.rootData || this.value;
      inputData = inputData || this.value;
      val = val ? val.replace(/(\$parent|\$item)/g, "$data") : 'dx: {{$root}}';
      return ncformUtils.smartAnalyze(val, {
        data: [
          {
            symbol: "$data",
            value: inputData
          },
          {
            symbol: "$root",
            value: rootData
          }
        ]
      });
    }
  }
}