import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import eventHub from '../../utils/event-hub.js'
import axios from 'axios';

export default {
  components: {},
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    },
    // 与弹窗通信的事件名。由弹窗随机生成。
    modalId: {
      type: String
    }
  },
  created() {
    this.$axios = !this.$axios ? axios : this.$axios;
    this._initData();

    // 统一监听事件，通过eventName区分事件。
    // `fromModal_${this.modalId}` 为modal触发的事件。
    // `toModal_${this.modalId}` 为modal接收的事件。
    eventHub.$on(`fromModal_${this.modalId}`, config => {
      switch (config.eventName) {
        case "modalConfirm":
          this._submitData(config);
          break;

        case "commonEditCancel":
          this._closeModal();
          break;
      }
    });
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
  destroyed() {
    eventHub.$off(`fromModal_${this.modalId}`);
  },
  methods: {
    _initData() {
      this.$data.formValue = {};
      this.$data.onlyId = this.value[this.config.idField];
      if (this.$data.onlyId != "0") {
        this._loadFormData();
      }
    },
    _loadFormData() {
      const formDataConfig = this.config.formData;
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
    _submitData(config) {
      const submitConfig = this.config.buttons.submit;
      let data = {};
      if (submitConfig.valueField) {
        data[submitConfig.valueField] = this.$data.formValue;
      } else {
        data = Object.assign({}, this.$data.formValue);
      }

      data[submitConfig.idField || "id"] = this.$data.onlyId;
      this.$axios.post(submitConfig.apiUrl, data).then(res => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
        if (config.close) {
          this._closeModal();
        }
      });
    },
    _closeModal() {
      eventHub.$emit(`toModal_${this.modalId}`, {
        eventName: "modalCancel"
      });
    }
  },
  watch: {
    value: {
      handler() {
        this._initData();
      }
    }
  }
};