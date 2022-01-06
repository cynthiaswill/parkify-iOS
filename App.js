import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/Login";
import { Home } from "./screens/Home";
import DrawerItems from "./constants/DrawerItems";
import { FontAwesome5 } from "@expo/vector-icons";
import { CreateMeets } from "./screens/CreateMeets";
import { Meets } from "./screens/Meets";
import { UserPage } from "./screens/UserPage";
import { UserProvider } from "./contexts/user-context.js";
import { EventProvider } from "./contexts/event-context.js";
import { ViewedUserProvider } from "./contexts/viewed-user-context.js";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <UserProvider>
      <EventProvider>
        <ViewedUserProvider>
          <NavigationContainer>
            <Drawer.Navigator
              drawerType="front"
              initialRouteName="Login"
              // drawerContentOptions={{
              //   activeTintColor: "#C37B89",
              //   itemStyle: { marginVertical: 10 },
              // }}
            >
              {DrawerItems.map((drawer) => (
                <Drawer.Screen
                  key={drawer.name}
                  name={drawer.name}
                  component={
                    drawer.name === "Login"
                      ? Login
                      : drawer.name === "Create Event"
                      ? CreateMeets
                      : drawer.name === "Find Event"
                      ? Meets
                      : drawer.name === "User Page"
                      ? UserPage
                      : Home
                  }
                  options={{
                    drawerIcon: ({ focused }) => (
                      <FontAwesome5
                        name={drawer.iconName}
                        size={24}
                        color={focused ? "#C37B89" : "black"}
                      />
                    ),
                    headerShown: true,
                  }}
                />
              ))}
            </Drawer.Navigator>
          </NavigationContainer>
        </ViewedUserProvider>
      </EventProvider>
    </UserProvider>
  );
}
