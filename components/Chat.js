import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
  if (!route?.params) return null;

  const { name, userID } = route.params;
  const [messages, setMessages] = useState([]);

  // Load Firestore messages
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const newMsgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text || "",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),
          user: data.user,
        };
      });
      setMessages(newMsgs);
    });
    return unsub;
  }, [db, navigation, name]);

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

  // Custom bubble style
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

  // Custom input toolbar for better styling
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
          // CRITICAL: These props fix the iOS keyboard issue
          keyboardShouldPersistTaps="handled"
          scrollToBottom
          minComposerHeight={44}
          maxComposerHeight={100}
          // CRITICAL: Proper text input configuration
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
          // Better list behavior
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
