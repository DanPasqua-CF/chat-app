import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
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
        createdAt: new Date(Date.now() - 2000),
        user: {
          _id: 1,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any"
        }
      },
      {
        _id: 2,
        text: "Hello developer!",
        createdAt: new Date(Date.now() - 1000),
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
  }, [name]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

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
      <SafeAreaView style={styles.safeArea}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          placeholder="Type a message..."
          alwaysShowSend
          keyboardShouldPersistTaps="handled"
          textInputProps={{
            autoCorrect: false,
            autoCapitalize: 'none',
          }}
        />
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
