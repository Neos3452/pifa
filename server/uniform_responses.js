/*jslint node:true */
"use strict";
var errorCodeMap = {
    0 : 'No error Error (this should not happen)',
    1001 : 'Incorrect parameters',
    9001 : 'Database error',
    // Everything else is an Unknown Error
};

module.exports.createSuccessResponse = function(value) {
    return value ? {
        result: 'success',
        data: value
    } : { result: 'success' };
};
module.exports.createErrorResponse = function(error, errorCode, errorMessage) {
    if (!errorMessage) {
        errorMessage = errorCodeMap[errorCode];
        if (!errorMessage) {
            errorMessage = 'Unknown Error';
        }
    }
    return {
        result: 'failure',
        errorCode: errorCode,
        errorMessage: errorMessage,
        errorObject: error,
    };
};
