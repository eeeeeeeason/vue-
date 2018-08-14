// 属性观察者，注意与渲染的watcher不同，后续会对渲染watcher处理
/**如
 * watch:{attr:cb()}
 * computed:{attr:function(){return balbalbalb}} func相当于cb
 */
import Dep from './Dep.js'
export function watcher (obj,key,cb) {
  // 定义一个被动触发函数，当这个“被观测对象”的依赖更新时调用
  const onDepUpdated = () => {
    const val = cb()  //baalbalbla
    onComputedUpdate(val)
  }
  // 第三个参数descriptor，读取该属性时触发依赖执行，相当于监听属性变化
  Object.defineProperty(obj,key,{
    get () {
      Dep.target = onDepUpdated
      const val = cb()
      // 制空避免收集
      Dep.target = null
      return val
    },
    set () {
      console.error('计算属性无法被赋值！')
    }
  })
}

// 监听并执行依赖得到结果
export function onComputedUpdate (val) {
  console.log(`处理结果为${val}`)
}

// 所有属性监听并依赖收集
export function defineReactive (obj, key, val) {
  const deps = []
  Object.defineProperty(obj, key, {
    get () {
      console.log(`我的${key}属性被读取了！`)
      if (Dep.target && deps.indexOf(Dep.target) === -1) {
        deps.push(Dep.target)
      }
      return val
    },
    set (newVal) {
      console.log(`我的${key}属性被修改了！`)
      val = newVal
      deps.forEach((dep) => {
        dep()
      })
    }
  })
}
// 用于深度遍历属性设置为可监听对象
export function observable (obj) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
  return obj
}