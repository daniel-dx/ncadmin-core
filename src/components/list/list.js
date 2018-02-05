import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
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
    // 初始化搜索内容
    this.$data.normalQueryValue = JSON.parse(JSON.stringify(this.value.query));
    this.$data.advQueryValue = JSON.parse(JSON.stringify(this.value.query));
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
      console.log('取本地');
    } else {
      this._resetColumnConfig();
      console.log('取配置');
    }

    eventHub.$on('nca-component-notify-submit', this.loadTableData);
  },

  mounted() {
    // 加载数据
    this.loadTableData();
  },

  data() {
    return {
      // 列的选项
      columnFilters: [],
      // ‘显示的列’的index
      columnShow: [],

      // 根据配置计算出的 ‘显示的列’的index
      configColumnShow: [],

      pageCount: 1, // 页码总数
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

    // 是否展示该列
    isColumnShow(index) {
      return this.$data.columnShow.indexOf(index) !== -1;
    },

    clearColumnConfig() {
      window.localStorage.removeItem('columnConfig:' + window.location.href);
      this._resetColumnConfig();
      console.log("清空本地");
    },

    // 重置列配置信息
    _resetColumnConfig() {
      this.$data.columnShow = JSON.parse(JSON.stringify(this.$data.configColumnShow));
    },

    // 获取本地列配置
    _getLocalColumnConfig() {
      this.$data.columnShow = JSON.parse(window.localStorage['columnConfig:' + window.location.href]);
    },

    // 存储列配置到本地
    _saveLocalColumnConfig(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.$data.configColumnShow)) {
        window.localStorage.setItem('columnConfig:' + window.location.href, JSON.stringify(newVal));
        console.log('存本地');
      }
    },

    // 多选改变时触发
    handleSelectionChange(val) {
      this.$data.multipleSelection = val;
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
      this.loadTableData();
    },

    // 加载表格数据 - 不重置pageNum和查询条件
    loadTableData() {
      const dataSource = this.$data.mergeConfig.list.datasource;

      let postData = {};
      postData[dataSource.paramFields.pageSize] = this.value.pageSize;
      postData[dataSource.paramFields.pageNum] = this.value.pageNum;
      if (dataSource.paramFields.query) {
        postData[dataSource.paramFields.query] = this.value.query;
      } else {
        postData = Object.assign(postData, this.value.query);
      }

      this.$axios(
        dataSource.apiUrl,
        axiosOptions(dataSource.method, postData)
      ).then(res => {
        const listField = dataSource.resField.list;
        const pageingTotalField = dataSource.resField.pageingTotal;
        this.$data.tableData = listField
          ? _get(res.data, `${listField}`)
          : res.data;
        this.$data.pageCount = pageingTotalField
          ? Math.ceil(_get(res.data, `${pageingTotalField}`, 0) / this.value.pageSize)
          : 1;
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
    }
  }
};