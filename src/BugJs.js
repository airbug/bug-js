//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import _ from 'lodash';
import {
    Bug,
    Error,
    Exception
} from './core';
import {
    Expectation
} from './expectations';
import {
    FunctionSpy,
    ObjectSpy
} from './spy';
import {
    AbstractMethodBug,
    ArgumentBug
} from './throwables';
import {
    Tracer
} from './trace';


//-------------------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------------------

const singleton             = Symbol();
const singletonEnforcer     = Symbol();


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 */
export default class BugJs {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    constructor(enforcer) {

        if (enforcer != singletonEnforcer) {
            throw new Error('CannotConstructSingleton');
        }

        /**
         * @private
         * @type {boolean}
         */
        this.enabled    = true;

        /**
         * @private
         * @type {Tracer}
         */
        this.tracer     = new Tracer();
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getEnabled() {
        return this.enabled;
    }

    /**
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * @return {Tracer}
     */
    getTracer() {
        return this.tracer;
    }


    //-------------------------------------------------------------------------------
    // Static Getters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugJs}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new BugJs(singletonEnforcer);
        }
        return this[singleton];
    }


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

     /**
     * @static
     * @param {string} methodName
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {AbstractMethodBug}
     */
    static abstractMethodNotImplemented(methodName, causes) {
        return new AbstractMethodBug(AbstractMethodBug.NOT_IMPLEMENTED, methodName,
            `Abstract method ${methodName} has not been implemented`, causes);
    }

    /**
     * @static
     * @param {string} type
     * @param {string=} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @param {*=} data
     * @return {Bug}
     */
    static bug(type, message, causes, data) {
        const bug = new Bug(type, message, causes, data);
        bug.setStackTrace(BugJs.instance.getTracer().generateStackTrace());
        return bug;
    }

    /**
     * @param {function(...):*} callback
     * @return {function}
     */
    static callback(callback) {
        if (BugJs.instance.getEnabled()) {
            return BugJs.instance.getTracer().callback(callback);
        }
        return callback;
    }

    /**
     * @static
     */
    static disableAsync() {
        BugJs.instance.setEnabled(false);
    }

    /**
     * @static
     */
    static enableAsync() {
        BugJs.instance.setEnabled(true);
    }

    /**
     * @static
     * @param {string} type
     * @param {string=} message
     * @param {Array<(Throwable | Error)>=} causes
     * @param {*=} data
     * @return {Error}
     */
    static error(type, message, causes, data) {
        const error = new Error(type, message, causes, data);
        error.setStackTrace(BugJs.instance.getTracer().generateStackTrace());
        return error;
    }

    /**
     * @static
     * @param {string} type
     * @param {string=} message
     * @param {Array<(Throwable | Error)>=} causes
     * @param {*=} data
     * @return {Exception}
     */
    static exception(type, message, causes, data) {
        const exception = new Exception(type, message, causes, data);
        exception.setStackTrace(BugJs.instance.getTracer().generateStackTrace());
        return exception;
    }

    /**
     * @static
     * @param {*} value
     * @return {Expectation}
     */
    static expect(value) {
        return new Expectation(value);
    }

    /**
     * @static
     * @param {string} argName
     * @param {*} argValue
     * @param {string} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {ArgumentBug}
     */
    static illegalArgument(argName, argValue, message, causes) {
        const bug = new ArgumentBug(ArgumentBug.ILLEGAL, argName, argValue, message, causes);
        bug.setStackTrace(BugJs.instance.getTracer().generateStackTrace());
        return bug;
    }

    /**
     * @static
     * @param {string} name
     */
    static nameTrace(name) {
        if (BugJs.instance.getEnabled()) {
            BugJs.instance.getTracer().name(name);
        }
    }

    /**
     * @static
     * @param {*} target
     * @return {function(...):*}
     */
    static spy(target) {
        if (_.isFunction(target)) {
            return (new FunctionSpy(target).spy();
        } else if (_.isObject(target)) {
            return (new ObjectSpy(target)).spy();
        }
        return target;
    }

    /**
     * @static
     * @param {Error} error
     * @return {Error}
     */
    static traceError(error) {
        if (BugJs.instance.getEnabled()) {
            BugJs.instance.getTracer().error(error);
        }
        return error;
    }
}
