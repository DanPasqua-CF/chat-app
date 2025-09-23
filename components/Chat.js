import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const { name } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer!",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any"
        }
      },
      {
        _id: 2,
        text: "This is a system message",
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
  <View style={styles.container}>
    <GiftedChat
    renderBubble={renderBubble}
    messages={messages}
    onSend={messages => onSend(messages)}
    user={{
      _id: 1
    }}
  />

  {/* Fix for handling Android keyboard covering message input */}
  { Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : null}
  </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;
