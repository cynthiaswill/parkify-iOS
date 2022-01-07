import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { postNewUser } from "../utils/nh-api";
import { UserContext } from "../contexts/user-context";
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    dateOfBirth: "",
  });
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date("2000-01-01T00:00:00"));

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
    // check if all fields are filled out
    // set error to null
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
    } else if (
      !/^\d{4}-\d{2}-\d{2}$/.test(newUser.dateOfBirth) ||
      newUser.dateOfBirth > new Date().toISOString().substring(0, 10)
    ) {
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

  const onDateChange = (event, value) => {
    setDate(value);
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
          <Text style={{ margin: 10, fontWeight: "bold" }}>
            <MaterialIcons name="arrow-back-ios" size={30} color="black" />
            <View>
              <Text style={{ fontSize: 18 }}>Back</Text>
            </View>
          </Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <KeyboardAwareScrollView extraScrollHeight={225} style={styles.wholeScroll}>
          <Image style={styles.image} source={require("../logo.jpg")} />
          <View style={{ alignSelf: "center" }}>
            <TextInput
              style={styles.input}
              value={newUser.username}
              onChangeText={(text) => {
                handleFormChanges(text, "username");
              }}
              placeholder="Username:"
            />

            <TextInput
              style={styles.input}
              value={newUser.password}
              onChangeText={(text) => {
                handleFormChanges(text, "password");
              }}
              placeholder="Password:"
              secureTextEntry={true}
            />

            <TextInput
              style={styles.input}
              value={newUser.displayName}
              onChangeText={(text) => handleFormChanges(text, "displayName")}
              placeholder="Display Name:"
            />

            <TextInput
              style={styles.input}
              value={newUser.pronouns}
              onChangeText={(text) => handleFormChanges(text, "pronouns")}
              placeholder="Pronouns:"
            />

            <TextInput
              style={styles.input}
              value={newUser.email}
              onChangeText={(text) => handleFormChanges(text, "email")}
              placeholder="email:"
            />
          </View>

          <View style={styles.datePickerContainer}>
            <View style={styles.DOB}>
              <Text style={{ fontSize: 14, alignSelf: "center" }}>Date of Birth</Text>
            </View>
            <DateTimePicker
              value={date}
              mode={"date"}
              display={"default"}
              is24Hour={true}
              onChange={onDateChange}
              style={styles.datePicker}
            />
          </View>

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
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    padding: 3,
    fontSize: 18,
    borderRadius: 4,
    backgroundColor: "white",
    width: 200,
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
    width: 160,
    height: 160,
    borderRadius: 80,
    margin: 20,
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
  },

  datePickerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
    alignSelf: "center",
    backgroundColor: "white",
    width: 220,
  },
  DOB: {
    flex: 4,
    width: 100,
  },
  // This only works on iOS
  datePicker: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 5,
    alignSelf: "flex-start",
  },
});
