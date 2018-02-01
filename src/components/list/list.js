import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import actionObject from "../private/action-object.vue";
import ncComponent from "../private/nc-component.vue";
import modal from "../modal/index-link.vue";
import { axiosOptions } from "../../utils/helper";
import axios from 'axios';

export default {
  components: {
    ncComponent,
    actionObject,
    modal
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
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
  },
  mounted() {
    // 加载数据
    this.loadTableData();
  },

  data() {
    return {
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
      }
    };
  },
  computed: {
    // 搜索栏 是否显示
    seachBarVisible() {
      return this.config.query && this.config.query.normal;
    },
    // 高级搜索 是否显示
    advSearchBarVisible() {
      return (
        this.config.query && this.config.query.normal && this.config.query.adv
      );
    },
    batchActionsVisible() {
      return (
        this.config.list.selectAll &&
        this.config.toolbar &&
        this.config.toolbar.batchActions
      );
    },
    toolsVisible() {
      return this.config.toolbar && this.config.toolbar.tools;
    },
    pagingVisible() {
      return !this.config.paging || this.config.paging.enable;
    }
  },
  methods: {

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
      const dataSource = this.config.list.datasource;

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
    }
  }
};