import {initMixin} from './mixin.js'
import {stateMixin} from './state.js'
import {eventsMixin} from './event.js'
import {lifecycleMixin} from './lifeCycle.js'
import {renderMixin} from './render.js'
import {initGlobalAPI} from './global/globalapi.js'
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
