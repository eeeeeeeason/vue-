var computedDataFunc = (function () {
  'use strict';

  // dep用于储存computed和watch属性的回调，在观察的属性值发生变化时取出进行处理
  function Dep () {
    // 依赖储存列表,依赖就像
    this.depList = [];
    // depend方法，如果储存器没有当前这个依赖就加入
    this.depend = function (){
      if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
        this.deps.push(Dep.target);
      }
    };
    this.notify = function() {
      // 观察属性修改时触发依赖执行
      this.depList.forEach((dep) => {
        dep();
      });
    };
  }
  var Dep$1 = new Dep();

  // 属性观察者，注意与渲染的watcher不同，后续会对渲染watcher处理
  function watcher (obj,key,cb) {
    // 定义一个被动触发函数，当这个“被观测对象”的依赖更新时调用
    const onDepUpdated = () => {
      const val = cb();  //baalbalbla
      onComputedUpdate(val);
    };
    // 第三个参数descriptor，读取该属性时触发依赖执行，相当于监听属性变化
    Object.defineProperty(obj,key,{
      get () {
        Dep$1.target = onDepUpdated;
        const val = cb();
        // 制空避免收集
        Dep$1.target = null;
        return val
      },
      set () {
        console.error('计算属性无法被赋值！');
      }
    });
  }

  // 监听并执行依赖得到结果
  function onComputedUpdate (val) {
    console.log(`处理结果为${val}`);
  }

  // 所有属性监听并依赖收集
  function defineReactive (obj, key, val) {
    const deps = [];
    Object.defineProperty(obj, key, {
      get () {
        console.log(`我的${key}属性被读取了！`);
        if (Dep$1.target && deps.indexOf(Dep$1.target) === -1) {
          deps.push(Dep$1.target);
        }
        return val
      },
      set (newVal) {
        console.log(`我的${key}属性被修改了！`);
        val = newVal;
        deps.forEach((dep) => {
          dep();
        });
      }
    });
  }
  // 用于深度遍历属性设置为可监听对象
  function observable (obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
    return obj
  }

  // let shopCart = {applePrice:9,orangePrice:15}
  // observable(shopCart)
  // // 执行总价
  // watcher('shopCart','totalPrice',()=>{
  //   return shopCart.applePrice + shopCart.orangePrice
  // })

  let ObData = {};
  ObData.observable = observable;
  ObData.watcher = watcher;

  return ObData;

}());
