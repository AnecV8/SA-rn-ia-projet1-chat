import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export default function SocrateAvatar() {
    return (
        <View style={styles.avatar}>
            <Text style={styles.emoji}>🏛️</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 34, height: 34, borderRadius: 17,   // borderRadius = la moitié de la taille → un cercle
        backgroundColor: colors.surface,
        borderWidth: 1.5, borderColor: colors.gold,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 8,
    },
    emoji: { fontSize: 17 },
});