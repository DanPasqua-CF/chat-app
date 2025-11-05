import { TouchableOpacity, View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {
  const actionSheet = useActionSheet();

  /* Action Sheet menu */
  const onActionPress = () => {
    const options = ["Choose From Library", "Take Picture", "Send Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage();
            break;
          case 1:
            await takePhoto();
            break;
          case 2:
            await handleGetLocation();
            break;
          default:
            return;
        }
      }
    );
  };

  /* Pick an image from Library */
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow access to your photo library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image Picker Error:", err);
      Alert.alert("Error", "Could not select image.");
    }
  };

  /* Take a photo */
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow camera access.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      Alert.alert("Error", "Could not take photo.");
    }
  };

  /* Get location */
  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow location access.");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled && Platform.OS === "android") {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in emulator settings."
        );
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Handle emulator returning default or invalid coordinates
      if (!location || (location.coords.latitude === 0 && location.coords.longitude === 0)) {
        console.warn("Using mock location (emulator likely has no GPS signal).");
        
        location = {
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
        };

        Alert.alert("Mock Location", "Using mock location for emulator testing.");
      }

      console.log("Fetched Location:", location);

      const message = {
        _id: Date.now(),
        createdAt: new Date(),
        user: { _id: userID },
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };

      onSend?.([message]);
    } 
    catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch your location.");
    }
  };

  /* Upload and send image */
  const generateReference = (uri) => {
    const imageName = uri.split("/").pop();
    const timeStamp = new Date().getTime();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();

      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);

      onSend?.([
        {
          _id: Date.now(),
          createdAt: new Date(),
          user: { _id: userID },
          image: imageURL,
        },
      ]);
    } catch (err) {
      console.error("Upload Error:", err);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  /* Custom Action button */
  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
