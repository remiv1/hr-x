package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reference {

    @JsonProperty("name")
    public String name;

    @JsonProperty("position")
    public String position;

    @JsonProperty("organisation")
    public String organisation;

    @JsonProperty("contact")
    public String contact;

}
