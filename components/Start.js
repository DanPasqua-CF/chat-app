import React, { useState } from 'react';
import { Alert, ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signInAnonymously } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

const Start = ({ navigation, auth }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const signInUser = () => {
    signInAnonymously(auth)
      .then((res) => {
        navigation.navigate("Chat", { userID: res.user.uid, name: name, backgroundColor: selectedColor });

        Alert.alert("Signin successful");
      })
      .catch((err) => {
        Alert.alert("Login unsuccessful");
        console.error(err);
      });
  };

  return (
    /* Hero image */
    <ImageBackground
      source={require('../assets/BackgroundImage.png')}
      style={styles.image}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Let's Talk</Text>

        {/* Box containing icon.svg, TextInput field and Start chatting button */}
        <View style={styles.box}>
          
          {/* Your name input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#757083" style={styles.icon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="rgba(117, 112, 131, 0.5)"
            />
          </View>

          {/* Start chatting button */}
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Start chatting"
            accessibilityHint="Let's you start chatting"
            style={[styles.button, { backgroundColor: '#757083' }]}
            onPress={signInUser}
          >
            <Text style={styles.buttonText}>Start chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 200,
    textAlign: 'center',
  },
  box: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#757083',
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  button: {
    width: '100%',
    paddingVertical: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCircle: {
    borderColor: '#5F5D66',
  },
});

export default Start;
