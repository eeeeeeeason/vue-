export function initState(vm) {
  debugger
  const opt = vm.$options
  if (opt.data) {
    initData(vm)
  }
  // TODO: METHODS,PROPS
}
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data ==='function'? getData(data,vm):data||{}
}
/**
 * 参考原函数
 * data () {
 *  return {abc:123}
 * }
 */
function getData (data,vm) {
  return data.call(vm,vm)  //指向vm并且返回vm的data,第二个参数不理解,去掉也不影响。。TODO:
}