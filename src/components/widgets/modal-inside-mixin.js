import widgetMixin from "./mixin.js";
import eventHub from '../../utils/event-hub.js'

/**
 * - 覆盖methods._confirmHandler(done)方法可实现点击确认按钮操作逻辑（请务必在执行确认操作后调用done方法，否则后果自负）
 * - 覆盖methods._btnsEventHandler(config)方法可实现自定义按钮的操作逻辑
 * - 调用this._closeModal(isConfirm)方法可关闭modal
 */

export default {
  mixins: [widgetMixin],
  props: ["modalId"],

  created() {
    eventHub.$on(`fromModal_${this.modalId}`, config => {
      switch (config.eventName) {
        case "modalConfirm":
          this._confirmHandler(() => {
            this._closeModal(true);
          });
          break;
        default:
          this._btnsEventHandler(config);
      }
    });
  },

  destroyed() {
    eventHub.$off(`fromModal_${this.modalId}`);
  },

  methods: {
    /**
     * [可覆盖]
     * 确认按钮事件处理。通过覆盖该方法可自行处理确认按钮事件
     * @param {Function} done 请务必在执行确认操作后调用done方法，否则后果自负
     */
    _confirmHandler(submitConfig, done) { },

    /**
     * [可覆盖]
     * 自定义的其它按钮的事件处理。通过覆盖该方法可自行处理自定义按钮事件
     * @param {*} config 
     */
    _btnsEventHandler(config) {},
    
    _closeModal(isConfirm) {
      eventHub.$emit(`toModal_${this.modalId}`, {
        eventName: "modalCancel",
        data: {
          isConfirm: isConfirm
        }
      });
    }
  }
}