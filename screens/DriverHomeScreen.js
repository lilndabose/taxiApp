import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { MaterialIcons } from "@expo/vector-icons";
import { CurrentLocation } from "../helpers/CurrentLocation";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { setUserInfo } from "../slices/authSlice";
import { async } from "@firebase/util";
import userService from "../api/userService";
import Visible from "../components/Visible";

// function Visible() {
//   useEffect(() => {
//     setInterval(async () => {
//       await CurrentLocation().then(async (response) => {
//         if (
//           response.coords.longitude == userInfo?.position?.longitude &&
//           response.coords.latitude == userInfo?.position?.latitude
//         ) {
//           console.log("the same");
//         } else {
//           // storedInformation.address = response.address[0]
//           var temPosition = {
//             longitude: response.coords.longitude,
//             latitude: response.coords.latitude,
//           };
//           let data = {};
//           if (visibility) {
//             data = {
//               ...userInfo,
//               position: temPosition,
//               visibility: true,
//             };
//           } else {
//             data = {
//               ...userInfo,
//               position: temPosition,
//               visibility: false,
//             };
//           }

//           var res = await userService.updateDevice(data);

//           if (res.statusCode === 200) {
//             console.log("ok", data);
//             dispatch(setUserInfo(data));
//           }
//         }
//       });
//     }, 5000);
//   }, []);
//   return (
//     <View>
//       <ActivityIndicator size={150} color="blue" />
//       <Text style={tw`self-center mt-20 text-2xl font-bold`}>
//         Waiting for Booking
//       </Text>
//       <TouchableOpacity onPress={() => setVisibility(!visibility)}>
//         <Text style={tw`self-center text-black`}>Stop</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

function DriverHomeScreen() {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const userInfo = useSelector(selectAuthUser);

  return (
    <View style={tw`bg-white w-full h-full p-8`}>
      <View style={tw`my-5 flex flex-row justify-between`}>
        <MaterialIcons name="menu" size={30} color={"black"} />
        <MaterialIcons name="logout" size={30} color={"black"} />
      </View>
      <View style={tw`w-full h-full items-center justify-center`}>
        {!visibility ? (
          <TouchableOpacity
            onPress={() => setVisibility(!visibility)}
            style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
          >
            <Text style={tw`self-center text-white`}>Click to be visible</Text>
          </TouchableOpacity>
        ) : (
          <Visible userInfo={userInfo} setVisibility={setVisibility} />
        )}
      </View>
    </View>
  );
}

export default DriverHomeScreen;
