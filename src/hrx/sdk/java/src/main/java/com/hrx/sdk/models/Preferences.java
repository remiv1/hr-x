package com.hrx.sdk.models;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Preferences {

    @JsonProperty("availability")
    public LocalDate availability;

    @JsonProperty("contracts")
    public List<ContractType> contracts;

    @JsonProperty("remote")
    public RemoteType remote;

    @JsonProperty("salary_min")
    public Integer salaryMin;

}
