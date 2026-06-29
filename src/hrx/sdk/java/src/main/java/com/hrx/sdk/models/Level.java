package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Level {
    @JsonProperty("beginner")
    BEGINNER,
    @JsonProperty("intermediate")
    INTERMEDIATE,
    @JsonProperty("advanced")
    ADVANCED,
    @JsonProperty("expert")
    EXPERT
}
