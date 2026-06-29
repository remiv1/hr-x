package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Civility {
    @JsonProperty("Mr.")
    MR,
    @JsonProperty("Mrs.")
    MRS,
    @JsonProperty("Dr.")
    DR,
    @JsonProperty("Prof.")
    PROF,
    @JsonProperty("Mx.")
    MX,
    @JsonProperty("Me")
    ME,
    @JsonProperty("other")
    OTHER
}
