import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import { axiosOptions } from "../../utils/helper.js";
import axios from 'axios';
import widgetMixin from '../widgets/mixin.js';

export default {

  mixins: [widgetMixin],

  created() {
    this.$axios = !this.$axios ? axios : this.$axios;
    this.initData();
  },

  props: {
    value: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      editFormName: `edit-${new Date().getTime()}`,
      onlyId: "",
      formValue: {},
      defaultConfig: {
        title: '', // 标题，editMode不同，显示也不同。比如这里写“商品”，编辑模式下显示为编辑商品，新建模式下显示新建商品
        idField: 'id', // 该表单记录的唯一标识，通过该字段可判断编辑模式还是新建模式
        formData: { // 当编辑模式时取表单数据用
          apiUrl: '', // 取表单数据的Url
          method: 'get', // get/post default:get
          params: [
            {
              name: 'id',
              value: 'dx: {{$id}}'
            }
          ],
          resField: '' // 返回数据的实际字段
        },
        formSchema: { // ncform 配置
        },
        buttons: {
          submit: { // 提交
            apiUrl: '', // 提交的Url
            method: 'post', // get/post default: post
            valueField: '', // 当为空时，即表单的每个一级字段即为参数名
            goBack: true, // 是否返回
          },
          back: { // 返回
            enable: true
          }
        }
      }
    };
  },

  computed: {
    isEdit() {
      return this.$data.onlyId !== "0";
    }
  },

  methods: {

    goBack() {
      if (this.$data.mergeConfig.buttons.submit.goBack) {
        this.$emit("goBack");
      }
    },

    initData() {
      this.$data.formValue = {};

      this.$data.onlyId = this.value[this.$data.mergeConfig.idField];
      if (this.$data.onlyId && this.$data.onlyId != "0") {
        this.loadFormData();
      }
    },

    loadFormData() {
      const formDataConfig = this.$data.mergeConfig.formData;
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
        let resData = this.$options.remoteData = resField ? _get(res.data, resField) : res.data;
        this.$data.formValue = this.$data.mergeConfig.formField ? resData[this.$data.mergeConfig.formField] : resData;
      });
    },

    submitData() {
      this.$ncformValidate(this.$data.editFormName).then( dataNeverUsed => {
        if (!dataNeverUsed.result) {return;}
        const submitConfig = this.$data.mergeConfig.buttons.submit;
        let data = {}, submitData;

        // 保证取回什么样的数据格式，就提交什么样的数据格式
        if (this.$data.mergeConfig.formField) {
          submitData = Object.assign({}, this.$options.remoteData || this.value);
          submitData[this.$data.mergeConfig.formField] = Object.assign(submitData[this.$data.mergeConfig.formField], this.$data.formValue);
        } else {
          submitData = Object.assign({}, this.$options.remoteData || this.value, this.$data.formValue);
        }

        if (submitConfig.valueField) data[submitConfig.valueField] = submitData;
        else data = submitData;

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