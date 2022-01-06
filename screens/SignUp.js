import React, { useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Dimensions,
  ImageBackground,
} from "react-native";
import { postNewUser } from "../utils/nh-api";
import { UserContext } from "../contexts/user-context";

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
      return;
    }

    // check if password is at least 8 characters
    if (newUser.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // check if email is valid
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newUser.email)) {
      setError("Please enter a valid email.");
      return;
    }

    // check if date of birth is valid
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(newUser.dateOfBirth) ||
      newUser.dateOfBirth > new Date().toISOString().substring(0, 10)
    ) {
      setError("Please enter a valid date of birth.");
      return;
    }

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
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.popToTop();
      };
    }, [])
  );

  return (
    <View style={styles.wholePage}>
      <View style={styles.backContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            return navigation.navigate("LoginForm");
          }}
        >
          <Text style={styles.arrow}>⇠</Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <Image style={styles.image} source={require("../logo.jpg")} />

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

        <TextInput
          style={styles.input}
          value={newUser.dateOfBirth}
          onChangeText={(text) => handleFormChanges(text, "dateOfBirth")}
          placeholder="Date of birth: (YYYY-MM-DD)"
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.buttons}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {photo && (
            <>
              <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100 }} />
              <Pressable style={styles.button} onPress={handleUploadPhoto}>
                <Text style={styles.buttonText}>Upload Avatar</Text>
              </Pressable>
            </>
          )}
          <Pressable style={styles.button} onPress={handleChoosePhoto}>
            <Text style={styles.buttonText}>Choose Avatar</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {photo && (
            <>
              <Image source={{ uri: photo.uri }} style={{ width: 150, height: 150 }} />
              <Pressable style={styles.button} onPress={handleUploadPhoto}>
                <Text style={styles.buttonText}>Upload Profile Picture</Text>
              </Pressable>
            </>
          )}
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 50),
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
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 1,
    borderColor: "#8E806A",
    padding: 3,
    fontSize: 18,
    borderRadius: 4,
    backgroundColor: "white",
  },

  formContainer: {
    flex: 1,
    alignItems: "center",
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
    marginVertical: 10,
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
  },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A403A",
    margin: 20,
  },
  error: {
    color: "red",
    fontSize: 18,
  },
});
