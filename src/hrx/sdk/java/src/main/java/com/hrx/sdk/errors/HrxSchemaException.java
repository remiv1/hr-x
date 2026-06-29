package com.hrx.sdk.errors;

public class HrxSchemaException extends HrxException {
    public HrxSchemaException(String message) {
        super(message);
    }

    public HrxSchemaException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public HrxSchemaException(String message, Object details) {
        super(message, details);
    }
}
