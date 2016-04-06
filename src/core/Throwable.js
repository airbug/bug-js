//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Obj
} from 'object-js';
import _ from 'lodash';


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
export default class Throwable extends Obj {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {string=} message
     * @param {Array<(Throwable | Error)>=} causes
     * @param {*=} data
     */
    constructor(type, message, causes, data) {

        super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Array.<(Throwable | Error)>}
         */
        this.causes             = causes ? causes : [];

        /**
         * @private
         * @type {*}
         */
        this.data               = data;

        /**
         * @private
         * @type {string}
         */
        this.message            = _.isString(message) ? message : '';

        /**
         * @private
         * @type {StackTrace}
         */
        this.stackTrace         = null;

        /**
         * @private
         * @type {string}
         */
        this.type               = type;

        /**
         * @private
         * @type {string}
         */
        this._stack             = null;

        /**
         * @private
         * @type {boolean}
         */
        this.stackValid         = false;
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Array<(Throwable | Error)>}
     */
    getCauses() {
        return this.causes;
    }

    /**
     * @return {*}
     */
    getData() {
        return this.data;
    }

    /**
     * @param {*} data
     */
    setData(data) {
        this.data = data;
    }

    /**
     * @return {string}
     */
    getMessage() {
        return this.message;
    }

    /**
     * @param {string} message
     */
    setMessage(message) {
        this.message = message;
    }

    /**
     * @return {StackTrace}
     */
    getStackTrace() {
        return this.stackTrace;
    }

    /**
     * @param {StackTrace} stackTrace
     */
    setStackTrace(stackTrace) {
        this.stackTrace = stackTrace;
    }

    /**
     * @return {string}
     */
    getType() {
        return this.type;
    }

    get code() {
        return this.getType();
    }

    get stack() {
        if (!this.stackValid) {
            this.buildStack();
        }
        return this._stack;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(Throwable | Error)} cause
     */
    addCause(cause) {
        this.causes.push(cause);
        this.stackValid = false;
    }

    /**
     * @return {{
     *      causes: Array.<Throwable>,
     *      data: *,
     *      message: string,
     *      type: string
     *  }}
     */
    toObject() {
        return {
            causes: this.getCauses(),
            data: this.getData(),
            message: this.getMessage(),
            type: this.getType()
        };
    }

    /**
     * @return {string}
     */
    toString() {
        return '{' +
            'causes:'   + this.getCauses().join(',\n') + ',' +
            'data:'     + this.getData() + '\n' +
            'message:'  + this.getMessage() + '\n' +
            'type:'     + this.getType() + '\n' +
            '}';
    }


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    buildStack() {
        let stack = this.stackTrace + '\n';
        stack += '\n';
        if (this.causes.length > 0) {
            stack += this.type + ' was caused by ' + this.causes.length + ' exceptions:\n';
            let count = 0;
            this.causes.forEach((cause) => {
                count++;
                stack += this.type + ' cause ' + count + ':\n';
                stack += cause.message + '\n';
                stack += cause.stack;
            });
        }
        this._stack = stack;
        this.stackValid = true;
    }
}
