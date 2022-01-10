import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { UserContext } from "../contexts/user-context.js";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getProfile } from "../utils/nh-api.js";
import EventCardUserPage from "../components/EventCardUserPage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const [editClicked, setEditClicked] = useState(false);

  const [hostedEvents, setHostedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [hostedClicked, setHostedClicked] = useState(true);
  const [attendedClicked, setAttendedClicked] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      // setError("You have to login first!");
      navigation.navigate("Login");
    } else {
      getProfile(user.token).then(({ data }) => {
        setHostedEvents(data.user.hostedEvents);
        setAttendedEvents(data.user.attendedEvents);
      });
    }
  }, []);

  if (user) {
    return (
      <View style={styles.wholePage}>
        <View style={styles.pageContainer}>
          <View style={styles.firstRowContainer}>
            <Text style={styles.username}>{user.username}</Text>
            {editClicked ? (
              <Pressable
                onPress={() => {
                  setEditClicked(false);
                }}
                style={styles.editButton}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setEditClicked(true);
                }}
                style={styles.editButton}
              >
                <Text style={{ color: "white" }}>Edit</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.middlePartContainer}>
            <View style={styles.pictureContainer}>
              <Image source={require("../logo.jpg")} style={styles.avatar} />
              <Pressable style={styles.uploadImage} onPress={() => {}}>
                <Text style={{ color: "white" }}>Upload Photo</Text>
              </Pressable>
            </View>
            <View style={styles.detailsContainer}>
              {editClicked ? (
                <TextInput
                  placeholder="Display name..."
                  style={styles.textInputDetails}
                />
              ) : (
                <Text style={styles.displayName}>{user.displayName}</Text>
              )}
              {editClicked ? (
                <TextInput placeholder="Pronouns..." style={styles.textInputDetails} />
              ) : (
                <Text style={styles.pronouns}>{user.pronouns}</Text>
              )}
              <Text style={styles.dateOfBirth}>{user.dateOfBirth}</Text>
            </View>
          </View>
          <View style={styles.eventListBox}>
            <Text>Hosted:</Text>
            {hostedEvents.length > 0 ? (
              !hostedClicked ? (
                <Pressable
                  onPress={() => {
                    setHostedClicked(true);
                  }}
                >
                  <Text>View {hostedEvents.length} events</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={() => {
                      setHostedClicked(false);
                    }}
                  >
                    <Text>Hide {hostedEvents.length} events</Text>
                  </Pressable>
                  <ScrollView style={styles.eventListScroller}>
                    {hostedEvents.map((event) => {
                      return <EventCardUserPage currentEvent={event} />;
                    })}
                  </ScrollView>
                </>
              )
            ) : (
              <Text>No hosted events</Text>
            )}
          </View>
          <View style={styles.eventListBox}>
            <Text>Attended:</Text>
            {attendedEvents.length > 0 ? (
              !attendedClicked ? (
                <Pressable
                  onPress={() => {
                    setAttendedClicked(true);
                  }}
                >
                  <Text>View {attendedEvents.length} events</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={() => {
                      setAttendedClicked(false);
                    }}
                  >
                    <Text>Hide {attendedEvents.length} events</Text>
                  </Pressable>
                  <ScrollView style={styles.eventListScroller}>
                    {attendedEvents.map((event) => {
                      return <EventCardUserPage currentEvent={event} />;
                    })}
                  </ScrollView>
                </>
              )
            ) : (
              <Text>No hosted events</Text>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    navigation.navigate("Login");
    return <Text>You are not logged in!</Text>;
  }
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 50),
    backgroundColor: "lightgrey",
  },
  pageContainer: {
    padding: 15,
    margin: 5,
  },
  uploadImage: {
    borderRadius: 10,
    backgroundColor: "#8E806A",
    fontSize: 16,
    padding: 5,
    marginTop: 5,
    height: 24,
    marginHorizontal: 5,
    alignSelf: "center",
    marginRight: 10,
  },
  username: {
    flex: 4,
    fontSize: 25,
  },
  editButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#8E806A",
    fontSize: 16,
    padding: 5,
    height: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  firstRowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 25,
  },
  middlePartContainer: {
    flexDirection: "row",
  },
  pictureContainer: {
    flex: 1,
  },
  detailsContainer: {
    marginTop: 20,
    marginLeft: 20,
    flex: 1,
    flexDirection: "column",
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  displayName: {
    height: 40,
    fontSize: 30,
  },
  pronouns: {
    height: 40,
    fontSize: 20,
  },
  dateOfBirth: {
    height: 40,
    fontSize: 20,
  },
  textInputDetails: {
    height: 30,
    fontSize: 16,
    marginVertical: 5,
    marginRight: 10,
    paddingLeft: 3,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
  },

  eventListBox: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginTop: 10,
  },
  eventListScroller: {
    maxHeight: 225,
  },
});
