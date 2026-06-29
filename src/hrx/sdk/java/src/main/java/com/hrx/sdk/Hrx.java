package com.hrx.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hrx.sdk.errors.HrxFileException;
import com.hrx.sdk.errors.HrxParseException;
import com.hrx.sdk.errors.HrxSchemaException;
import com.hrx.sdk.errors.HrxVersionException;
import com.hrx.sdk.models.Candidate;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.ValidationMessage;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;

public class Hrx {

    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private final Candidate candidate;

    public Hrx(Object source) {
        this.candidate = loadCandidate(source);
    }

    public static Hrx fromPath(Path path) {
        return new Hrx(path.toFile());
    }

    public static Hrx fromJson(String payload) {
        return new Hrx(payload);
    }

    public static Hrx fromMap(Map<String, Object> payload) {
        return new Hrx(payload);
    }

    private Candidate loadCandidate(Object source) {
        Candidate loadedCandidate;
        if (source instanceof Candidate) {
            loadedCandidate = (Candidate) source;
        } else if (source instanceof File) {
            loadedCandidate = loadFromFile((File) source);
        } else if (source instanceof String) {
            loadedCandidate = loadFromJson((String) source);
        } else if (source instanceof Map) {
            loadedCandidate = loadFromMap((Map<String, Object>) source);
        } else {
            throw new IllegalArgumentException("Unsupported source type: " + source.getClass().getName());
        }

        if (loadedCandidate.hrx == null || !"1.0".equals(loadedCandidate.hrx.version)) {
            String version = (loadedCandidate.hrx != null) ? loadedCandidate.hrx.version : "null";
            throw new HrxVersionException(
                    String.format("Unsupported HRX version '%s'. Only version '1.0' is currently supported.", version)
            );
        }

        return loadedCandidate;
    }

    private Candidate loadFromFile(File file) {
        try {
            return objectMapper.readValue(file, Candidate.class);
        } catch (IOException e) {
            throw new HrxFileException("Cannot read HRX file: " + file.getPath(), e);
        }
    }

    private Candidate loadFromJson(String json) {
        try {
            return objectMapper.readValue(json, Candidate.class);
        } catch (JsonProcessingException e) {
            throw new HrxParseException("Invalid HRX JSON payload", e);
        }
    }

    private Candidate loadFromMap(Map<String, Object> map) {
        return objectMapper.convertValue(map, Candidate.class);
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public Map<String, Object> toMap() {
        return objectMapper.convertValue(candidate, Map.class);
    }

    public String toJson(boolean pretty) throws JsonProcessingException {
        if (pretty) {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(candidate);
        }
        return objectMapper.writeValueAsString(candidate);
    }
    
     public String toJson() throws JsonProcessingException {
        return toJson(false);
    }


    public void validateAgainstSchema(File schemaFile) {
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance();
        try {
            JsonNode schemaNode = objectMapper.readTree(schemaFile);
            JsonSchema schema = factory.getSchema(schemaNode);
            JsonNode jsonNode = objectMapper.valueToTree(this.toMap());
            Set<ValidationMessage> errors = schema.validate(jsonNode);
            if (!errors.isEmpty()) {
                throw new HrxSchemaException("HRX payload does not match the provided JSON schema.", errors);
            }
        } catch (IOException e) {
            throw new HrxSchemaException("Cannot read schema file: " + schemaFile.getPath(), e);
        }

    }
}
