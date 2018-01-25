import detailRecursion from "../private/detail-widget/detail-recursion.vue";
import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import { axiosOptions } from "../../utils/helper.js";
import axios from "axios";

export default {
  components: {
    detailRecursion
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    this.$axios = !this.$axios ? axios : this.$axios;
    this.initData();
  },
  mounted() {
  },
  data() {
    return {
      onlyId: "",
      formValue: {
        username: "apple",
        attribute: {
          weight: "300g",
          color: "red"
        },
        tag: ["red", "sweet"],
        attributes: [
          {
            weight: "11g",
            color: "purple"
          },
          {
            weight: "22g",
            color: "green"
          }
        ],
        attributes3: [
          {
            weight: {
              value1: "12g",
              value2: "22g"
            },
            color: {
              value1: "purple1",
              value2: "purple2"
            }
          },
          {
            weight: {
              value1: "78g",
              value2: "88g"
            },
            color: {
              value1: "purple3",
              value2: "purple4"
            }
          }
        ],
        obj: {
          a: {
            a: 1,
            b: 2
          },
          b: {
            a: 3,
            b: 4
          }
        }
      }
    };
  },
  methods: {
    goEdit() {
      this.$emit("goEdit");
    },
    goBack() {
      this.$emit("goBack");
    },
    buttonBack() {
      return _get(this.config, 'buttons.back.enable', true);
    },
    initData() {
      this.$data.onlyId = this.value[this.config.idField];
      this.loadFormData();
    },
    loadFormData() {
      const formDataConfig = this.config.source;
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