import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import App from "./App";

registerRootComponent(App);

LogBox.ignoreAllLogs(true);
