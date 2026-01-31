/* File : wishlist-details.tsx
 * Description : Calm Wishlist Details Screen with Ambient Hero Image
 * Author : SyncCalm
 * Version : v1.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, StyleSheet, Dimensions, Platform, Animated, Alert, TextInput, Modal, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { WishlistItem, StorageHelper, ChildTask } from '../../../Helper/storage';
import { Icon } from '../../../Navigator/router';
import { COLORS, Styles } from '../../../Theme';
import { scaleWidth } from '../../../Helper/responsive';

type ParamList = {
    'wishlist-details': { item: WishlistItem };
};

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.45;

export default function WishlistDetails(): React.JSX.Element {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'wishlist-details'>>();
    const { item } = route.params;

    const [childTasks, setChildTasks] = useState<ChildTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [progress, setProgress] = useState(0);

    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const tasks = await StorageHelper.getChildTasks(item.id);
        setChildTasks(tasks);
        calculateProgress(tasks);
    };

    const calculateProgress = (tasks: ChildTask[]) => {
        if (tasks.length === 0) {
            setProgress(item.status === 'completed' ? 1 : 0);
            return;
        }
        const completed = tasks.filter(t => t.completed).length;
        setProgress(completed / tasks.length);
    };

    const addChildTask = async () => {
        if (!newTaskTitle.trim()) return;

        const newTask: ChildTask = {
            id: Date.now().toString(),
            wishlistId: item.id,
            title: newTaskTitle.trim(),
            completed: false,
            createdAt: Date.now()
        };

        const updated = await StorageHelper.saveChildTask(newTask);
        setChildTasks(updated);
        setNewTaskTitle('');
        calculateProgress(updated);
    };

    const toggleTask = async (task: ChildTask) => {
        const updatedTask = { ...task, completed: !task.completed };
        const updatedList = await StorageHelper.updateChildTask(updatedTask);
        setChildTasks(updatedList);
        calculateProgress(updatedList);

        // Check if all completed
        const allCompleted = updatedList.every(t => t.completed);
        if (allCompleted && updatedList.length > 0 && item.status !== 'completed') {
            // Optional: Auto-complete parent wishlist
            Alert.alert(
                "Intention Aligned",
                "You've completed all steps. Mark this wish as fulfilled?",
                [
                    { text: "Keep focusing", style: "cancel" },
                    {
                        text: "Yes, Fulfilled", onPress: async () => {
                            const updatedItem = { ...item, status: 'completed' };
                            await StorageHelper.updateWishlistStatus(item.id, 'completed');
                            // Ideally update local route param or refetch, but navigation back handles it usually.
                            // For instant update feeling, we might need simple local state if we were editing 'item' prop directly, but 'item' is from route params.
                        }
                    }
                ]
            );
        }
    };

    // Animation Values for Orb in Modal
    const orbScale = useRef(new Animated.Value(1)).current;
    const orbFloat = useRef(new Animated.Value(0)).current;
    const [showVisualization, setShowVisualization] = useState(false);

    const startVisualization = () => {
        setShowVisualization(true);
        // Orb Breathing Animation (Scale)
        const breathe = Animated.loop(
            Animated.sequence([
                Animated.timing(orbScale, {
                    toValue: 1.2,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(orbScale, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        // Orb Floating Animation (TranslateY)
        const float = Animated.loop(
            Animated.sequence([
                Animated.timing(orbFloat, {
                    toValue: -20,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(orbFloat, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.parallel([breathe, float]).start();
    };

    const stopVisualization = () => {
        setShowVisualization(false);
        orbScale.setValue(1);
        orbFloat.setValue(0);
    };

    // Parallax Interpolation
    const imageTranslateY = scrollY.interpolate({
        inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
        outputRange: [HEADER_HEIGHT * 0.5, 0, HEADER_HEIGHT * 0.7],
        extrapolate: 'clamp',
    });

    const imageScale = scrollY.interpolate({
        inputRange: [-HEADER_HEIGHT, 0],
        outputRange: [2, 1],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT * 0.3],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    // Fallback Image
    const imageSource = item.image ? { uri: item.image } : require('../../../Assets/img/swing.jpg');

    const handleBack = () => navigation.goBack();
    const handleEdit = () => (navigation as any).navigate('create-wishlist', { item });

    // Manual delete handler inside details if needed, though mostly editing is fine.

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Parallax Hero Image */}
            <Animated.View style={[styles.heroContainer]}>
                <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)', '#FDFBF7']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1.3 }}
                />
            </Animated.View>

            {/* Floating Back Button (Always visible) */}
            <SafeAreaView style={styles.floatingHeader} edges={['top']}>
                <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                    <Icon name="arrow" size={scaleWidth(24)} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
                    <Icon name="edit-without-line" size={scaleWidth(20)} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>


            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 40 }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            >
                <View style={styles.contentContainer}>
                    {/* decorative visual anchor */}
                    <View style={styles.pillAnchor} />

                    {/* Status Chip */}
                    <View style={[styles.statusRow]}>
                        <View style={[styles.chip, { backgroundColor: item.status === 'completed' ? '#FDD835' : '#E0E5DF' }]}>
                            <Text style={[Styles.rubicMedium, { fontSize: 12, color: item.status === 'completed' ? '#FFF' : '#4DB6AC' }]}>
                                {item.status === 'completed' ? 'ALIGNED' : 'FOCUSING ON'}
                            </Text>
                        </View>
                        {item.deadline && (
                            <Text style={[Styles.rubicRegualr, { color: '#90A4AE', marginLeft: 12, fontSize: 13 }]}>
                                Target: {new Date(item.deadline).toLocaleDateString()}
                            </Text>
                        )}

                        {/* Visualize Button - Small */}
                        <TouchableOpacity
                            onPress={startVisualization}
                            style={{ marginLeft: 'auto', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}
                        >
                            <Text style={[Styles.rubicMedium, { fontSize: 12, color: COLORS.TEAL }]}>Visualize ✨</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{item.title}</Text>

                    {/* Description */}
                    {item.description ? (
                        <Text style={styles.description}>{item.description}</Text>
                    ) : (
                        <Text style={[styles.description, { fontStyle: 'italic', opacity: 0.5 }]}>
                            "Silence is the language of intention."
                        </Text>
                    )}

                    {/* Child Tasks Section */}
                    <View style={[Styles.marginTop24, Styles.paddingBottom24, { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 24 }]}>
                        <Text style={[Styles.rubicMedium, { fontSize: 18, color: COLORS.CHARCOL, marginBottom: 16 }]}>
                            Steps toward this intention
                        </Text>

                        {/* Progress Bar */}
                        {childTasks.length > 0 && (
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ height: 6, backgroundColor: '#EFF0F1', borderRadius: 3, overflow: 'hidden' }}>
                                    <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: COLORS.TEAL, borderRadius: 3 }} />
                                </View>
                                <Text style={[Styles.rubicRegualr, { fontSize: 12, color: COLORS.SLATE, marginTop: 8, textAlign: 'right' }]}>
                                    {Math.round(progress * 100)}% Aligned
                                </Text>
                            </View>
                        )}

                        {/* Task List */}
                        {childTasks.map((task) => (
                            <TouchableOpacity
                                key={task.id}
                                activeOpacity={0.7}
                                onPress={() => toggleTask(task)}
                                style={[Styles.row, Styles.alignItemsCenter, { marginBottom: 16 }]}
                            >
                                <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                                    {task.completed && <Icon name="check" size={12} color="#FFF" />}
                                </View>
                                <Text style={[Styles.rubicRegualr, { fontSize: 16, color: task.completed ? COLORS.SLATE : COLORS.CHARCOL, textDecorationLine: task.completed ? 'line-through' : 'none', flex: 1, marginLeft: 12 }]}>
                                    {task.title}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Add Task Input */}
                        <View style={[Styles.row, Styles.alignItemsCenter, { marginTop: 8 }]}>
                            <View style={[styles.checkbox, { borderColor: COLORS.SLATE, borderStyle: 'dashed', opacity: 0.5 }]} />
                            <TextInput
                                placeholder="Add a small step..."
                                placeholderTextColor={COLORS.SLATE}
                                style={[Styles.rubicRegualr, { fontSize: 16, color: COLORS.CHARCOL, flex: 1, marginLeft: 12, padding: 0 }]}
                                value={newTaskTitle}
                                onChangeText={setNewTaskTitle}
                                onSubmitEditing={addChildTask}
                                returnKeyType="done"
                            />
                            {newTaskTitle.length > 0 && (
                                <TouchableOpacity onPress={addChildTask} style={{ padding: 8 }}>
                                    <Text style={[Styles.rubicMedium, { color: COLORS.TEAL }]}>Add</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>


                    {/* Meta Details */}
                    <View style={styles.metaContainer}>
                        {item.reminderEnabled && item.reminderTime && (
                            <View style={styles.metaRow}>
                                <Icon name="timer-icon" size={scaleWidth(18)} color="#FFAB91" />
                                <Text style={styles.metaText}>Reminder set for {item.reminderTime} daily</Text>
                            </View>
                        )}
                        <View style={styles.metaRow}>
                            <Icon name="moon" size={scaleWidth(18)} color="#8DA399" />
                            <Text style={styles.metaText}>Envisioned on {new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={[Styles.padding16, { paddingBottom: 40, alignItems: 'center', opacity: 0.6 }]}>
                        <View style={{ width: 40, height: 2, backgroundColor: COLORS.CHARCOL, opacity: 0.1, marginBottom: 16 }} />

                        <Text style={[Styles.rubicMedium, { fontSize: 10, color: COLORS.CHARCOL, textTransform: 'uppercase', letterSpacing: 3 }]}>
                        SyncCalm Studios
                        </Text>

                        <Text style={[Styles.rubicRegualr, { fontSize: 12, color: COLORS.CHARCOL, opacity: 0.5, marginTop: 4, fontStyle: 'italic' }]}>
                        Crafted for your inner peace
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Visualization Modal */}
            <Modal
                visible={showVisualization}
                transparent={true}
                animationType="fade"
                onRequestClose={stopVisualization}
            >
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['rgba(22, 33, 62, 0.95)', 'rgba(26, 26, 46, 0.98)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <TouchableOpacity onPress={stopVisualization} style={{ position: 'absolute', top: 60, right: 30, zIndex: 10, padding: 10 }}>
                        <Icon name="close" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={Styles.center}>
                        {/* Glowing Orb with Wish Image */}
                        <Animated.View
                            style={[
                                styles.orbContainer,
                                {
                                    transform: [
                                        { scale: orbScale },
                                        { translateY: orbFloat }
                                    ]
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.2)', 'rgba(168, 218, 220, 0.1)', 'transparent']}
                                style={styles.orb}
                            >
                                <View style={[styles.orbInner, { overflow: 'hidden' }]}>
                                    {item.image ? (
                                        <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', opacity: 0.8 }} resizeMode="cover" />
                                    ) : (
                                        <LinearGradient colors={['#A8DADC', '#457B9D']} style={{ width: '100%', height: '100%' }} />
                                    )}
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        <Text style={[Styles.rubicMedium, { fontSize: 24, color: '#FFFFFF', textAlign: 'center', marginTop: 40, paddingHorizontal: 40 }]}>
                            {item.title}
                        </Text>

                        <Text style={[Styles.rubicRegualr, { fontSize: 16, color: '#B0B0C0', textAlign: 'center', marginTop: 16, opacity: 0.8, paddingHorizontal: 60 }]}>
                            "See it. Feel it. Believe it."
                        </Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7'
    },
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 0
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10
    },
    iconButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        backgroundColor: '#FDFBF7',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        minHeight: height * 0.6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10
    },
    pillAnchor: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
        opacity: 0.6
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20
    },
    title: {
        fontFamily: 'Rubik-Bold',
        fontSize: 32,
        color: '#37474F',
        marginBottom: 16,
        lineHeight: 40
    },
    description: {
        fontFamily: 'Rubik-Regular',
        fontSize: 16,
        color: '#546E7A',
        lineHeight: 28,
        marginBottom: 32
    },
    metaContainer: {
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)'
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    metaText: {
        fontFamily: 'Rubik-Regular',
        fontSize: 14,
        color: '#90A4AE',
        marginLeft: 12
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.TEAL,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0
    },
    checkboxChecked: {
        backgroundColor: COLORS.TEAL,
        borderColor: COLORS.TEAL
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orbContainer: {
        width: width * 0.6,
        height: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#A8DADC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 20,
        borderRadius: 1000
    },
    orb: {
        width: '100%',
        height: '100%',
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    orbInner: {
        width: '90%',
        height: '90%',
        borderRadius: 1000,
        backgroundColor: '#FFF',
        elevation: 10
    }
});
