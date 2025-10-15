import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  const { name, userID } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });

    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  }

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

 return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ 
            _id: userID,
            name: name
          }}
          renderBubble={renderBubble}
          placeholder="Type a message..."
          alwaysShowSend
          keyboardShouldPersistTaps="handled"
          textInputProps={{
            autoCorrect: false,
            autoCapitalize: 'none',
          }}
        />
        {Platform.OS !== 'web' && (
          <KeyboardAvoidingView behavior="padding" />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default Chat;
