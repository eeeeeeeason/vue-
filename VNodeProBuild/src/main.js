import el from './vElement.js'
import parse from './regTemplate.js'
import _ from '../helper/utils'
console.log(parse)
// 将所有从template来的元素处理为VELEMNT
function modifyChild (parent) {
  if (parent.children.length>0 && !parent.text) {
    parent.childList = []
    _.each(parent.children,function(child,i){
      if (!child.text) {
        parent.childList.push(el(child.tag,child.attrsMap,modifyChild(child)))
      }
      else {
        parent.childList.push(el('text',[child.text]))
      }
    })
    return parent.childList
  }
}
console.log(modifyChild)
