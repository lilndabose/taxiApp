import HomeScreen from "../screens/HomeScreen";
import DriverHomeScreen from "../screens/DriverHomeScreen";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
import LandingScreen from "../screens/Authentication/LandingScreen";
import UserHomeScreen from "../screens/UserHomeScreen";
import TrackingScreen from "../screens/TrackingScreen";

const Stack = createStackNavigator();

function DriverStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DriverHomeScreen"
        component={DriverHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrackingScreen"
        component={TrackingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserHomeScreen"
        component={UserHomeScreen}
        options={{
          headerShown: false,
        }}
      />
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
      <Stack.Screen
        name="TrackingScreen"
        component={TrackingScreen}
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
