package com.hrx.sdk.errors;

public class HrxException extends RuntimeException {
    private Object details;

    public HrxException(String message) {
        super(message);
    }

    public HrxException(String message, Throwable cause) {
        super(message, cause);
    }

    public HrxException(String message, Object details) {
        super(message);
        this.details = details;
    }

    public HrxException(String message, Throwable cause, Object details) {
        super(message, cause);
        this.details = details;
    }

    public Object getDetails() {
        return details;
    }
}
