import React from "react";
import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";

function SearchLocation({ setLocation, placeholder }) {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      styles={toTnputBoxStyle}
      onPress={(data, details = null) => {
        setLocation({
          location: details.geometry.location,
          description: data.description,
        });
      }}
      fetchDetails={true}
      returnKeyType={"search"}
      enablePoweredByContainer={false}
      listViewDisplayed={false}
      minLength={2}
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: "en",
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={400}
    />
  );
}

const toTnputBoxStyle = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 0,
  },
  textInput: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 50,
  },
});

export default SearchLocation;
