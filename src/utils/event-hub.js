import Vue from 'vue';
if (!window.ncadmin_eventHub)
  window.ncadmin_eventHub = new Vue();
export default window.ncadmin_eventHub;