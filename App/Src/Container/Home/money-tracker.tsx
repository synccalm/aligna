/* File : money-tracker.tsx
 * Description : Financial Harmony - Calm Money Tracker
 * Author : SyncCalm
 * Version : v2.0
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, FlatList, Alert, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// Manual Imports
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';
import { StorageHelper, ExpenseItem } from '../../../Helper/storage';
import { AIQ } from '../../Components/Other';

// New Calm Palette
const PALETTE = {
    BG_CREAM: '#FDFBF7',
    SAGE_LIGHT: '#E0E5DF',
    SAGE_DARK: '#8DA399',
    TEAL_SOFT: '#B2DFDB',
    TEAL_MAIN: '#4DB6AC',
    GOLD_SOFT: '#F0E68C',
    CORAL_SOFT: '#FFAB91',
    TEXT_MAIN: '#37474F',
    TEXT_LIGHT: '#78909C'
};

export default function MoneyTracker(): React.JSX.Element {
    const navigation = useNavigation();

    // Tabs: 'Harmony' (Tracker), 'Insight' (Analyser)
    const [activeTab, setActiveTab] = useState<'Harmony' | 'Insight'>('Harmony');

    // Tracker State
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

    // Add Expense State
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [addStep, setAddStep] = useState<number>(1); // 1: Name, 2: Amount
    const [newExpenseTitle, setNewExpenseTitle] = useState<string>('');
    const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');

    const [month, setMonth] = useState<string>('');

    // Analyser State
    const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
    const [showIncomeInput, setShowIncomeInput] = useState<boolean>(false);
    const [incomeInputText, setIncomeInputText] = useState<string>('');

    // Analytics Data
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        loadExpenses();
        const date = new Date();
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        setMonth(`${monthName} ${year}`);
    }, []);

    useEffect(() => {
        if (activeTab === 'Insight' || expenses.length > 0) {
            loadAnalytics();
        }
    }, [activeTab, expenses]);

    const loadExpenses = async () => {
        const data = await StorageHelper.getExpenses();
        const date = new Date();
        const currentMonth = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        const filtered = data.filter(item => item.month === currentMonth);
        setExpenses(filtered);
    };

    const loadAnalytics = async () => {
        const income = await StorageHelper.getIncomeByMonth(month);
        setMonthlyIncome(income);
        setShowIncomeInput(income === null);

        const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalExpenses(total);
        setBalance((income || 0) - total);
    };

    const handleAddExpenseStep = async () => {
        if (addStep === 1) {
            if (newExpenseTitle.trim()) setAddStep(2);
            return;
        }

        if (addStep === 2) {
            const amount = parseFloat(newExpenseAmount);
            if (isNaN(amount) && newExpenseAmount.trim() !== '') return;

            const finalAmount = isNaN(amount) ? 0 : amount;
            const newItem: ExpenseItem = {
                id: Date.now().toString(),
                title: newExpenseTitle.trim(),
                amount: finalAmount,
                isCompleted: false, // In this context, implies "Reviewd/Paid"
                month: month,
                createdAt: Date.now(),
            };

            await StorageHelper.saveExpense(newItem);
            setExpenses(prev => [...prev, newItem]);

            // Reset
            setNewExpenseTitle('');
            setNewExpenseAmount('');
            setIsAdding(false);
            setAddStep(1);
        }
    };

    const startAdding = () => { setIsAdding(true); setAddStep(1); setNewExpenseTitle(''); setNewExpenseAmount(''); };
    const cancelAdding = () => { setIsAdding(false); setAddStep(1); setNewExpenseTitle(''); setNewExpenseAmount(''); };

    const toggleExpense = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const updatedList = expenses.map(item => item.id === id ? { ...item, isCompleted: newStatus } : item);
        setExpenses(updatedList);
        await StorageHelper.updateExpenseStatus(id, newStatus);
    };

    const deleteExpense = async (id: string) => {
        Alert.alert("Remove Item", "Release this expense from your list?", [
            { text: "Keep", style: "cancel" },
            {
                text: "Release", style: "destructive", onPress: async () => {
                    const updated = expenses.filter(item => item.id !== id);
                    setExpenses(updated);
                    await StorageHelper.deleteExpense(id);
                }
            }
        ]);
    };

    // Render Row
    const renderExpenseItem = ({ item }: { item: ExpenseItem }) => (
        <View style={styles.expenseRow}>
            <TouchableOpacity onPress={() => toggleExpense(item.id, item.isCompleted)} style={{ padding: 8 }}>
                <Icon
                    name={item.isCompleted ? "selected-circle" : "un-selected-circle"}
                    size={scaleWidth(22)}
                    color={item.isCompleted ? PALETTE.SAGE_DARK : PALETTE.SAGE_LIGHT} // Softer check icons
                    style={{ opacity: item.isCompleted ? 1 : 0.8 }}
                />
            </TouchableOpacity>

            <View style={[Styles.flexOne, { marginLeft: 8 }]}>
                <Text style={[Styles.rubicMedium, Styles.fontSize16, {
                    color: item.isCompleted ? PALETTE.TEXT_LIGHT : PALETTE.TEXT_MAIN,
                    textDecorationLine: item.isCompleted ? 'line-through' : 'none'
                }]}>
                    {item.title}
                </Text>
            </View>

            <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                {item.amount ? (
                    <Text style={[Styles.RubicBold, Styles.fontSize14, { color: PALETTE.TEXT_MAIN }]}>
                        ₹{item.amount.toLocaleString()}
                    </Text>
                ) : null}
            </View>

            <TouchableOpacity onPress={() => deleteExpense(item.id)} style={{ padding: 8 }}>
                <Icon name="delete-basket" size={scaleWidth(18)} color={PALETTE.CORAL_SOFT} style={{ opacity: 0.6 }} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={Styles.flexOne}>
            <StatusBar barStyle={'dark-content'} translucent backgroundColor='transparent' />
            <LinearGradient colors={[PALETTE.BG_CREAM, '#F5F5F0']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={Styles.flexOne} edges={['top']}>
                {/* Header */}
                <View style={[Styles.padding16, Styles.row, Styles.alignItemsCenter, Styles.marginTop16]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
                        <Icon name="arrow" size={scaleWidth(24)} color={PALETTE.TEXT_MAIN} style={{ transform: [{ rotate: '90deg' }] }} />
                    </TouchableOpacity>
                    <Text style={[Styles.RubicBold, Styles.fontSize20, { color: PALETTE.TEXT_MAIN, marginLeft: 8, letterSpacing: 0.5 }]}>
                        Financial Harmony
                    </Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('Harmony')} style={[styles.tabButton, activeTab === 'Harmony' && styles.activeTab]}>
                        <Text style={[activeTab === 'Harmony' ? Styles.RubicBold : Styles.rubicMedium, { color: activeTab === 'Harmony' ? PALETTE.TEXT_MAIN : PALETTE.TEXT_LIGHT }]}>
                            Tracker
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('Insight')} style={[styles.tabButton, activeTab === 'Insight' && styles.activeTab]}>
                        <Text style={[activeTab === 'Insight' ? Styles.RubicBold : Styles.rubicMedium, { color: activeTab === 'Insight' ? PALETTE.TEXT_MAIN : PALETTE.TEXT_LIGHT }]}>
                            Insight
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {activeTab === 'Harmony' ? (
                    <View style={[Styles.flexOne, Styles.paddingHorizontal16]}>
                        <View style={[Styles.marginBottom16, Styles.marginTop8]}>
                            <Text style={[Styles.rubicRegualr, Styles.fontSize14, { color: PALETTE.TEXT_LIGHT, textTransform: 'uppercase', letterSpacing: 1 }]}>
                                {month}
                            </Text>
                        </View>

                        {isAdding && (
                            <View style={[Styles.marginBottom24]}>
                                <AIQ
                                    question={addStep === 1 ? "What did you invest in?" : "How much was the energy exchange?"} // Renaming Cost to Energy Exchange
                                    type="input"
                                    value={addStep === 1 ? newExpenseTitle : newExpenseAmount}
                                    onChangeText={addStep === 1 ? setNewExpenseTitle : setNewExpenseAmount}
                                    onSubmit={handleAddExpenseStep}
                                    showSave={false}
                                >
                                    <TouchableOpacity onPress={cancelAdding} style={[Styles.center, Styles.marginTop16, { padding: 12 }]}>
                                        <Text style={[Styles.rubicMedium, { color: PALETTE.CORAL_SOFT }]}>Cancel</Text>
                                    </TouchableOpacity>
                                </AIQ>
                            </View>
                        )}

                        <FlatList
                            data={expenses}
                            keyExtractor={item => item.id}
                            renderItem={renderExpenseItem}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <View style={[Styles.center, Styles.marginTop40, { opacity: 0.6 }]}>
                                    <Icon name="leaf" size={scaleWidth(40)} color={PALETTE.SAGE_DARK} />
                                    <Text style={[Styles.rubicRegualr, { color: PALETTE.TEXT_LIGHT, marginTop: 16 }]}>
                                        A fresh start for your abundance.
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <View style={[Styles.flexOne, Styles.padding16]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Income Input */}
                            {showIncomeInput && (
                                <View style={[Styles.marginBottom24]}>
                                    <AIQ
                                        question="What is your monthly abundance flow?"
                                        type="input"
                                        value={incomeInputText}
                                        onChangeText={setIncomeInputText}
                                        onSubmit={async () => {
                                            const amount = parseFloat(incomeInputText);
                                            if (!isNaN(amount) && amount > 0) {
                                                await StorageHelper.saveIncome(month, amount);
                                                setMonthlyIncome(amount);
                                                setShowIncomeInput(false);
                                                loadAnalytics();
                                            }
                                        }}
                                        showSave={false}
                                    >
                                        <TouchableOpacity onPress={() => setShowIncomeInput(false)} style={[Styles.center, Styles.marginTop16]}>
                                            <Text style={[Styles.rubicMedium, { color: PALETTE.TEXT_LIGHT }]}>Skip for now</Text>
                                        </TouchableOpacity>
                                    </AIQ>
                                </View>
                            )}

                            {/* Balance Card - The "Peace" Indicator */}
                            <View style={[styles.balanceCard, { backgroundColor: balance >= 0 ? PALETTE.SAGE_LIGHT : '#FFEBEE' }]}>
                                <Text style={[Styles.rubicRegualr, Styles.fontSize14, { color: PALETTE.TEXT_LIGHT, letterSpacing: 0.5 }]}>
                                    Available Abundance
                                </Text>
                                <Text style={[Styles.RubicBold, { fontSize: 36, color: balance >= 0 ? PALETTE.TEXT_MAIN : PALETTE.CORAL_SOFT, marginTop: 8 }]}>
                                    ₹{balance.toLocaleString()}
                                </Text>
                                <View style={[Styles.row, Styles.alignItemsCenter, Styles.marginTop16, { opacity: 0.8 }]}>
                                    <Icon name={balance >= 0 ? "leaf" : "info-circle"} size={scaleWidth(16)} color={balance >= 0 ? PALETTE.SAGE_DARK : PALETTE.CORAL_SOFT} />
                                    <Text style={[Styles.rubicMedium, Styles.fontSize14, { color: balance >= 0 ? PALETTE.SAGE_DARK : PALETTE.CORAL_SOFT, marginLeft: 8 }]}>
                                        {balance > 0 ? "Your flow is healthy." : balance === 0 ? "Perfectly balanced." : "Let's bring this back to harmony."}
                                    </Text>
                                </View>
                            </View>

                            {/* Breakdown Cards */}
                            <View style={[Styles.row, Styles.spaceBetween, Styles.marginBottom24]}>
                                <TouchableOpacity onPress={() => setShowIncomeInput(true)} style={[styles.statCard, { backgroundColor: '#E0F7FA' }]}>
                                    <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: PALETTE.TEXT_LIGHT }]}>Inflow</Text>
                                    <Text style={[Styles.RubicBold, Styles.fontSize18, { color: PALETTE.TEAL_MAIN, marginTop: 4 }]}>
                                        ₹{monthlyIncome ? monthlyIncome.toLocaleString() : 'Set'}
                                    </Text>
                                </TouchableOpacity>

                                <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                                    <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: PALETTE.TEXT_LIGHT }]}>Outflow</Text>
                                    <Text style={[Styles.RubicBold, Styles.fontSize18, { color: PALETTE.CORAL_SOFT, marginTop: 4 }]}>
                                        ₹{totalExpenses.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Chart Placeholder */}
                            <View style={styles.chartPlaceholder}>
                                <Icon name="chart" size={scaleWidth(32)} color={PALETTE.SAGE_DARK} style={{ opacity: 0.3 }} />
                                <Text style={[Styles.rubicRegualr, { color: PALETTE.TEXT_LIGHT, marginTop: 12, opacity: 0.6 }]}>
                                    Visual insights blooming soon...
                                </Text>
                            </View>

                        </ScrollView>
                    </View>
                )}

                {/* Floating Add Button */}
                {activeTab === 'Harmony' && !isAdding && (
                    <TouchableOpacity activeOpacity={0.9} onPress={startAdding} style={styles.fab}>
                        <Icon name='add-circle' color={'white'} size={40}/>
                    </TouchableOpacity>
                )}

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    tabButton: {
        marginRight: 24,
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.TEAL_MAIN
    },
    expenseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        // Soft Shadow
        shadowColor: "#8DA399",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2
    },
    balanceCard: {
        padding: 24,
        borderRadius: 24,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 20,
        marginHorizontal: 6,
        alignItems: 'center'
    },
    chartPlaceholder: {
        height: 220,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: PALETTE.SAGE_LIGHT
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: PALETTE.TEAL_MAIN,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PALETTE.TEAL_MAIN,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10
    }
});
