import {initMixin} from './mixin.js'
function Eason (options) {
  console.log(options)
  this._init(options)
}
initMixin(Eason)
export default Eason
