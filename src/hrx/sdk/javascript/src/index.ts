import * as fs from 'fs/promises';
import { Candidate } from './models';
import { HrxFileError, HrxParseError, HrxValidationError, HrxVersionError } from './errors';

/**
 * Charge, valide et sérialise un document HRX.
 */
export class HRX {
    public candidate: Candidate;

    constructor(source: string | Record<string, any> | Candidate) {
        this.candidate = this._loadCandidate(source);
    }

    /**
     * Charge un document HRX depuis un chemin de fichier.
     * @param path Chemin vers le fichier HRX.
     * @returns Une instance de HRX.
     */
    public static async fromPath(path: string): Promise<HRX> {
        try {
            const payload = await fs.readFile(path, 'utf-8');
            const data = JSON.parse(payload);
            return new HRX(data);
        } catch (error: any) {
            if (error instanceof SyntaxError) {
                throw new HrxParseError(`Invalid HRX JSON payload: ${error.message}`);
            }
            throw new HrxFileError(`Cannot read HRX file: ${path}`);
        }
    }

    /**
     * Charge un document HRX depuis une chaîne JSON.
     * @param payload Chaîne JSON représentant le document HRX.
     * @returns Une instance de HRX.
     */
    public static fromJson(payload: string): HRX {
        try {
            const data = JSON.parse(payload);
            return new HRX(data);
        } catch (error: any) {
            throw new HrxParseError(`Invalid HRX JSON payload: ${error.message}`);
        }
    }

    /**
     * Charge un document HRX depuis un objet.
     * @param payload Objet représentant le document HRX.
     * @returns Une instance de HRX.
     */
    public static fromObject(payload: Record<string, any>): HRX {
        return new HRX(payload);
    }

    private _loadCandidate(source: string | Record<string, any> | Candidate): Candidate {
        let candidate: Candidate;

        if (typeof source === 'string') {
            candidate = HRX.fromJson(source).candidate;
        } else if (typeof source === 'object' && !('candidate' in source)) {
            // Simple validation, should be improved with a validation library
            if (!source.$hrx || !source.identity) {
                throw new HrxValidationError("HRX payload does not match the expected model.");
            }
            candidate = source as Candidate;
        } else {
             candidate = source as Candidate;
        }


        const version = candidate.$hrx.version;
        if (version !== "1.0") {
            throw new HrxVersionError(
                `Unsupported HRX version '${version}'. Only version '1.0' is currently supported.`,
            );
        }
        return candidate;
    }

    /**
     * Sérialise le document HRX en un objet.
     * @returns Un objet représentant le document HRX.
     */
    public toObject(): Record<string, any> {
        // A simple implementation. A more robust one would handle aliases and exclude nulls.
        return JSON.parse(JSON.stringify(this.candidate));
    }

    /**
     * Sérialise le document HRX en une chaîne JSON.
     * @param indent Nombre d'espaces pour l'indentation.
     * @returns Une chaîne JSON représentant le document HRX.
     */
    public toJson(indent: number = 2): string {
        return JSON.stringify(this.candidate, null, indent);
    }

    // La validation de schéma avec jsonschema n'est pas implémentée ici
    // car elle nécessiterait une dépendance externe comme 'ajv'.
}
