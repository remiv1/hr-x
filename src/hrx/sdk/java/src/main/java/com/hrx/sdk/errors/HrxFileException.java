package com.hrx.sdk.errors;

public class HrxFileException extends HrxException {
    public HrxFileException(String message) {
        super(message);
    }

    public HrxFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
