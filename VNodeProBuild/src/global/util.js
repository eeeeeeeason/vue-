// 默认父子合并TODO:若子类有值为何只返回子
const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}
// 合并对象工具
export function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}
// 指令从函数格式转为对象格式
function normalizeDirectives (options) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}

//检测是否含有该属性，不包括继承来的属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

// 根据父子组件进行合并
export function mergeOptions (
  parent,
  child,
  vm
) {
  // TODO:strats属性特征描述，先做个简单的，再考虑合并share/utils中的config
  // const strats = config.optionMergeStrategies
  const strats = {}
  // TODO:检测组件命名是否合法，是否已经存在该组件名
  // if (process.env.NODE_ENV !== 'production') {
    // checkComponents(child);
  // }
  // 检测是否为函数组件
  if (typeof child === 'function') {
    child = child.options;
  }
  // normalizeProps(child, vm); //TODO:props 暂不处理
  // normalizeInject(child, vm);  //TODO:inject 暂不处理
  // normalizeDirectives(child); //TODO: 
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  // 根据把key的属性调用不同的合并方法，需要合并的如component
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

// strats根据不同属性处理data或者function
strats.data = function (parentVal,childVal,vm) {
  // TODO:记录什么时候会没有vm,合并时子类的data属性必须是一个返回组件实例的值
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      console.warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )
      return parentVal
    }
    debugger
    // 记录childVal类型
    return mergeDataOrFn(parentVal, childVal)
  }
  return mergeDataOrFn(parentVal, childVal,vm)
}

export function mergeDataOrFn(parentVal, childVal,vm) {
  if (!vm) {
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // 我们要做的就是合并两个函数并返回
    // 注意这里函数名多了个d，merged
    return function mergedDataFn () {
      debugger
      // TODO:这里的this指什么？属性什么情况会返回函数？
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  }
}

function mergeData (to, from) {
  debugger
  if (!from) return to
  let key, toVal, fromVal
  const keys = Object.keys(from)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    toVal = to[key]
    fromVal = from[key]
    // 如果合并的结果之前没有监听过这个属性，需要新增一个监听者、暂时不处理
    if (!hasOwn(to, key)) {
      // set(to, key, fromVal)  TODO:
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      // 如果两者都是对象需要深度继续遍历合并，TODO:考虑如果其中一个是对象呢？
      mergeData(toVal, fromVal)
    }
  }
  return to
}
// 是一个纯对象，而不是数组balablab
const _toString = Object.prototype.toString
export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}