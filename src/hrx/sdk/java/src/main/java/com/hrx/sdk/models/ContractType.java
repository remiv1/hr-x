package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ContractType {
    @JsonProperty("permanent")
    PERMANENT,
    @JsonProperty("fixed-term")
    FIXED_TERM,
    @JsonProperty("freelance")
    FREELANCE,
    @JsonProperty("mission")
    MISSION,
    @JsonProperty("internship")
    INTERNSHIP,
    @JsonProperty("apprenticeship")
    APPRENTICESHIP
}
