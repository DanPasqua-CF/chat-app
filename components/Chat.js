import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  // Add safety checks
  if (!route || !route.params) {
    console.error('Route or route.params is undefined');
    return null;
  }
  
  const { name, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: name });

    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
    setText('');
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
      <GiftedChat
        messages={messages}
        onSend={onSend}
        text={text}
        onInputTextChanged={setText}
        user={{ 
          _id: userID,
          name: name
        }}
        renderBubble={renderBubble}
        placeholder="Type a message..."
        alwaysShowSend
        minComposerHeight={40}
        maxComposerHeight={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default Chat;
