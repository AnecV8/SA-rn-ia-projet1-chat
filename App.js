import { useRef, useState } from 'react';
import {
  Alert, FlatList, KeyboardAvoidingView, Platform,
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Cinzel_700Bold } from '@expo-google-fonts/cinzel';

import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { askAI } from './services/ai';
import { colors } from './constants/theme';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  // Charge la police. Tant qu'elle n'est pas prête, le titre utilise la police système.
  const [fontsLoaded] = useFonts({ Cinzel_700Bold });

  async function fetchReply(history) {
    setIsLoading(true);
    setError(null);
    try {
      const reply = await askAI(history);
      const aiMessage = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        text: reply,
        createdAt: Date.now(),
      };
      setMessages([...history, aiMessage]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend(text) {
    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
      createdAt: Date.now(),
    };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    fetchReply(newHistory);
  }

  function handleRetry() {
    fetchReply(messages);
  }

  function handleNewConversation() {
    Alert.alert(
      'Nouvelle conversation',
      'Effacer la discussion en cours avec Socrate ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            setError(null);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={[styles.title, fontsLoaded && styles.titleFont]}>SOCRATE</Text>
          <Text style={styles.subtitle}>« Connais-toi toi-même »</Text>
          {messages.length > 0 ? (
            <Pressable
              onPress={handleNewConversation}
              disabled={isLoading}
              style={[styles.newButton, isLoading && styles.newButtonDisabled]}
              accessibilityLabel="Commencer une nouvelle conversation"
            >
              <Text style={styles.newButtonText}>New chat</Text>
            </Pressable>
          ) : null}
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <Text style={styles.empty}>
                « Je sais que je ne sais rien. »{'\n'}Et toi, que crois-tu savoir ?
              </Text>
            }
            ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={handleRetry} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </Pressable>
            </View>
          ) : null}

          <ChatInput onSend={handleSend} disabled={isLoading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  header: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.gold,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.aegean, letterSpacing: 3 },
  titleFont: { fontFamily: 'Cinzel_700Bold', fontWeight: 'normal' },
  subtitle: { fontSize: 12, fontStyle: 'italic', color: colors.gold, marginTop: 2 },
  newButton: {
    position: 'absolute', right: 12,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: colors.aegean,
  },
  newButtonDisabled: { opacity: 0.4 },
  newButtonText: { color: colors.aegean, fontWeight: '600' },

  list: { padding: 12, flexGrow: 1 },
  empty: {
    textAlign: 'center', color: colors.textMuted, fontStyle: 'italic',
    fontSize: 16, lineHeight: 24, marginTop: 60,
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, margin: 8, padding: 12,
    backgroundColor: colors.errorBg, borderRadius: 12,
  },
  errorText: { flex: 1, color: colors.errorText },
  retryButton: { backgroundColor: colors.errorButton, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  retryText: { color: colors.white, fontWeight: '600' },
});