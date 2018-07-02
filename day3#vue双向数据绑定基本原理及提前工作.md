#vue双向数据绑定基本原理及提前工作



- 提前工作

  - 1.initData,在处理完毕前数据为function,初始化完毕之后产生真实数据_data,并且能够利用data.a来代理获取到__data的真实的数据
  - 2.处理props及本身的data,避免重复，另外查看是否使用了vue中的保留字，避免冲突，最后Observe(data,true) 开启响应

- 响应基本思路

  - 依赖Object.defineProperty(data,'a',{set:function(){},get:function(){}}),可以拦截获取及设置的操作，在获取该属性时将所依赖的其他函数先储存，设置时按条件将依赖取出后执行

    ```js
    const dep = []
    Object.defineProperty(data, 'a', {
      set () {
        // 当属性被设置的时候，将“筐”里的依赖都执行一次
        dep.forEach(fn => fn())
      },
      get () {
        // 当属性被获取的时候，把依赖放到“筐”里
        dep.push(Target)
      }
    })
    ```

  - 如何收集依赖是第二个问题，$watch('a',()=>{console.log('设置了a')})

    - 方案:$watch中可以知道当前监听并响应的属性，比如a，name此时我们可以在watch中通过data.a去触发get从而将缓存的fn去存储到dep依赖数组中

      ```js
      // 连接上一个代码块
      // Target 是全局变量
      let Target = null
      function $watch (exp, fn) {
        // 将 Target 的值设置为 fn
        Target = fn
        // 读取字段值，触发 get 函数
        data[exp]
      }
      ```

  - 完善:

    - 此时当使用console.log(data.a)会打印undefined,需要在外部进行键值缓存,这样就能返回缓存值

        ```js
        for (let key in data) {	//walk函数
          const dep = []
          let val = data[key] // 缓存字段原有的值
          Object.defineProperty(data, key, {
            set (newVal) {
              // 如果值没有变什么都不做
              if (newVal === val) return
              // 使用新值替换旧值
              val = newVal
              dep.forEach(fn => fn())
            },
            get () {
              dep.push(Target)
              return val  // 将该值返回
            }
          })
        }
        ```

    - 当前watch仅能监听data.a第一层，而data.a.b不能进行监听，依然不算响应式，我们可以递归去向下读取内部属性，判断data[key]是否为对象进行递归

        ```js
        const nativeString = Object.prototype.toString.call(val)
            if (nativeString === '[object Object]') {
              walk(val)
            }
        ```

    - 此时$watch输入为$watch('a.b',()=>{})，data[a.b]并不能执行，需要修改watch部分data[exp],如果带点就变为"[a]"[b]"

        ```js
        if (/\./.test(exp)) {
            // 将字符串转为数组，例：'a.b' => ['a', 'b']
            pathArr = exp.split('.')
            // 使用循环读取到 data.a.b
            pathArr.forEach(p => {
              obj = obj[p]
            })
            return
          }
        ```

    - watch监听数据变化时如何渲染呢，我们当下get方法其实可以换为一个render渲染函数,这样就做到数据更新时监听并更新视图，因此我们的watch函数也要随之修改,允许为普通属性，也可以为渲染函数，$watch(render, render)执行时，我们第一个参数储存了依赖，第二个参数设置了数据修改时的执行依赖函数

        ```js
        function render () {
          return document.write(`姓名：${data.name}; 年龄：${data.age}`)
        } // 在render函数执行时，其实就相当于一次get函数，因为读取了data.name
        ```

        ```js
        function $watch (exp, fn) {
          Target = fn
          let pathArr,
              obj = data
          // 如果 exp 是函数，直接执行该函数
          if (typeof exp === 'function') {
            exp()
            return
          }
          if (/\./.test(exp)) {
            pathArr = exp.split('.')
            pathArr.forEach(p => {
              obj = obj[p]
            })
            return
          }
          data[exp]
        }
        ```

        
