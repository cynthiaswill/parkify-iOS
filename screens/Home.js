import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Home = ({ navigation }) => {
  return (
    <View style={styles.wholePage}>
      <View style={styles.contentsContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../logo.jpg")} style={styles.logo} />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Find Event")}
          >
            <Text style={styles.buttonText}>Find Event</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Create Event")}
          >
            <Text style={styles.buttonText}>Create Event</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight)),
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  contentsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 650,
  },

  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#8E806A",
    elevation: 3,
    marginVertical: 10,
    width: 150,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },

  logo: {
    width: 200,
    height: 200,
    margin: 50,
    borderRadius: 100,
  },
});
