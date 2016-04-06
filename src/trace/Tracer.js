//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import { Obj } from 'object-js';
import _ from 'lodash';
import { Stack } from '../core';
import { StackUtil } from '../util';
import StackTrace from './StackTrace';
import StackTraceTree from './StackTraceTree';


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
export default class Tracer extends Obj {

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
        this.currentTrace   = new StackTrace(new Stack(), 'ROOT_TRACE');

        /**
         * @private
         * @type {StackTraceTree}
         */
        this.traceTree      = new StackTraceTree();

        this.traceTree.setRootTrace(this.currentTrace)
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {StackTrace}
     */
    getCurrentTrace() {
        return this.currentTrace;
    }

    /**
     * @param {StackTrace} currentTrace
     */
    setCurrentTrace(currentTrace) {
        this.currentTrace = currentTrace;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Throwable | Error} error
     * @return {Throwable | Error}
     */
    error(error) {
        if (_.isObject(error) && !error.__traced) {
            Object.defineProperty(error, '__traced', {
                value : true,
                writable : false,
                enumerable : false,
                configurable : false
            });
            const stackTrace    = this.generateStackTrace();
            error.stack         = stackTrace.toString();
        }
        return error;
    }

    /**
     * @param {string} name
     */
    name(name) {
        if (this.currentTrace) {
            this.currentTrace.setName(name);
        }
    }

    /**
     * @param {function(...):*} callback
     * @return {function}
     */
    callback(callback) {
        const _this = this;
        const trace = this.generateStackTrace();
        return function() {
            const error = _.first(arguments);
            if (error) {
                _this.error(error);
            }
            _this.currentTrace = trace;
            callback.apply(null, arguments);

            //NOTE BRN: If one async thread ends and a new one starts that we have not wrapped in our own trace callback
            //we do not want any new traces that the thread creates to attach to the previous current trace (since they
            //are unrelated). So, we reset the current trace to the root trace after the completion of every callback.

            _this.currentTrace = _this.traceTree.getRootTrace();
            _this.checkStackTraceForRemoval(trace);
        };
    }

    /**
     * @param {string} name
     * @return {string}
     */
    generateNamedTraceStack(name) {
        const firstNamedTrace = this.traceTree.findFirstTrace((trace) => {
            return (trace.getName() === name);
        });

        if (firstNamedTrace) {
            let currentTrace    = null;
            let nextTrace       = firstNamedTrace;
            while (nextTrace) {
                currentTrace = nextTrace;
                nextTrace    = null;
                if (currentTrace.numberChildTraces() > 0) {
                    const childTraces = currentTrace.getChildTraces();
                    for (let i = childTraces.length - 1; i >= 0; i--) {
                        const childTrace = childTraces[i];
                        if (childTrace.getName() === name) {
                            nextTrace = childTrace;
                            break;
                        }
                    }
                }
            }
            return this.generateTraceStack(currentTrace);
        }
        return '';
    }

    /**
     * @return {StackTrace}
     */
    generateStackTrace() {
        const stack     = StackUtil.generateStack();
        const trace     = new StackTrace(stack);
        this.addStackTrace(trace);
        return trace;
    }


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {StackTrace} trace
     */
    addStackTrace(trace) {
        let currentName = this.currentTrace.getName();
        if (currentName === 'ROOT_TRACE') {
            currentName = '';
        }
        trace.setName(currentName);
        this.currentTrace.addChildTrace(trace);
    }

    /**
     * @private
     * @param {StackTrace} trace
     */
    checkStackTraceForRemoval(trace) {
        //console.log('check trace - numberChildren:' + node.numberChildTraces() + ' Obj.equals(trace, this.traceTree.getRootTrace()):' + Obj.equals(trace, this.traceTree.getRootTrace()) + ' trace:' + trace);
        if (trace.numberChildTraces() === 0 && !Obj.equals(trace, this.traceTree.getRootTrace())) {
            if (trace.getRemoved()) {
                throw new Error('Trying to remove the same trace TWICE!');
            }
            const parentTrace = trace.getParentTrace();
            parentTrace.removeChildTrace(trace);
            trace.setRemoved(true);

            this.checkStackTraceForRemoval(parentTrace);
        }
    }
}
