import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { postNewUser } from "../utils/nh-api";
import { UserContext } from "../contexts/user-context";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import Container from "../components/Container";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const SignUp = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    displayName: "",
    pronouns: "",
    email: "",
    dateOfBirth: "01/01/2000",
  });
  const [date, setDate] = useState(new Date("2000-01-01"));

  // const SERVER_URL = "http://localhost:3000";

  // const createFormData = (photo, body = {}) => {
  //   const data = new FormData();

  //   data.append("photo", {
  //     name: photo.fileName,
  //     type: photo.type,
  //     uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  //   });

  //   Object.keys(body).forEach((key) => {
  //     data.append(key, body[key]);
  //   });

  //   return data;
  // };

  const handleChoosePhoto = () => {
    // launchImageLibrary({ noData: true }, (response) => {
    //   // console.log(response);
    //   if (response) {
    //     setPhoto(response);
    //   }
    // });
  };

  const handleUploadPhoto = () => {
    // fetch(`${SERVER_URL}/api/upload`, {
    //   method: "POST",
    //   body: createFormData(photo, { userId: "123" }),
    // })
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log("response", response);
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });
  };

  const handleFormChanges = (text, keyToChange) => {
    setNewUser((prevState) => {
      const newState = { ...prevState };
      newState[keyToChange] = text;
      return newState;
    });
  };

  const handleSubmit = () => {
    console.log(newUser);
    setError(null);
    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.displayName ||
      !newUser.pronouns ||
      !newUser.email ||
      !newUser.dateOfBirth
    ) {
      setError("Please fill out all fields.");
    } else if (newUser.password.length < 8) {
      setError("Password must be at least 8 characters.");
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newUser.email)) {
      setError("Please enter a valid email.");
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(newUser.dateOfBirth)) {
      setError("Please enter a valid date of birth.");
    } else {
      postNewUser(newUser)
        .then((res) => {
          const { User, token } = res.data;
          setUser({
            ...User,
            token: token,
          });
          console.log(user);
          navigation.navigate("User Page");
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    }
  };

  const onDateChange = (value) => {
    setDate(new Date(value));
    const dateString = date.toISOString();
    const newValue =
      dateString.slice(8, 10) +
      "/" +
      dateString.slice(5, 7) +
      "/" +
      dateString.slice(0, 4);
    console.log(newValue);
    handleFormChanges(newValue, "dateOfBirth");
  };

  const onDateChangeIOS = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    const dateString = date.toISOString();
    const newValue =
      dateString.slice(8, 10) +
      "/" +
      dateString.slice(5, 7) +
      "/" +
      dateString.slice(0, 4);
    console.log(newValue);
    handleFormChanges(newValue, "dateOfBirth");
  };

  return (
    <View style={styles.wholePage}>
      <View style={styles.backContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            return navigation.navigate("LoginForm");
          }}
        >
          <Text style={{ marginVertical: 10, marginHorizontal: 15, fontWeight: "bold" }}>
            <MaterialIcons name="arrow-back-ios" size={30} color="black" />
          </Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView extraScrollHeight={225} style={styles.wholeScroll}>
          <Image style={styles.image} source={require("../logo.jpg")} />
          <View style={{ alignSelf: "center" }}>
            <View style={styles.input}>
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Container.TextField
                  onChangeText={(text) => {
                    handleFormChanges(text, "username");
                  }}
                  label="Username:"
                  containerStyle={{ width: 200, maxHeight: 25 }}
                />
              ) : (
                <Container.TextField
                  onChange={(e) => {
                    handleFormChanges(e.target.value, "username");
                  }}
                  label="Username:"
                />
              )}
            </View>
            <View style={styles.input}>
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Container.TextField
                  onChangeText={(text) => handleFormChanges(text, "password")}
                  label="Password:"
                  containerStyle={{ width: 200, maxHeight: 25 }}
                  secureTextEntry={true}
                />
              ) : (
                <Container.TextField
                  onChange={(e) => handleFormChanges(e.target.value, "password")}
                  label="Password:"
                  type="password"
                />
              )}
            </View>
            <View style={styles.input}>
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Container.TextField
                  onChangeText={(text) => {
                    handleFormChanges(text, "displayName");
                  }}
                  label="Display name:"
                  containerStyle={{ width: 200 }}
                />
              ) : (
                <Container.TextField
                  onChange={(e) => {
                    handleFormChanges(e.target.value, "displayName");
                  }}
                  label="Display name:"
                />
              )}
            </View>
            <View style={styles.input}>
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Container.TextField
                  onChangeText={(text) => {
                    handleFormChanges(text, "pronouns");
                  }}
                  label="Pronouns:"
                  containerStyle={{ width: 200 }}
                />
              ) : (
                <Container.TextField
                  onChange={(e) => {
                    handleFormChanges(e.target.value, "pronouns");
                  }}
                  label="Pronouns:"
                />
              )}
            </View>
            <View style={styles.input}>
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Container.TextField
                  onChangeText={(text) => {
                    handleFormChanges(text, "email");
                  }}
                  label="Email:"
                  containerStyle={{ width: 200 }}
                />
              ) : (
                <Container.TextField
                  onChange={(e) => {
                    handleFormChanges(e.target.value, "email");
                  }}
                  label="Email:"
                />
              )}
            </View>
          </View>
          {Platform.OS === "ios" || Platform.OS === "android" ? (
            <View style={styles.datePickerContainer}>
              <View style={styles.DOB}>
                <Text style={{ fontSize: 15, alignSelf: "center", color: "grey" }}>
                  Date of Birth:
                </Text>
              </View>
              <DateTimePicker
                value={date}
                mode={"date"}
                display={"default"}
                is24Hour={true}
                onChange={onDateChangeIOS}
                style={styles.datePicker}
              />
            </View>
          ) : (
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <Container.TextField
                id="date"
                label="Date of Birth:"
                type="date"
                defaultValue="2000-01-01"
                onChange={(e) => {
                  onDateChange(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </View>
          )}

          {error && (
            <View style={{ marginBottom: 10, alignSelf: "center" }}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: Number(parseInt(windowHeight) - 600),
            }}
          >
            {photo && (
              <Pressable style={styles.button} onPress={handleUploadPhoto}>
                <Text style={styles.buttonText}>Upload Profile Picture</Text>
              </Pressable>
            )}
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
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
  title: {
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
  },
  input: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 5,
    padding: 3,
    fontSize: 18,
    borderRadius: 4,
    width: 200,
    height: 45,
  },

  formContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: Number(parseInt(windowHeight) - 110),
  },

  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#8E806A",
    elevation: 3,
    marginVertical: 20,
    width: 150,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },

  image: {
    marginBottom: 15,
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
  },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A403A",
    marginLeft: 20,
  },
  error: {
    color: "darkred",
  },
  wholeScroll: {
    flex: 1,
    width: Number(parseInt(windowWidth)),
  },

  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 5,
    alignSelf: "center",
    width: 220,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  DOB: {
    flex: 4,
  },
  // This only works on iOS
  datePicker: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 5,
    alignSelf: "flex-start",
    borderRadius: 5,
    marginVertical: 2,
  },
});
