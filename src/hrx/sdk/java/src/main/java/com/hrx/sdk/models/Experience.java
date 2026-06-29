package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Experience {

    @JsonProperty("position")
    public String position;

    @JsonProperty("organisation")
    public String organisation;

    @JsonProperty("sector")
    public String sector;

    @JsonProperty("period")
    public Period period;

    @JsonProperty("description")
    public String description;

    @JsonProperty("achievements")
    public List<String> achievements;

    @JsonProperty("projects")
    public List<Project> projects;

}
