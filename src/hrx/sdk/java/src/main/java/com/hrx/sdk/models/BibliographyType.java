package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum BibliographyType {
    @JsonProperty("article")
    ARTICLE,
    @JsonProperty("book")
    BOOK,
    @JsonProperty("conference")
    CONFERENCE,
    @JsonProperty("report")
    REPORT,
    @JsonProperty("other")
    OTHER
}
