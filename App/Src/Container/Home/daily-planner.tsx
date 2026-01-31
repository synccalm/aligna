/* File : daily-planner.tsx
 * Description : Daily Planner screen to track daily tasks
 * Author : SyncCalm
 * Version : v1.0
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Styles, COLORS } from '../../../Theme';
import { myEdges } from '../../../Helper/type-models';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, DailyTask } from '../../../Helper/storage';
import { AIQ } from '../../Components/Other';

export default function DailyPlanner(): React.JSX.Element {
    const navigation = useNavigation();

    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // Get today's date string "YYYY-MM-DD"
    const today = new Date().toISOString().split('T')[0];
    const displayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); // 24 January 2024

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const allTasks = await StorageHelper.getDailyTasks();
        const dailyTasks = allTasks.filter(item => item.date === today);
        setTasks(dailyTasks);
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) {
            setIsAdding(false);
            return;
        }

        const newItem: DailyTask = {
            id: Date.now().toString(),
            title: newTaskTitle.trim(),
            isCompleted: false,
            date: today,
            createdAt: Date.now(),
        };

        await StorageHelper.saveDailyTask(newItem);
        setTasks(prev => [...prev, newItem]);
        setNewTaskTitle('');
        setIsAdding(false);
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const updatedList = tasks.map(item =>
            item.id === id ? { ...item, isCompleted: newStatus } : item
        );
        setTasks(updatedList); // Optimistic update
        await StorageHelper.updateDailyTaskStatus(id, newStatus);
    };

    const deleteTask = async (id: string) => {
        Alert.alert(
            "Delete Task",
            "Remove this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updated = tasks.filter(item => item.id !== id);
                        setTasks(updated);
                        await StorageHelper.deleteDailyTask(id);
                    }
                }
            ]
        );
    };

    const renderTaskItem = ({ item }: { item: DailyTask }) => (
        <View style={[Styles.row, Styles.alignItemsCenter, Styles.padding16, Styles.marginBottom12, { backgroundColor: '#F9F9F9', borderRadius: 12 }]}>
            <TouchableOpacity onPress={() => toggleTask(item.id, item.isCompleted)} style={[Styles.marginRight12]}>
                <Icon
                    name={item.isCompleted ? "selected-square-2" : "unselect-square"}
                    size={scaleWidth(24)}
                    color={item.isCompleted ? COLORS.TEAL : COLORS.SLATE}
                />
            </TouchableOpacity>

            <View style={[Styles.flexOne]}>
                <Text style={[
                    Styles.rubicMedium,
                    Styles.fontSize16,
                    { color: item.isCompleted ? COLORS.SLATE : COLORS.CHARCOL, textDecorationLine: item.isCompleted ? 'line-through' : 'none' }
                ]}>
                    {item.title}
                </Text>
            </View>

            <TouchableOpacity onPress={() => deleteTask(item.id)} style={[Styles.padding8]}>
                <Icon name="close-circle" size={scaleWidth(18)} color={COLORS.TANGERING} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[Styles.flexOne, Styles.backgroundColorPureWhite]} edges={myEdges}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.PURE_WHITE} />

            {/* Header */}
            <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.marginTop24]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[Styles.padding8, { marginLeft: -8 }]}>
                    <Icon name="arrow" size={scaleWidth(24)} color={COLORS.CHARCOL} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
                <View>
                    <Text style={[Styles.RubicBold, Styles.fontSize20, { color: COLORS.CHARCOL, marginLeft: 8 }]}>
                        Daily Planner
                    </Text>
                    <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.SLATE, marginLeft: 8 }]}>
                        {displayDate}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View style={[Styles.flexOne, Styles.paddingHorizontal16]}>

                {isAdding && (
                    <View style={[Styles.marginBottom16]}>
                        <AIQ
                            question="What's your task for today?"
                            type="input"
                            value={newTaskTitle}
                            onChangeText={setNewTaskTitle}
                            onSubmit={handleAddTask}
                            showSave={false}
                        >
                            <TouchableOpacity onPress={() => setIsAdding(false)} style={[Styles.center, Styles.marginTop16, { padding: 12 }]}>
                                <Text style={[Styles.rubicMedium, { color: COLORS.TANGERING }]}>Cancel</Text>
                            </TouchableOpacity>
                        </AIQ>
                    </View>
                )}

                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id}
                    renderItem={renderTaskItem}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
                    ListEmptyComponent={() => (
                        !isAdding ? (
                            <View style={[Styles.center, Styles.marginTop40]}>
                                <Text style={[Styles.rubicRegualr, { color: COLORS.SLATE }]}>No tasks for today. Time to plan!</Text>
                            </View>
                        ) : null
                    )}
                />
            </View>

            {/* Bottom Add Button */}
            {!isAdding && (
                <View style={[{ bottom: 32, left: 16, right: 16, position: 'absolute' }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsAdding(true)}
                        style={[
                            Styles.center,
                            Styles.borderRadius12,
                            Styles.cardShadow,
                            { backgroundColor: COLORS.TEAL, paddingVertical: 16 }
                        ]}
                    >
                        <Text style={[Styles.rubicMedium, Styles.fontSize16, { color: COLORS.WHITE_SMOKE }]}>
                            Add Task
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
