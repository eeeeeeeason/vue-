export function stateMixin (Eason) {
  var dataDef = {}
  dataDef.get = function () { return this._data } //TODO:_data从哪来。
  var propsDef = {}
  propsDef.get = function () { return this._props } //TODO:
  //TODO: process.env.NODE_ENV,搭配webpack设置环境变量
  dataDef.set = function () {
    console.warn('Avoid replacing instance root $data. Use nested data properties instead') 
  }
  propsDef.set = function () {
    console.warn('$props is readonly')
  }
  Object.defineProperty(Eason.prototype, '$data', dataDef); //就是$data不能直接设置，需要其他代理,具体设置方法TODO:
  Object.defineProperty(Eason.prototype, '$props', propsDef);
  // Eason.prototype.$set = set TODO:
  // Eason.prototype.$watch TODO:
}

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