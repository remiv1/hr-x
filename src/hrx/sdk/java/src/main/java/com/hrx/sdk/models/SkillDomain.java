package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SkillDomain {

    @JsonProperty("domain")
    public String domain;

    @JsonProperty("items")
    public List<SkillItem> items;

}
