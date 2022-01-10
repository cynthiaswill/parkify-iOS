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

import Categories from "../constants/Categories.js";

import { EventContext } from "../contexts/event-context.js";
import { UserContext } from "../contexts/user-context.js";
import { ViewedUserContext } from "../contexts/viewed-user-context.js";
import { getComments } from "../utils/nh-api.js";
import CommentCard from "../components/CommentCard";
import SlidingPanel from "react-native-sliding-up-down-panels";
import Chat from "../components/Chat";
import { deleteEvent } from "../utils/YizApi.js";
import { getUser } from "../utils/nh-api.js";
import MapView from "react-native-maps";
import { joinEvent, leaveEvent } from "../utils/YizApi";
import { MaterialIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const ViewEvent = () => {
  const { event, setEvent } = useContext(EventContext);
  const { user, setUser } = useContext(UserContext);
  const { setViewedUser } = useContext(ViewedUserContext);
  const [comments, setComments] = useState([]);
  const [chatOn, setChatOn] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [mapOpened, setMapOpened] = useState(true);
  const navigation = useNavigation();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    event.participants.forEach((person) => {
      if (person.username === user.username) {
        setJoined(true);
      }
    });
    getComments(user.token, event.eventId)
      .then(({ data }) => {
        setComments(data);
      })
      .catch((err) => {
        console.dir(err.response.data);
      });
    if (event.creator.username === user.username) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [event]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       navigation.goBack();
  //     };
  //   }, [])
  // );

  return (
    <View
      style={{
        backgroundColor: "lightgrey",
      }}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView style={styles.contentsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.backContainer}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              return navigation.navigate("MeetsPage");
            }}
          >
            <Text style={{ marginVertical: 5, fontWeight: "bold" }}>
              <MaterialIcons name="arrow-back-ios" size={28} color="black" />
            </Text>
          </Pressable>
        </View>
        <View style={styles.topContainer}>
          <View style={styles.topRow}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.topRowButtons}>
              {isSelf ? (
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    deleteEvent(event.event_id);
                    navigation.navigate("MeetsPage");
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              ) : null}
              {isSelf ? (
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    handleEditEvent(event.event_id);
                  }}
                >
                  {isSelf ? <Text style={styles.buttonText}>Edit</Text> : null}
                </Pressable>
              ) : null}
              <Pressable
                style={styles.button}
                onPress={() => {
                  // backend patch: just send event id and body,
                  // which is an updated event object
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
                    setJoined(true);
                  }
                }}
              >
                <Text style={styles.buttonText}>{joined ? "Leave" : "Join"}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.middleRows}>
            <View style={styles.leftMiddleSide}>
              <Text style={styles.eventDetailText}>
                Category:{event.category}
                {/* {event.categories.length > 0 ? event.categories[0].categorySlug : "none"} */}
              </Text>
              <Text style={styles.eventDetailText}>
                <Text>Creator: </Text>{" "}
                <Pressable
                  onPress={() => {
                    getUser(user.token, event.creator.username).then((res) => {
                      setViewedUser(res.data);
                      return navigation.navigate("ViewUser");
                    });
                  }}
                >
                  <Text style={styles.eventCreatorButton}>{event.creator.username}</Text>
                </Pressable>
              </Text>
              <Text style={styles.eventDetailText}>
                Date: {event.eventStart.slice(0, 10).replaceAll("-", "/")}
              </Text>
              <Text style={styles.eventDetailText}>
                Time: {event.eventStart.slice(11, 16)} - {event.eventEnd.slice(11, 16)}
              </Text>
            </View>
            <View style={styles.rightMiddleSide}>
              <Image
                source={{
                  uri: `${
                    Categories.filter((cat) => cat.category_name === event.category)[0][
                      "image_url"
                    ]
                  }`,
                }}
                style={styles.eventImage}
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
        <View style={styles.participantsContainer}>
          <Text style={{ color: "white", paddingTop: 5, fontWeight: "bold" }}>
            Participants:{" "}
          </Text>
          <View style={{ flexDirection: "row", padding: 5 }}>
            {event.participants.map((participant) => {
              return (
                <Pressable
                  key={participant.username}
                  onPress={() => {
                    getUser(user.token, participant.username).then((res) => {
                      setViewedUser(res.data);
                      return navigation.navigate("ViewUser");
                    });
                  }}
                  style={styles.participant}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ textDecorationLine: "none" }}> </Text>
                    <Text style={styles.participantButtonText}>
                      {participant.username}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.mapWrapper}>
          <Pressable
            style={styles.mapButton}
            onPress={() => {
              if (mapOpened) {
                setMapOpened(false);
              } else {
                setMapOpened(true);
              }
            }}
          >
            {mapOpened ? (
              <Text style={styles.buttonText}>Collapse map</Text>
            ) : (
              <Text style={styles.buttonText}>Open map</Text>
            )}
          </Pressable>
          {mapOpened ? (
            <View>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: 53.47791641806832,
                    longitude: -2.242188787189367,
                    latitudeDelta: 0.4522,
                    longitudeDelta: 1.1421,
                  }}
                >
                  <MapView.Marker
                    title={event.name}
                    description={event.description}
                    coordinate={{
                      latitude: event.location.latitude,
                      longitude: event.location.longitude,
                    }}
                  />
                </MapView>
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.commentsContainer}>
          <View style={styles.commentTopRow}>
            <Text style={{ fontWeight: "bold", color: "white", padding: 5 }}>
              Comments
            </Text>
            {user.username ? (
              <Pressable
                style={styles.button}
                onPress={() => {
                  // *** need to make postComment at backend
                  // postComment(event.event_id);
                  // isPosting... state
                }}
              >
                <Text style={styles.buttonText}>Post Comment</Text>
              </Pressable>
            ) : null}
          </View>
          {comments.map((comment) => {
            return <CommentCard key={comment._id} comment={comment} />;
          })}
        </View>
      </ScrollView>
      <View style={styles.ChatContainer}>
        <SlidingPanel
          onAnimationStop={() => setChatOn(true)}
          panelPosition="bottom"
          headerLayoutHeight={100}
          headerLayout={() => (
            <View style={styles.headerLayoutStyle}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                ⇡
              </Text>
              <Text style={styles.commonTextStyle}>Live Chat!</Text>
            </View>
          )}
          slidingPanelLayout={() => (
            <View style={styles.slidingPanelLayoutStyle}>{chatOn ? <Chat /> : null}</View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight)),
  },
  contentsContainer: {
    flexDirection: "column",
    marginHorizontal: 30,
    marginBottom: 55,
    height: 700,
  },
  topContainer: {
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#8E806A",
    borderRadius: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "#4A403A",
  },
  eventTitle: {
    fontSize: 20,
    color: "white",
  },
  button: {
    borderRadius: 10,
    backgroundColor: "lightgrey",
    fontSize: 16,
    padding: 5,
    height: 24,
    marginHorizontal: 5,
  },
  mapButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "lightgrey",
    marginVertical: 10,
    marginHorizontal: 100,
  },
  middleRows: {
    marginVertical: 10,
    flexDirection: "row",
  },
  leftMiddleSide: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-around",
  },
  rightMiddleSide: {
    flex: 1,
  },
  eventImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  eventDetailText: {
    fontSize: 16,
    color: "white",
  },
  eventDescription: {
    fontSize: 12,
    marginVertical: 5,
    borderRadius: 10,
    color: "white",
    padding: 10,
    backgroundColor: "#8E806A",
  },
  participantsContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    borderRadius: 10,

    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#8E806A",
  },
  mapWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#8E806A",
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    width: 290,
    height: 290,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  commentsContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    borderRadius: 10,

    padding: 5,
    marginVertical: 5,
    marginBottom: 50,
    backgroundColor: "#8E806A",
  },
  headerLayoutStyle: {
    width: windowWidth,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#8E806A",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  slidingPanelLayoutStyle: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 100),
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
  },
  commonTextStyle: {
    color: "white",
    fontSize: 18,
  },
  ChatContainer: {
    flex: 1,
  },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A403A",
    marginTop: 10,
  },

  participantButtonText: {
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "blue",
  },
  participantSpacer: {
    textDecorationLine: "none",
  },
  participant: {
    flex: 1,
  },
  eventCreatorButton: {
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "blue",
  },
  topRowButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 5,
  },
  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
