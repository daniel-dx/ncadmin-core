import widgetMixin from "./mixin.js";
import eventHub from '../../utils/event-hub.js'

/**
 * - 覆盖methods._confirmHandler(done)方法可实现点击确认按钮操作逻辑（请务必在执行确认操作后调用done方法，可通过给done方法传参来传递参数，如form数据）
 * - 覆盖methods._btnsEventHandler(config, done)方法可实现自定义按钮的操作逻辑（请务必在执行确认操作后调用done方法，可通过给done方法传参来传递参数，如form数据）
 * - 调用this._closeModal()方法可关闭modal
 */

export default {
  mixins: [widgetMixin],
  props: ["modalId"],

  created() {
    eventHub.$on(`fromModal_${this.modalId}`, this.handleFromModalEvent);
  },

  beforeDestroy() {
    eventHub.$off(`fromModal_${this.modalId}`, this.handleFromModalEvent);
  },

  methods: {
    /**
     * [可覆盖]
     * 确认按钮事件处理。通过覆盖该方法可自行处理确认按钮事件
     * @param {Function} done 请务必在执行确认操作后调用done方法，否则后果自负。如果请求失败，把Error对象传给done
     */
    _confirmHandler(done) { },

    /**
     * [可覆盖]
     * 自定义的其它按钮的事件处理。通过覆盖该方法可自行处理自定义按钮事件
     * @param {*} config 
     * @param {Function} done 请务必在执行确认操作后调用done方法，否则后果自负。如果请求失败，把Error对象传给done
     */
    _btnsEventHandler(config, done) { },

    _closeModal() {
      eventHub.$emit(`toModal_${this.modalId}`, {
        eventName: "modalCancel"
      });
    },

    handleFromModalEvent(config) {
      switch (config.eventName) {
        case "modalConfirm": // 确认按钮事件
          this._confirmHandler(data => {
            eventHub.$emit(`toModal_${this.modalId}`, {
              eventName: "modalConfirm",
              data: {
                data
              }
            });
          });
          break;
        default: // 其它按钮事件
          this._btnsEventHandler(config, data => {
            if (config.eventName) {
              eventHub.$emit(`toModal_${this.modalId}`, {
                eventName: config.eventName,
                data: {
                  data
                }
              });
            }
          });
      }
    }
  }
}