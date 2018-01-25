import eventHub from '../../utils/event-hub.js'

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
    }
  },
  created() {
    eventHub.$on(`toModal_${this.$data.modalId}`, config => {
      switch (config.eventName) {
        case "modalCancel":
          this.closeModal();
          break;
      }
    });
  },
  data() {
    return {
      visibleData: this.visible,
      modalId:
        "event_" +
        Math.random()
          .toString(36)
          .substring(2)
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
          close: true
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
    _modalButtonEvent(config) {
      eventHub.$emit(`fromModal_${this.$data.modalId}`, config);
    },
    closeModal() {
      this.$data.visibleData = false;
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
  destroyed() {
    eventHub.$off(`toModal_${this.$data.modalId}`);
  }
};