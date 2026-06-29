package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Period {

    @JsonProperty("start")
    public String start;

    @JsonProperty("end")
    public String end;

}
