var activeInstance
export function lifecycleMixin (Eason) {
  // TODO:记录vnode,hydrating 
  Eason.prototype._update = function (vnode, hydrating) {
    var vm = this //TODO: this是什么,prevEl是什么,_isMounted,$el在哪里赋值,__patch__在哪里过来的传递的参数怎么使用
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    var prevEl = vm.$el 
    var prevVnode = vm._vnode //最开始是空咯？
    var prevActiveInstance = activeInstance
    activeInstance = vm;
    vm._vnode = vnode;
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
  }
  // Vue.prototype.$forceUpdate
  // Vue.prototype.$destroy

}