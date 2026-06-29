package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Candidate {

    @JsonProperty("$hrx")
    @JsonAlias("$hrx")
    public HrxMetadata hrx;

    @JsonProperty("identity")
    public Identity identity;

    @JsonProperty("skills")
    public Skills skills;

    @JsonProperty("experiences")
    public List<Experience> experiences;

    @JsonProperty("education")
    public List<Education> education;

    @JsonProperty("credentials")
    public Credentials credentials;

    @JsonProperty("preferences")
    public Preferences preferences;

}
