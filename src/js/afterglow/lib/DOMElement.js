'use strict';

class DOMElement{

	constructor(node){
		this.node = node;
	}

	/**
	 * Adds a given class to the DOM node if the node doesn't have it.
	 * @param {string} className
	 * @return {object} this - for method chaining
	 */
	addClass(className){
		if(this.node.classList) {
	        this.node.classList.add(className);
	    } else if (!this.hasClass(className)) {
	        this.node.className += ' ' + className;
	    }
	    return this;
	}

	/**
	 * Removes a given class from the DOM node if the node doesn't have it.
	 * @param {string} className
	 * @return {object} this - for method chaining
	 */
	removeClass(className){
	    if (this.node.classList) {
	        this.node.classList.remove(className);
	    } else {
	        var classes = this.node.className.split(" ");
	        classes.splice(classes.indexOf(className), 1);
	        this.node.className = classes.join(" ");
	    }
	    return this;
	}

	/**
	 * Will detect if the node does have the given className
	 * @param  {string}  className
	 * @return {Boolean}  
	 */
	hasClass(className){
		if (this.node.classList) {
	        return this.node.classList.contains(className);
	    } else {
	        return (-1 < this.node.className.indexOf(className));
	    }
	}

	/**
	 * IE8 compliant way of handling event bindings with the possibility to remove them lateron, with support for multiple events at once
	 * @param {string} eventType The events to react to
	 * @param {function} handler The function to execute
	 * @return {object} this - for method chaining
	 */
	bind(eventType,handler) {
	    var evts = eventType.split(' ');
	    for (var i=0, iLen=evts.length; i<iLen; i++) {
	    	if (this.node.addEventListener)
	    		this.node.addEventListener (evts[i],handler,false);
	    	else if (this.node.attachEvent)
	    		this.node.attachEvent ('on'+evts[i],handler);
	    } 
	    return this;
	}

	/**
	 * IE8 compliant way of handling removing event bindings which were added before
	 * @param {string} eventType The events to react to
	 * @param {function} handler The function to detach
	 * @return {object} this - for method chaining
	 */
	unbind(eventType,handler) {
	    var evts = eventType.split(' ');
	    for (var i=0, iLen=evts.length; i<iLen; i++) {
	    	if (this.node.removeEventListener) 
	    		this.node.removeEventListener (evts[i],handler,false);
	    	if (this.node.detachEvent)
	    		this.node.detachEvent ('on'+evts[i],handler); 
	    }
	    return this;
	}

	/**
	 * Appends another DOMElement to the current one
	 * @param  {DOMElement object} element 
	 * @param  {string} name       The accessor for the new element
	 * @return void
	 */
	appendDomElement(element, name){
		this[name] = element;
		this.appendChild(element.node);
	}

	/** PROXY METHODS */

	getAttribute(input){
		return this.node.getAttribute(input);
	}
	setAttribute(key, value){
		return this.node.setAttribute(key, value);
	}
	hasAttribute(input){
		return this.node.hasAttribute(input);
	}
	removeAttribute(key){
		return this.node.removeAttribute(key);
	}
	cloneNode(deep = false){
		return this.node.cloneNode(deep);
	}
	appendChild(node){
		this.node.appendChild(node);
	}

}

export default DOMElement;