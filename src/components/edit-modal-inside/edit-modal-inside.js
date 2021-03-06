import _get from "lodash-es/get";
import _merge from "lodash-es/merge";
import _cloneDeep from "lodash-es/cloneDeep";
import { ncformUtils } from "@ncform/ncform-common";
import modalInsideMixins from '../widgets/modal-inside-mixin.js';
import { axiosOptions } from "../../utils/helper.js";
import eventHub from '../../utils/event-hub.js';

export default {

  mixins: [modalInsideMixins],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },
  },

  created() {
    this.$options.valueCopy = _cloneDeep(this.value);
    this._initData();

    // 编辑初始状态下通知“确定”按钮呈现不可用状态
    if (this.isEdit && this.$data.mergeConfig.buttons.submit.toggleDisabled) {
      this._disableConfirm(true);
    }
  },

  computed: {
    isEdit() {
      return this.$data.onlyId && this.$data.onlyId !== '0';
    }
  },

  data() {
    return {
      formName: 'edit-modal-inside_' + ncformUtils.genRandomId(),
      isFormDirty: false,
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
          globalConfig: {
            scrollToFailField: {
              container: '.el-dialog__wrapper'
            }
          }
        },
        buttons: {
          submit: { // 提交
            triggerByExternal: false, // 是否通过外部组件通过调用confirm方法来触发
            apiUrl: '', // 提交的Url。当为空时表示不调用接口提交，而只是改变model值
            method: 'post', // get/post default:get
            valueField: '', // 当为空时，即表单的每个一级字段即为参数名
            notifyEvent: '', // 成功后通过事件总线发出的事件名
            successTips: '保存成功', // 成功提示信息
            toggleDisabled: true, // 自动切换 disabled 状态
          }
        }
      }
    };
  },

  methods: {
    
    /**
     * 暴露该方法给外面组件（也是基于modalInsideMixins，请在_confirmHandler方法内调用confirm方法）来触发该组件的提交事件
     */
    confirm(done) {
      this._confirmHandler(done, true);
    },

    /**
     * 暴露该方法给外面组件（也是基于modalInsideMixins，请在_confirmHandler方法内调用getFormData方法）来获取表单的校验状态和数据
     */
    getFormData() {
      return this.$ncformValidate(this.$data.formName).then(data => {
        return {
          valid: data.result,
          data: this.$data.formValue
        }
      })
    },

    _initData() {
      this.$data.onlyId = this.$options.valueCopy[this.$data.mergeConfig.idField];
      this.$data.formValue = Object.assign({}, this.$data.mergeConfig.formField ? this.$options.valueCopy[this.$data.mergeConfig.formField] : this.$options.valueCopy);
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
      if (!this.isEdit) {
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

      this.$http(formDataConfig.apiUrl, axiosOptions(formDataConfig.method, data)).then(res => {
        const resField = formDataConfig.resField;
        let resData = this.$options.remoteData = resField ? _get(res.data, resField) : res.data;
        this.$data.formValue = this.$data.mergeConfig.formField ? resData[this.$data.mergeConfig.formField] : resData;
        this.$data.dataLoaded = true;
        if (this.$data.mergeConfig.isCopy) { // 复制模式删除ID
          delete this.$data.formValue[this.$data.mergeConfig.idField];
        }
      });
    },

    _confirmHandler(done, triggerByExternal) {

      this.$ncformValidate(this.$data.formName).then(data => {
        if (data.result) {

          let data = {}, submitData;
          const submitConfig = this.$data.mergeConfig.buttons.submit;

          if (submitConfig.triggerByExternal && !triggerByExternal) {
            return done(new Error('must be submit externally'));
          }

          // 保证取回什么样的数据格式，就提交什么样的数据格式
          if (this.$data.mergeConfig.formField) {
            submitData = Object.assign({}, this.$options.remoteData || this.$options.valueCopy);
            submitData[this.$data.mergeConfig.formField] = Object.assign(submitData[this.$data.mergeConfig.formField], this.$data.formValue);
          } else {
            submitData = Object.assign({}, this.$options.remoteData || this.$options.valueCopy, this.$data.formValue);
          }

          if (this.$data.mergeConfig.isCopy) delete submitData[this.$data.mergeConfig.idField];

          if (submitConfig.valueField) data[submitConfig.valueField] = submitData;
          else data = submitData;

          if (!this.$data.mergeConfig.isCopy) data[this.$data.mergeConfig.idField] = this.$data.onlyId;

          // if (!this.$data.isFormDirty) {
          //   done(data);
          //   return;
          // }

          if (submitConfig.apiUrl) { // 有则远程调用 
            
            if (submitConfig.triggerByExternal) { 
              this._showConfirmLoading(true); // 手动显示确认按钮的loading状态，因为 _confirmHandler 是被上面的 confirm 方法调用的，而不是 modal 组件调用的
            }  

            this.$http(submitConfig.apiUrl, axiosOptions(submitConfig.method, data)).then(res => {
              this.$message({
                type: "success",
                message: submitConfig.successTips
              });

              if (submitConfig.notifyEvent) {
                eventHub.$emit(submitConfig.notifyEvent, _merge(res.data, data));
              }

              done(_merge(res.data, data));
            }).catch(e => done(e)).finally(() => {
              if (submitConfig.triggerByExternal) {
                this._showConfirmLoading(false);
              }
            });


          } else { // 无则通知value改变
            this.$emit('input', data); 
            done(data);
          }
        } else {
          done(new Error('Form validation failed'));
        }
      });
    },

    // 仅用于调试其它按钮配置
    // _btnsEventHandler(config, done) {
    //   setTimeout(() => {
    //     done(1)
    //   }, 2000)
    // },
  },

  watch: {
    value: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
          this._initData();
        }
      },
      deep: true
    },
    formValue: {
      handler(newVal) {
        if (JSON.stringify(newVal) != JSON.stringify(this.$options.valueCopy)) {
          Object.assign(this.$options.valueCopy, newVal);
        }
      },
      deep: true
    },
    isFormDirty(newVal) {
      if (this.isEdit && this.$data.mergeConfig.buttons.submit.toggleDisabled) { 
        this._disableConfirm(!newVal);
      }
    }
  }
};