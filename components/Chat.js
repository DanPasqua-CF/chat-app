import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
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

  // 🔹 Load Firestore messages
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

  // 🔹 Send message
  const handleSend = useCallback(
    async (newMessages = []) => {
      setMessages((prev) => GiftedChat.append(prev, newMessages));
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

  // 🔹 Custom bubble style
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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={(msgs) => handleSend(msgs)}
          user={{ _id: userID, name }}
          renderBubble={renderBubble}
          placeholder="Type a message..."
          alwaysShowSend
          renderAvatarOnTop
          keyboardShouldPersistTaps="handled"
          minComposerHeight={44}
          maxComposerHeight={100}
          textInputProps={{
            editable: true,
            multiline: true,
            style: {
              color: "#000",
              paddingHorizontal: 8,
              fontSize: 16,
            },
          }}
          composerStyle={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
});

export default Chat;
