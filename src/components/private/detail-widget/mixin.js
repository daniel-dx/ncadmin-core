import { ncformUtils } from "@ncform/ncform-common";

export default {
  props: ["config", "value", "rootData"],
  methods: {
    analyze(val, inputData) {
      const rootData = this.rootData || this.value;
      inputData = inputData || this.value;
      val = val !== undefined ? (typeof val === 'string' ? val.replace(/(\$parent|\$item)/g, "$data") : val) : 'dx: {{$root}}';
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