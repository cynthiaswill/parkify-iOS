import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { UserContext } from "../contexts/user-context.js";
import { EventContext } from "../contexts/event-context.js";
import { joinEvent, leaveEvent } from "../utils/frosty-api";
import { useNavigation } from "@react-navigation/native";
import Categories from "../constants/Categories.js";

export default function EventCard({ currentEvent, setJoinedClicked }) {
  const [toggleOn, setToggleOn] = useState(false);
  const { user } = useContext(UserContext);
  const { event, setEvent } = useContext(EventContext);

  const navigation = useNavigation();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    currentEvent.participants.forEach((person) => {
      if (person.username === user.username) {
        setJoined(true);
      }
    });
  }, [joined]);

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={styles.mainContainer}
        onPress={() => {
          if (toggleOn) {
            setToggleOn(false);
          } else {
            setEvent(currentEvent);
            setToggleOn(true);
          }
        }}
      >
        <Image
          source={{
            uri: `${
              Categories.filter((cat) => cat.category_name === currentEvent.category)[0][
                "image_url"
              ]
            }`,
          }}
          style={styles.eventImage}
        />
        <View style={styles.textContainer}>
          <View style={styles.textRow}>
            <Text style={{ color: "white" }}>
              {currentEvent.title.length > 25
                ? `${currentEvent.title.slice(0, 20)}...`
                : currentEvent.title}
            </Text>
            <Text style={{ color: "white" }}>
              {currentEvent.eventStart.slice(0, 10).replaceAll("-", "/")}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={{ color: "white" }}>
              Creator: {currentEvent.creator.username}
            </Text>
            <Text style={{ color: "white" }}>
              {currentEvent.eventStart.slice(11, 16)} -{" "}
              {currentEvent.eventEnd.slice(11, 16)}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={{ color: "white" }}>
              Info:{" "}
              {currentEvent.description.length > 100
                ? `${currentEvent.description.slice(0, 60)}...`
                : currentEvent.description}
            </Text>
          </View>
        </View>
      </Pressable>
      {toggleOn && currentEvent === event ? (
        <View style={styles.extraContainer}>
          <Pressable
            style={styles.joinButton}
            onPress={() => {
              // backend patch: just send event id and body,
              // which is a new participants array
              if (joined) {
                leaveEvent(user.token, event.eventId)
                  .then((res) => {
                    setJoined(false);
                    setEvent(res.data.event);
                    setJoinedClicked(true);
                  })
                  .catch((err) => console.dir(err));
              } else {
                joinEvent(user.token, event.eventId)
                  .then((res) => {
                    setJoined(true);
                    setEvent(res.data.event);
                    setJoinedClicked(true);
                  })
                  .catch((err) => console.dir(err));
              }
            }}
          >
            <Text style={styles.buttonText}>{joined ? "Leave" : "Join"}</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              return navigation.navigate("ViewEvent");
            }}
          >
            <Text style={styles.buttonText}>Read More</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#8E806A",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    margin: 5,
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: 96,
  },
  eventImage: {
    flex: 1,
    borderRadius: 10,
    margin: 3,
  },
  textContainer: {
    flexDirection: "column",
    flex: 3,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
  },
  extraContainer: {
    flexDirection: "row",
    margin: 5,
  },
  joinButton: {
    marginLeft: 65,
    marginRight: 85,
  },
  buttonText: {
    width: 80,
    justifyContent: "center",
    color: "white",
  },
  creatorButtonText: {
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "blue",
  },
});
