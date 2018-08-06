/***
*
* Utility Functions
*
* Assorted functions to help support other modules
*
***/

// debounce function to improve scroll event performance
/* eslint-disable */
const debounce = function(func, wait = 20, immediate = true) {
  var timeout;
  return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
/* eslint-enable */

export { debounce };
