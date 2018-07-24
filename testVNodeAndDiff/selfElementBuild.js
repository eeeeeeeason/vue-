/**
 * @param {String} tag 标签名
 * @param {Object} attrsMap 属性列表对象
 * @param {Array} children 子元素
 */
function VElement (tag, attrsMap, children) {
  if (!(this instanceof VElement)) {
    return new VElement(tag, attrsMap, children)
  }
  // 如果第二个参数传递的是一个数组，证明没有传递属性列表，将得到的attrsMap赋值给children同时把自己制空
  if (_.isArray(attrsMap)) {
    children = attrsMap
    attrsMap = {}
  }
  this.tag = tag
  this.attrsMap = attrsMap || {}
  this.children = children || []
  this.key = attrsMap     //key如何生成？TODO:
  ? attrsMap.key
  : void 0
  var count = 0
  // 用于计算子元素个数，不影响数据结构,猜测用于diff算法
  _.each(this.children, function (child, i) {
    if (child instanceof Element) {
      count += child.count
    } else {
      children[i] = '' + child
    }
    count++
  })

  this.count = count
}

VElement.prototype.render = function () {
  var el = document.createElement(this.tag)
  var attrsMap = this.attrsMap

  for (var propName in attrsMap) {
    var propValue = attrsMap[propName]
    _.setAttr(el, propName, propValue)
  }

  _.each(this.children, function (child) {
    var childEl = (child instanceof VElement)
      ? child.render()
      : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el
}