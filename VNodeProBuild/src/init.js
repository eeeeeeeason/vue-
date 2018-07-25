import _ from '../helper/utils'
import el from './vElement.js'

var init = {}
// 将所有从template来的元素处理为VELEMNT
init.modifyEl = function modifyChild (parent) {
  if (parent.children.length>0 && !parent.text) {
    parent.childList = []
    _.each(parent.children,function(child){
      if (!child.text) {
        parent.childList.push(el(child.tag,child.attrsMap,modifyChild(child)))
      }
      else {
        parent.childList.push(el('text',[child.text]))  //TODO: 当tag不存在时使用createTextNode代替现有的VElement
      }
    })
    return parent.childList
  }
}

export default init