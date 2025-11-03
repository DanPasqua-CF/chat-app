import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, KeyboardAvoidingView, View } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const { _id, text, createdAt, user } = newMessages[0];
      try {
        await addDoc(collection(db, "messages"), {
          _id,
          text,
          createdAt,
          user,
        });
      } catch (err) {
        console.error("Send error:", err);
      }
    },
    [db]
  );

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
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
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputPrimary}
    />
  );

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
