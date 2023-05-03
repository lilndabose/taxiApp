import HomeScreen from "../screens/HomeScreen";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
import LandingScreen from "../screens/Authentication/LandingScreen";
import { Text, TouchableOpacity, View } from "react-native";
import { setVariable } from "../services/AsyncStorageMethods";

const Stack = createStackNavigator();

function DriverStack() {
  return (
    <View>
      <Text>HEllo this is driver Stack</Text>
      <Text>HEllo this is driver Stack</Text>
      <Text>HEllo this is driver Stack</Text>
      <TouchableOpacity
        onPress={() => {
          setVariable(null, "userInfo");
        }}
      >
        <Text>logout </Text>
      </TouchableOpacity>
    </View>
  );
}

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function RootStack(userType) {
  if (userType.userType) {
    return <DriverStack />;
  } else {
    return <UserStack />;
  }
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export { AuthStack, RootStack };
