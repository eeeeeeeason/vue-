#组件化---vnode如何转化为dom

```js
Varsity  app = new Vue({
    el: '#app',
    render: h => h(App)		//此处的h为createElement，App为vue组件
})
```

- createElement当tag为组件时执行createComponent

- Vue.extend就是一个原型继承的构造器

- 组件构造器是继承于Vue的

- 组件初始就有多个ComponentVnodeHook经过merageHook合并到各自的dataHook中

- 最后生成一个组件的vnode

- 组件patch流程****

  - 创建生命周期初始化时建立父子关系并将父组件以参数的形式向子组件传递，因此子组件可以用$parent进行父组件获取

  - 从最深层开始初始化，子组件先将父组件设置为占位符vnode后，父组件初始化再将自己经过render和_update转变为渲染vnode，并且父组件将自己的父组件设置为占位符vnode,进行一个深层遍历

  - 当我们通过 createComponent 创建了组件 VNode，接下来会走到 vm._update，执行 vm.__patch__ 去把 VNode 转换成真正的 DOM 节点。 

    - example

    ```
    <div id="app">
    	<img src="./abc.png">
    	<HelloWorld/>
    </div>
    ```

    创建父级时HelloWorld组件会以占位符的形式储存，接着createChildren就会创建该子组件结构再次调用createComponent，当进入子组件调render函数时才进行内层渲染调_update将生命周期等挂载
