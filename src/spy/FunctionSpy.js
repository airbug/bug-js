//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Obj
} from 'object-js';


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
export default class FunctionSpy extends Obj {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {function(...):*} targetFunction
     */
    constructor(targetFunction) {

        super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...):*}
         */
        this.targetFunction     = targetFunction;
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...):*}
     */
    getTargetFunction() {
        return this.targetFunction;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {function(...):*}
     */
    spy() {
        const _this = this;
        const spy = function() {
            //TODO BRN: Record function call
            // track stacktrace, arguments,
            return _this.targetFunction.apply(this, arguments);
        };
        Object.defineProperty(spy, '__spy', {
            value : _this,
            writable : true,
            enumerable : false,
            configurable : false
        });
        // Proxy.proxy(spy, _this, [
        //     "getCallCount",
        //     "wasCalled",
        //     "wasNotCalled"
        // ]);
        return spy;
    }

    /**
     * @return {boolean}
     */
    wasCalled() {
        return this.functionCallList.getCount() > 0;
    }

    /**
     * @return {boolean}
     */
    wasNotCalled() {
        return this.functionCallList.getCount() === 0;
    }
}
