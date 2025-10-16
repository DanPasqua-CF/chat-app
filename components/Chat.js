import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  const { name, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: name });

    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt.toMillis()) : new Date(),
        };
      });
      setMessages(newMessages);
      setLoading(false);
    },
    (error) => {
      Alert.alert("Error", "Failed to load messages.");
      console.error(error);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onSend = async (newMessages = []) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      Alert.alert("Error", "Failed to send message.");
      console.error(error);
    }
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
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
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Chat;
