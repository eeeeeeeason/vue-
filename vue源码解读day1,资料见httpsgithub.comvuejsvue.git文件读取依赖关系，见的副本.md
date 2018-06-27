- vue源码解读day1,资料见https://github.com/vuejs/vue.git
  - 文件读取依赖关系，见scripts目录下的config.js

    - 其中分为cjs为browserify和webpack1提供,es为ESModule操作webpack2及rollup,umd可以在script中进行加载;
    - 并且每种也分为了production与development的两种模式，采用的入口文件也是不相同的，一个使用了entry-runtime.js,另一个则为entry-runtim-with-compiler.js,compiler为编译器的代码存放目录，讲template转化为render函数所用

  - package.json

    - ```
      "main": "dist/vue.runtime.common.js",//cjs
      "module": "dist/vue.runtime.esm.js", //es
      scripts:{
          "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",	//通常我们构建的是一个umd完整版vue
          "dev:cjs": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-cjs",//cjs
          "dev:esm": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-esm"//es
      }
      ```

