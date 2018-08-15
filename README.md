# ncadmin-core

![vue 2.5](https://img.shields.io/badge/vue-2.5-green.svg)
![axios](https://img.shields.io/badge/axios-0.17-green.svg)

ncadmin的核心组件库，包括配置开发的查询列表，编辑，详情页，弹窗等

## install 

```javascript
npm install ncadmin-core
```

## Usage

``` js
// 使用其工具库
import {
  ncformCommon,
  eventHub,
} from 'ncadmin-core';

// 使用其组件。具体的组件请阅读下面的组件文档
<nca-xxx></nca-xxx>
```

## 工具库 

### eventHub

事件总线，用于全局触发和监听事件

```js
  import ncadminCore from 'ncadmin-core';
  const { eventHub } = ncadminCore;

  eventHub.$on(); // 监听事件
  eventHub.$emit(); // 触发事件 
```

### ncformCommon

ncform的通用类库，请参考ncform-common项目的文档

## 组件列表

### ncform

请参考ncform项目的文档

### nca-detail

```html
<template>
  <nca-detail></nca-detail>
</template>
<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>
```

### nca-detail-modal

```html
<template>
  <nca-detail-modal></nca-detail-modal>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
```

### nca-edit

```html
<template>
  <nca-edit></nca-edit>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
```

### nca-edit-modal

```html
<template>
  <nca-edit-modal></nca-edit-modal>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
```

### nca-list

```html
<template>
  <nca-list></nca-list>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    }
  }
</script>
```

### nca-modal

弹窗组件，可配置弹窗的标题，底部按钮

弹窗里面的内容需要当一个组件来开发，组件需遵循nca-modal内容组件的规则来开发

```html
<template>
  <nca-modal :visible.sync="visible" :modal-config="modalConfig">
    <!--
      当组件需要与弹窗进行交互时（比如通知弹窗关闭），请按下面的例子填写slot-scope和modal-id
    -->
    <component slot-scope="modalProps" :modal-id="modalProps.modalId"></component>
  </nca-modal>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        modalConfig: {
          title: '', // 弹窗标题
          buttons: {
            confirm: { // 确定按钮
              enable: true
            },
            cancel: { // 取消按钮
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
  }
</script>
```

#### 弹窗内容组件开发规则和示例

```html
<template>
</template>

<script>
  import ncadminCore from 'ncadmin-core';
  const { eventHub } = ncadminCore;
  
  export default {
    // modalId 为弹窗传入的唯一标识
    props: ["modalId"],

    created() {
      /* 
      *  监听modal容器事件，通过eventName区分事件。
      *  fromModal_${this.modalId} 为modal触发的事件。
      */
      eventHub.$on(`fromModal_${this.modalId}`, config => {
        switch (config.eventName) {
          // 点击确定按钮
          case "modalConfirm":
            // do something;
            break;

          // 点击自定义按钮的事件（事件名用户自定义，以下仅仅是演示）
          case "commonEditCancel":
            // do something;
            break;
        }
      });
    },
    mounted() {
      /*
      *  toModal_${this.modalId} 为发送给modal容器的事件。
      */
      eventHub.$emit(`toModal_${this.modalId}`, {
        eventName: 'modalCancel' // 触发弹窗的关闭事件
      });
    }
  }
</script>
```

## Widgets

### nca-label

```js
component: {
  name: 'nca-label',
  config: {
    color: ''
  },
  value: ''
}
```

### nca-image

```js
component: {
  name: 'nca-image',
  config: {
    maxWidth: ''
  },
  value: ''
}
```

### 组件使用方法

# edit-page.vue

通过配置开发一个新建/编辑的页面
（根据配置中的idField字段，在$route中取页面唯一值（通常为Id）。值为0时，页面为新建状态，值为其他值时，页面为编辑状态。）
具体配置参考[文档](config-edit.md)

### 示例
```html
<template>
  <edit-page :config="config"></edit-page>
</template>

<script>
  import ncadminCore from 'ncadmin-core';
  const editPage = ncadminCore.edit;

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

具体配置参考[文档](config-list.md)

### 示例
```html
<template>
  <list-page :config="config" v-model="valueData"></list-page>
</template>

<script>
  import ncadminCore from 'ncadmin-core';
  const listPage = ncadminCore.list;

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