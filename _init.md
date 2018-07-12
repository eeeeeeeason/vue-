 -  _init函数中将传入的{el:'#app',data:{}},绑定与vm.$option,例如可以用vm.$option.el获取el;vm.$option.data获取data;
 - data有两种状态，1为函数可以理解为当data(){return {} }为函数，调用getDATA给vm._data赋值
 - 当我们获取值时能够用this.abc去获取到值，原因是proxy函数代理了_data，
 - $mount,compiler-only版本（entry-runtime-with-compiler.js），
   - 首先获取了el元素，如果是dom元素就捆绑dom元素，如果是类名或者id就调用querySelector选择器，
   - 判断是否含有options.render属性。没有的话去找_data.template,再没有的话去找dom元素中的template,获取innerHtml；或者如果只有el就从el调用getOuterHTML进行template赋值
   - 无论是render或是template最终都会转化为render function，最后调用mount.call(this,el,hydrating)
     - mount方法来自于vue.prototype.$mount，最终执行的是mountComponent函数,这个方法定义在 src/core/instance/lifecycle.js 文件中
     - 1.判断render函数是否存在，不存在的话创建空的VNODE， 接着updateComponent调用了_update方法，设置了一个渲染类型的watcher,在它的回调函数中会调用 updateComponent 方法，最终调用 vm._update 更新 DOM。
        ```
        updateComponent = () => {
          vm._update(vm.render(),hydrating) //如果更新了会重新调用render渲染函数
        }
        new watcher（updateComponent） //设置一个渲染类型的监听器，其中利用的getter与setter
        ```
     
 - 函数最后判断为根节点的时候设置 vm._isMounted 为 true， 表示这个实例已经挂载了，同时执行 mounted 钩子函数。 这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。
