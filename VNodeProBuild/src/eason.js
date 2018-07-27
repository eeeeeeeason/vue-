import {initMixin} from './mixin.js'
function Eason (options) {
  console.log(options)
  this._init(options)
}
initMixin(Eason)
stateMixin(Eason)
eventsMixin(Eason)
lifecycleMixin(Eason)
renderMixin(Eason)
initGlobalAPI(Eason)

export default Eason
