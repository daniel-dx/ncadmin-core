<template>
  <div class="modal">
    <!-- 弹窗 -->
    <el-dialog :visible.sync="visibleData" :title="mdConfig.title">
      <slot v-if="visibleData" :modalId="modalId"></slot>
      <el-row type="flex" style="margin-top:10px;">
        <el-col></el-col>
        <el-button v-if="mdConfig.buttons.confirm.enable" @click="_modalButtonEvent(mdConfig.buttons.confirm)" type="success" plain>
          {{mdConfig.buttons.confirm.name}}
        </el-button>
        <template v-for="(item, index) in mdConfig.buttons.others">
          <el-button v-if="item.enable" @click="_modalButtonEvent(item)" type="primary" plain>
            {{item.name}}
          </el-button>
        </template>
        <el-button v-if="mdConfig.buttons.cancel.enable" @click="closeModal" type="info" plain>
          {{mdConfig.buttons.cancel.name}}
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
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
      default: {}
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
</script>

<style lang="sass" rel="stylesheet/scss">
.modal .el-dialog__body {
  padding: 0 20px 15px;
}
</style>
