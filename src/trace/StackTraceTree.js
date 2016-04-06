//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import { Obj } from 'object-js';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
export default class StackTraceTree extends Obj {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    constructor() {

        super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {StackTrace}
         */
        this.rootTrace = null;
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {StackTrace}
     */
    getRootTrace() {
        return this.rootTrace;
    }

    /**
     * @param {StackTrace} rootTrace
     */
    setRootTrace(rootTrace) {
        this.rootTrace = rootTrace;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(StackTrace):StackTrace} func
     * @return {StackTrace}
     */
    findFirstTrace(func) {
        const rootTrace = this.getRootTrace();
        if (rootTrace) {
            return this.findRecursive(rootTrace, func);
        }
        return null;
    }


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {StackTrace} trace
     * @param {function(*)} func
     * @return {StackTrace}
     */
    findRecursive(trace, func) {
        const result = func(trace);
        if (result) {
            return trace;
        }
        const childTraces = trace.getChildTraces();
        for (let i = 0, size = childTraces.length; i < size; i++) {
            const childTrace = childTraces[i];
            const foundTrace = this.findRecursive(childTrace, func);
            if (foundTrace) {
                return foundTrace;
            }
        }
        return null;
    }
}
