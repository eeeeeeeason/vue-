import {initState} from './state.js'
let uid = 0
export function initMixin (Eason) {
  Eason.prototype._init = function (options) {
    const vm = this
    vm.uid = uid++
    debugger
    vm.$options = options
    initState(vm)
  }
}