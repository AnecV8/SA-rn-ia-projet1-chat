import { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform,
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import { askAI } from './services/ai';

export default function App() {
  const [messages, setMessages] = useState([]);       // l'historique de la conversation
  const [isLoading, setIsLoading] = useState(false);  // true pendant que l'IA répond
  const [error, setError] = useState(null);           // message d'erreur, ou null s'il n'y en a pas
  const listRef = useRef(null);                       // une "poignée" sur la FlatList pour la faire défiler

  // Demande une réponse à l'IA pour un historique donné.
  async function fetchReply(history) {
    setIsLoading(true);
    setError(null);
    try {
      const reply = await askAI(history);
      const aiMessage = { id: `${Date.now()}-ai`, role: 'assistant', text: reply };
      setMessages([...history, aiMessage]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false); // exécuté dans tous les cas, succès ou erreur
    }
  }

  function handleSend(text) {
    const userMessage = { id: `${Date.now()}-user`, role: 'user', text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    fetchReply(newHistory);
  }

  // Le message de l'utilisateur est déjà dans la liste : on redemande juste la réponse.
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
          <Text style={styles.title}>🏛️ Socrate</Text>
          {messages.length > 0 ? (
            <Pressable
              onPress={handleNewConversation}
              disabled={isLoading}
              style={[styles.newButton, isLoading && styles.newButtonDisabled]}
            >
              <Text style={styles.newButtonText}>New Chat</Text>
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
            ListEmptyComponent={<Text style={styles.empty}>« Je sais que je ne sais rien. »{'\n'}Et toi, que crois-tu savoir ?</Text>}
          />

          {isLoading ? <ActivityIndicator style={styles.loader} size="small" /> : null}

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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { justifyContent: 'center', paddingVertical: 12 },
  flex: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  list: { padding: 12, flexGrow: 1 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  loader: { marginVertical: 8 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, margin: 8, padding: 12,
    backgroundColor: '#FEE2E2', borderRadius: 12,
  },
  errorText: { flex: 1, color: '#991B1B' },
  retryButton: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  newButton: {
    position: 'absolute', right: 12,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1, borderColor: '#4F46E5',
  },
  newButtonDisabled: { opacity: 0.4 },
  newButtonText: { color: '#4F46E5', fontWeight: '600' },
});