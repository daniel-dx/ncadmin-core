import detailRecursion from "../private/detail-widget/detail-recursion.vue";
import _get from "lodash-es/get";
import { ncformUtils } from "@ncform/ncform-common";
import { axiosOptions } from "../../utils/helper.js";
import modalInsideMixins from '../widgets/modal-inside-mixin.js';

export default {

  mixins: [modalInsideMixins],

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
          ]
        },
      }
    };
  },

  methods: {

    initData() {
      this.$data.onlyId = this.value[this.$data.mergeConfig.idField];
      this.loadFormData();
    },

    loadFormData() {
      const formDataConfig = this.$data.mergeConfig.source;

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