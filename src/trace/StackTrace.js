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
export default class StackTrace extends Obj {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Stack} stack
     * @param {string=} name
     */
    constructor(stack, name) {

        super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array<StackTrace>}
         */
        this.childTraces    = [];

        /**
         * @private
         * @type {string}
         */
        this.name           = name;

        /**
         * @private
         * @type {StackTrace}
         */
        this.parentTrace    = null;

        /**
         * @private
         * @type {boolean}
         */
        this.removed        = false;

        /**
         * @private
         * @type {Stack}
         */
        this.stack          = stack;
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<StackTrace>}
     */
    getChildTraces() {
        return this.childTraces;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @param {string} name
     */
    setName(name) {
        this.name = name;
    }

    /**
     * @return {StackTrace}
     */
    getParentTrace() {
        return this.parentTrace;
    }

    /**
     * @param {StackTrace} parentTrace
     */
    setParentTrace(parentTrace) {
        this.parentTrace = parentTrace;
    }

    /**
     * @return {boolean}
     */
    getRemoved() {
        return this.removed;
    }

    /**
     * @param {boolean} removed
     */
    setRemoved(removed) {
        this.removed = removed;
    }

    /**
     * @return {Stack}
     */
    getStack() {
        return this.stack;
    }

    /**
     * @param {Stack} stack
     */
    setStack(stack) {
        this.stack = stack;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {StackTrace} childTrace
     */
    addChildTrace(childTrace) {
        if (childTrace.hasParentTrace()) {
            childTrace.removeParentTrace();
        }
        this.childTraces.push(childTrace);
        childTrace.setParentTrace(this);
    }

    /**
     * @return {boolean}
     */
    hasParentTrace() {
        return !!this.parentTrace;
    }

    /**
     * @param {StackTrace} childTrace
     * @return {number}
     */
    indexOfChildTrace(childTrace) {
        for (let i = 0, size = this.childTraces.length; i < size; i++) {
            if (Obj.equals(this.childTraces[i], childTrace)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @return {number}
     */
    numberChildTraces() {
        return this.childTraces.length;
    }

    /**
     * @param {StackTrace} childTrace
     * @return {StackTrace}
     */
    removeChildTrace(childTrace) {
        if (Obj.equals(this, childTrace.getParentTrace())) {
            const childIndex = this.indexOfChildTrace(childTrace);
            if (childIndex > -1) {
                childTrace.setParentTrace(null);
                return this.childTraces.splice(childIndex, 1)[0];
            }
            throw new Error('CouldNotFindChildTrace');
        }
    }

    /**
     *
     */
    removeParentTrace() {
        this.parentTrace.removeChildTrace(this);
    }

    /**
     * @return {string}
     */
    toString() {
        let traceStack  = [];
        let trace       = this;
        let first       = true;
        while (trace && trace.getName() !== 'ROOT_TRACE') {
            if (!first) {
                traceStack.push('-------- Async Break ---------');
            } else {
                first = false;
            }
            const stack     = trace.getStack();
            traceStack      = traceStack.concat(stack.getFrames());
            trace           = trace.getParentTrace();
        }
        return traceStack.join('\n');
    }
}
