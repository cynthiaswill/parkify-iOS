import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ViewedUserContext } from "../contexts/viewed-user-context.js";
import { UserContext } from "../contexts/user-context.js";
import { getUser } from "../utils/nh-api.js";
import EventCardUserPage from "../components/EventCardUserPage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const ViewUser = () => {
  const { viewedUser } = useContext(ViewedUserContext);
  const { user } = useContext(UserContext);

  const [hostedEvents, setHostedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [hostedClicked, setHostedClicked] = useState(true);
  const [attendedClicked, setAttendedClicked] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    setHostedEvents(viewedUser.hostedEvents);
    setAttendedEvents(viewedUser.attendedEvents);
  }, [viewedUser]);

  return (
    <View style={styles.wholePage}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          return navigation.navigate("ViewEvent");
        }}
      >
        <Text style={styles.arrow}>⇠</Text>
      </Pressable>
      <View style={styles.pageContainer}>
        <View style={styles.firstRowContainer}>
          <Text style={styles.username}>{viewedUser.username}</Text>
        </View>
        <View style={styles.middlePartContainer}>
          <View style={styles.pictureContainer}>
            <Image source={require("../logo.jpg")} style={styles.avatar} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.displayName}>{viewedUser.displayName}</Text>
            <Text style={styles.pronouns}>{viewedUser.pronouns}</Text>
            <Text style={styles.dateOfBirth}>{viewedUser.dateOfBirth}</Text>
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
            <Text>No attended events</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight)),
    backgroundColor: "lightgrey",
  },
  pageContainer: {
    padding: 15,
    margin: 5,
  },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 20,
    color: "#4A403A",
  },
  username: {
    flex: 4,
    fontSize: 25,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 18,
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
    height: 35,
    fontSize: 16,
    marginTop: 5,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
  },

  eventListBox: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
  eventListScroller: {
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 200,
  },
});
