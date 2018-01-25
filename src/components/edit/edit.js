import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import { axiosOptions } from "../../utils/helper.js";
import axios from 'axios';

export default {
  components: {},
  created() {
    this.$axios = !this.$axios ? axios : this.$axios;
    this.initData();
  },
  props: {
    config: {
      type: Object,
      default: {}
    },
    value: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      onlyId: "",
      formValue: {}
    };
  },
  computed: {
    isEdit() {
      return this.$data.onlyId !== "0";
    }
  },
  methods: {
    goBack() {
      this.$emit("goBack");
    },
    initData() {
      this.$data.formValue = {};

      this.$data.onlyId = this.value[this.config.idField];
      if (this.$data.onlyId != "0") {
        this.loadFormData();
      }
    },
    loadFormData() {
      const formDataConfig = this.config.formData;
      const data = {};
      formDataConfig.params.forEach(item => {
        data[item.name] = ncformUtils.smartAnalyze(item.value, {
          data: [
            {
              symbol: "$item",
              value: {
                id: this.$data.onlyId
              }
            }
          ]
        });
      });

      this.$axios(
        formDataConfig.apiUrl,
        axiosOptions(formDataConfig.method, data)
      ).then(res => {
        const resField = formDataConfig.resField;
        this.$data.formValue = resField ? _get(res.data, resField) : res.data;
      });
    },
    submitData() {
      const submitConfig = this.config.buttons.submit;
      let data = {};
      if (submitConfig.valueField) {
        data[submitConfig.valueField] = this.$data.formValue;
      } else {
        data = Object.assign({}, this.$data.formValue);
      }

      data[submitConfig.idField || "id"] = this.$data.onlyId;

      this.$axios(
        submitConfig.apiUrl,
        axiosOptions(submitConfig.method, data)
      ).then(res => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.goBack();
      });
    }
  },
  watch: {
    value: {
      handler() {
        this.initData();
      }
    }
  }
};