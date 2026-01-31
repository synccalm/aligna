import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    visible: boolean;
}

const NightModeOverlay: React.FC<Props> = ({ visible }) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay} pointerEvents="none" />
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FF8C00', // Deep Amber
        opacity: 0.15, // Subtle tint
        zIndex: 9999, // On top of everything
    }
});

export default NightModeOverlay;
