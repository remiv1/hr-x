package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Mobility {
    @JsonProperty("local")
    LOCAL,
    @JsonProperty("regional")
    REGIONAL,
    @JsonProperty("national")
    NATIONAL,
    @JsonProperty("international")
    INTERNATIONAL
}
