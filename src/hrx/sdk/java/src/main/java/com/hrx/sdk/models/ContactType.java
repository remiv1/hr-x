package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ContactType {
    @JsonProperty("email")
    EMAIL,
    @JsonProperty("phone")
    PHONE,
    @JsonProperty("linkedin")
    LINKEDIN,
    @JsonProperty("github")
    GITHUB,
    @JsonProperty("x")
    X,
    @JsonProperty("facebook")
    FACEBOOK,
    @JsonProperty("instagram")
    INSTAGRAM,
    @JsonProperty("website")
    WEBSITE,
    @JsonProperty("other")
    OTHER
}
