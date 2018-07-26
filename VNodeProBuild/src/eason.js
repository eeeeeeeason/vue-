import {initMixin} from './mixin.js'
function Eason (options) {
  console.log(options)
  this._init(options)
  // TODO:补充initGlobalAPI
  this.options = {
    components:{},  //TODO:后期补充了toString和hasOwnProperty之后再考虑将{}换为Object.create(null)
    directives:{},
    filters:{},
    _base:Eason
  }
}
initMixin(Eason)
export default Eason
