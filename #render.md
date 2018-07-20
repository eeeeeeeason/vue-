 #render

- **不理解的es6语法new Proxy()第二遍浏览记得学习

- **不理解createElement

- Vue 的 _render 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 src/core/instance/render.js 文件中 

  - 开发过程中我们使用render函数的时候很少通常采用template来代替，但实际上所有的执行最终都转化为render函数，render函数中返回了createElement

    ```js
    <div id="app">
      {{ message }}
    </div>
    ----------上下两者等价---------
    render: function (createElement) {
      return createElement('div', {
         attrs: {
            id: 'app'
          },
      }, this.message)
    }
    ```

- render渲染的虚拟DOM可以理解为一个带有许多属性的js对象用来描述一个dom元素的js对象。远比一个真正的DOM更加轻量它是定义在 src/core/vdom/vnode.js 中的。 借鉴了一个开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现 

- createElement是一个生成虚拟dom的函数，传入VM实例，vnode标签， 相关数据data,子节点children

  - createElement做了几件事情包括
    - 1.分辨tag去创建不同的VNODE，
    - 2.拍平子节点。把所有的子元素节点转为一维数组