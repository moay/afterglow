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

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function loadYoutubeThumbnailUrl(id){

    var uri = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';

    return uri;

};