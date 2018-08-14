import {watcher,observable} from './attrWatcher.js'
let shopCart = {applePrice:9,orangePrice:15}
observable(shopCart)
// 执行总价
watcher('shopCart','totalPrice',()=>{
  return shopCart.applePrice + shopCart.orangePrice
})