import { StyleSheet, Text, View } from 'react-native';


export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={isUser ? styles.userText : styles.aiText}>{message.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginVertical: 4 },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#4F46E5' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#E5E7EB' },
    userText: { color: '#FFFFFF', fontSize: 16 },
    aiText: { color: '#111827', fontSize: 16 },
});