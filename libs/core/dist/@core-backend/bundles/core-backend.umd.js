(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('core-backend', ['exports'], factory) :
    (global = global || self, factory(global['core-backend'] = {}));
}(this, function (exports) { 'use strict';

    var Messages = {
        UNAUTHORIZED_INVALID_PASSWORD: 'Invalid password',
        UNAUTHORIZED_INVALID_EMAIL: 'The email does not exist',
        UNAUTHORIZED_UNRECOGNIZED_BEARER: 'Unrecognized bearer of the token'
    };

    exports.Messages = Messages;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=core-backend.umd.js.map
