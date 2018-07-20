
var uid = 0;    //暂时不知道杂用
function Eason (options) {  //初始化构造函数
    this._init(options)
}
Eason.prototype._init = function (options) {
    var vm = this
    vm.uid = uid++
    vm.$options = options   //暂时不考虑合并子组件属性
    initRender(vm)
}
// 初始化render进行数据getset，与模板渲染
function initRender (vm) {
    var temp = vm.$options.temp
    var el = vm.$options.el
    var _data = vm.$options.data
    for (var k in _data) {
        defineReactive(vm.$options.data, k)
        // if (temp.match(/\{\{\S+\}\}/)) {
        //     var list = temp.match(/\{\{\S+\}\}/)
        //     if (list.indexOf(_data[k])!=-1) {
        //         var index = list.indexOf(_data[k])
        //         console.log(index)
        //     }
        // }
    }
    
    document.getElementById(el).innerHTML=temp

}

function defineReactive (obj, key) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
          var value = obj[key]
          return value
        },
        set: function reactiveSetter (newVal) {
            console.log(obj+'的'+key+'改为了'+newVal)
        }
      });
}

function render () {

}