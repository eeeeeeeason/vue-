import {initState} from './state.js'
let uid = 0
export function initMixin (Eason) {
  Eason.prototype._init = function (options) {
    const vm = this
    vm.uid = uid++
    debugger
    if (options && options._isComponent) {
      // 组件合并，动态属性合并缓慢，不需要特殊处理就单独拉出来优化
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    initState(vm)
  }
}

function resolveConstructorOptions(ctor) {

}