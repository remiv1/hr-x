package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Bibliography {

    @JsonProperty("title")
    public String title;

    @JsonProperty("authors")
    public List<String> authors;

    @JsonProperty("year")
    public Integer year;

    @JsonProperty("type")
    public BibliographyType type;

    @JsonProperty("url")
    public String url;

}
