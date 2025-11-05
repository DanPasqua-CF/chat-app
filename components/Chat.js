import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, KeyboardAvoidingView, View, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';

// Conditionally import MapView only for native platforms
let MapView = null;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  if (!route?.params) return null;

  const { name, userID } = route.params;
  const [messages, setMessages] = useState([]);
  let unsubMessages;

  /* Load Firestore messages */
  useEffect(() => {
    navigation.setOptions({ title: name });
    if (isConnected === true) {

      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, async (docs) => {
        let newMessages = [];
        docs.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        })
        cacheMessages(newMessages);
        setMessages(newMessages);
      })
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  // Send message
  const handleSend = useCallback(
    async (newMessages = []) => {
      const { _id, text, createdAt, user, image, location } = newMessages[0];
      
      try {
        await addDoc(collection(db, "messages"), {
          _id,
          text,
          createdAt,
          user,
          ...(image && { image }),
          ...(location && { location }),
        });
      } 
      catch (err) {
        console.error("Send error:", err);
      }
    },
    [db]
  );

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } 
    catch (error) {
      console.error('Failed to cache messages', error);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  /* Custom bubble style */
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#fff" },
      }}
      textStyle={{
        right: { color: "#fff" },
        left: { color: "#000" },
      }}
    />
  );

  /* Custom input toolbar */
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    // Only render on native platforms
    if (Platform.OS === 'web') return null;
    
    return (
      <CustomActions 
        userID={userID} 
        storage={storage}
        onSend={handleSend} 
        {...props} 
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    console.log("renderCustomView currentMessage:", currentMessage)
    if (currentMessage.location) {
      console.log("renderCustomView location data:", currentMessage.location);
      const { latitude, longitude } = currentMessage.location;
      
      // For web: show a link to Google Maps
      if (Platform.OS === 'web') {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        return (
          <View style={{
            padding: 10,
            margin: 3,
            borderRadius: 13,
            backgroundColor: '#f0f0f0',
            maxWidth: 150,
          }}>
            <Text style={{ fontSize: 12, marginBottom: 5 }}>📍 Location shared</Text>
            <Text 
              style={{ color: '#007AFF', fontSize: 11, textDecorationLine: 'underline' }}
              onPress={() => window.open(googleMapsUrl, '_blank')}
            >
              View on Google Maps
            </Text>
          </View>
        );
      }
      
      // For native: show MapView
      if (MapView) {
        return (
          <MapView
            style={{
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3
            }}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{ _id: userID, name }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          placeholder="Type a message..."
          alwaysShowSend
          renderAvatarOnTop
          keyboardShouldPersistTaps="handled"
          scrollToBottom
          minComposerHeight={44}
          maxComposerHeight={100}
          textInputProps={{
            editable: true,
            autoFocus: false,
            blurOnSubmit: false,
            returnKeyType: "send",
            enablesReturnKeyAutomatically: true,
            multiline: true,
            style: styles.textInput,
          }}
          textInputStyle={styles.composer}
          listViewProps={{
            keyboardShouldPersistTaps: "handled",
            keyboardDismissMode: Platform.OS === "ios" ? "interactive" : "on-drag",
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  inputPrimary: {
    alignItems: "center",
  },
  textInput: {
    color: "#000",
    fontSize: 16,
    lineHeight: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 4,
    paddingHorizontal: 12,
  },
  composer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 0,
  },
});

export default Chat;
