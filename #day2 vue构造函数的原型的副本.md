#day2 vue构造函数的原型

- Npm run dev实际执行script/config.js中的配置

  - ```
    'web-full-dev': {
        entry: resolve('web/entry-runtime-with-compiler.js'), //入口,web为一个别名配置，在scripts/alias中可找
        dest: resolve('dist/vue.js'),//实际转化为一个vue.js
        format: 'umd',
        env: 'development',
        alias: { he: './entity-decoder' },
        banner
      },
    ```

    

- 但当我们打开web/entry-runtime-with-compiler.js会发现该文件并不是vue构造函数的来源，vue来自./runtime/index,但还能继续向上找,最后找到src/core/index.js

  ```
  import Vue from './runtime/index' //compiler.js
  import Vue from 'core/index' //runtime/index.js
  import Vue from './instance/index' //src/core/index
  ```

- Instance/index.js

  ```
  通过5个文件赋予Vue函数原型属性，并导出Vue
  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
  ```

  

  - initMixin的作用是初始化，绑定_init再Vue.prototype下，当我们执行new Vue()时，执行this._init(options)

  - stateMixin主要包括dataDef,propsDef的set,get

    ```js
    const dataDef = {}
      dataDef.get = function () { return this._data }
      const propsDef = {}
      propsDef.get = function () { return this._props }
      if (process.env.NODE_ENV !== 'production') {
        dataDef.set = function (newData: Object) {
          warn(
            'Avoid replacing instance root $data. ' +
            'Use nested data properties instead.',
            this
          )
        }
        propsDef.set = function () {	//如果为生产环境为属性设置为只读，无法修改
          warn(`$props is readonly.`, this)
        }
      }
      Object.defineProperty(Vue.prototype, '$data', dataDef)	//$data代理了this._data
      Object.defineProperty(Vue.prototype, '$props', propsDef)	//$props代理了this._props
    ```

    - get和set属于ES5的东西.. 简单说当你读取一个变量的时候会触发该变量的getter. 当你修改该变量时候会触发他的setter.