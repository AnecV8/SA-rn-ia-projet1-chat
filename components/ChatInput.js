import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChatInput({ onSend, disabled }) {
    const [text, setText] = useState('');


    const canSend = text.trim().length > 0 && !disabled;

    function handleSend() {
        if (!canSend) return;
        onSend(text.trim()); // on prévient le parent
        setText('');         // on vide le champ
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Écris ton message…"
                multiline
            />
            <Pressable
                onPress={handleSend}
                disabled={!canSend}
                style={[styles.button, !canSend && styles.buttonDisabled]}
            >
                <Text style={styles.buttonText}>Envoyer</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'flex-end', padding: 8, gap: 8,
        borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1, maxHeight: 120, paddingHorizontal: 12, paddingVertical: 10,
        borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, fontSize: 16,
    },
    button: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
    buttonDisabled: { backgroundColor: '#A5B4FC' },
    buttonText: { color: '#FFFFFF', fontWeight: '600' },
});