import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        console.log("Button pressed:", buttonIndex);
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
            console.log("Cancelled action sheet");
        }
      },
    );
  };

  const uploadAndSendImage = async (imageURI) => {
    console.log("uploadAndSendImage called with URI:", imageURI);

    const uniqueRefString = generateReference(imageURI);
    console.log("Generated reference:", uniqueRefString);
    
    const newUploadRef = ref(storage, uniqueRefString);
    console.log("Storage reference created:", newUploadRef);
    
    try {
      const response = await fetch(imageURI);
      console.log("Fetch response:", response);
      const blob = await response.blob();
      console.log("Blob created:", blob);
      uploadBytes(newUploadRef, blob)
        .then(async (snapshot) => {
          console.log("Image uploaded successfully:", snapshot);
          
          try {
            const imageURL = await getDownloadURL(snapshot.ref);
            console.log("Download URL obtained:", imageURL);
            onSend([{ user: { _id: userID }, image: imageURL }]);
            console.log("onSend called with image message");
          } 
          catch (error) {
            console.error("Error getting download URL:", error); 
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    } 
    catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const pickImage = async () => {
    console.log("pickImage called");
    
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Media library permissions:", permissions);
    
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      console.log("Image library result:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri);
      } 
      else {
        Alert.alert("Image selection cancelled or no image selected.");
      }
    } 
    else {
      Alert.alert("Permissions haven't been granted for media library.");
    }
  };

  const takePhoto = async () => {
    console.log("takePhoto called");
    
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    console.log("Camera permissions:", permissions);
    
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      console.log("Camera result:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadAndSendImage(result.assets[0].uri);
      } 
      else {
        Alert.alert("Taking photo cancelled or no photo taken.");
      }
    } 
    else {
      Alert.alert("Permissions haven't been granted for camera.");
    }
  };

  const getLocation = async () => {
    console.log("getLocation called");
    
    let permissions = await Location.requestForegroundPermissionsAsync();
    console.log("Location permissions:", permissions);
    
    if (permissions?.granted) {
      try {
        const location = await Location.getCurrentPositionAsync({});
        console.log("Location data:", location);

        if (location) {
          onSend([{
            user: { _id: userID },
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          }]);
          
          console.log("onSend called with location message");
        } 
        else {
          Alert.alert("Error occurred while fetching location");
          console.error("Location object is null after getCurrentPositionAsync");
        }
      } 
      catch (error) {
        Alert.alert("Error occurred while fetching location");
        console.error("Error in getCurrentPositionAsync:", error);
      }
    } 
    else {
      Alert.alert("Permissions haven't been granted for location.");
    }
  };

  const generateReference = (uri) => {
    const imageName = uri.split("/").pop();
    const timeStamp = (new Date()).getTime();
    
    return `${userID}-${timeStamp}-${imageName}`;
  };

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
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
