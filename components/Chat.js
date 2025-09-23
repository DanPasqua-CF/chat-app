import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 3,
        text: "Hi there!",
        createdAt: new Date() - 2000,
        user: {
          _id: 1,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any"
        }
      },
      {
        _id: 2,
        text: "Hello developer!",
        createdAt: new Date() - 1000,
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any"
        }
      },
      {
        _id: 1,
        text: `${name} has entered the chat`,
        createdAt: new Date(),
        system: true
      }
    ]);
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
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
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <GiftedChat
          renderBubble={renderBubble}
          messages={messages}
          onSend={onSend}
          user={{ 
            _id: 1 
          }}
          placeholder="Type a message..."
          alwaysShowSend
        />
      </KeyboardAvoidingView>
  </SafeAreaView>
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
