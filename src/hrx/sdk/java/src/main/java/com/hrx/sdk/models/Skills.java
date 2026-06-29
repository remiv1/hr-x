package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Skills {

    @JsonProperty("hard")
    public List<SkillDomain> hard;

    @JsonProperty("soft")
    public List<SkillDomain> soft;

}
