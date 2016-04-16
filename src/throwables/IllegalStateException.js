//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import {
    Exception
} from '../core';


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Exception}
 */
export default class IllegalStateException extends Exception {

    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    static ILLEGAL_STATE = 'Exception:IllegalState';


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
}
