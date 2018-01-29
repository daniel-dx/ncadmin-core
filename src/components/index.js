import Vue from 'vue';
import ncformCommon from 'ncform-common';
import ncform from 'ncform';
import ncformThemeElementui from 'ncform-theme-elementui';

import eventHub from '../utils/event-hub.js';
import detail from './detail/index.vue';
import detailModal from './detail-modal/index.vue';
import editModal from './edit-modal/index.vue';
import edit from './edit/index.vue';
import list from './list/index.vue';
import modal from './modal/index.vue';
import label from './widgets/label/index.vue';
import image from './widgets/image/index.vue';
// Don't touch me - import

Vue.use(ncform, { extComponents: ncformThemeElementui });

Vue.component('nca-detail', detail);
Vue.component('nca-detail-modal', detailModal);
Vue.component('nca-edit-modal', editModal);
Vue.component('nca-edit', edit);
Vue.component('nca-list', list);
Vue.component('nca-modal', modal);

Vue.component('nca-label', label);
Vue.component('nca-image', image);

export default {
  ncformCommon,
  eventHub,
  image,
  // Don't touch me - export
};
