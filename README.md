 - MVVM到底是什么，跟Jquery有什么区别？
  - MVVM理解，跟MVC区别
    - Model View Controller,一般是用户操作view视图按钮，触发controller内方法，cotroller修改model数据，model通知view，算是后端开发的主流思想
    - vue中template为View, data对象为Model,new Vue({el,data,methods})为ViewModel，连接视图view与data，view通过DOMlistenser事件'on'绑定来操作model,model通过数据绑定dataBinding操作view
    - 数据，视图层是否分离
      - vue中，proxy代理_data数据，并且不允许直接修改。template为视图
      - 不分离背离了开放封闭的原则，不利于维护，功能扩展
    - 以数据驱动视图
      - 只修改数据，就会触发封装好的dom操作。不需要手动进行dom操作
  - MVVM 实现三要素
    - 如何监听变化，实现响应式
      - Object.defineProperty设置get,set监听data变化
      - vm.data，利用Object.defineProperty，proxy代理data对象,便于render函数中的this取值
    - 视图模板解析，模板引擎
      - 本质是字符串，有v-if,v-for等逻辑，需要以js执行
      - 将js中data对象属性捆绑到render函数，最后返回vnode，render函数中结构与snabbdom中h函数相似
      ```js
      // vue
      function render () {
        with (this) {  //将_c,_v,price的this省略，相当于this._c,this._vthis.price
          _c('div', {attrs: {'id': 'app'}}, [_c('span', [_v(_s(price))])])  //_c创建vnode，_v字符串节点，_s字符串转话
        }
      }
      // snabbdom
       h('div#app', [
         h('span', vm.price)
       ])
      ```
    - dom如何生成的，如何在监听变化后渲染,使用patch方法与snabbdom相同
      - 首次渲染
      - 更新渲染
      ```js
      vm._update(vnode) {
        const prevVnode = vm.vnode
        vm._vnode = vnode
        if (!prevVnode) {
          vm.$el = vm.__patch__(vm.$el,vnode) //初次渲染
        } else {
          vm.$el = vm.__patch__(prevVnode,vnode)
        }
      }
      function updateComponent() {
        vm._update(vm._render()) //此处render即是模板转化的render函数，执行后可生成vnode
      }
      ```

