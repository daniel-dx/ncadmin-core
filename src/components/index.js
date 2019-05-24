import promiseFinallyShim from 'promise.prototype.finally/shim';
import ncformCommon from '@ncform/ncform-common';
import ncform from '@ncform/ncform';
import ncformThemeElementui from '@ncform/ncform-theme-elementui';

import widgetMixin from './widgets/mixin.js';
import modalInsideMixin from './widgets/modal-inside-mixin.js';

import eventHub from '../utils/event-hub.js';
import detail from './detail/index.vue';
import detailModalInside from './detail-modal-inside/index.vue';
import editModalInside from './edit-modal-inside/index.vue';
import edit from './edit/index.vue';
import list from './list/index.vue';
import modal from './modal/index.vue';
import label from './widgets/label/index.vue';
import image from './widgets/image/index.vue';
import link from './widgets/link/index.vue';
import detailRecursion from './private/detail-widget/detail-recursion.vue';
// Don't touch me - import



promiseFinallyShim();

export default {
  install(Vue, {ncformExtComponents, ncformExtRules}) {
    Vue.component('nca-detail-modal-inside', detailModalInside);
    Vue.component('nca-edit-modal-inside', editModalInside);
    Vue.component('nca-detail', detail);
    Vue.component('nca-edit', edit);
    Vue.component('nca-list', list);
    Vue.component('nca-modal', modal);
    
    Vue.component('nca-detail-widget', detailRecursion);
    Vue.component('nca-label', label);
    Vue.component('nca-image', image);
    Vue.component('nca-link', link);

    Vue.use(ncform, { 
      extComponents: Object.assign(ncformThemeElementui, ncformExtComponents),
      extRules: ncformExtRules
    });
  },
  ncformCommon,
  eventHub,
  widgetMixin,
  modalInsideMixin
  // Don't touch me - export
};
