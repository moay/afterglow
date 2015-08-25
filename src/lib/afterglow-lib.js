// Here are some helper functions that may be used within afterglow

/**
 * IE8 compliant way of handling event bindings with the possibility to remove them lateron
 * @param {domelement} elem  The element to bind
 * @param {string} eventType The event to react to
 * @param {function} handler The function to execute
 */
function addEventHandler(elem,eventType,handler) {
	if (elem.addEventListener)
		elem.addEventListener (eventType,handler,false);
	else if (elem.attachEvent)
		elem.attachEvent ('on'+eventType,handler); 
}

/**
 * IE8 compliant way of handling removing event bindings which were added before
 * @param {domelement} elem  The element to unbind
 * @param {string} eventType The event to react to
 * @param {function} handler The function to detach
 */
function removeEventHandler(elem,eventType,handler) {
	if (elem.removeEventListener) 
		elem.removeEventListener (eventType,handler,false);
	if (elem.detachEvent)
		elem.detachEvent ('on'+eventType,handler); 
}