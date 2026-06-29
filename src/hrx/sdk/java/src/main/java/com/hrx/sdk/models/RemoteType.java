package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RemoteType {
    @JsonProperty("no")
    NO,
    @JsonProperty("partial")
    PARTIAL,
    @JsonProperty("full")
    FULL
}
