import { ncformUtils } from "ncform-common";

export default {
  props: ["config", "value"],
  methods: {
    analyze(val, inputData) {
      inputData = inputData || this.value;
      val = val.replace(/(\$object|\$item|\$data)/g, "$data");
      return ncformUtils.smartAnalyze(val, {
        data: [
          {
            symbol: "$data",
            value: inputData
          }
        ]
      });
    }
  }
}