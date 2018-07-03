#day4Observe工厂函数实现vue数据响应

- Observe构造函数,initData函数最后执行observe(data,true)中将new Observer(data)处理并返回

  ```js
  export class Observer {
    value: any;
    dep: Dep;
    vmCount: number; // number of vms that has this object as root $data
  
    constructor (value: any) {
        this.value = value	//引用了需要处理的数据对象如果处理的是data这里就是data
        this.dep = new Dep()	//对象或者数组的依赖收集
        this.vmCount = 0		//
        def(value, '__ob__', this)
        if (Array.isArray(value)) {	// 数组处理
            const augment = hasProto
            ? protoAugment
            : copyAugment
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {			//对象深度处理
            this.walk(value)
        }
    }
  
    walk (obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i])	//处理对象getset属性拦截
        }
    }
    
    observeArray (items: Array<any>) {
      // 省略...
    }
  }
  ```

- defineReactive

  ```js
  export function defineReactive (
    obj: Object,	//引用上一步需要深度处理的对象
    key: string,	//对象的键
    val: any,		// 此处处理为空
    customSetter?: ?Function,// 此处处理为空
    shallow?: boolean// 此处处理为空，即默认深度访问对象
  ) {
    const dep = new Dep()	// 储存依赖函数的筐，此时该依赖函数就是某个特定属性的依赖，跟上面的dep对象不一样
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {	//查看是否存在，或者是否可以配置
      return		//存在就没必要再去搜集依赖，不可配置的属性就没必要强行处理
    }
  
    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key]
    }
  
    let childOb = !shallow && observe(val)	//shallow表示是否为对象的最底层属性，*****observe(val)还不懂
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        const value = getter ? getter.call(obj) : val
        if (Dep.target) {	//是否有需要收集依赖的属性
          dep.depend()	//依赖注入，dep在属性值被修改时触发依赖收集
          if (childOb) {	
            childOb.dep.depend()	//第二个收集依赖的渠道，再$set时触发
            if (Array.isArray(value)) {
              dependArray(value)
            }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        // 省略...
      }
    })
  }
  ```

  