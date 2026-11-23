import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import SocrateAvatar from './SocrateAvatar';
import { colors } from '../constants/theme';

// Un point qui clignote, avec un décalage (delay) pour créer la "vague".
function Dot({ delay }) {
    // useRef garde la même valeur animée d'un affichage à l'autre.
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
                Animated.delay(600 - delay), // durée totale identique pour chaque point → la vague reste régulière
            ]),
        );
        animation.start();
        return () => animation.stop(); // nettoyage : on arrête l'animation quand le composant disparaît
    }, [delay, opacity]);

    return <Animated.View style={[styles.dot, { opacity }]} />;
}

export default function TypingIndicator() {
    return (
        <View style={styles.row}>
            <SocrateAvatar />
            <View style={styles.bubble}>
                <Text style={styles.label}>Socrate réfléchit</Text>
                <Dot delay={0} />
                <Dot delay={200} />
                <Dot delay={400} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
    bubble: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomLeftRadius: 4,
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.goldLight,
    },
    label: { color: colors.textMuted, fontStyle: 'italic', marginRight: 4 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
});