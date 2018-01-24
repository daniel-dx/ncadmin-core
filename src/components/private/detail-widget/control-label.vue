<template>
  <span>{{analyze(config.value)}}</span>
</template>
<script>
import widgetMixin from "./mixin.js";
export default {
  mixins: [widgetMixin]
};
</script>