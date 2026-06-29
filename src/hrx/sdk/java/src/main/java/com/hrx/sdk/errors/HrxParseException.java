package com.hrx.sdk.errors;

public class HrxParseException extends HrxException {
    public HrxParseException(String message) {
        super(message);
    }

    public HrxParseException(String message, Throwable cause) {
        super(message, cause);
    }
}
