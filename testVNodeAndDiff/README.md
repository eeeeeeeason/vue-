- vdom是什么，作用是什么
  - 用js模拟dom树，操作轻量，只需声明特定的几个属性，而不用把dom的几百个属性携带操作，另外diff算法降低了重绘的性能损耗
- vdom核心api是什么
  - h函数，生成vnode函数
  - patch，渲染及比较函数
- diff算法（讲大概）
- 终于知道为什么createElement函数要缩写成h函数、参考snabbdom。
- dom结构与vnode节点生成对比如下
  ```js
  var container = document.getElementById('#container')
  // 第一个参数标签，第二个参数事件或属性，第三个子元素节点,纯粹文本节点无需经过h函数转vnode节点
  var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
    h('span', {style: {fontWeight: 'bold'}}, 'this is bold'),
    'just normal text',
    h('a', {props: {href: '/foo'}}, 'i will take your places!')
  ])
  // 第一次patch我认为相当于直接占位插入节点渲染
  patch(container, vnode)

  var newVnode = h('div#container.two.classes', {on: {click: anotherFn}}, [
    h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'this is italic now'),
    'still normal text',
    h('a', {props: {href: '/bar'}}, 'i will take your places!')
  ])
  // 第二次会判断原本是否存在进行diff比较，并且只修改变更过后的值
  patch(vnode, newVnode)
  ```
  ```html
  <ul id="list">
    <li class="item">item1</li>
    <li class="item">item2</li>
  </ul>
  ```