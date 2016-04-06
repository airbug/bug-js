//-------------------------------------------------------------------------------
// Imports
//-------------------------------------------------------------------------------

import ErrorStackParser from 'error-stack-parser';
import StackGenerator from 'stack-generator';
import { Stack } from '../core';


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @class
 */
export default class StackUtil {

    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {Error}
     */
    static createException() {
        try {
            this.undef();
        } catch (error) {
            return error;
        }
    }

    /**
     * @static
     * @return {Stack}
     */
    static generateStack() {
        const error = StackUtil.createException();
        return StackUtil.parseError(error);
    }

    /**
     * @static
     * @param {Error} error
     * @return {Stack}
     */
    static parseError(error) {
        const frames = ErrorStackParser.parse(error);
        return new Stack(frames);
    }
}
