/**
 * Erreurs personnalisées pour le SDK HR-X.
 */

export class HrxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class HrxFileError extends HrxError {}
export class HrxParseError extends HrxError {}
export class HrxValidationError extends HrxError {
    public details: any;
    constructor(message: string, details: any = null) {
        super(message);
        this.details = details;
    }
}
export class HrxVersionError extends HrxError {}
export class HrxSchemaError extends HrxError {
    public details: any;
    constructor(message: string, details: any = null) {
        super(message);
        this.details = details;
    }
}
