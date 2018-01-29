import _get from "lodash-es/get";
import { ncformUtils } from "ncform-common";
import actionObject from "../private/action-object.vue";
import modal from "../modal/index-link.vue";
import { axiosOptions } from "../../utils/helper";
import axios from 'axios';

export default {
  components: {
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
    this.loadtableData();
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
    // 加载表格数据
    loadtableData() {
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
          ? Math.ceil(_get(res.data, `${pageingTotalField}`, 0)/this.value.pageSize)
          : 1;
      });
    },
    // 重置页面
    resetList() {
      this.normalQueryValue = {};
      this.advQueryValue = {};
      this.value.pageNum = 1;
      this.value.query = {};
      this.loadtableData();
    },
    // 多选改变时触发
    handleSelectionChange(val) {
      this.$data.multipleSelection = val;
    },
    eventHandlerConfirm(handler, item = {}, multipleSelection = [], needConfirm){
      if (needConfirm) {
        this.$confirm(needConfirm, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.eventHandler(handler, item, multipleSelection);
          })
          .catch(err=>{
            
          });
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
            if (handler.refresh !== false) {
              this.loadtableData();
            }
          });
          break;
        case "page":
          const path = ncformUtils.smartAnalyze(options.route, {
            data: handlerData
          });
          this.$emit('pathChange', path);
          break;
        case "modal":
          const newValue = {};
          for (let key in options.component.value) {
            newValue[key] = ncformUtils.smartAnalyze(
              options.component.value[key],
              {
                data: handlerData
              }
            );
          }

          this.$data.modal = Object.assign(
            {},
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
      this.loadtableData();
    },
    // pageSize变化
    handleSizeChange(size) {
      this.value.pageNum = 1;
      this.value.pageSize = size;
      this.loadtableData();
    },
    // 搜索
    search() {
      this.value.pageNum = 1;
      this.value.query = Object.assign(
        {},
        this.value.query,
        this.$data.normalQueryValue,
        this.$data.advQueryValue
      );
      this.loadtableData();
    }
  },
  watch: {
    value: {
      handler: function(newVal) {
        this.$emit("input", newVal);
      },
      deep: true
    }
  }
};