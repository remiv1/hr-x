package com.hrx.sdk.errors;

public class HrxValidationException extends HrxException {
    public HrxValidationException(String message, Object details) {
        super(message, details);
    }

    public HrxValidationException(String message, Throwable cause, Object details) {
        super(message, cause, details);
    }
}
