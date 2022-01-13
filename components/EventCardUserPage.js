import { View, Text, StyleSheet, Image } from "react-native";
import Categories from "../constants/Categories.js";

export default function EventCardUserPage({ currentEvent }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainContainer}>
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
              Creator: {currentEvent.creator ? currentEvent.creator.username : null}
            </Text>
            <Text style={{ color: "white" }}>
              {currentEvent.eventStart.slice(11, 16)} -{" "}
              {currentEvent.eventEnd.slice(11, 16)}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={{ color: "white" }}>
              Info:{" "}
              {currentEvent.description.length > 60
                ? `${currentEvent.description.slice(0, 55)}...`
                : currentEvent.description}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#8E806A",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "white",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,
    height: 90,
  },
  eventImage: {
    flex: 1,
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: "column",
    flex: 3,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 3,
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
  },
  creatorButtonText: {
    fontStyle: "italic",
    textDecorationLine: "underline",
    color: "blue",
  },
});
