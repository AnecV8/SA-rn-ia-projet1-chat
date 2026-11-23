
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const MOCK_REPLIES = [
    "Bonne question ! (réponse simulée du mode mock)",
    "Je suis en mode démo : aucune vraie IA n'a été appelée.",
    "Voici une réponse factice pour tester l'affichage des bulles.",
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



export async function askAI(messages) {
    if (USE_MOCK) {
        return mockReply(messages);
    }

    throw new Error("La vraie API n'est pas encore branchée. Active le mode mock.");
}