package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Contact {

    @JsonProperty("type")
    public ContactType type;

    @JsonProperty("value")
    public String value;

    @JsonProperty("primary")
    public Boolean primary;

}
