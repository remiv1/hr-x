package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Education {

    @JsonProperty("title")
    public String title;

    @JsonProperty("institution")
    public String institution;

    @JsonProperty("year")
    public Integer year;

    @JsonProperty("certification")
    public Boolean certification;

}
