package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillItem {

    @JsonProperty("label")
    public String label;

    @JsonProperty("level")
    public Level level;

}
