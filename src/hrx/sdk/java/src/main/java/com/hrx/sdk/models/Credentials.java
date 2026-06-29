package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Credentials {

    @JsonProperty("awards")
    public List<Award> awards;

    @JsonProperty("references")
    public List<Reference> references;

    @JsonProperty("bibliography")
    public List<Bibliography> bibliography;

}
