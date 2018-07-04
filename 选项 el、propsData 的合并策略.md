#Vue选项的合并

- ## 选项 el、propsData 的合并策略

  - new Vue 与 Vue.extend的属性合并不同,是否有第三个参数vm决定是否为子组件，没有vm代表就是子组件

  ```js
  vm.$options = mergeOptions(		// new Vue时执行Init方法调用mergeOptions,此时带有第三个参数vm
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
  ```

  ```js
  Sub.options = mergeOptions(		//Vue.extend时mergeOptions的第三个参数并不存在
    Super.options,
    extendOptions
  )
  ```

  

- ## 选项 data 的合并策略

  ```js
  strats.data = function (
    parentVal: any,
    childVal: any,
    vm?: Component
  ): ?Function {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        process.env.NODE_ENV !== 'production' && warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        )
  
        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)	//子组件执行
    }
  
    return mergeDataOrFn(parentVal, childVal, vm)	//无论是不是子组件都会执行，但非子组件会带vm
  }
  ```

  