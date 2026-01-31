import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, Styles } from '../../../../Theme';
import { Icon } from '../../../../Navigator/router';
import { scaleWidth } from '../../../../Helper/responsive';
import Toast from 'react-native-toast-message';

interface Props {
    onClose: () => void;
}

export default function GuidedAudioPlayer({ onClose }: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [track, setTrack] = useState<'Body Scan' | 'Story'>('Body Scan');

    useEffect(() => {
        // Auto-play simulation
        const timer = setTimeout(() => setIsPlaying(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="arrow-down" size={scaleWidth(24)} color="#AAA" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Guided Sleep</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Track Selector */}
            <View style={[Styles.row, Styles.center, Styles.marginTop24]}>
                <TouchableOpacity onPress={() => setTrack('Body Scan')} style={[styles.trackBtn, track === 'Body Scan' && styles.activeTrack]}>
                    <Text style={[styles.trackText, track === 'Body Scan' && styles.activeTrackText]}>Body Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTrack('Story')} style={[styles.trackBtn, track === 'Story' && styles.activeTrack]}>
                    <Text style={[styles.trackText, track === 'Story' && styles.activeTrackText]}>Sleep Story</Text>
                </TouchableOpacity>
            </View>

            {/* Visualizer / Cover */}
            <View style={[Styles.center, { height: 200, marginTop: 40 }]}>
                {isPlaying ? (
                    <View style={[Styles.center]}>
                        <ActivityIndicator size="large" color={COLORS.TEAL} />
                        <Text style={[Styles.rubicRegualr, { color: '#888', marginTop: 16 }]}>Playing...</Text>
                    </View>
                ) : (
                    <Icon name="moon" size={80} color="#444" />
                )}
            </View>

            {/* Title */}
            <View style={[Styles.center, Styles.marginTop16]}>
                <Text style={[Styles.RubicBold, Styles.fontSize20, { color: 'white' }]}>
                    {track}
                </Text>
                <Text style={[Styles.rubicRegualr, { color: '#888', marginTop: 8 }]}>
                    Soft ambient guidance
                </Text>
            </View>

            {/* Controls */}
            <View style={[Styles.row, Styles.center, { marginTop: 60 }]}>
                <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                    <Icon name={isPlaying ? "pause" : "play"} size={scaleWidth(32)} color="black" style={{ marginLeft: isPlaying ? 0 : 4 }} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#111',
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    headerTitle: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '600'
    },
    trackBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#222',
        marginHorizontal: 8
    },
    activeTrack: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#555'
    },
    trackText: {
        color: '#666',
        fontWeight: '600'
    },
    activeTrackText: {
        color: 'white'
    },
    playBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
