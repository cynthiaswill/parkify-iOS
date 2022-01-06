import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Picker,
  DatePicker,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import EventCard from "../components/EventCard.js";
//import { getParks, getEvents, getCategories } from "../utils/api.js";
import { getEvents } from "../utils/nh-api.js";
// import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewEvent } from "./ViewEvent.js";
import { ViewUser } from "./ViewUser.js";
import { useContext } from "react";
import { UserContext } from "../contexts/user-context.js";
import MapView from "react-native-maps";
import Categories from "../constants/Categories.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Meets = () => {
  const [categoryValue, setCategoryValue] = useState("All categories");

  const [joinedOptions, setJoinedOptions] = useState([
    { label: "All events", value: "All events" },
    { label: "Joined events", value: "Joined events" },
    { label: "Not joined", value: "Not joined" },
  ]);

  const [joinedValue, setJoinedValue] = useState("All events");
  const [joinedClicked, setJoinedClicked] = useState(false);
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);
  // const navigation = useNavigation();

  useEffect(() => {
    if (joinedClicked) setJoinedClicked(false);
    getEvents(user.token, categoryValue).then(({ data }) => {
      const events = [];

      if (joinedValue === "Joined events") {
        data.events.forEach((event) => {
          let joined = false;
          event.participants.forEach((person) => {
            if (person.username === user.username) joined = true;
          });
          if (joined === true) events.push(event);
        });
      } else if (joinedValue === "Not joined") {
        data.events.forEach((event) => {
          let joined = false;
          event.participants.forEach((person) => {
            if (person.username === user.username) joined = true;
          });
          if (joined === false) events.push(event);
        });
      } else {
        data.events.forEach((event) => events.push(event));
      }

      setEvents(events);
    });
  }, [categoryValue, joinedValue, joinedClicked]);

  const [mapOpened, setMapOpened] = useState(true);

  const Stack = createNativeStackNavigator();

  const MeetsPage = () => {
    return (
      <View style={styles.wholePage}>
        {/* <ImageBackground
          source={"https://i.makeagif.com/media/8-27-2015/1NpjsX.gif"}
          resizeMode="cover"
          style={styles.background}
        > */}
        <View style={styles.topSelectorRow}>
          <Picker
            style={styles.pickerStyle}
            selectedValue={categoryValue}
            onValueChange={(itemValue, itemIndex) => {
              setCategoryValue(itemValue);
            }}
          >
            <Picker.Item
              key="All categories"
              label="All categories"
              value="All categories"
            />
            {Categories.map((cat) => {
              return (
                <Picker.Item
                  key={cat.category_name}
                  label={cat.category_name}
                  value={cat.category_name}
                />
              );
            })}
          </Picker>
          {/* <TextInput
            style={styles.dateInput}
            value={eventDate}
            onChangeText={setEventDate}
            placeholder="DD/MM/YYYY"
          /> */}

          {/* <DatePicker
            defaultDate={new Date(2021, 4, 4)}
            minimumDate={new Date(2021, 1, 1)}
            maximumDate={new Date(2021, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            disabled={false}
            onChange={setEventDate}
            value={eventDate}
          />
          <Text>{eventDate.toString().substr(4, 12)}</Text> */}

          <Picker
            style={styles.pickerStyle}
            selectedValue={joinedValue}
            onValueChange={(itemValue, itemIndex) => setJoinedValue(itemValue)}
          >
            {joinedOptions.map((opt) => {
              return <Picker.Item key={opt.label} label={opt.label} value={opt.value} />;
            })}
          </Picker>
        </View>
        <View style={styles.secondRowContainer}>
          <Pressable
            style={styles.button}
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
                  {events.map((eachEvent) => {
                    return (
                      <MapView.Marker
                        key={eachEvent.title}
                        title={eachEvent.title}
                        description={eachEvent.description}
                        coordinate={{
                          latitude: eachEvent.location.latitude,
                          longitude: eachEvent.location.longitude,
                        }}
                      />
                    );
                  })}
                </MapView>
              </View>
            </View>
          ) : null}
        </View>
        <ScrollView>
          {events.length === 0 ? (
            <Text>No events here</Text>
          ) : (
            events.map((currentEvent) => {
              return (
                <EventCard
                  key={currentEvent._id}
                  // navigation={navigation}
                  currentEvent={currentEvent}
                  setJoinedClicked={setJoinedClicked}
                />
              );
            })
          )}
        </ScrollView>
        {/* </ImageBackground> */}
      </View>
    );
  };

  return (
    <Stack.Navigator initialRouteName="MeetsPage">
      <Stack.Screen
        name="MeetsPage"
        component={MeetsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewEvent"
        component={ViewEvent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewUser"
        component={ViewUser}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 50),
    backgroundColor: "lightgrey",
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },

  topSelectorRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  pickerStyle: {
    height: 25,
    width: 130,
    marginTop: 10,
    backgroundColor: "#8E806A",
    borderRadius: 10,
    borderWidth: 1,
    color: "white",
  },
  dateInput: {
    maxWidth: 100,
    marginTop: 10,
    height: 25,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
  },

  secondRowContainer: {
    marginTop: 25,
    flexDirection: "column",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#8E806A",
    marginVertical: 10,
    marginHorizontal: 100,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    width: 300,
    height: 300,
    marginHorizontal: 50,
    borderRadius: 10,
    overflow: "hidden",
  },
});
