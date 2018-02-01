import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import eventHub from '../../utils/event-hub.js'
import axios from 'axios';
import modalInsideMixins from '../widgets/modal-inside-mixin.js';

export default {

  mixins: [modalInsideMixins],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
  },

  created() {
    this.$axios = !this.$axios ? axios : this.$axios;
    this._initData();
  },

  data() {
    return {
      formName: 'edit-modal-inside_' + ncformUtils.genRandomId(),
      onlyId: "",
      formValue: {},
      defaultConfig: {
        idField: 'id', // 该表单记录的唯一标识，通过该字段可判断编辑模式还是新建模式
        formData: { // 当编辑模式时取表单数据用
          // 是否远程读取，默认是。如果不是，则从value属性中直接读取
          isRemote: true,
          // 当远程读取时，从以下信息请求远程数据
          apiUrl: '', // 取表单数据的Url
          method: 'get', // get/post default:get
          params: [
            {
              name: 'id',
              value: 'dx: {{$id}}'    // $item.id 为表单记录的唯一标识
            }
          ],
          resField: '' // 返回数据的实际字段
        },
        formSchema: { // ncform 配置
        },
        buttons: {
          submit: { // 提交
            apiUrl: '', // 提交的Url
            method: 'post', // get/post default:get
            valueField: '', // 当为空时，即表单的每个一级字段即为参数名
          }
        }
      }
    };
  },

  methods: {

    _initData() {
      this.$data.formValue = {};
      this.$data.onlyId = this.value[this.$data.mergeConfig.idField];
      if (this.$data.onlyId && this.$data.onlyId != "0") {
        this._loadFormData();
      }
    },

    _loadFormData() {

      // 如果指定数据从本地数据源获取，则直接将value当数据源
      if (this.$data.mergeConfig.formData.isRemote === false) {
        this.$data.formValue = this.value;
        return;
      }

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

      this.$axios.post(formDataConfig.apiUrl, data).then(res => {
        const resField = formDataConfig.resField;
        this.$data.formValue = resField ? _get(res.data, resField) : res.data;
      });
    },

    _confirmHandler(done) {

      this.$ncformValidate(this.$data.formName).then(data => {
        if (data.result) {
          let data = {};
          const submitConfig = this.$data.mergeConfig.buttons.submit;
          if (submitConfig.valueField) {
            data[submitConfig.valueField] = this.$data.formValue;
          } else {
            data = Object.assign({}, this.$data.formValue);
          }

          data[this.$data.mergeConfig.idField] = this.$data.onlyId;
          this.$axios.post(submitConfig.apiUrl, data).then(res => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            done();
          });
        }
      });
    },
  },

  watch: {
    value: {
      handler() {
        this._initData();
      }
    }
  }
};