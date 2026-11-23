import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState('');
    const canSend = text.trim().length > 0 && !disabled;

    function handleSend() {
        if (!canSend) return;
        onSend(text.trim());
        setText('');
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Interroge Socrate…"
                placeholderTextColor={colors.textMuted}
                multiline
            />
            <Pressable
                onPress={handleSend}
                disabled={!canSend}
                style={[styles.button, !canSend && styles.buttonDisabled]}
                accessibilityLabel="Envoyer le message"
            >
                <Text style={styles.buttonText}>Envoyer</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10,
        borderTopWidth: 1, borderTopColor: colors.goldLight, backgroundColor: colors.background,
    },
    input: {
        flex: 1, maxHeight: 120, paddingHorizontal: 14, paddingVertical: 10,
        backgroundColor: colors.surface, color: colors.text,
        borderWidth: 1, borderColor: colors.goldLight, borderRadius: 20, fontSize: 16,
    },
    button: { backgroundColor: colors.aegean, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
    buttonDisabled: { backgroundColor: colors.aegeanLight },
    buttonText: { color: colors.white, fontWeight: '600' },
});