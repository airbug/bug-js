//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Bug
} from '../core';
import {
    StackTraceUtil
} from '../util';


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Bug}
 */
export default class ArgumentBug extends Bug {

    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    static ILLEGAL = 'ArgumentBug:Illegal';


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {string} argName
     * @param {*} argValue
     * @param {string} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @private
     */
    constructor(type, argName, argValue, message, causes) {

        super(type, {}, message, causes);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.argName    = argName;

        /**
         * @private
         * @type {*}
         */
        this.argValue   = argValue;
    }


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getArgName() {
        return this.argName;
    }

    /**
     * @return {*}
     */
    getArgValue() {
        return this.argValue;
    }


    //-------------------------------------------------------------------------------
    // Throwable Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @return {string}
     */
    generateStackTrace() {
        return `${this.getMessage()}\n
            Argument '${this.argName}' was ${this.argValue}\n
            ${StackTraceUtil.generateStackTrace()}`;
    }
}
