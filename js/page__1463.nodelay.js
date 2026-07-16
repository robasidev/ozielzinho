/**
 * DOMContentLoaded Event Deferral Helper
 * 
 * Intercepts DOMContentLoaded event listeners and automatically wraps their
 * callbacks with requestAnimationFrame to prevent forced synchronous layouts
 * (reflows) that negatively impact page performance metrics.
 * 
 * This approach maintains full backward compatibility while deferring layout-
 * triggering operations (offsetHeight, getComputedStyle, etc.) until the next
 * animation frame, allowing the browser to optimize rendering.
 * 
 * @see https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/
 */
(function() {
    'use strict';
    
    var originalAddEventListener = document.addEventListener;
    var isDOMReady = document.readyState === 'complete' || document.readyState === 'interactive';
    
    /**
     * Intercept document.addEventListener to defer DOMContentLoaded callbacks
     * 
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     * @param {Object|boolean} options - Event listener options
     */
    document.addEventListener = function(event, callback, options) {
        if (event === 'DOMContentLoaded' && typeof callback === 'function') {
            var deferredCallback = function(e) {
                requestAnimationFrame(function() {
                    callback.call(this, e);
                }.bind(this));
            };
            
            if (isDOMReady) {
                // DOM already loaded, execute immediately but deferred
                requestAnimationFrame(function() {
                    callback.call(document, new Event('DOMContentLoaded'));
                });
            } else {
                originalAddEventListener.call(document, event, deferredCallback, options);
            }
        } else {
            originalAddEventListener.call(document, event, callback, options);
        }
    };
    
    // Track when DOM becomes ready
    if (!isDOMReady) {
        originalAddEventListener.call(document, 'DOMContentLoaded', function() {
            isDOMReady = true;
        });
    }
})();
document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('[data-op3-element-type="video"] .op3-video-magic-overlay .op3-video-magic-overlay-image');if(e.length>0)for(var t=0;t<e.length;t++){var o=(e[t].currentStyle||window.getComputedStyle(e[t],!1)).backgroundImage.slice(4,-1).replace(/"/g,""),n=new Image;n.src=o,function(t,o){o.onload=function(){e[t].style.maxWidth=o.width+"px",e[t].style.maxHeight=o.height+"px"}}(t,n)}});