import eventHub from '../../utils/event-hub.js';
import _set from 'lodash-es/set';

// modal内接收的事件由开发者自己定义，在modalConfig中配置即可。
export default {

  props: {

    visible: {
      type: Boolean,
      default: false
    },

    modalConfig: {
      type: Object,
      default: ()=>({})
    },
  },

  created() {
    eventHub.$on(`toModal_${this.$data.modalId}`, this.handelToModalEvent);
  },

  data() {
    return {
      visibleData: this.visible,
      modalId:
        "event_" +
        Math.random()
          .toString(36)
          .substring(2),
      loading: {
        // 通过button的eventName来识别按钮的loading状态
      },
      disabled: {
        // 通过button的eventName来识别按钮的disabled状态
      }
    };
  },

  computed: {
    mdConfig() {
      const mdConfig = JSON.parse(JSON.stringify(this.modalConfig));
      mdConfig.title = mdConfig.title || "Dialog";
      mdConfig.buttons = mdConfig.buttons || {};
      mdConfig.buttons.others = mdConfig.buttons.others || [];
      mdConfig.buttons.confirm = Object.assign(
        {},
        {
          enable: true,
          name: "确定",
          eventName: "modalConfirm",
          close: true,
          showLoading: true,
        },
        mdConfig.buttons.confirm
      );

      mdConfig.buttons.cancel = Object.assign(
        {},
        {
          enable: true,
          name: "取消",
          eventName: "modalCancel",
          close: true
        },
        mdConfig.buttons.cancel
      );
      return mdConfig;
    }
  },
  methods: {

    modalButtonEvent(config) {
      if (config.showLoading && config.eventName) {
        this.$set(this.$data.loading, config.eventName, true);
      }
      
      eventHub.$emit(`fromModal_${this.$data.modalId}`, config);
    },

    closeModal() {
      this.$data.visibleData = false;
    },

    handelToModalEvent(config) {
      switch (config.eventName) {
        case "modalCancel": // 关闭窗口事件
          this.closeModal();
          break;
        case "modalConfirm": // 确认逻辑处理完的事件
          if (this.mdConfig.buttons.confirm.showLoading) {
            this.$data.loading.modalConfirm = false;
          }
          if (!(config.data.data instanceof Error)) { // 有异步请求时出现异常
            this.$emit('confirm', config.data.data);
            this.closeModal();
          }
          break;
        case "confirmLoading": // 显示确认按钮的 loading 状态
          this.$set(this.$data.loading, 'modalConfirm', config.data.loading);
          break;
        case "confirmDisabled": // 显示确认按钮的 loading 状态
          this.$set(this.$data.disabled, 'modalConfirm', config.data.disabled);
          break;
        default: // 其它按钮事件逻辑处理完的事件
          let foundBtnConfig = this.mdConfig.buttons.others.find(bItem => bItem.eventName === config.eventName);
          if (foundBtnConfig.showLoading) {
            this.$data.loading[config.eventName] = false;
          }
          if (foundBtnConfig.close && !(config.data.data instanceof Error)) { // 有异步请求时出现异常
            this.closeModal();
          }
          break;
      }
    }
  },
  watch: {
    visibleData(newVal) {
      if (this.visible != newVal) {
        this.$emit("update:visible", newVal);
      }
    },

    visible(newVal) {
      if (this.$data.visibleData !== newVal) {
        this.$data.visibleData = newVal;
      }
    }
  },
  
  beforeDestroy() {
    eventHub.$off(`toModal_${this.$data.modalId}`, this.handelToModalEvent);
  }
};