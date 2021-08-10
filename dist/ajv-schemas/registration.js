'use strict';
var equal = require('ajv/lib/compile/equal');
var validate = (function () {
    var refVal = [];
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
        'use strict';
        var vErrors = null;
        var errors = 0;
        if (rootData === undefined) {
            rootData = data;
        }
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            if (true) {
                var errs__0 = errors;
                var valid1 = true;
                var data1 = data.authorization_endpoint;
                if (data1 === undefined) {
                    valid1 = false;
                    validate.errors = [
                        {
                            keyword: 'required',
                            dataPath: (dataPath || '') + '',
                            schemaPath: '#/required',
                            params: {
                                missingProperty: 'authorization_endpoint',
                            },
                            message: "should have required property 'authorization_endpoint'",
                        },
                    ];
                    return false;
                }
                else {
                    var errs_1 = errors;
                    if (typeof data1 !== 'string') {
                        validate.errors = [
                            {
                                keyword: 'type',
                                dataPath: (dataPath || '') + '.authorization_endpoint',
                                schemaPath: '#/properties/authorization_endpoint/type',
                                params: {
                                    type: 'string',
                                },
                                message: 'should be string',
                            },
                        ];
                        return false;
                    }
                    var schema1 = validate.schema.properties.authorization_endpoint.enum;
                    var valid1;
                    valid1 = false;
                    for (var i1 = 0; i1 < schema1.length; i1++) {
                        if (equal(data1, schema1[i1])) {
                            valid1 = true;
                            break;
                        }
                    }
                    if (!valid1) {
                        validate.errors = [
                            {
                                keyword: 'enum',
                                dataPath: (dataPath || '') + '.authorization_endpoint',
                                schemaPath: '#/properties/authorization_endpoint/enum',
                                params: {
                                    allowedValues: schema1,
                                },
                                message: 'should be equal to one of the allowed values',
                            },
                        ];
                        return false;
                    }
                    else {
                    }
                    if (errors === errs_1) {
                    }
                    var valid1 = errors === errs_1;
                }
                if (valid1) {
                    var data1 = data.credential_formats_supported;
                    if (data1 === undefined) {
                        valid1 = false;
                        validate.errors = [
                            {
                                keyword: 'required',
                                dataPath: (dataPath || '') + '',
                                schemaPath: '#/required',
                                params: {
                                    missingProperty: 'credential_formats_supported',
                                },
                                message: "should have required property 'credential_formats_supported'",
                            },
                        ];
                        return false;
                    }
                    else {
                        var errs_1 = errors;
                        if (Array.isArray(data1)) {
                            var errs__1 = errors;
                            var valid1;
                            for (var i1 = 0; i1 < data1.length; i1++) {
                                var data2 = data1[i1];
                                var errs_2 = errors;
                                if (typeof data2 !== 'string') {
                                    validate.errors = [
                                        {
                                            keyword: 'type',
                                            dataPath: (dataPath || '') +
                                                '.credential_formats_supported[' +
                                                i1 +
                                                ']',
                                            schemaPath: '#/properties/credential_formats_supported/items/type',
                                            params: {
                                                type: 'string',
                                            },
                                            message: 'should be string',
                                        },
                                    ];
                                    return false;
                                }
                                var schema2 = validate.schema.properties.credential_formats_supported.items
                                    .enum;
                                var valid2;
                                valid2 = false;
                                for (var i2 = 0; i2 < schema2.length; i2++) {
                                    if (equal(data2, schema2[i2])) {
                                        valid2 = true;
                                        break;
                                    }
                                }
                                if (!valid2) {
                                    validate.errors = [
                                        {
                                            keyword: 'enum',
                                            dataPath: (dataPath || '') +
                                                '.credential_formats_supported[' +
                                                i1 +
                                                ']',
                                            schemaPath: '#/properties/credential_formats_supported/items/enum',
                                            params: {
                                                allowedValues: schema2,
                                            },
                                            message: 'should be equal to one of the allowed values',
                                        },
                                    ];
                                    return false;
                                }
                                else {
                                }
                                if (errors === errs_2) {
                                }
                                var valid2 = errors === errs_2;
                                if (!valid2) {
                                    break;
                                }
                            }
                            if (errs__1 == errors) {
                            }
                        }
                        else {
                            validate.errors = [
                                {
                                    keyword: 'type',
                                    dataPath: (dataPath || '') + '.credential_formats_supported',
                                    schemaPath: '#/properties/credential_formats_supported/type',
                                    params: {
                                        type: 'array',
                                    },
                                    message: 'should be array',
                                },
                            ];
                            return false;
                        }
                        if (errors === errs_1) {
                        }
                        var valid1 = errors === errs_1;
                    }
                    if (valid1) {
                        if (data.did === undefined) {
                            valid1 = true;
                        }
                        else {
                            var errs_1 = errors;
                            if (typeof data.did !== 'string') {
                                validate.errors = [
                                    {
                                        keyword: 'type',
                                        dataPath: (dataPath || '') + '.did',
                                        schemaPath: '#/properties/did/type',
                                        params: {
                                            type: 'string',
                                        },
                                        message: 'should be string',
                                    },
                                ];
                                return false;
                            }
                            var valid1 = errors === errs_1;
                        }
                        if (valid1) {
                            var data1 = data.did_methods_supported;
                            if (data1 === undefined) {
                                valid1 = true;
                            }
                            else {
                                var errs_1 = errors;
                                if (Array.isArray(data1)) {
                                    var errs__1 = errors;
                                    var valid1;
                                    for (var i1 = 0; i1 < data1.length; i1++) {
                                        var errs_2 = errors;
                                        if (typeof data1[i1] !== 'string') {
                                            validate.errors = [
                                                {
                                                    keyword: 'type',
                                                    dataPath: (dataPath || '') +
                                                        '.did_methods_supported[' +
                                                        i1 +
                                                        ']',
                                                    schemaPath: '#/properties/did_methods_supported/items/type',
                                                    params: {
                                                        type: 'string',
                                                    },
                                                    message: 'should be string',
                                                },
                                            ];
                                            return false;
                                        }
                                        var valid2 = errors === errs_2;
                                        if (!valid2) {
                                            break;
                                        }
                                    }
                                    if (errs__1 == errors) {
                                    }
                                }
                                else {
                                    validate.errors = [
                                        {
                                            keyword: 'type',
                                            dataPath: (dataPath || '') + '.did_methods_supported',
                                            schemaPath: '#/properties/did_methods_supported/type',
                                            params: {
                                                type: 'array',
                                            },
                                            message: 'should be array',
                                        },
                                    ];
                                    return false;
                                }
                                if (errors === errs_1) {
                                }
                                var valid1 = errors === errs_1;
                            }
                            if (valid1) {
                                if (data.id_token_encrypted_response_alg === undefined) {
                                    valid1 = true;
                                }
                                else {
                                    var errs_1 = errors;
                                    if (typeof data.id_token_encrypted_response_alg !== 'string') {
                                        validate.errors = [
                                            {
                                                keyword: 'type',
                                                dataPath: (dataPath || '') + '.id_token_encrypted_response_alg',
                                                schemaPath: '#/properties/id_token_encrypted_response_alg/type',
                                                params: {
                                                    type: 'string',
                                                },
                                                message: 'should be string',
                                            },
                                        ];
                                        return false;
                                    }
                                    var valid1 = errors === errs_1;
                                }
                                if (valid1) {
                                    if (data.id_token_encrypted_response_enc === undefined) {
                                        valid1 = true;
                                    }
                                    else {
                                        var errs_1 = errors;
                                        if (typeof data.id_token_encrypted_response_enc !== 'string') {
                                            validate.errors = [
                                                {
                                                    keyword: 'type',
                                                    dataPath: (dataPath || '') +
                                                        '.id_token_encrypted_response_enc',
                                                    schemaPath: '#/properties/id_token_encrypted_response_enc/type',
                                                    params: {
                                                        type: 'string',
                                                    },
                                                    message: 'should be string',
                                                },
                                            ];
                                            return false;
                                        }
                                        var valid1 = errors === errs_1;
                                    }
                                    if (valid1) {
                                        var data1 = data.id_token_signing_alg_values_supported;
                                        if (data1 === undefined) {
                                            valid1 = false;
                                            validate.errors = [
                                                {
                                                    keyword: 'required',
                                                    dataPath: (dataPath || '') + '',
                                                    schemaPath: '#/required',
                                                    params: {
                                                        missingProperty: 'id_token_signing_alg_values_supported',
                                                    },
                                                    message: "should have required property 'id_token_signing_alg_values_supported'",
                                                },
                                            ];
                                            return false;
                                        }
                                        else {
                                            var errs_1 = errors;
                                            if (Array.isArray(data1)) {
                                                var errs__1 = errors;
                                                var valid1;
                                                for (var i1 = 0; i1 < data1.length; i1++) {
                                                    var data2 = data1[i1];
                                                    var errs_2 = errors;
                                                    if (typeof data2 !== 'string') {
                                                        validate.errors = [
                                                            {
                                                                keyword: 'type',
                                                                dataPath: (dataPath || '') +
                                                                    '.id_token_signing_alg_values_supported[' +
                                                                    i1 +
                                                                    ']',
                                                                schemaPath: '#/properties/id_token_signing_alg_values_supported/items/type',
                                                                params: {
                                                                    type: 'string',
                                                                },
                                                                message: 'should be string',
                                                            },
                                                        ];
                                                        return false;
                                                    }
                                                    var schema2 = validate.schema.properties
                                                        .id_token_signing_alg_values_supported.items.enum;
                                                    var valid2;
                                                    valid2 = false;
                                                    for (var i2 = 0; i2 < schema2.length; i2++) {
                                                        if (equal(data2, schema2[i2])) {
                                                            valid2 = true;
                                                            break;
                                                        }
                                                    }
                                                    if (!valid2) {
                                                        validate.errors = [
                                                            {
                                                                keyword: 'enum',
                                                                dataPath: (dataPath || '') +
                                                                    '.id_token_signing_alg_values_supported[' +
                                                                    i1 +
                                                                    ']',
                                                                schemaPath: '#/properties/id_token_signing_alg_values_supported/items/enum',
                                                                params: {
                                                                    allowedValues: schema2,
                                                                },
                                                                message: 'should be equal to one of the allowed values',
                                                            },
                                                        ];
                                                        return false;
                                                    }
                                                    else {
                                                    }
                                                    if (errors === errs_2) {
                                                    }
                                                    var valid2 = errors === errs_2;
                                                    if (!valid2) {
                                                        break;
                                                    }
                                                }
                                                if (errs__1 == errors) {
                                                }
                                            }
                                            else {
                                                validate.errors = [
                                                    {
                                                        keyword: 'type',
                                                        dataPath: (dataPath || '') +
                                                            '.id_token_signing_alg_values_supported',
                                                        schemaPath: '#/properties/id_token_signing_alg_values_supported/type',
                                                        params: {
                                                            type: 'array',
                                                        },
                                                        message: 'should be array',
                                                    },
                                                ];
                                                return false;
                                            }
                                            if (errors === errs_1) {
                                            }
                                            var valid1 = errors === errs_1;
                                        }
                                        if (valid1) {
                                            var data1 = data.issuer;
                                            if (data1 === undefined) {
                                                valid1 = false;
                                                validate.errors = [
                                                    {
                                                        keyword: 'required',
                                                        dataPath: (dataPath || '') + '',
                                                        schemaPath: '#/required',
                                                        params: {
                                                            missingProperty: 'issuer',
                                                        },
                                                        message: "should have required property 'issuer'",
                                                    },
                                                ];
                                                return false;
                                            }
                                            else {
                                                var errs_1 = errors;
                                                if (typeof data1 !== 'string') {
                                                    validate.errors = [
                                                        {
                                                            keyword: 'type',
                                                            dataPath: (dataPath || '') + '.issuer',
                                                            schemaPath: '#/properties/issuer/type',
                                                            params: {
                                                                type: 'string',
                                                            },
                                                            message: 'should be string',
                                                        },
                                                    ];
                                                    return false;
                                                }
                                                var schema1 = validate.schema.properties.issuer.enum;
                                                var valid1;
                                                valid1 = false;
                                                for (var i1 = 0; i1 < schema1.length; i1++) {
                                                    if (equal(data1, schema1[i1])) {
                                                        valid1 = true;
                                                        break;
                                                    }
                                                }
                                                if (!valid1) {
                                                    validate.errors = [
                                                        {
                                                            keyword: 'enum',
                                                            dataPath: (dataPath || '') + '.issuer',
                                                            schemaPath: '#/properties/issuer/enum',
                                                            params: {
                                                                allowedValues: schema1,
                                                            },
                                                            message: 'should be equal to one of the allowed values',
                                                        },
                                                    ];
                                                    return false;
                                                }
                                                else {
                                                }
                                                if (errors === errs_1) {
                                                }
                                                var valid1 = errors === errs_1;
                                            }
                                            if (valid1) {
                                                if (valid1) {
                                                    if (data.jwks_uri === undefined) {
                                                        valid1 = true;
                                                    }
                                                    else {
                                                        var errs_1 = errors;
                                                        if (typeof data.jwks_uri !== 'string') {
                                                            validate.errors = [
                                                                {
                                                                    keyword: 'type',
                                                                    dataPath: (dataPath || '') + '.jwks_uri',
                                                                    schemaPath: '#/properties/jwks_uri/type',
                                                                    params: {
                                                                        type: 'string',
                                                                    },
                                                                    message: 'should be string',
                                                                },
                                                            ];
                                                            return false;
                                                        }
                                                        var valid1 = errors === errs_1;
                                                    }
                                                    if (valid1) {
                                                        if (data.logo_uri === undefined) {
                                                            valid1 = true;
                                                        }
                                                        else {
                                                            var errs_1 = errors;
                                                            if (typeof data.logo_uri !== 'string') {
                                                                validate.errors = [
                                                                    {
                                                                        keyword: 'type',
                                                                        dataPath: (dataPath || '') + '.logo_uri',
                                                                        schemaPath: '#/properties/logo_uri/type',
                                                                        params: {
                                                                            type: 'string',
                                                                        },
                                                                        message: 'should be string',
                                                                    },
                                                                ];
                                                                return false;
                                                            }
                                                            var valid1 = errors === errs_1;
                                                        }
                                                        if (valid1) {
                                                            if (data.policy_uri === undefined) {
                                                                valid1 = true;
                                                            }
                                                            else {
                                                                var errs_1 = errors;
                                                                if (typeof data.policy_uri !== 'string') {
                                                                    validate.errors = [
                                                                        {
                                                                            keyword: 'type',
                                                                            dataPath: (dataPath || '') + '.policy_uri',
                                                                            schemaPath: '#/properties/policy_uri/type',
                                                                            params: {
                                                                                type: 'string',
                                                                            },
                                                                            message: 'should be string',
                                                                        },
                                                                    ];
                                                                    return false;
                                                                }
                                                                var valid1 = errors === errs_1;
                                                            }
                                                            if (valid1) {
                                                                var data1 = data.redirect_uris;
                                                                if (data1 === undefined) {
                                                                    valid1 = true;
                                                                }
                                                                else {
                                                                    var errs_1 = errors;
                                                                    if (Array.isArray(data1)) {
                                                                        var errs__1 = errors;
                                                                        var valid1;
                                                                        for (var i1 = 0; i1 < data1.length; i1++) {
                                                                            var errs_2 = errors;
                                                                            if (typeof data1[i1] !== 'string') {
                                                                                validate.errors = [
                                                                                    {
                                                                                        keyword: 'type',
                                                                                        dataPath: (dataPath || '') +
                                                                                            '.redirect_uris[' +
                                                                                            i1 +
                                                                                            ']',
                                                                                        schemaPath: '#/properties/redirect_uris/items/type',
                                                                                        params: {
                                                                                            type: 'string',
                                                                                        },
                                                                                        message: 'should be string',
                                                                                    },
                                                                                ];
                                                                                return false;
                                                                            }
                                                                            var valid2 = errors === errs_2;
                                                                            if (!valid2) {
                                                                                break;
                                                                            }
                                                                        }
                                                                        if (errs__1 == errors) {
                                                                        }
                                                                    }
                                                                    else {
                                                                        validate.errors = [
                                                                            {
                                                                                keyword: 'type',
                                                                                dataPath: (dataPath || '') + '.redirect_uris',
                                                                                schemaPath: '#/properties/redirect_uris/type',
                                                                                params: {
                                                                                    type: 'array',
                                                                                },
                                                                                message: 'should be array',
                                                                            },
                                                                        ];
                                                                        return false;
                                                                    }
                                                                    if (errors === errs_1) {
                                                                    }
                                                                    var valid1 = errors === errs_1;
                                                                }
                                                                if (valid1) {
                                                                    var data1 = data.request_object_signing_alg_values_supported;
                                                                    if (data1 === undefined) {
                                                                        valid1 = false;
                                                                        validate.errors = [
                                                                            {
                                                                                keyword: 'required',
                                                                                dataPath: (dataPath || '') + '',
                                                                                schemaPath: '#/required',
                                                                                params: {
                                                                                    missingProperty: 'request_object_signing_alg_values_supported',
                                                                                },
                                                                                message: "should have required property 'request_object_signing_alg_values_supported'",
                                                                            },
                                                                        ];
                                                                        return false;
                                                                    }
                                                                    else {
                                                                        var errs_1 = errors;
                                                                        if (Array.isArray(data1)) {
                                                                            var errs__1 = errors;
                                                                            var valid1;
                                                                            for (var i1 = 0; i1 < data1.length; i1++) {
                                                                                var data2 = data1[i1];
                                                                                var errs_2 = errors;
                                                                                if (typeof data2 !== 'string') {
                                                                                    validate.errors = [
                                                                                        {
                                                                                            keyword: 'type',
                                                                                            dataPath: (dataPath || '') +
                                                                                                '.request_object_signing_alg_values_supported[' +
                                                                                                i1 +
                                                                                                ']',
                                                                                            schemaPath: '#/properties/request_object_signing_alg_values_supported/items/type',
                                                                                            params: {
                                                                                                type: 'string',
                                                                                            },
                                                                                            message: 'should be string',
                                                                                        },
                                                                                    ];
                                                                                    return false;
                                                                                }
                                                                                var schema2 = validate.schema.properties
                                                                                    .request_object_signing_alg_values_supported
                                                                                    .items.enum;
                                                                                var valid2;
                                                                                valid2 = false;
                                                                                for (var i2 = 0; i2 < schema2.length; i2++) {
                                                                                    if (equal(data2, schema2[i2])) {
                                                                                        valid2 = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                                if (!valid2) {
                                                                                    validate.errors = [
                                                                                        {
                                                                                            keyword: 'enum',
                                                                                            dataPath: (dataPath || '') +
                                                                                                '.request_object_signing_alg_values_supported[' +
                                                                                                i1 +
                                                                                                ']',
                                                                                            schemaPath: '#/properties/request_object_signing_alg_values_supported/items/enum',
                                                                                            params: {
                                                                                                allowedValues: schema2,
                                                                                            },
                                                                                            message: 'should be equal to one of the allowed values',
                                                                                        },
                                                                                    ];
                                                                                    return false;
                                                                                }
                                                                                else {
                                                                                }
                                                                                if (errors === errs_2) {
                                                                                }
                                                                                var valid2 = errors === errs_2;
                                                                                if (!valid2) {
                                                                                    break;
                                                                                }
                                                                            }
                                                                            if (errs__1 == errors) {
                                                                            }
                                                                        }
                                                                        else {
                                                                            validate.errors = [
                                                                                {
                                                                                    keyword: 'type',
                                                                                    dataPath: (dataPath || '') +
                                                                                        '.request_object_signing_alg_values_supported',
                                                                                    schemaPath: '#/properties/request_object_signing_alg_values_supported/type',
                                                                                    params: {
                                                                                        type: 'array',
                                                                                    },
                                                                                    message: 'should be array',
                                                                                },
                                                                            ];
                                                                            return false;
                                                                        }
                                                                        if (errors === errs_1) {
                                                                        }
                                                                        var valid1 = errors === errs_1;
                                                                    }
                                                                    if (valid1) {
                                                                        var data1 = data.response_types_supported;
                                                                        if (data1 === undefined) {
                                                                            valid1 = false;
                                                                            validate.errors = [
                                                                                {
                                                                                    keyword: 'required',
                                                                                    dataPath: (dataPath || '') + '',
                                                                                    schemaPath: '#/required',
                                                                                    params: {
                                                                                        missingProperty: 'response_types_supported',
                                                                                    },
                                                                                    message: "should have required property 'response_types_supported'",
                                                                                },
                                                                            ];
                                                                            return false;
                                                                        }
                                                                        else {
                                                                            var errs_1 = errors;
                                                                            if (Array.isArray(data1)) {
                                                                                if (data1.length < 1) {
                                                                                    validate.errors = [
                                                                                        {
                                                                                            keyword: 'minItems',
                                                                                            dataPath: (dataPath || '') +
                                                                                                '.response_types_supported',
                                                                                            schemaPath: '#/properties/response_types_supported/minItems',
                                                                                            params: {
                                                                                                limit: 1,
                                                                                            },
                                                                                            message: 'should NOT have fewer than 1 items',
                                                                                        },
                                                                                    ];
                                                                                    return false;
                                                                                }
                                                                                else {
                                                                                    var errs__1 = errors;
                                                                                    var valid1;
                                                                                    valid2 = true;
                                                                                    if (data1.length > 0) {
                                                                                        var data2 = data1[0];
                                                                                        var errs_2 = errors;
                                                                                        if (typeof data2 !== 'string') {
                                                                                            validate.errors = [
                                                                                                {
                                                                                                    keyword: 'type',
                                                                                                    dataPath: (dataPath || '') +
                                                                                                        '.response_types_supported[' +
                                                                                                        0 +
                                                                                                        ']',
                                                                                                    schemaPath: '#/properties/response_types_supported/items/0/type',
                                                                                                    params: {
                                                                                                        type: 'string',
                                                                                                    },
                                                                                                    message: 'should be string',
                                                                                                },
                                                                                            ];
                                                                                            return false;
                                                                                        }
                                                                                        var schema2 = validate.schema.properties
                                                                                            .response_types_supported
                                                                                            .items[0].enum;
                                                                                        var valid2;
                                                                                        valid2 = false;
                                                                                        for (var i2 = 0; i2 < schema2.length; i2++) {
                                                                                            if (equal(data2, schema2[i2])) {
                                                                                                valid2 = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (!valid2) {
                                                                                            validate.errors = [
                                                                                                {
                                                                                                    keyword: 'enum',
                                                                                                    dataPath: (dataPath || '') +
                                                                                                        '.response_types_supported[' +
                                                                                                        0 +
                                                                                                        ']',
                                                                                                    schemaPath: '#/properties/response_types_supported/items/0/enum',
                                                                                                    params: {
                                                                                                        allowedValues: schema2,
                                                                                                    },
                                                                                                    message: 'should be equal to one of the allowed values',
                                                                                                },
                                                                                            ];
                                                                                            return false;
                                                                                        }
                                                                                        else {
                                                                                        }
                                                                                        if (errors === errs_2) {
                                                                                        }
                                                                                        var valid2 = errors === errs_2;
                                                                                    }
                                                                                    if (valid2) {
                                                                                        valid2 = true;
                                                                                        if (data1.length > 1) {
                                                                                            for (var i1 = 1; i1 < data1.length; i1++) {
                                                                                                var data2 = data1[i1];
                                                                                                var errs_2 = errors;
                                                                                                var errs__2 = errors;
                                                                                                var valid2 = false;
                                                                                                var errs_3 = errors;
                                                                                                if (typeof data2 !== 'string') {
                                                                                                    var err = {
                                                                                                        keyword: 'type',
                                                                                                        dataPath: (dataPath || '') +
                                                                                                            '.response_types_supported[' +
                                                                                                            i1 +
                                                                                                            ']',
                                                                                                        schemaPath: '#/properties/response_types_supported/additionalItems/anyOf/0/type',
                                                                                                        params: {
                                                                                                            type: 'string',
                                                                                                        },
                                                                                                        message: 'should be string',
                                                                                                    };
                                                                                                    if (vErrors === null) {
                                                                                                        vErrors = [err];
                                                                                                    }
                                                                                                    else {
                                                                                                        vErrors.push(err);
                                                                                                    }
                                                                                                    errors++;
                                                                                                }
                                                                                                var schema3 = validate.schema.properties
                                                                                                    .response_types_supported
                                                                                                    .additionalItems.anyOf[0]
                                                                                                    .enum;
                                                                                                var valid3;
                                                                                                valid3 = false;
                                                                                                for (var i3 = 0; i3 < schema3.length; i3++) {
                                                                                                    if (equal(data2, schema3[i3])) {
                                                                                                        valid3 = true;
                                                                                                        break;
                                                                                                    }
                                                                                                }
                                                                                                if (!valid3) {
                                                                                                    var err = {
                                                                                                        keyword: 'enum',
                                                                                                        dataPath: (dataPath || '') +
                                                                                                            '.response_types_supported[' +
                                                                                                            i1 +
                                                                                                            ']',
                                                                                                        schemaPath: '#/properties/response_types_supported/additionalItems/anyOf/0/enum',
                                                                                                        params: {
                                                                                                            allowedValues: schema3,
                                                                                                        },
                                                                                                        message: 'should be equal to one of the allowed values',
                                                                                                    };
                                                                                                    if (vErrors === null) {
                                                                                                        vErrors = [err];
                                                                                                    }
                                                                                                    else {
                                                                                                        vErrors.push(err);
                                                                                                    }
                                                                                                    errors++;
                                                                                                }
                                                                                                else {
                                                                                                }
                                                                                                if (errors === errs_3) {
                                                                                                }
                                                                                                var valid3 = errors === errs_3;
                                                                                                valid2 = valid2 || valid3;
                                                                                                if (!valid2) {
                                                                                                }
                                                                                                if (!valid2) {
                                                                                                    var err = {
                                                                                                        keyword: 'anyOf',
                                                                                                        dataPath: (dataPath || '') +
                                                                                                            '.response_types_supported[' +
                                                                                                            i1 +
                                                                                                            ']',
                                                                                                        schemaPath: '#/properties/response_types_supported/additionalItems/anyOf',
                                                                                                        params: {},
                                                                                                        message: 'should match some schema in anyOf',
                                                                                                    };
                                                                                                    if (vErrors === null) {
                                                                                                        vErrors = [err];
                                                                                                    }
                                                                                                    else {
                                                                                                        vErrors.push(err);
                                                                                                    }
                                                                                                    errors++;
                                                                                                    validate.errors = vErrors;
                                                                                                    return false;
                                                                                                }
                                                                                                else {
                                                                                                    errors = errs__2;
                                                                                                    if (vErrors !== null) {
                                                                                                        if (errs__2) {
                                                                                                            vErrors.length = errs__2;
                                                                                                        }
                                                                                                        else {
                                                                                                            vErrors = null;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                                if (errors === errs_2) {
                                                                                                }
                                                                                                var valid2 = errors === errs_2;
                                                                                                if (!valid2) {
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        if (valid2) {
                                                                                        }
                                                                                    }
                                                                                    if (errs__1 == errors) {
                                                                                    }
                                                                                }
                                                                            }
                                                                            else {
                                                                                validate.errors = [
                                                                                    {
                                                                                        keyword: 'type',
                                                                                        dataPath: (dataPath || '') +
                                                                                            '.response_types_supported',
                                                                                        schemaPath: '#/properties/response_types_supported/type',
                                                                                        params: {
                                                                                            type: 'array',
                                                                                        },
                                                                                        message: 'should be array',
                                                                                    },
                                                                                ];
                                                                                return false;
                                                                            }
                                                                            if (errors === errs_1) {
                                                                            }
                                                                            var valid1 = errors === errs_1;
                                                                        }
                                                                        if (valid1) {
                                                                            var data1 = data.scopes_supported;
                                                                            if (data1 === undefined) {
                                                                                valid1 = false;
                                                                                validate.errors = [
                                                                                    {
                                                                                        keyword: 'required',
                                                                                        dataPath: (dataPath || '') + '',
                                                                                        schemaPath: '#/required',
                                                                                        params: {
                                                                                            missingProperty: 'scopes_supported',
                                                                                        },
                                                                                        message: "should have required property 'scopes_supported'",
                                                                                    },
                                                                                ];
                                                                                return false;
                                                                            }
                                                                            else {
                                                                                var errs_1 = errors;
                                                                                if (Array.isArray(data1)) {
                                                                                    var errs__1 = errors;
                                                                                    var valid1;
                                                                                    for (var i1 = 0; i1 < data1.length; i1++) {
                                                                                        var data2 = data1[i1];
                                                                                        var errs_2 = errors;
                                                                                        if (typeof data2 !== 'string') {
                                                                                            validate.errors = [
                                                                                                {
                                                                                                    keyword: 'type',
                                                                                                    dataPath: (dataPath || '') +
                                                                                                        '.scopes_supported[' +
                                                                                                        i1 +
                                                                                                        ']',
                                                                                                    schemaPath: '#/properties/scopes_supported/items/type',
                                                                                                    params: {
                                                                                                        type: 'string',
                                                                                                    },
                                                                                                    message: 'should be string',
                                                                                                },
                                                                                            ];
                                                                                            return false;
                                                                                        }
                                                                                        var schema2 = validate.schema.properties
                                                                                            .scopes_supported.items.enum;
                                                                                        var valid2;
                                                                                        valid2 = false;
                                                                                        for (var i2 = 0; i2 < schema2.length; i2++) {
                                                                                            if (equal(data2, schema2[i2])) {
                                                                                                valid2 = true;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (!valid2) {
                                                                                            validate.errors = [
                                                                                                {
                                                                                                    keyword: 'enum',
                                                                                                    dataPath: (dataPath || '') +
                                                                                                        '.scopes_supported[' +
                                                                                                        i1 +
                                                                                                        ']',
                                                                                                    schemaPath: '#/properties/scopes_supported/items/enum',
                                                                                                    params: {
                                                                                                        allowedValues: schema2,
                                                                                                    },
                                                                                                    message: 'should be equal to one of the allowed values',
                                                                                                },
                                                                                            ];
                                                                                            return false;
                                                                                        }
                                                                                        else {
                                                                                        }
                                                                                        if (errors === errs_2) {
                                                                                        }
                                                                                        var valid2 = errors === errs_2;
                                                                                        if (!valid2) {
                                                                                            break;
                                                                                        }
                                                                                    }
                                                                                    if (errs__1 == errors) {
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    validate.errors = [
                                                                                        {
                                                                                            keyword: 'type',
                                                                                            dataPath: (dataPath || '') +
                                                                                                '.scopes_supported',
                                                                                            schemaPath: '#/properties/scopes_supported/type',
                                                                                            params: {
                                                                                                type: 'array',
                                                                                            },
                                                                                            message: 'should be array',
                                                                                        },
                                                                                    ];
                                                                                    return false;
                                                                                }
                                                                                if (errors === errs_1) {
                                                                                }
                                                                                var valid1 = errors === errs_1;
                                                                            }
                                                                            if (valid1) {
                                                                                var data1 = data.subject_identifier_types_supported;
                                                                                if (data1 === undefined) {
                                                                                    valid1 = false;
                                                                                    validate.errors = [
                                                                                        {
                                                                                            keyword: 'required',
                                                                                            dataPath: (dataPath || '') + '',
                                                                                            schemaPath: '#/required',
                                                                                            params: {
                                                                                                missingProperty: 'subject_identifier_types_supported',
                                                                                            },
                                                                                            message: "should have required property 'subject_identifier_types_supported'",
                                                                                        },
                                                                                    ];
                                                                                    return false;
                                                                                }
                                                                                else {
                                                                                    var errs_1 = errors;
                                                                                    if (Array.isArray(data1)) {
                                                                                        var errs__1 = errors;
                                                                                        var valid1;
                                                                                        for (var i1 = 0; i1 < data1.length; i1++) {
                                                                                            var errs_2 = errors;
                                                                                            if (typeof data1[i1] !== 'string') {
                                                                                                validate.errors = [
                                                                                                    {
                                                                                                        keyword: 'type',
                                                                                                        dataPath: (dataPath || '') +
                                                                                                            '.subject_identifier_types_supported[' +
                                                                                                            i1 +
                                                                                                            ']',
                                                                                                        schemaPath: '#/properties/subject_identifier_types_supported/items/type',
                                                                                                        params: {
                                                                                                            type: 'string',
                                                                                                        },
                                                                                                        message: 'should be string',
                                                                                                    },
                                                                                                ];
                                                                                                return false;
                                                                                            }
                                                                                            var valid2 = errors === errs_2;
                                                                                            if (!valid2) {
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (errs__1 == errors) {
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        validate.errors = [
                                                                                            {
                                                                                                keyword: 'type',
                                                                                                dataPath: (dataPath || '') +
                                                                                                    '.subject_identifier_types_supported',
                                                                                                schemaPath: '#/properties/subject_identifier_types_supported/type',
                                                                                                params: {
                                                                                                    type: 'array',
                                                                                                },
                                                                                                message: 'should be array',
                                                                                            },
                                                                                        ];
                                                                                        return false;
                                                                                    }
                                                                                    if (errors === errs_1) {
                                                                                    }
                                                                                    var valid1 = errors === errs_1;
                                                                                }
                                                                                if (valid1) {
                                                                                    var data1 = data.subject_types_supported;
                                                                                    if (data1 === undefined) {
                                                                                        valid1 = false;
                                                                                        validate.errors = [
                                                                                            {
                                                                                                keyword: 'required',
                                                                                                dataPath: (dataPath || '') + '',
                                                                                                schemaPath: '#/required',
                                                                                                params: {
                                                                                                    missingProperty: 'subject_types_supported',
                                                                                                },
                                                                                                message: "should have required property 'subject_types_supported'",
                                                                                            },
                                                                                        ];
                                                                                        return false;
                                                                                    }
                                                                                    else {
                                                                                        var errs_1 = errors;
                                                                                        if (Array.isArray(data1)) {
                                                                                            var errs__1 = errors;
                                                                                            var valid1;
                                                                                            for (var i1 = 0; i1 < data1.length; i1++) {
                                                                                                var data2 = data1[i1];
                                                                                                var errs_2 = errors;
                                                                                                if (typeof data2 !== 'string') {
                                                                                                    validate.errors = [
                                                                                                        {
                                                                                                            keyword: 'type',
                                                                                                            dataPath: (dataPath || '') +
                                                                                                                '.subject_types_supported[' +
                                                                                                                i1 +
                                                                                                                ']',
                                                                                                            schemaPath: '#/properties/subject_types_supported/items/type',
                                                                                                            params: {
                                                                                                                type: 'string',
                                                                                                            },
                                                                                                            message: 'should be string',
                                                                                                        },
                                                                                                    ];
                                                                                                    return false;
                                                                                                }
                                                                                                var schema2 = validate.schema.properties
                                                                                                    .subject_types_supported
                                                                                                    .items.enum;
                                                                                                var valid2;
                                                                                                valid2 = false;
                                                                                                for (var i2 = 0; i2 < schema2.length; i2++) {
                                                                                                    if (equal(data2, schema2[i2])) {
                                                                                                        valid2 = true;
                                                                                                        break;
                                                                                                    }
                                                                                                }
                                                                                                if (!valid2) {
                                                                                                    validate.errors = [
                                                                                                        {
                                                                                                            keyword: 'enum',
                                                                                                            dataPath: (dataPath || '') +
                                                                                                                '.subject_types_supported[' +
                                                                                                                i1 +
                                                                                                                ']',
                                                                                                            schemaPath: '#/properties/subject_types_supported/items/enum',
                                                                                                            params: {
                                                                                                                allowedValues: schema2,
                                                                                                            },
                                                                                                            message: 'should be equal to one of the allowed values',
                                                                                                        },
                                                                                                    ];
                                                                                                    return false;
                                                                                                }
                                                                                                else {
                                                                                                }
                                                                                                if (errors === errs_2) {
                                                                                                }
                                                                                                var valid2 = errors === errs_2;
                                                                                                if (!valid2) {
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                            if (errs__1 == errors) {
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            validate.errors = [
                                                                                                {
                                                                                                    keyword: 'type',
                                                                                                    dataPath: (dataPath || '') +
                                                                                                        '.subject_types_supported',
                                                                                                    schemaPath: '#/properties/subject_types_supported/type',
                                                                                                    params: {
                                                                                                        type: 'array',
                                                                                                    },
                                                                                                    message: 'should be array',
                                                                                                },
                                                                                            ];
                                                                                            return false;
                                                                                        }
                                                                                        if (errors === errs_1) {
                                                                                        }
                                                                                        var valid1 = errors === errs_1;
                                                                                    }
                                                                                    if (valid1) {
                                                                                        if (data.tos_uri === undefined) {
                                                                                            valid1 = true;
                                                                                        }
                                                                                        else {
                                                                                            var errs_1 = errors;
                                                                                            if (typeof data.tos_uri !== 'string') {
                                                                                                validate.errors = [
                                                                                                    {
                                                                                                        keyword: 'type',
                                                                                                        dataPath: (dataPath || '') +
                                                                                                            '.tos_uri',
                                                                                                        schemaPath: '#/properties/tos_uri/type',
                                                                                                        params: {
                                                                                                            type: 'string',
                                                                                                        },
                                                                                                        message: 'should be string',
                                                                                                    },
                                                                                                ];
                                                                                                return false;
                                                                                            }
                                                                                            var valid1 = errors === errs_1;
                                                                                        }
                                                                                        if (valid1) {
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (errs__0 == errors) {
                }
            }
        }
        else {
            validate.errors = [
                {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '',
                    schemaPath: '#/type',
                    params: {
                        type: 'object',
                    },
                    message: 'should be object',
                },
            ];
            return false;
        }
        if (errors === 0) {
        }
        validate.errors = vErrors;
        return errors === 0;
    };
})();
validate.schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
        authorization_endpoint: {
            enum: ['openid:'],
            type: 'string',
        },
        credential_formats_supported: {
            items: {
                enum: ['jwt', 'jwt_vc', 'jwt_vp', 'ldp_vc', 'ldp_vp'],
                type: 'string',
            },
            type: 'array',
        },
        did: {
            type: 'string',
        },
        did_methods_supported: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
        id_token_encrypted_response_alg: {
            type: 'string',
        },
        id_token_encrypted_response_enc: {
            type: 'string',
        },
        id_token_signing_alg_values_supported: {
            items: {
                enum: ['ES256', 'ES256K', 'EdDSA', 'RS256'],
                type: 'string',
            },
            type: 'array',
        },
        issuer: {
            enum: ['https://self-issued.me/v2'],
            type: 'string',
        },
        jwks: {},
        jwks_uri: {
            type: 'string',
        },
        logo_uri: {
            type: 'string',
        },
        policy_uri: {
            type: 'string',
        },
        redirect_uris: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
        request_object_signing_alg_values_supported: {
            items: {
                enum: ['ES256', 'ES256K', 'EdDSA', 'RS256', 'none'],
                type: 'string',
            },
            type: 'array',
        },
        response_types_supported: {
            additionalItems: {
                anyOf: [
                    {
                        enum: ['id_token'],
                        type: 'string',
                    },
                ],
            },
            items: [
                {
                    enum: ['id_token'],
                    type: 'string',
                },
            ],
            minItems: 1,
            type: 'array',
        },
        scopes_supported: {
            items: {
                enum: ['address', 'email', 'openid', 'phone', 'profile'],
                type: 'string',
            },
            type: 'array',
        },
        subject_identifier_types_supported: {
            items: {
                type: 'string',
            },
            type: 'array',
        },
        subject_types_supported: {
            items: {
                enum: ['pairwise', 'public'],
                type: 'string',
            },
            type: 'array',
        },
        tos_uri: {
            type: 'string',
        },
    },
    required: [
        'authorization_endpoint',
        'credential_formats_supported',
        'id_token_signing_alg_values_supported',
        'issuer',
        'request_object_signing_alg_values_supported',
        'response_types_supported',
        'scopes_supported',
        'subject_identifier_types_supported',
        'subject_types_supported',
    ],
    type: 'object',
};
validate.errors = null;
module.exports = validate;
