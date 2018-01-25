import Vue from 'vue';
import ncformCommon from 'ncform-common';
import ncForm from 'ncform';
import ncformThemeElementui from 'ncform-theme-elementui';

import eventHub from '../utils/event-hub.js';
import detail from './detail/index.vue';
import detailModal from './detail-modal/index.vue';
import editModal from './edit-modal/index.vue';
import edit from './edit/index.vue';
import list from './list/index.vue';
import modal from './modal/index.vue';
// Don't touch me - import



Vue.use(ncForm, { extComponents: ncformThemeElementui });

export default {
  ncformCommon,
  ncForm,
  eventHub,
  detail,
  detailModal,
  editModal,
  edit,
  list,
  modal,
  // Don't touch me - export
};
