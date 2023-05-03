import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/authSlice";
import userService from "../api/userService";
import { CurrentLocation } from "../helpers/CurrentLocation";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const Visible = ({userInfo, setVisibility}) => {
  const dispatch = useDispatch();
  useEffect(() => {
      setInterval(async () => {
        await CurrentLocation().then(async (response) => {
          if (
            response.coords.longitude == userInfo?.position?.longitude &&
            response.coords.latitude == userInfo?.position?.latitude
          ) {
            console.log("the same");
          } else {
            // storedInformation.address = response.address[0]
            var temPosition = {
              longitude: response.coords.longitude,
              latitude: response.coords.latitude,
            };
            const data = {
              ...userInfo,
              position: temPosition,
              visibility: true,
            };
  
            var res = await userService.updateDevice(data);
  
            if (res.statusCode === 200) {
                dispatch(setUserInfo(data));
            }
          }
        });
      }, 5000);
    }, []);
    const setNotVisible = async () => {
        const data = {
          ...userInfo,
          visibility: false,
        };

        var res = await userService.updateDevice(data);

        if (res.statusCode === 200) {
            setVisibility(false)
            dispatch(setUserInfo(data));
        }

    }
    return (
      <View>
        <ActivityIndicator size={150} color="blue" />
        <Text style={tw`self-center mt-20 text-2xl font-bold`}>
          Waiting for Booking
        </Text>
        <TouchableOpacity onPress={() => setNotVisible()}>
          <Text style={tw`self-center text-black`}>Stop</Text>
        </TouchableOpacity>
      </View>
    );
    
}

export default Visible;