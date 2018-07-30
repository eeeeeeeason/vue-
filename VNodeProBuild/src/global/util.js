// 默认父子合并TODO:若子类有值为何只返回子
const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}
// 是一个纯对象，而不是数组balablab
const _toString = Object.prototype.toString
export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
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
// 要求对应value必须为纯对象，否则返回该对象类型和警告
function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    console.warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
    );
  }
}

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
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
  // 如果有定义extend或者mixin就递归调用合并属性
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
      // TODO:这里的this指什么？
      // function data (){return{abc:123}}
      // function data (){return{def:123}}
      // function data (){return{def:[1,2,3]}}
      // function data (){return{def:{aaa:123}}}
      // function data (){return{qqq:{bbb:789}}}
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  }
}
// from {def:123}
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
      // 情况1，to:{def:123},from:{abc:789}
      // 情况2，to:{def:[1,2,3]},from:{abc:789}
      set(to, key, fromVal)
    }
    // 如果该属性名相同，并且都为对象
    else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      // def:{aaa:123} def:{bbb:789}
      // 如果两者都是对象需要深度继续遍历合并，TODO:考虑如果其中一个是对象呢？
      mergeData(toVal, fromVal)
    }
  }
  return to
}
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
  'errorCaptured'
]

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})

// 生命周期合并
export function mergeHook (parentVal,
  childVal
) {
  return childVal //是否存在子
    ? parentVal //存在子判断父是否存在
      ? parentVal.concat(childVal)  //父子都存在连接父子后返回
      : Array.isArray(childVal)   //父不存在判断子是不是一个数组，不是的话包裹好后再返回
        ? childVal          
        : [childVal]
    : parentVal     //子不存在就直接返回父
}

// component,directive,filter合并,多了个key
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);   //设置parentVal为res的原型。TODO:了解目的
  if (childVal) {
    assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});