// 初始化Eason.extend,mergeOptions,defineReactive
export function initGlobalAPI (Eason) {
  var configDef = {};
  configDef.get = function () { return config; };
  // if (process.env.NODE_ENV !== 'production') {
  configDef.set = function () {
    console.warn(
      'Do not replace the Vue.config object, set individual fields instead.'
    );
  };
  // }
  Object.defineProperty(Eason, 'config', configDef);
  Eason.util = {
    // warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Eason.set = set
  // Eason.delete = del
  // Eason.nextTick = nextTick

  Eason.options = Object.create(null)
  
  var ASSET_TYPES = ['component','directive','filter']
  ASSET_TYPES.forEach(type => {
    Eason.options[type + 's'] = Object.create(null)
  })
  
  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Eason.options._base = Eason

  extend(Eason.options.components, builtInComponents)

  initUse(Eason)
  initMixin(Eason)
  initExtend(Eason)
  initAssetRegisters(Eason)
}