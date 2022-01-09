import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView from "react-native-maps";
import MapMarkers from "../constants/MapMarkers.js";
import Categories from "../constants/Categories.js";
import { postEvent } from "../utils/nh-api.js";
import { UserContext } from "../contexts/user-context.js";
import { EventContext } from "../contexts/event-context.js";
import Container from "../components/Container";
import DropDownPicker from "react-native-dropdown-picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const CreateMeets = () => {
  const { user } = useContext(UserContext);
  const { event, setEvent } = useContext(EventContext);
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [categories, setCategories] = useState([
    ...Categories.map((cat) => {
      return {
        label: cat.category_name,
        value: cat.category_name,
      };
    }),
  ]);
  const navigation = useNavigation();

  const [formResult, setFormResult] = useState({
    title: "",
    description: "",
    creator: "",
    category: "",
    location: {},
    eventImage: "",
    eventStart: "",
    eventEnd: "",
  });
  const [markerClicked, setMarkerClicked] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleFormInput = (text, keyToChange) => {
    setFormResult((prev) => {
      const newState = { ...prev };
      newState[keyToChange] = text;
      return newState;
    });
  };

  const handleCategoryPicker = (category) => {
    setCategoryValue(category);
    setFormResult((prev) => {
      const newState = { ...prev };
      newState.category = "";
      if (category !== "Pick a category:") {
        newState.category = category;
      }
      return newState;
    });
  };

  const handleLocationPick = (park) => {
    setFormResult((prev) => {
      const newState = { ...prev };
      newState.location = park;
      return newState;
    });
  };

  const handleDateBlur = () => {
    const formStartDate = `${startDate}T${startTime}:00.000Z`;
    const formEndDate = `${endDate}T${endTime}:00.000Z`;
    setFormResult((prev) => {
      const newState = { ...prev };
      newState.eventStart = formStartDate;
      newState.eventEnd = formEndDate;
      return newState;
    });
  };

  const handleSubmit = () => {
    postEvent(user.token, formResult)
      .then((res) => {
        setEvent(res.data.eventId);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  // const uploadEventImage = () => {};

  return (
    <View style={styles.wholePage}>
      <View style={styles.formContainer}>
        <View style={styles.formRow1}>
          {Platform.OS === "ios" || Platform.OS === "android" ? (
            <View style={styles.iOSInput}>
              <Container.TextField
                onChangeText={(text) => handleFormInput(text, "title")}
                label="Title:"
              />
            </View>
          ) : (
            <View style={styles.Input}>
              <Container.TextField
                onChangeText={(text) => handleFormInput(text, "title")}
                placeholder="Title:"
              />
            </View>
          )}
          <DropDownPicker
            items={categories}
            defaultIndex={0}
            onChangeItem={(item) => handleCategoryPicker(item)}
            containerStyle={styles.Picker}
          />
        </View>
        <View style={styles.inputDescription}>
          {Platform.OS === "ios" || Platform.OS === "android" ? (
            <Container.OutlinedTextField
              onChangeText={(text) => handleFormInput(text, "description")}
              label="Please give a description ..."
              multiline={true}
            />
          ) : (
            <Container.TextField
              onChangeText={(text) => handleFormInput(text, "description")}
              label="Please give a description ..."
              multiline={true}
            />
          )}
        </View>

        <View style={styles.formRow3}>
          <Text style={styles.row3Labels}>Start:</Text>
          <Text style={styles.row3Labels}>End:</Text>
        </View>
        <View style={styles.formRow4}>
          <View style={styles.eventStartContainer}>
            <TextInput
              style={styles.dateInput}
              value={startDate}
              onChangeText={setStartDate}
              onBlur={handleDateBlur}
              placeholder="YYYY-MM-DD"
              maxLength={10}
            />
            <TextInput
              style={styles.timeInput}
              value={startTime}
              onChangeText={setStartTime}
              handleDateBlur={handleDateBlur}
              placeholder="HH:MM"
              maxLength={5}
            />
          </View>
          <View style={styles.eventEndContainer}>
            <TextInput
              style={styles.dateInput}
              value={endDate}
              onChangeText={setEndDate}
              onBlur={handleDateBlur}
              placeholder="YYYY-MM-DD"
              maxLength={10}
            />
            <TextInput
              style={styles.timeInput}
              value={endTime}
              onChangeText={setEndTime}
              onBlur={handleDateBlur}
              placeholder="HH:MM"
              maxLength={5}
            />
          </View>
        </View>
      </View>
      <View style={styles.formRow5}>
        <View style={styles.mapContainer}>
          <Text>Pick a park to hold your event:</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 53.47791641806832,
              longitude: -2.242188787189367,
              latitudeDelta: 0.4522,
              longitudeDelta: 1.1421,
            }}
          >
            {MapMarkers.map((park) => {
              return (
                <MapView.Marker
                  key={park.parkId}
                  title={park.name}
                  description={park.description}
                  coordinate={{
                    latitude: park.latitude,
                    longitude: park.longitude,
                  }}
                  onPress={() => {
                    handleLocationPick(park);
                    setMarkerClicked(true);
                  }}
                />
              );
            })}
          </MapView>
          {markerClicked ? (
            <Text style={styles.mapText}>{formResult.location.name} selected!</Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <View style={styles.buttonContainer}>
          {/* <Pressable
            style={styles.button}
            onPress={() => {
              uploadEventImage;
            }}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </Pressable> */}

          <Pressable
            style={styles.button}
            onPress={() => {
              handleSubmit();
              navigation.navigate("Find Event");
            }}
          >
            <Text style={styles.buttonText}>Submit!</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 60),
    backgroundColor: "lightgrey",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
    paddingTop: 10,
  },

  Input: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    marginRight: 5,
    maxWidth: 150,
    padding: 1,
    fontSize: 18,
    borderRadius: 5,
    width: 150,
    alignSelf: "stretch",
  },
  iOSInput: {
    marginBottom: 10,
    marginRight: 5,
    maxWidth: 150,
    padding: 1,
    fontSize: 18,
    height: 45,
    borderRadius: 5,
    width: 150,
  },
  inputDescription: {
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,
    padding: 1,
    fontSize: 18,
    borderRadius: 5,
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#8E806A",
    elevation: 3,
    marginVertical: 10,
    marginTop: 40,
    width: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  formRow1: {
    flexDirection: "row",
    zIndex: 5000,
    justifyContent: "center",
    alignSelf: "center",
    height: Platform.OS === "ios" || Platform.OS === "android" ? 100 : 30,
    marginTop: Platform.OS === "ios" || Platform.OS === "android" ? 5 : 30,
    marginBottom: Platform.OS === "ios" || Platform.OS === "android" ? 0 : 10,
  },

  pickerStyle: {
    height: 100,
    width: 150,
    overflow: "visible",
  },
  Picker: {
    flexDirection: "column",
    justifyContent: "center",
    width: 150,
    alignSelf: "center",
    height: 30,
    borderRadius: 10,
  },
  formRow3: {
    marginTop: 10,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  row3Labels: {
    textAlign: "left",
    flex: 1,
    paddingLeft: 8,
  },

  formRow4: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  formRow5: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  eventStartContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
  },
  eventEndContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
  },
  dateInput: {
    maxWidth: 90,
    borderWidth: 1,
    borderColor: "#8E806A",
    borderRadius: 5,
    backgroundColor: "white",
  },
  timeInput: {
    maxWidth: 50,
    borderWidth: 1,
    borderColor: "#8E806A",
    borderRadius: 5,
    backgroundColor: "white",
  },
  mapContainer: {
    flexDirection: "column",
    marginTop: 10,
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  mapText: {
    fontSize: 18,
    marginBottom: 10,
  },
  map: {
    width: 300,
    height: 300,
    marginHorizontal: 50,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    alignSelf: "center",
  },

  error: {
    color: "red",
    fontSize: 18,
    marginBottom: 10,
  },
});
