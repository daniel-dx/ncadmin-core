# View detail page

## Config

```js
{
  title: '', // 详情页的标题
  idField: 'id', // 作为该详情信息的唯一标识
  source: { // 详细页的数据源
      apiUrl: '', // 数据源api
      method: 'get', // get/post default:get
      params: [{ // 请求参数
        name: 'id',
        value: 'dx: {{$id}}'
      }],
      resField: 'data' // 返回结果数据字段
  },
  detail: {

    properties: [

      // 普通字段
      {
        label: '', // 标签
        value: '', // 【必填】。只支持dx表达式（支持$root，$parent，$item）
        columns: 6, // 所占的列数，默认是12（一行为12列）
        widget: 'label', // 使用的widget，默认是label，即只显示只读文本
        widgetConfig: {} // widget的一些配置信息
      },

      // 对象包含
      {
        label: '', // 标签
        value: '', // 【非必填】。只支持dx表达式（支持$root和$parent）
        widget: 'object', // 使用的widget，默认是object
        widgetConfig: {
          // 针对自身的
          titleColor: "red",
          showOwnLabel: false,
          showTitle: true,
          // 针对子元素的
          labelWidth: "",
          labelColor: "green",
        },
        properties: [
          {
            label: '', // 标签
            value: '' // 只支持dx表达式（支持$root和$parent）
          },
        ],
      },

      // 数组包含
      {
        label: '', // 标签
        value: '', // 【必填】。只支持dx表达式（支持$root和$parent）
        widget: 'array', // array | table | tabs
        widgetConfig: {
        },
        items: {
          label: '', // 标签
          value: '' // dx表达式（支持$root和$item）
        },
      },
    ]
  },
  buttons: { // 操作按钮
    back: { // 后退
      enable: true // 可用状态，默认为true
    }
  }
}
```

## dx expression

- dx: {{$id}}

代表id字段的值

- dx: {{$root}}

代表详情数据

- dx: {{$parent}}

代表显示项所属的object widget的值

```
详情页的数据例子：
{
  id: 1,
  name: {
    firstName: 'daniel',
    lastName: 'xiao'
  },
  age: 22
}

部分配置例子：
{
  label: 'Name',
  value: 'dx: {{$root.name}}',
  widget: 'object',
  properties: [
    {
      label: 'First Name',
      value: 'dx: {{$parent.firstName}}'
    },
    {
      label: 'Last Name',
      value: 'dx: {{$parent.lastName}}'
    }
  ]
}
```

- dx: {{$item}}

代表array widget某一项的值

```
详情页的数据例子：
{
  id: 1,
  people: [
    {
      firstName: 'daniel',
      lastName: 'xiao'
    },
    {
      firstName: 'sarah',
      lastName: 'wu'
    }
  ]
}

部分配置例子：
{
  label: 'People',
  value: 'dx: {{$root.people}}',
  widget: 'array',
  items: [
    {
      label: 'First Name',
      value: 'dx: {{$item.firstName}}'
    },
    {
      label: 'Last Name',
      value: 'dx: {{$item.lastName}}'
    }
  ]
}
```
