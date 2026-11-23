import { SYSTEM_PROMPT } from './prompts';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY;
const MODEL = process.env.EXPO_PUBLIC_AI_MODEL || 'llama-3.3-70b-versatile';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const TIMEOUT_MS = 15000;   // au-delà de 15 s, on abandonne
const MAX_HISTORY = 20;     // on n'envoie que les 20 derniers messages

// ---------- Mode mock ----------

const MOCK_REPLIES = [
    "Tu dis cela avec assurance… mais comment sais-tu que c'est vrai ? (réponse simulée)",
    "Intéressant. Peux-tu me donner un exemple où ce ne serait pas le cas ? (réponse simulée)",
    "Je sais que je ne sais rien. Et toi, que crois-tu savoir exactement ? (réponse simulée)",
];

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockReply(messages) {
    await wait(1000);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.text.toLowerCase().includes('erreur')) {
        throw new Error('Erreur simulée (mode mock). Appuie sur Réessayer.');
    }
    const index = Math.floor(Math.random() * MOCK_REPLIES.length);
    return MOCK_REPLIES[index];
}

// ---------- Vraie API (Groq, format compatible OpenAI) ----------

// Convertit nos messages ({ id, role, text }) au format attendu par l'API ({ role, content }),
// et ajoute le prompt système en tête.
function toApiMessages(messages) {
    const recent = messages.slice(-MAX_HISTORY);
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recent.map((m) => ({ role: m.role, content: m.text })),
    ];
}

async function realReply(messages) {
    if (!API_KEY) {
        throw new Error("Clé d'API manquante : remplis EXPO_PUBLIC_AI_API_KEY dans .env, ou active le mode mock.");
    }

    // Timeout : si l'API ne répond pas à temps, on annule la requête.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response;
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: toApiMessages(messages),
                temperature: 0.7,
                max_tokens: 300,
            }),
            signal: controller.signal,
        });
    } catch (e) {
        if (e.name === 'AbortError') {
            throw new Error('Socrate met trop de temps à répondre. Réessaie.');
        }
        throw new Error('Pas de connexion internet. Vérifie ton réseau puis réessaie.');
    } finally {
        clearTimeout(timer);
    }

    // Le serveur a répondu, mais avec un code d'erreur.
    if (!response.ok) {
        if (response.status === 401) throw new Error("Clé d'API invalide. Vérifie ton fichier .env.");
        if (response.status === 429) throw new Error('Quota dépassé. Attends un peu puis réessaie.');

        // Pour les autres erreurs, on lit l'explication renvoyée par l'API.
        const errorData = await response.json().catch(() => null);
        const detail = errorData?.error?.message ?? 'aucun détail';
        console.log('Erreur API :', response.status, detail); // visible dans le terminal
        throw new Error(`Erreur du serveur IA (code ${response.status}).`);
    }

    const data = await response.json();
    // On vérifie la forme de la réponse au lieu de lui faire confiance aveuglément.
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
        throw new Error("Socrate est resté muet (réponse vide). Réessaie.");
    }
    return text;
}

// ---------- Point d'entrée unique ----------

export async function askAI(messages) {
    return USE_MOCK ? mockReply(messages) : realReply(messages);
}