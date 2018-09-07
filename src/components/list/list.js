import _get from "lodash-es/get";
import { ncformUtils } from "@ncform/ncform-common";
import actionObject from "../private/action-object.vue";
import ncComponent from "../private/nc-component.vue";
import modal from "../modal/index-link.vue";
import { axiosOptions } from "../../utils/helper";
import axios from 'axios';
import widgetMixin from '../widgets/mixin.js';
import eventHub from '../../utils/event-hub.js';

export default {

  mixins: [widgetMixin],

  components: {
    ncComponent,
    actionObject,
    modal
  },

  props: {
    value: {
      type: Object,
      default: () => ({
        pageNum: 1,
        pageSize: 20,
        query: {}
      })
    }
  },

  created() {
    this.$axios = !this.$axios ? axios : this.$axios;

    // 设置默认值（因为value是个对象，这里不设置，上面的default值是不生效的）
    this.value.pageNum = this.value.pageNum || 1;
    this.value.pageSize = this.value.pageSize || 20;

    // 初始化搜索内容
    if (this.seachBarVisible) {
      this.$data.normalQueryValue = JSON.parse(JSON.stringify(this.value.query));
    }
    if (this.advSearchBarVisible) {
      this.$data.advQueryValue = JSON.parse(JSON.stringify(this.value.query));
    }

    // 获取列配置信息
    this.$data.columnFilters = this.$data.mergeConfig.list.columns.map((item, index) => ({ text: item.header, value: index }));

    // 存储列配置信息（根据mergeConfig）
    this.$data.mergeConfig.list.columns.forEach((item, index) => {
      if (item.defShow !== false) {
        this.$data.configColumnShow.push(index);
      }
    });

    // 判断是否从localStorage读取列配置
    if (window.localStorage['columnConfig:' + window.location.href]) {
      this._getLocalColumnConfig();
    } else {
      this._resetColumnConfig();
    }

    this.checkSelectAll();

    eventHub.$on('nca-component-notify-submit', this.loadTableData);

    const notifyRefreshEventName = _get(this.$data.mergeConfig, 'listenEvents.notifyRefresh');
    if (notifyRefreshEventName) {
      eventHub.$on(notifyRefreshEventName, data => {
        this.$options.outsideAddonQuery = data.query || {}; // 组件外加给组件的查询参数
        this._refreshHandler(data.refreshType || 'current');
      });
    }

  },

  mounted() {
    // 初始加载数据（放在nextTick是为了取得查询条件表单的默认值）
    this.$nextTick(() => {
      this.value.query = Object.assign(
        {},
        this.value.query,
        this.$data.normalQueryValue,
        this.$data.advQueryValue
      );
      this.loadTableData().then(() => {
        this.$data.initLoading = false;
      }).catch(() => {
        this.$data.initLoading = false;
      });
    })
  },

  beforeDestroy() {
    eventHub.$off('nca-component-notify-submit');
    const notifyRefreshEventName = _get(this.$data.mergeConfig, 'listenEvents.notifyRefresh');
    if (notifyRefreshEventName) eventHub.$off(notifyRefreshEventName);
  },

  data() {
    return {

      initLoading: true,

      // 是否支持全选
      columnSelectAll: false,
      // 列的选项
      columnFilters: [],
      // ‘显示的列’的index
      columnShow: [],

      // 根据配置计算出的 ‘显示的列’的index
      configColumnShow: [],

      sortField: '',
      sortOrder: '',

      pageCount: 1, // 页码总数
      itemTotal: 0, // 数据项总数
      tableData: [], // 表单数据
      multipleSelection: [], // 多选的选中项
      showAdvSearch: false, //  搜索模式，0为普通搜索, 1为高级搜索
      normalQueryValue: {}, // 常规搜索value
      advQueryValue: {}, // 高级搜索value
      modal: {
        visible: false,
        componentName: "",
        config: {},
        value: {},
        modalConfig: {}
      },
      defaultConfig: {

      }
    };
  },

  computed: {
    actionColumnWidth() {
      return _get(this.$data.mergeConfig, 'list.actionColumn.width', '');
    },
    // 搜索栏 是否显示
    seachBarVisible() {
      return this.$data.mergeConfig.query && this.$data.mergeConfig.query.normal;
    },

    // 高级搜索 是否显示
    advSearchBarVisible() {
      return (
        this.$data.mergeConfig.query && this.$data.mergeConfig.query.normal && this.$data.mergeConfig.query.adv
      );
    },

    batchActionsVisible() {
      return (
        this.$data.mergeConfig.list.selectAll &&
        this.$data.mergeConfig.toolbar &&
        this.$data.mergeConfig.toolbar.batchActions
      );
    },

    toolsVisible() {
      return this.$data.mergeConfig.toolbar && this.$data.mergeConfig.toolbar.tools;
    },

    pagingVisible() {
      return !this.$data.mergeConfig.paging || this.$data.mergeConfig.paging.enable;
    }
  },
  methods: {
    checkSelectAll() {
      this.$data.columnSelectAll = this.$data.columnFilters.length == this.$data.columnShow.length;
    },

    handleCheckAllChange(val) {
      this.$data.columnShow = val ? this.$data.columnFilters.map(item => item.value) : [];
    },

    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      let allCount = this.$data.columnFilters.length;
      this.columnSelectAll = checkedCount === allCount;
    },

    // 是否展示该列
    isColumnShow(index) {
      return this.$data.columnShow.indexOf(index) !== -1;
    },

    clearColumnConfig() {
      window.localStorage.removeItem('columnConfig:' + window.location.href);
      this._resetColumnConfig();
    },

    // 重置列配置信息
    _resetColumnConfig() {
      this.$data.columnShow = JSON.parse(JSON.stringify(this.$data.configColumnShow));
      this.checkSelectAll();
    },

    // 获取本地列配置
    _getLocalColumnConfig() {
      this.$data.columnShow = JSON.parse(window.localStorage['columnConfig:' + window.location.href]);
    },

    // 存储列配置到本地
    _saveLocalColumnConfig(newVal) {
      // 配置信息与本地存储以及与config不同时，才保存到本地
      if (JSON.stringify(newVal) !== JSON.stringify(this.$data.configColumnShow) &&
        JSON.stringify(newVal) !== window.localStorage['columnConfig:' + window.location.href]
      ) {
        window.localStorage.setItem('columnConfig:' + window.location.href, JSON.stringify(newVal));
      }
    },

    // 多选改变时触发
    handleSelectionChange(val) {
      this.$data.multipleSelection = val;
      this.$emit('select-change', val);
    },

    // 表头排序时触发
    handelSortChange(data) {
      let sortField = _get(data, 'column.sortBy');
      let order = data.order;
      this.$data.sortField = sortField;
      this.$data.sortOrder = order;
      this.search();
    },

    eventHandlerConfirm(handler, item = {}, multipleSelection = [], defConfirmTxt) {
      if (handler.confirmTxt || defConfirmTxt) {
        this.$confirm(handler.confirmTxt || defConfirmTxt, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.eventHandler(handler, item, multipleSelection);
        });
      } else {
        this.eventHandler(handler, item, multipleSelection);
      }
    },

    actionObjectEnable(enable, item = {}, multipleSelection = []) {
      const handlerData = [
        {
          symbol: "$item",
          value: item
        },
        {
          symbol: "$selected",
          value: multipleSelection
        }
      ];

      return ncformUtils.smartAnalyze(enable, {
        data: handlerData
      });

    },

    _actionObjectEvent(options, data) {
      if (options && options.name) {
        const emitData = ncformUtils.smartAnalyze(options.data, {
          data
        });
        this.$emit(options.name, emitData);
      }
    },
    // Action Object config 实现
    eventHandler(handler, item = {}, multipleSelection = []) {
      const { type, options } = handler;
      const handlerData = [
        {
          symbol: "$item",
          value: item
        },
        {
          symbol: "$selected",
          value: multipleSelection
        }
      ];

      this._actionObjectEvent(options.event, handlerData);

      switch (type) {
        case "ajax":
          const params = {};
          options.params.forEach(item => {
            params[item.name] = ncformUtils.smartAnalyze(item.value, {
              data: handlerData
            });
          });

          this.$axios(
            handler.options.apiUrl,
            axiosOptions(handler.options.method, params)
          ).then(res => {
            this._refreshHandler(handler.refresh);
          });
          break;
        case "page":
          const path = ncformUtils.smartAnalyze(options.route, {
            data: handlerData
          });
          if (path.search(/^(http)?[s]?[:]?\/\//) >= 0) { // 普通的链接，非SPA路由
            window.open(path);
          } else {
            this.$emit('pathChange', path);
          }
          break;
        case "modal":
          const newValue = ncformUtils.smartAnalyze(
            options.component.value,
            {
              data: handlerData
            }
          );

          this.$data.modal = Object.assign(
            {
              refresh: handler.refresh
            },
            this.$data.modal,
            options.component
          );

          this.$data.modal.value = newValue;

          this.$data.modal.modalConfig = options.modalConfig;
          this.$data.modal.visible = true;
          break;
      }
    },

    // 页码变化
    currentChange(currentIndex) {
      this.value.pageNum = currentIndex;
      this.loadTableData();
    },

    // pageSize变化
    handleSizeChange(size) {
      this.value.pageNum = 1;
      this.value.pageSize = size;
      this.loadTableData();
    },

    // 搜索 - 重置pageNum为1
    search() {
      this.value.pageNum = 1;
      this.value.query = Object.assign(
        {},
        this.value.query,
        this.$data.normalQueryValue,
        this.$data.advQueryValue
      );
      this.loadTableData();
    },

    // 重置 - 重置pageNum为1和查询条件
    resetList() {
      this.normalQueryValue = {};
      this.advQueryValue = {};
      this.value.pageNum = 1;
      this.value.query = {};

      this.$refs.table.clearSort();
      const datasource = this.$data.mergeConfig.list.datasource;
      this.$data.sortField = _get(datasource.otherParams, datasource.paramFields.sortField, '');
      this.$data.sortOrder = _get(datasource.otherParams, datasource.paramFields.sortOrder, '');

      // 这里用setTimeout是为了让normalQueryValue和advQueryValue能取到实际的默认值，而非{}
      // why not nextTick，因为nextTick取到的还是{}
      setTimeout(() => {
        this.search();
      })
    },

    // 加载表格数据 - 不重置pageNum和查询条件
    loadTableData() {
      const datasource = this.$data.mergeConfig.list.datasource;

      let postData = {};

      // 处理分页字段
      if (this.pagingVisible) {
        postData[datasource.paramFields.pageSize] = this.value.pageSize;
        postData[datasource.paramFields.pageNum] = this.value.pageNum;
      }

      // 处理排序字段
      if (this.$data.sortField && this.$data.sortOrder) {
        postData[datasource.paramFields.sortField] = this.$data.sortField;
        postData[datasource.paramFields.sortOrder] = this.$data.sortOrder;
      }

      // 处理查询字段
      if (datasource.paramFields.query) {
        postData[datasource.paramFields.query] = this.value.query;
      } else {
        postData = Object.assign(postData, this.value.query);
      }

      // otherParams的优先级低于查询参数，排序参数
      postData = Object.assign({}, datasource.otherParams, postData, this.$options.outsideAddonQuery || {});

      return this.$axios(
        datasource.apiUrl,
        axiosOptions(datasource.method, postData)
      ).then(res => {
        const listField = datasource.resField.list;
        const pageingTotalField = datasource.resField.pageingTotal;
        this.$data.itemTotal = parseInt(_get(res.data, `${pageingTotalField}`, 0));
        this.$data.tableData = [];
        this.$nextTick(() => { // 这里先置空，再在下一个循环赋值，是为了绕开el-table没法正确显示更新后的值的BUG
          this.$data.tableData = listField
            ? _get(res.data, `${listField}`)
            : res.data;
        })
        this.$data.pageCount = pageingTotalField
          ? Math.ceil(this.$data.itemTotal / this.value.pageSize)
          : 1;
        return;
      });
    },

    onModalClose() {
      this._refreshHandler(this.$data.modal.refresh);
    },

    _refreshHandler(refresh) {
      switch (refresh) {
        case 'current':
          this.loadTableData()
          break;
        case 'resetPage':
          this.search();
          break;
        case 'resetAll':
          this.resetList();
          break;
      }
    }
  },

  watch: {
    value: {
      handler: function (newVal) {
        this.$emit("input", newVal);
      },
      deep: true
    },
    columnShow: {
      handler: function (newVal) {
        this._saveLocalColumnConfig(newVal);
      },
      deep: true
    },
    normalQueryValue: {
      handler: function (newVal, oldVal) {

        // Ignore when no autoQueryFields
        const autoQueryFields = _get(this.$data.mergeConfig, 'query.autoQueryFields', []);
        if (autoQueryFields.length === 0) return;

        // Ignore when newVal/oldVal is empty obj or newVal equals oldVal 
        if (Object.keys(newVal).length === 0 || Object.keys(oldVal).length === 0 || JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

        const foundOne = autoQueryFields.find(field => newVal[field] !== oldVal[field]);
        if (foundOne) {
          this.search();
        }
      },
      deep: false
    },
    advQueryValue: {
      handler: function (newVal, oldVal) {

        // Ignore when no autoQueryFields
        const autoQueryFields = _get(this.$data.mergeConfig, 'query.autoQueryFields', []);
        if (autoQueryFields.length === 0) return;

        // Ignore when newVal/oldVal is empty obj or newVal equals oldVal 
        if (Object.keys(newVal).length === 0 || Object.keys(oldVal).length === 0 || JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

        const foundOne = autoQueryFields.find(field => newVal[field] !== oldVal[field]);
        if (foundOne) {
          this.search();
        }
      },
      deep: false
    }
  }
};