'use strict';

/**
 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param  fn 需要执行的函数
 * @param  delay 延迟执行时间（毫秒）
 * @param  immediate---true 表立即执行[触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间]，
 *                     false 表非立即执行[触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果]
 **/
function debounce(fn, delay, immediate) {
    let timer;
    return function() {
        let self = this;
        let args = arguments;
        if (timer) {
            clearTimeout(timer)
        };
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            if (callNow) {
                fn.apply(self, args);
            }
        } else {
            timer = setTimeout(function() {
                fn.apply(self, args)
            }, delay);
        }
    }
}


module.exports = {
    debounce: debounce
};
