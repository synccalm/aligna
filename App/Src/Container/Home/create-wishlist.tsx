/* File : create-wishlist.tsx
 * Description : Screen to create a new wishlist item with images, deadline, time, and reminders
 * Author : SyncCalm
 * Version : v1.3
 */

import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';

import { Styles, COLORS } from '../../../Theme';
import { myEdges } from '../../../Helper/type-models';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, WishlistItem } from '../../../Helper/storage';
import { AIQ } from '../../Components/Other';

type ParamList = {
    'create-wishlist': { item?: WishlistItem; prefill?: Partial<WishlistItem> };
};

export default function CreateWishlist(): React.JSX.Element {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'create-wishlist'>>();
    const editItem = route.params?.item;
    const prefill = route.params?.prefill;

    // Steps: 
    // 0: Title Input
    // 1: Description Input (Optional/Skip) - NEW
    // 2: Image Question (Yes/No) -> If Yes, pick image.
    // 3: Deadline Date (Select Date)
    // 4: Deadline Time (Select Time)
    // 5: Reminder Question (Yes/No)
    // 6: Reminder Time (Select Time) (if Yes)
    // 7: Summary & Save

    const [step, setStep] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [inputText, setInputText] = useState<string>('');

    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [deadlineDate, setDeadlineDate] = useState<number | undefined>(undefined);
    const [deadlineTime, setDeadlineTime] = useState<Date | undefined>(undefined);

    const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
    const [reminderTime, setReminderTime] = useState<Date | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false); // For DateTimePicker modal

    // Init for Edit Mode or Prefill
    React.useEffect(() => {
        if (editItem) {
            setTitle(editItem.title);
            setDescription(editItem.description || '');
            setImageUri(editItem.image);
            setDeadlineDate(editItem.deadline);
            if (editItem.deadlineTime) {
                const [hours, minutes] = editItem.deadlineTime.split(':').map(Number);
                const d = new Date();
                d.setHours(hours);
                d.setMinutes(minutes);
                setDeadlineTime(d);
            }
            if (editItem.reminderEnabled) {
                setReminderEnabled(true);
                if (editItem.reminderTime) {
                    const [hours, minutes] = editItem.reminderTime.split(':').map(Number);
                    const d = new Date();
                    d.setHours(hours);
                    d.setMinutes(minutes);
                    setReminderTime(d);
                }
            }
            setStep(0);
            setInputText(editItem.title);
        } else if (prefill) {
            if (prefill.title) {
                setTitle(prefill.title);
                setInputText(prefill.title);
                // If title is prefilled, we could auto-advance, but letting user confirm is better.
                // Or maybe just fill it and let them hit next.
            }
            if (prefill.description) {
                setDescription(prefill.description);
            }
        }
    }, [editItem, prefill]);

    const handleTitleSubmit = () => {
        if (!inputText.trim()) return;
        setTitle(inputText.trim());
        setInputText('');
        setStep(1); // Go to Description
    };

    const handleDescriptionSubmit = () => {
        if (inputText.trim()) {
            setDescription(inputText.trim());
        }
        setInputText('');
        setStep(2); // Go to Image Question
    };

    const handleSkipDescription = () => {
        setDescription('');
        setInputText('');
        setStep(2); // Go to Image Question
    };

    const handleImageOption = (option: string) => {
        if (option === 'Yes') {
            pickImage();
        } else {
            setStep(3); // Go to Deadline Date
        }
    };

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1,
            });

            if (result.didCancel) {
                // Do nothing
            } else if (result.assets && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
                setStep(3); // Go to Deadline Date
            }
        } catch (e) {
            Alert.alert("Error", "Could not pick image");
        }
    };

    const handleDateChange = (date: any) => {
        if (date) {
            setDeadlineDate(new Date(date.toString()).getTime());
        }
    };

    const handleDeadlineDateNext = () => {
        if (deadlineDate) {
            setStep(4); // Go to Deadline Time
        } else {
            // If skipped date, skip time too? Or just skip logic. 
            // Let's assume if date is skipped, time is skipped.
            // But let's prompt logic: "When do you want to complete this wish? -> Date picker (optional)"
            // "At what time... -> Time picker (optional)" -> Only show if date exists.
            if (!deadlineDate) {
                setStep(5); // Skip to Reminder Question
            } else {
                setStep(4);
            }
        }
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        // Platform specific behavior handling
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }

        if (selectedDate) {
            if (step === 4) {
                setDeadlineTime(selectedDate);
            } else if (step === 6) {
                setReminderTime(selectedDate);
            }
        }
    };

    const handleDeadlineTimeNext = () => {
        setStep(5); // Go to Reminder Question
    };

    const handleReminderOption = (option: string) => {
        if (option === 'Yes') {
            setReminderEnabled(true);
            setStep(6); // Go to Reminder Time
        } else {
            setReminderEnabled(false);
            setStep(7); // Go to Summary
        }
    };

    const handleReminderTimeNext = () => {
        setStep(7); // Go to Summary
    };

    const scheduleAlarm = (date: Date): string => {
        // Simple mock or actual implementation attempt
        // Since we are mocking mostly, we generate an ID.
        // If PushNotification is linked, we can use it.
        const id = Math.floor(Math.random() * 100000).toString();

        PushNotification.localNotificationSchedule({
            id: id,
            channelId: "wishlist-channel",
            title: "Wishlist Reminder",
            message: `Time to work on: ${title}`,
            date: date,
            repeatType: 'day', // Daily
            allowWhileIdle: true,
        });

        return id;
    };

    const saveWishlist = async () => {
        setIsLoading(true);

        let alarmId: string | undefined = undefined;
        if (reminderEnabled && reminderTime) {
            // Schedule the alarm
            // We need to schedule it for the FUTURE. 
            // If reminderTime is past for today, schedule for tomorrow?
            // DateTimePicker returns a Date object with today's date and selected time.
            let scheduleDate = new Date();
            scheduleDate.setHours(reminderTime.getHours());
            scheduleDate.setMinutes(reminderTime.getMinutes());
            scheduleDate.setSeconds(0);

            if (scheduleDate.getTime() < Date.now()) {
                scheduleDate.setDate(scheduleDate.getDate() + 1);
            }

            try {
                alarmId = scheduleAlarm(scheduleDate);
            } catch (e) {
                console.log("PushNotification error (likely not linked):", e);
                // Continue without failing creation
            }
        }

        const newItem: WishlistItem = {
            id: Date.now().toString(),
            title: title,
            description: description,
            image: imageUri,
            createdAt: Date.now(),
            deadline: deadlineDate,
            deadlineTime: deadlineTime ? deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            reminderEnabled: reminderEnabled,
            reminderTime: reminderTime ? reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            alarmId: alarmId || (editItem ? editItem.alarmId : undefined), // Keep old alarm ID if not replaced, or undefined logic
            status: editItem ? editItem.status : 'in_progress'
        };

        if (editItem) {
            newItem.id = editItem.id; // Keep original ID
            newItem.createdAt = editItem.createdAt; // Keep original creation date
            await StorageHelper.updateWishlist(newItem);
        } else {
            await StorageHelper.saveWishlist(newItem);
        }
        setIsLoading(false);
        navigation.goBack();
    };

    const getQuestion = () => {
        switch (step) {
            case 0: return "What is your wish?";
            case 1: return "Add a small description?";
            case 2: return "Would you like to add an image?";
            case 3: return "When do you want to complete this?";
            case 4: return "At what time should this be completed?";
            case 5: return "Do you want to be reminded everyday?";
            case 6: return "Choose a reminder time";
            case 7: return "Here is your wish summary.";
            default: return "";
        }
    };

    return (
        <SafeAreaView style={[Styles.flexOne, Styles.backgroundColorPureWhite]} edges={myEdges}>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.PURE_WHITE} />

            <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.marginTop24]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[Styles.padding8, { marginLeft: -8 }]}>
                    <Icon name="arrow" size={scaleWidth(24)} color={COLORS.CHARCOL} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
            </View>

            <View style={[Styles.padding16, Styles.flexOne]}>

                {/* Step 0: Title */}
                {step === 0 && (
                    <AIQ
                        question={getQuestion()}
                        type="input"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmit={handleTitleSubmit}
                        showSave={false}
                    />
                )}

                {/* Step 1: Description */}
                {step === 1 && (
                    <AIQ
                        question={getQuestion()}
                        type="input"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmit={handleDescriptionSubmit}
                        showSave={false}
                    >
                        <TouchableOpacity onPress={handleSkipDescription} style={[Styles.center, Styles.marginTop16, { padding: 12 }]}>
                            <Text style={[Styles.rubicMedium, { color: COLORS.SLATE }]}>Skip</Text>
                        </TouchableOpacity>
                    </AIQ>
                )}

                {/* Step 2: Image Question */}
                {step === 2 && (
                    <AIQ
                        question={getQuestion()}
                        data={['Yes', 'No']}
                        onPress={handleImageOption}
                        isLoading={isLoading}
                    />
                )}

                {/* Step 3: Deadline Date */}
                {step === 3 && (
                    <View>
                        <AIQ question={getQuestion()} />
                        <View style={[Styles.marginTop24, { backgroundColor: '#F9F9F9', borderRadius: 12, overflow: 'hidden' }]}>
                            <CalendarPicker
                                onDateChange={handleDateChange}
                                width={scaleWidth(340)}
                                selectedDayColor={COLORS.TEAL}
                                selectedDayTextColor={COLORS.WHITE_SMOKE}
                            />
                        </View>
                        <View style={[Styles.row, Styles.spaceBetween, Styles.marginTop24]}>
                            <TouchableOpacity onPress={handleDeadlineDateNext} style={[Styles.center, { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.SLATE }]}>
                                <Text style={[Styles.rubicMedium, { color: COLORS.SLATE }]}>{deadlineDate ? 'Next' : 'Skip'}</Text>
                            </TouchableOpacity>
                            {deadlineDate && (
                                <TouchableOpacity onPress={handleDeadlineDateNext} style={[Styles.center, { padding: 12, borderRadius: 8, backgroundColor: COLORS.TEAL, width: 100 }]}>
                                    <Text style={[Styles.rubicMedium, { color: COLORS.WHITE_SMOKE }]}>Next</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Step 4: Deadline Time */}
                {step === 4 && (
                    <View>
                        <AIQ question={getQuestion()} />
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            style={[Styles.marginTop24, Styles.center, { padding: 16, backgroundColor: '#F0F0F0', borderRadius: 12 }]}>
                            <Text style={[Styles.RubicBold, Styles.fontSize20, { color: COLORS.TEAL }]}>
                                {deadlineTime ? deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Pick a Time"}
                            </Text>
                        </TouchableOpacity>

                        {(showTimePicker || Platform.OS === 'ios') && ( // iOS shows inline by default or we can control slightly differently, keeping simple
                            <DateTimePicker
                                value={deadlineTime || new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}

                        <View style={[Styles.row, Styles.spaceBetween, Styles.marginTop24]}>
                            <TouchableOpacity onPress={handleDeadlineTimeNext} style={[Styles.center, { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.SLATE }]}>
                                <Text style={[Styles.rubicMedium, { color: COLORS.SLATE }]}>{deadlineTime ? 'Next' : 'Skip'}</Text>
                            </TouchableOpacity>
                            {deadlineTime && (
                                <TouchableOpacity onPress={handleDeadlineTimeNext} style={[Styles.center, { padding: 12, borderRadius: 8, backgroundColor: COLORS.TEAL, width: 100 }]}>
                                    <Text style={[Styles.rubicMedium, { color: COLORS.WHITE_SMOKE }]}>Next</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Step 5: Reminder Question */}
                {step === 5 && (
                    <AIQ
                        question={getQuestion()}
                        data={['Yes', 'No']}
                        onPress={handleReminderOption}
                    />
                )}

                {/* Step 6: Reminder Time */}
                {step === 6 && (
                    <View>
                        <AIQ question={getQuestion()} />
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            style={[Styles.marginTop24, Styles.center, { padding: 16, backgroundColor: '#FFF0F0', borderRadius: 12 }]}>
                            <Text style={[Styles.RubicBold, Styles.fontSize20, { color: COLORS.TANGERING }]}>
                                {reminderTime ? reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Pick a Time"}
                            </Text>
                        </TouchableOpacity>

                        {(showTimePicker || Platform.OS === 'ios') && (
                            <DateTimePicker
                                value={reminderTime || new Date()}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}

                        <View style={[Styles.row, Styles.spaceBetween, Styles.marginTop24]}>
                            <TouchableOpacity onPress={() => handleReminderOption('No')} style={[Styles.center, { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.SLATE }]}>
                                <Text style={[Styles.rubicMedium, { color: COLORS.SLATE }]}>Cancel</Text>
                            </TouchableOpacity>
                            {reminderTime && (
                                <TouchableOpacity onPress={handleReminderTimeNext} style={[Styles.center, { padding: 12, borderRadius: 8, backgroundColor: COLORS.TEAL, width: 100 }]}>
                                    <Text style={[Styles.rubicMedium, { color: COLORS.WHITE_SMOKE }]}>Next</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Step 7: Summary */}
                {step === 7 && (
                    <View style={[Styles.flexOne]}>
                        <Text style={[Styles.rubicMedium, Styles.fontSize18, { color: COLORS.CHARCOL, marginBottom: 24 }]}>
                            Summary
                        </Text>

                        <View style={[Styles.padding16, { backgroundColor: '#F0FFFF', borderRadius: 16 }]}>
                            {imageUri && (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={{ width: '100%', height: 150, borderRadius: 12, marginBottom: 16 }}
                                    resizeMode="cover"
                                />
                            )}
                            <Text style={[Styles.RubicBold, Styles.fontSize16, { color: COLORS.CHARCOL }]}>{title}</Text>
                            {description ? (
                                <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.SLATE, marginTop: 4, fontStyle: 'italic' }]}>
                                    {description}
                                </Text>
                            ) : null}
                            <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.SLATE, marginTop: 8 }]}>
                                Status: In Progress
                            </Text>
                            {deadlineDate && (
                                <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.TEAL, marginTop: 4 }]}>
                                    Deadline: {new Date(deadlineDate).toLocaleDateString()} {deadlineTime ? `at ${deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                                </Text>
                            )}
                            {reminderEnabled && reminderTime && (
                                <View style={[Styles.row, Styles.alignItemsCenter, Styles.marginTop8]}>
                                    <Icon name="notification-unread" size={scaleWidth(14)} color={COLORS.TANGERING} />
                                    <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.TANGERING, marginLeft: 6 }]}>
                                        Reminder set for {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} daily
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={saveWishlist}
                            disabled={isLoading}
                            style={[Styles.marginTop24, Styles.center, { backgroundColor: COLORS.TANGERING, paddingVertical: 12, borderRadius: 12 }]}
                        >
                            {isLoading ? (
                                <Text style={[Styles.rubicMedium, Styles.fontSize16, { color: COLORS.WHITE_SMOKE }]}>Saving...</Text>
                            ) : (
                                <Text style={[Styles.rubicMedium, Styles.fontSize16, { color: COLORS.WHITE_SMOKE }]}>
                                    Save Wish
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </SafeAreaView>
    );
}
