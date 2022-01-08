import DateTimePicker from "@react-native-community/datetimepicker";
import TextField from "@material-ui/core/TextField";

export default function DatePicker() {
  return (
    <>
      {Platform.OS === "ios" ? (
        <View style={styles.datePickerContainer}>
          <View style={styles.DOB}>
            <Text style={{ fontSize: 15, alignSelf: "center" }}>Date of Birth</Text>
          </View>
          <DateTimePicker
            value={date}
            mode={"datetime"}
            display={"default"}
            is24Hour={true}
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>
      ) : (
        <View style={{ alignSelf: "center", marginTop: 10 }}>
          <TextField
            id="date"
            label="Choose your Birthdate"
            type="datetime-local"
            defaultValue="2000-01-01T00:00"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "lightgrey",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "grey",
    marginVertical: 2,
  },
});
