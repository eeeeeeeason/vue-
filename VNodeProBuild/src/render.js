const callbacks = []
let pending = false

export function renderMixin (Eason) {
  installRenderHelpers(Eason.prototype) //Eason.prototype:{$set,$emit,_update,_init....}
  Eason.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };
  Eason.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;    //_parentVnode不知道拿来的TODO:
    // $slots TODO:
    // if (process.env.NODE_ENV !== 'production') {
    //   for (var key in vm.$slots) {
    //     // $flow-disable-line
    //     vm.$slots[key]._rendered = false;
    //   }
    // }
    // if (_parentVnode) {
    //   vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    // }
    vm.$vnode = _parentVnode;
    var vnode
    vnode = render.call(vm._renderProxy, vm.$createElement);  //TODO:源码这里有个异常处理trycatch我干掉了
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    vnode.parent = _parentVnode;
    return vnode
  }
}

// 处理工具，用啥添加啥，先不管，TODO:
export function installRenderHelpers (target) {
  // target._o = markOnce
  // target._n = toNumber
  // target._s = toString
  // target._l = renderList
  // target._t = renderSlot
  // target._q = looseEqual
  // target._i = looseIndexOf
  // target._m = renderStatic
  // target._f = resolveFilter
  // target._k = checkKeyCodes
  // target._b = bindObjectProps
  // target._v = createTextVNode
  // target._e = createEmptyVNode
  // target._u = resolveScopedSlots
  // target._g = bindObjectListeners
}

export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}