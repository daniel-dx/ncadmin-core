import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import axios from 'axios';
import modalInsideMixins from '../widgets/modal-inside-mixin.js';
import { axiosOptions } from "../../utils/helper.js";

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
      dataLoaded: false, // 表单数据是否已经加载完毕
      defaultConfig: {
        idField: 'id', // 该表单记录的唯一标识
        isCopy: false, // 是否复制模式
        formField: '', // 数据源中哪个字段作为form的数据
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
            apiUrl: '', // 提交的Url。当为空时表示不调用接口提交，而只是改变model值
            method: 'post', // get/post default:get
            valueField: '', // 当为空时，即表单的每个一级字段即为参数名
          }
        }
      }
    };
  },

  methods: {

    _initData() {
      this.$data.onlyId = this.value[this.$data.mergeConfig.idField];
      this.$data.formValue = Object.assign({}, this.$data.mergeConfig.formField ? this.value[this.$data.mergeConfig.formField] : this.value);
      this._loadFormData();
    },

    _loadFormData() {

      // 如果指定数据从本地数据源获取，则直接将value当数据源
      if (this.$data.mergeConfig.formData.isRemote === false) {
        if (this.$data.mergeConfig.isCopy) { // 复制模式删除ID
          delete this.$data.formValue[this.$data.mergeConfig.idField];
        }
        this.$data.dataLoaded = true;
        return;
      }

      // 没有ID则中断请求
      if (!this.$data.onlyId || this.$data.onlyId == "0") {
        this.$data.dataLoaded = true;
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

      this.$axios(formDataConfig.apiUrl, axiosOptions(formDataConfig.method, data)).then(res => {
        const resField = formDataConfig.resField;
        let resData = this.$options.remoteData = resField ? _get(res.data, resField) : res.data;
        this.$data.formValue = this.$data.mergeConfig.formField ? resData[this.$data.mergeConfig.formField] : resData;
        this.$data.dataLoaded = true;
        if (this.$data.mergeConfig.isCopy) { // 复制模式删除ID
          delete this.$data.formValue[this.$data.mergeConfig.idField];
        }
      });
    },

    _confirmHandler(done) {

      this.$ncformValidate(this.$data.formName).then(data => {
        if (data.result) {
          let data = {}, submitData;
          const submitConfig = this.$data.mergeConfig.buttons.submit;

          // 保证取回什么样的数据格式，就提交什么样的数据格式
          if (this.$data.mergeConfig.formField) {
            submitData = Object.assign({}, this.$options.remoteData || this.value);
            submitData[this.$data.mergeConfig.formField] = Object.assign(submitData[this.$data.mergeConfig.formField], this.$data.formValue);
          } else {
            submitData = Object.assign({}, this.$options.remoteData || this.value, this.$data.formValue);
          }

          if (this.$data.mergeConfig.isCopy) delete submitData[this.$data.mergeConfig.idField];

          if (submitConfig.valueField) data[submitConfig.valueField] = submitData;
          else data = submitData;

          if (!this.$data.mergeConfig.isCopy) data[this.$data.mergeConfig.idField] = this.$data.onlyId;

          if (submitConfig.apiUrl) { // 有则远程调用 
            this.$axios(submitConfig.apiUrl, axiosOptions(submitConfig.method, data)).then(res => {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              done();
            });
          } else { // 无则通知value改变
            this.$emit('input', data); 
            done();
          }
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