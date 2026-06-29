package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import java.time.LocalDate;
import java.util.regex.Pattern;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class HrxMetadata {

    @JsonProperty("version")
    public String version;

    @JsonProperty("schema")
    public String schemaUri;

    @JsonProperty("issuer")
    public String issuer;

    @JsonProperty("date")
    public LocalDate date;

    @JsonProperty("lang")
    public String lang;

}
