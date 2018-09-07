# Query List

## Config

```js
{

  // 监听事件 - 可通过事件通知该组件做些事，比如刷新
  listenEvents: {
    // 通知执行刷新动作事件名
    // event data: {refreshType: '', query: {}}
    // refreshType: current-当前页码和查询条件刷新 resetPage-重置查询页码进行刷新 resetAll-重置查询条件和页码进行刷新
    notifyRefresh: '', 
  },

  // 查询条件
  query: {
    normal: { // 普通搜索
      // ncform的配置
    },
    adv: { // 高级搜索
      // ncform的配置
    },
    autoQueryFields: [], // 搜索字段值改变时自动触发查询，如下拉框等
  },

  // 工具栏，位于列表之上
  toolbar: {
    batchActions: { // 批量操作，当selectAll为true时有效
      delete: { // 批量删除
        enable: true,
        handler: { // 参考 Action Object config 的 handler( type = 'ajax')
        }
      },
      others: [ // 参考 Action Object config
      ]
    },
    tools: {
      new: { // 新建
        enable: true,
        handler: { // 参考 Action Object config 的 handler( type = 'modal' or 'page') 
        }
      },
      others: [ // 参考 Action Object config
      ]
    }
  },

  // 显示列表
  list: {
    datasource: { // 数据源
      apiUrl: '', // 请求url
      method: 'get', // get/post default:get
      paramFields: { // 传过去的参数
        pageSize: 'pageSize', // 每页显示的项数
        pageNum: 'pageNum', // 请求的页码
        sortField: 'sortField', // 排序字段
        sortOrder: 'sortOrder', // 排序方向
        query: '', // 查询条件，当为空时，查询对象的每个Key就是字段。当提供值时，即整个查询对象作为值传过去
      },
      otherParams: { // 其它的请求参数，如 type: 1
      },
      resField: { // 返回结果字段
        pageingTotal: '', // 分页总数字段
        list: '' // 列表数据字段
      },
    },

    selectAll: true, // 是否全选

    columnsConfigurable: false, // 是否可配置显示列

    columns: [ // 所有列
      {
        header: '', // 表头
        width: 100, // 指定列宽度，非必填
        defShow: true, // 默认是否显示。默认为true
        dataField: '', // 数据源的字段
        sortField: '', // 当有值时才启动表头排序
        component: { // 以组件形式显示。复杂形式的显示方式可用此种形式，比如点击即可编辑之类的 (注：component和dataField只有其中一个生效，component的优先级高于dataField)
          name: '', // 组件名称
          config: {}, // 组件配置
          value: {} // 传给组件的值
        }
      }
    ],

    actions: { // 项操作
      delete: { // 删除
        enable: true, // 或 dx表达式，如 dx: !!{{$item.id}}
        handler: { // 参考 Action Object config 的 handler( type = 'ajax')
        } 
      },
      view: { // 查看
        enable: true, // 或 dx表达式，如 dx: !!{{$item.id}}
        handler: { // 参考 Action Object config 的 handler( type = 'modal' 或 'page')
        }
      },
      edit: { // 编辑
        enable: true, // 或 dx表达式，如 dx: !!{{$item.id}}
        handler: { // 参考 Action Object config 的 handler( type = 'modal' 或 'page')
        }
      }
      others: [ // 参考 Action Object config
      ]
    }
  },

  // 分页配置
  paging: {
    enable: true
  }
}
```

## Action Object config
```js
{
  name: '',
  enable: true, // 支持dx表达式
  btnType: '', // 按钮类型 primary / success / warning / danger / info / text
  handler: {
    type: 'ajax', // ajax / page / modal / component
    confirmTxt: '', // 确认提示语。当需求让用户确认操作时提供，不提供则操作不需要用户确认
    event: { // 点击的时候对外发送事件，可用于通知组件外的环境去做某些事
        name: '',
        data: 'dx: {{$item}}'
    },
    options: {

      // type = 'ajax'
      apiUrl: '', 
      method: 'get', // get/post default:get
      params: [{
        name: 'id',
        value: 'dx: {{$item.id}}'
      }],

      // type = 'page'
      route: 'dx: "/path/to/some-page?id={{$item.id}}"',

      // type = 'modal' || 'component'
      component: { // 对于弹窗，需要指定弹窗页面的业务组件，这里约定弹窗页面整个就是一个业务组件
        name: '',
        config: {},
        value: {}
      },
      
      // type = 'modal'
      modalConfig: {
        title: '弹窗title',
        appendToBody: true,
        width: '50%',
        buttons: {
            confirm: {
                enable: true,
            },
            cancel: {
                enable: true,
            },
            others: [{
                enable: true,
                name: '',   // 按钮名称
                eventName: '', // 按钮米触发事件名称
                close: true // 操作后是否关闭弹窗
            }]
        }
      }
    },
    refresh: 'no', // 操作后是否刷新数据 no-不刷新，默认值 current-当前页码和查询条件刷新 resetPage-重置查询页码进行刷新 resetAll-重置查询条件和页码进行刷新
  },
}
```

## dx expression

- dx: {{$item.xxx}}

表示列表项的某个值，比如{id:1}，即`dx: {{$item.id}}`值为1

- dx: {{$selected[e].xxx}

表示选中的列表项的某个字段，比如选中项为[{id:1}, {id:2}]，即`{{$selected[e].id}`值为[1, 2]