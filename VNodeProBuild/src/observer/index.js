// TODO:先把赋值逻辑取出
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 * 新增属性时，如果一个属性在添加前还没被监听过，手动添加
 */
export function isUndef (v) {
  return v === undefined || v === null
}
//TODO: ？？？是否基础类型？
export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
// 判断这个数组索引是否有效，不能是小数，不能是无穷数，不能是非数字，>0
export function isValidArrayIndex (val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val) //isFinite有限数字返回true，NAN /正负无穷返回false
}

// to, from的key属性, from[key]
export function set (target, key, val) {
  if (
    isUndef(target) || isPrimitive(target)
  ) {
    // 必须要设置在对象或者数组中才可使用属性赋值set方法
    console.warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target)}`)
  }
  // 深度遍历时可能会是一个数组,并且target.length必然比from.length要小才能通过hasOwn
  // 校验key的合法性，并且相当于新增一个数组项在数组的最后TODO:暂时不明白为什么要return val
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)  //返回目标数组长度及key，中更大的一个
    target.splice(key, 1, val)
    return val
  }
  // 目标原本有该属性，并且没有使用原生对象自带的属性
  if (key in target && !(key in Object.prototype)) {
    target[key] = val   //外层用hasOwn过滤了相同属性的情况，只有当两个属性不同的时候才有合并的可能
    return val
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    console.warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}