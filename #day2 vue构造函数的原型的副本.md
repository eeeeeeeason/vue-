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
  ß
  ```

  