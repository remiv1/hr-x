import { HRX } from './index';
import { Candidate } from './models';
import * as fs from 'fs/promises';
import * as path from 'path';
import { HrxFileError, HrxParseError, HrxValidationError, HrxVersionError } from './errors';

const validCandidate: Candidate = {
    $hrx: {
        version: "1.0",
        schema: "https://raw.githubusercontent.com/tild-hrt/hr-X/main/schema/v1/hrx-schema-v1.json",
        date: "2026-06-29",
    },
    identity: {
        last_name: "Doe",
        first_name: "John",
    },
};

const invalidCandidate_version = {
    $hrx: {
        version: "0.9",
        schema: "https://example.com/schema",
        date: "2026-06-29",
    },
    identity: {
        last_name: "Doe",
        first_name: "Jane",
    },
};

const invalidCandidate_structure = {
    $hrx: {
        version: "1.0",
        schema: "https://example.com/schema",
        date: "2026-06-29",
    },
};

describe('HRX SDK', () => {

    describe('Loading data', () => {
        it('should load a valid Candidate object', () => {
            const hrx = new HRX(validCandidate);
            expect(hrx.candidate).toEqual(validCandidate);
        });

        it('should load from a valid JSON string', () => {
            const json = JSON.stringify(validCandidate);
            const hrx = HRX.fromJson(json);
            expect(hrx.candidate).toEqual(validCandidate);
        });

        it('should load from a valid file path', async () => {
            const testDir = 'test_data';
            const filePath = path.join(testDir, 'valid.hrx');
            await fs.mkdir(testDir, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(validCandidate, null, 2));

            const hrx = await HRX.fromPath(filePath);
            expect(hrx.candidate).toEqual(validCandidate);

            await fs.rm(testDir, { recursive: true, force: true });
        });
    });

    describe('Error handling', () => {
        it('should throw HrxVersionError for unsupported versions', () => {
            expect(() => new HRX(invalidCandidate_version as any)).toThrow(HrxVersionError);
        });

        it('should throw HrxValidationError for invalid structure', () => {
            expect(() => new HRX(invalidCandidate_structure as any)).toThrow(HrxValidationError);
        });

        it('should throw HrxParseError for malformed JSON', () => {
            const malformedJson = '{"key": "value"';
            expect(() => HRX.fromJson(malformedJson)).toThrow(HrxParseError);
        });

        it('should throw HrxFileError for a non-existent file', async () => {
            await expect(HRX.fromPath('nonexistent/file.hrx')).rejects.toThrow(HrxFileError);
        });
    });

    describe('Serialization', () => {
        it('should serialize to an object', () => {
            const hrx = new HRX(validCandidate);
            expect(hrx.toObject()).toEqual(validCandidate);
        });

        it('should serialize to a JSON string', () => {
            const hrx = new HRX(validCandidate);
            const json = hrx.toJson();
            expect(JSON.parse(json)).toEqual(validCandidate);
        });

        it('should serialize to a JSON string with specified indentation', () => {
            const hrx = new HRX(validCandidate);
            const json = hrx.toJson(4);
            const expectedJson = JSON.stringify(validCandidate, null, 4);
            expect(json).toBe(expectedJson);
        });
    });
});
