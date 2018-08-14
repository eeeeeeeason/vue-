// dep用于储存computed和watch属性的回调，在观察的属性值发生变化时取出进行处理
function Dep () {
  // 依赖储存列表,依赖就像
  this.depList = []
  // depend方法，如果储存器没有当前这个依赖就加入
  this.depend = function (){
    if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
      this.deps.push(Dep.target)
    }
  }
  this.notify = function() {
    // 观察属性修改时触发依赖执行
    this.depList.forEach((dep) => {
      dep()
    })
  }
}
export default new Dep()