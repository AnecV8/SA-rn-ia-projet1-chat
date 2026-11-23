import { StyleSheet, Text, View } from 'react-native';
import SocrateAvatar from './SocrateAvatar';
import { colors } from '../constants/theme';
import { formatTime } from '../utils/formatTime';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
            {!isUser ? <SocrateAvatar /> : null}

            <View style={[styles.column, isUser && styles.columnUser]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={isUser ? styles.userText : styles.aiText}>{message.text}</Text>
                </View>
                <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
    rowUser: { justifyContent: 'flex-end' },
    rowAi: { justifyContent: 'flex-start' },

    column: { maxWidth: '78%', alignItems: 'flex-start' },
    columnUser: { alignItems: 'flex-end' },

    bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
    userBubble: { backgroundColor: colors.aegean, borderBottomRightRadius: 4 },
    aiBubble: {
        backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.goldLight,
        borderBottomLeftRadius: 4,
    },

    userText: { color: colors.white, fontSize: 16, lineHeight: 22 },
    aiText: { color: colors.text, fontSize: 16, lineHeight: 22 },
    time: { fontSize: 11, color: colors.textMuted, marginTop: 3, marginHorizontal: 4 },
});