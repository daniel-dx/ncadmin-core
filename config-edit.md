# Editable detail page

## Config

```js
{
  title: '', // 标题，editMode不同，显示也不同。比如这里写“商品”，编辑模式下显示为编辑商品，新建模式下显示新建商品
  idField: 'id', // 该表单记录的唯一标识，通过该字段可判断编辑模式还是新建模式
  formField: '', // 当只想取数据中的某个字段的值作为表单的值时，比如{id:1, info: {name: 'daniel'}}，这时可设置该值为info
  formData: { // 当编辑模式时取表单数据用
    apiUrl: '', // 取表单数据的Url
    method: 'get', // get/post default:get
    params: [
        {   
            name: 'id',
            value: 'dx: {{$id}}'    // $item.id 为表单记录的唯一标识
        }
    ],
    resField: '' // 返回数据的实际字段
  },
  formSchema: { // ncform 配置
  },
  buttons: {
    submit: { // 提交
      apiUrl: '', // 提交的Url。当为空时表示不调用接口提交，而只是改变model值
      method: 'post', // get/post default:post
      valueField: '', // 当为空时，即表单的每个一级字段即为参数名
    },
    back: { // 返回
      enable: true
    }
  }
}
```