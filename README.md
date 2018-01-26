## ncadmin-core
可配置列表，编辑，详情页 核心组件

依赖 `vue`、`axios`

### install 
```javascript
  npm install ncadmin-core
```

### Usage
``` javascript
  // 引入
  import {
    ncformCommon,
    ncForm, 
    eventHub,
    
    // 组件
    detail,
    detailModal,
    editModal,
    edit,
    list,
    modal,
  } from 'ncadmin-core';
```

### 组件使用方法
# edit-page.vue

通过配置开发一个新建/编辑的页面
（根据配置中的idField字段，在$route中取页面唯一值（通常为Id）。值为0时，页面为新建状态，值为其他值时，页面为编辑状态。）
具体配置参考[文档](http://gitlab.tools.vipshop.com/daniel.xiao/admin-terminator/blob/master/ediable-detail-config.md)

### 示例
```html
<template>
  <edit-page :config="config"></edit-page>
</template>

<script>
  import ncAdminCore from 'ncadmin-core';
  const editPage = ncAdminCore.edit;

  export default {
    component: {
      editPage
    },
    data: {
      return {
        config: {}
      }
    }
  }
</script>
```

# list-page.vue

通过配置开发一个查询列表的页面

具体配置参考[文档](http://gitlab.tools.vipshop.com/daniel.xiao/admin-terminator/blob/master/query-list-config.md)

### 示例
```html
<template>
  <list-page :config="config" v-model="valueData"></list-page>
</template>

<script>
  import ncAdminCore from 'ncadmin-core';
  const listPage = ncAdminCore.list;

  export default {
    component: {
      listPage
    },
    data: {
      return {
          config: {},
          // value 传时默认值如下
          valueData: {
            pageNum: 1,
            pageSize: 20,
            query: {}
          }
      }
    }
  }
</script>
```

# modal.vue

弹窗组件，可配置顶部title，底部buttons。
使用者通过遵循modal组件的规则开发一个组件来实现弹窗显示内容

### 示例
```html
<template>
  <modal
    :visible.sync="visible"
    :modal-config="modalConfig"
  >
  <!-- 
    弹窗内可显示任意内容。
    弹窗显示组件并且需要进行交互时，请将modalId传入component内作为弹窗的唯一标识，主要用于事件交互。
  -->
  <component 
    slot-scope="modalProps"
    :modalId="modalProps.modalId"
  ></component>
</modal>
</template>

<script>
    import ncAdminCore from 'ncadmin-core';
    const { modal } = ncAdminCore;

    export default {
        component: {
          modal
        },
        data: {
          return {
            visible: false,
            modalConfig: {
              confirm: {
                enable: true
              },
              cancel: {
                enable: true
              },
              others: [
                {
                  enable: true,
                  name: '',   // 按钮名称
                  eventName: '', // 按钮触发事件名称
                  close: true // 操作后是否关闭弹窗
                }
              ]
            }
          }
        }
    }
</script>
```

### 弹窗内使用的组件 开发示例

```html
<template>
  
</template>

<script>
  import ncAdminCore from 'ncadmin-core';
  const { eventHub } = ncAdminCore;
  
  export default {
    // modalId 为弹窗传入的唯一标识
    props: ["modalId"],
    created() {
      // 统一监听事件，通过eventName区分事件。
      // `fromModal_${this.modalId}` 为modal触发的事件。
      // `toModal_${this.modalId}` 为modal接收的事件。
      // modalConfirm 为“确定“按钮触发的事件。
      // 其中config格式为 
      // {
      //   enable: true,
      //   name: '',   // 按钮名称
      //   eventName: '', // 按钮触发事件名称
      //   close: true // 操作后是否关闭弹窗
      // }
      eventHub.$on(`fromModal_${this.modalId}`, config => {
        switch (config.eventName) {
          // 确定
          case "modalConfirm":
            this._submitData(config);
            break;

          // 自定义事件
          case "commonEditCancel":
            this._closeModal();
            break;
        }
      });
    },
    mounted() {
      // 触发弹窗的关闭事件
      eventHub.$emit(`toModal_${this.modalId}`, {
        eventName: 'modalCancel'
      });
    }
  }
</script>
```

# action-object.vue
处理行为，比如按钮行为

[文档](http://gitlab.tools.vipshop.com/daniel.xiao/admin-terminator/blob/master/query-list-config.md)


# event-hub.js

事件总线，用于事件交互的单一实例。
使用时建议通过唯一值区分。

```js
  import ncAdminCore from 'ncadmin-core';
  const { eventHub } = ncAdminCore;

  // 使用方法与vue实例监听触发事件一致。
  eventHub.$on();
  eventHub.$emit();
  
```
