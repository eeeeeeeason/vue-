
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

//检测是否含有该属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  debugger
  return hasOwnProperty.call(obj, key)
}

// 根据父子组件进行合并
export function mergeOptions (
  parent,
  child,
  vm
) {

// TODO:strats属性特征描述，先做个简单的，再考虑合并share/utils中的config
const strats = config.optionMergeStrategies
  // TODO:检测组件命名是否合法，是否已经存在该组件名
  // if (process.env.NODE_ENV !== 'production') {
    // checkComponents(child);
  // }

  if (typeof child === 'function') {
    child = child.options;
  }

  // normalizeProps(child, vm); //TODO:props 暂不处理
  // normalizeInject(child, vm);  //TODO:inject 暂不处理
  normalizeDirectives(child); //TODO: 难道不是传递child.options吗？
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
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}