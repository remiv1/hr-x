package com.hrx.sdk.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Location {

    @JsonProperty("city")
    public String city;

    @JsonProperty("postal_code")
    public String postalCode;

    @JsonProperty("country")
    public String country;

    @JsonProperty("mobility")
    public Mobility mobility;

}
