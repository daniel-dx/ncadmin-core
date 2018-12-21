import detailRecursion from "../private/detail-widget/detail-recursion.vue";
import _get from "lodash-es/get";
import { ncformUtils } from "@ncform/ncform-common";
import { axiosOptions } from "../../utils/helper.js";
import widgetMixin from '../widgets/mixin.js';

export default {

  mixins: [widgetMixin],

  components: {
    detailRecursion
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },

  created() {
    this.initData();
  },

  data() {
    return {
      onlyId: "",
      formValue: {},
      defaultConfig: {
        title: '', // 详情页的标题
        idField: 'id', // 作为该详情信息的唯一标识
        source: { // 详细页的数据源
          apiUrl: '', // 数据源api
          method: 'get', // get/post default:get
          params: [{ // 请求参数
            name: 'id',
            value: 'dx: {{$id}}'
          }],
          resField: 'data' // 返回结果数据字段
        },
        detail: {
          properties: []
        },
        buttons: { // 操作按钮
          back: { // 后退
            enable: true // 可用状态，默认为true
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
      return _get(this.$data.mergeConfig, 'buttons.back.enable', true);
    },

    initData() {
      this.$data.onlyId = this.value[this.$data.mergeConfig.idField];
      this.loadFormData();
    },

    loadFormData() {
      const formDataConfig = this.$data.mergeConfig.source;
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

      this.$http(
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