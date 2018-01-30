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
      default: () => ({
        idField: 'id', // 作为该详情信息的唯一标识
        source: { // 详细页的数据源
          // 是否远程读取，默认是。如果不是，则从value属性中直接读取
          isRemote: true,
          // 当远程读取时，从以下信息请求远程数据
          apiUrl: '', // 数据源api
          method: 'get', // get/post default:get
          params: [{ // 请求参数
            name: 'id',
            value: 'dx: {{$id}}'
          }],
          resField: 'data' // 返回结果数据字段
        },
        detail: {

          properties: [

            // 普通字段
            {
              label: '', // 标签
              value: '', // 【必填】。只支持dx表达式（支持$root，$parent，$item）
              columns: 6, // 所占的列数，默认是12（一行为12列）
              widget: 'label', // 使用的widget，默认是label，即只显示只读文本
              widgetConfig: {} // widget的一些配置信息
            },

            // 对象包含
            {
              label: '', // 标签
              value: '', // 【非必填】。只支持dx表达式（支持$root和$parent）
              widget: 'object', // 使用的widget，默认是object
              widgetConfig: {},
              properties: [
                {
                  label: '', // 标签
                  value: '' // 只支持dx表达式（支持$root和$parent）
                },
              ],
            },

            // 数组包含
            {
              label: '', // 标签
              value: '', // 【必填】。只支持dx表达式（支持$root和$parent）
              widget: 'array', // array | table | tabs
              widgetConfig: {},
              items: {
                label: '', // 标签
                value: '' // dx表达式（支持$root和$item）
              },
            },
          ]
        },
      })
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

  data() {
    return {
      onlyId: "",
      formValue: {}
    };
  },

  methods: {

    initData() {
      this.$data.onlyId = this.value[this.config.idField];
      this.loadFormData();
    },

    loadFormData() {
      const formDataConfig = this.config.source;

      // 如果指定数据从本地数据源获取，则直接将value当数据源
      if (formDataConfig.isRemote === false) {
        this.$data.formValue = this.value;
        return;
      }

      const data = {};
      formDataConfig.params.forEach(item => {
        data[item.name] = ncformUtils.smartAnalyze(item.value, {
          data: [
            {
              symbol: "$id",
              value: this.$data.onlyId
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
        console.log(this.$data.formValue)
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