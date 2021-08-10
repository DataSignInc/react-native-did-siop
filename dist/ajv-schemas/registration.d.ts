export = validate;
declare function validate(data: any, dataPath: any, parentData: any, parentDataProperty: any, rootData: any): boolean;
declare namespace validate {
    export const schema: {
        $schema: string;
        properties: {
            authorization_endpoint: {
                enum: string[];
                type: string;
            };
            credential_formats_supported: {
                items: {
                    enum: string[];
                    type: string;
                };
                type: string;
            };
            did: {
                type: string;
            };
            did_methods_supported: {
                items: {
                    type: string;
                };
                type: string;
            };
            id_token_encrypted_response_alg: {
                type: string;
            };
            id_token_encrypted_response_enc: {
                type: string;
            };
            id_token_signing_alg_values_supported: {
                items: {
                    enum: string[];
                    type: string;
                };
                type: string;
            };
            issuer: {
                enum: string[];
                type: string;
            };
            jwks: {};
            jwks_uri: {
                type: string;
            };
            logo_uri: {
                type: string;
            };
            policy_uri: {
                type: string;
            };
            redirect_uris: {
                items: {
                    type: string;
                };
                type: string;
            };
            request_object_signing_alg_values_supported: {
                items: {
                    enum: string[];
                    type: string;
                };
                type: string;
            };
            response_types_supported: {
                additionalItems: {
                    anyOf: {
                        enum: string[];
                        type: string;
                    }[];
                };
                items: {
                    enum: string[];
                    type: string;
                }[];
                minItems: number;
                type: string;
            };
            scopes_supported: {
                items: {
                    enum: string[];
                    type: string;
                };
                type: string;
            };
            subject_identifier_types_supported: {
                items: {
                    type: string;
                };
                type: string;
            };
            subject_types_supported: {
                items: {
                    enum: string[];
                    type: string;
                };
                type: string;
            };
            tos_uri: {
                type: string;
            };
        };
        required: string[];
        type: string;
    };
    export const errors: any;
}
