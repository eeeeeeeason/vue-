#合并配置mixin，实现逻辑类似extends

- 通过mergeOptions将Vue .options和当前项进行合并

- 了解外部调用场景的配置合并,主动调用new Vue创建对象

- 了解组件场景配置合并事例化子组建new Vue

- 实现方案：

  - 使用mergeOptions递归将extends和mixins合并到parent
  - 父组件判断是否有子组件属性，若父组件没有的话调用mergeField

- mergeOptions实际执行的方法

  ```js
  function mergeField (key) {
    const strat = starts[key] || defaultStrat
    options[keys] = strat(parent[key],child[key],vm,key)
    // strat是多方合并策略
    //有根据data，watch,computed,hook等多种合并策略
  }
  // 生命周期的合并。其实是将多个周期作为数组参数子组件判断是否有该参数有则在改数组中塞入该值
  ```

  - 初始化时会给Vue.options创建components,directives,filters三个空对象属性

- mergeHook函数

  ```js
  export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    ]
  function mergeHook (
    parentVal: ?Array<Function>,
    childVal: ?Function | ?Array<Function>
  ): ?Array<Function> {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)	//合并父子特定属性
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal
  }
  
  LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
  })
    //定义了多个周期关键字，同样以数组进行储存，判断子组件是否有某个生命周期，有的话判断是否父组件也有如果都有，就合并到相同周期属性的数组底下。如果父组件没有就直接用子组件的
  ```

  
