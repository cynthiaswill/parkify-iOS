import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useContext, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { SignUp } from "./SignUp";
import { loginUser } from "../utils/frosty-api";
import { UserContext } from "../contexts/user-context";
import Container from "../components/Container";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Stack = createNativeStackNavigator();

export const Login = ({ navigation }) => {
  const LoginForm = () => {
    const { setUser } = useContext(UserContext);
    const [formData, setFormdata] = useState({
      username: "",
      password: "",
    });

    const [error, setError] = useState(null);
    useEffect(() => {}, [error]);

    const handleInputs = (text, keyToChange) => {
      setFormdata((prev) => {
        const newState = { ...prev, [keyToChange]: text };
        return newState;
      });
    };

    const handleLogin = async () => {
      try {
        const res = await loginUser(formData);
        const resUser = res.data.response.user;
        const resToken = res.data.response.token;
        setUser({
          ...resUser,
          token: resToken,
        });
        navigation.navigate("Home");
      } catch (err) {
        setError(err.response.data.message);
        setFormdata({
          username: "",
          password: "",
        });
      }
    };
    return (
      <View style={styles.pageContainer}>
        <View style={styles.wholePage}>
          <KeyboardAwareScrollView extraScrollHeight={150} style={styles.wholeScroll}>
            <View style={styles.insideContainer}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../logo.jpg")} />
              </View>

              <View style={styles.formContainer}>
                {Platform.OS === "ios" ? (
                  <Container.TextField
                    onChangeText={(text) => handleInputs(text, "username")}
                    label="Username:"
                    containerStyle={{ width: 200 }}
                  />
                ) : (
                  <Container.TextField
                    onChange={(e) => handleInputs(e.target.value, "username")}
                    label="Username:"
                  />
                )}

                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(text) => handleInputs(text, "username")}
                  placeholder="Username:"
                />
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => handleInputs(text, "password")}
                  placeholder="Password:"
                  secureTextEntry={true}
                />
                {error && <Text style={styles.error}>{error}</Text>}
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={styles.buttonText}>Sign up</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  };

  return (
    <Stack.Navigator initialRouteName="LoginForm">
      <Stack.Screen
        name="LoginForm"
        component={LoginForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  wholePage: {
    width: windowWidth,
    height: Number(parseInt(windowHeight) - 60),
    backgroundColor: "lightgrey",
  },
  wholeScroll: {
    flex: 1,
  },
  insideContainer: {
    height: Number(parseInt(windowHeight) - 65),
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: 200,
    width: 200,
    borderRadius: 100,
    alignSelf: "center",
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    padding: 3,
    fontSize: 18,
    borderRadius: 4,
    backgroundColor: "white",
    width: 200,
  },
  buttonContainer: {
    marginTop: 15,
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
  error: {
    color: "darkred",
    margin: 5,
  },
});
