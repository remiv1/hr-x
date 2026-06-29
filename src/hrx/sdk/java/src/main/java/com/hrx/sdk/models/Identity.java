package com.hrx.sdk.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Identity {

    @JsonProperty("civility")
    public Civility civility;

    @JsonProperty("last_name")
    public String lastName;

    @JsonProperty("first_name")
    public String firstName;

    @JsonProperty("contacts")
    public List<Contact> contacts;

    @JsonProperty("location")
    public Location location;

}
