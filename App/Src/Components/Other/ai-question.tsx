/* File : ai-question.tsx
 * Description : AI Question component for input and selection
 * Author URI : https://evoqins.com
 * Version : v1.1
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

// manual import
import { Styles, COLORS } from '../../../Theme';
import { Icon } from '../../../Navigator/router';
import { scaleWidth } from '../../../Helper/responsive';

// Define the type of data object
type AIQProps = {
    question: string;
    data?: string[];
    onPress?: (value: string) => void;
    isLoading?: boolean;
    type?: 'text' | 'input';

    // Controlled props
    value?: string;
    onChangeText?: (text: string) => void;
    onSubmit?: () => void;

    // Save functionality
    showSave?: boolean;
    onSave?: () => void;
    children?: React.ReactNode;
};

export default function AIQ(props: AIQProps): React.JSX.Element {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    useEffect(() => {
        setIsLoading(props?.isLoading ?? false);
    }, [props?.isLoading]);

    return (
        <View>
            <View style={[Styles.alignItemsCenter, Styles.row]}>
                <Icon name="ai-chat" size={scaleWidth(30)} color={COLORS.CHARCOL} />
                <View style={[Styles.marginLeft20]}>
                    <Text style={[Styles.rubicMedium, Styles.fontSize18, { color: COLORS.CHARCOL, width: scaleWidth(250) }]}>
                        {props?.question ?? ''}
                    </Text>
                </View>

            </View>
            {
                !isLoading && (props?.data && props?.data?.length > 0) &&
                <View style={[Styles.row, Styles.flexWrap, Styles.marginTop12, Styles.padding16]}>
                    {props?.data?.map((item, index) => (
                        <TouchableOpacity activeOpacity={0.8} key={index}
                            onPress={() => props.onPress && props.onPress(item)}
                            style={[{ paddingVertical: 6, borderRadius: 50, paddingHorizontal: 14, borderWidth: 2, borderColor: COLORS.TEAL }, Styles.marginRight8, Styles.marginBottom8]}>
                            <Text style={[Styles.rubicRegualr, Styles.fontSize12, { color: COLORS.TEAL }]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            }

            {
                !isLoading && props.type === 'input' &&
                <View style={[Styles.marginTop24]}>
                    <View style={[Styles.row, Styles.alignItemsCenter]}>
                        <View style={[Styles.flexOne, { borderWidth: 2, borderColor: COLORS.TEAL, borderRadius: 12 }]}>
                            <TextInput
                                style={[Styles.rubicRegualr, Styles.fontSize14, Styles.padding12, { color: COLORS.CHARCOL }]}
                                placeholder="Type here..."
                                placeholderTextColor={COLORS.SLATE}
                                value={props.value}
                                onChangeText={props.onChangeText}
                                onSubmitEditing={props.onSubmit}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={props.onSubmit}
                            style={[{ width: 44, height: 44, borderRadius: 22, marginLeft: 16, backgroundColor: COLORS.TEAL }, Styles.center]}>
                            <Icon name="arrow-right" size={scaleWidth(16)} color={COLORS.WHITE_SMOKE} />
                        </TouchableOpacity>
                    </View>

                    {props.showSave && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={props.onSave}
                            style={[Styles.marginTop24, Styles.center, { backgroundColor: COLORS.TANGERING, paddingVertical: 12, borderRadius: 12 }]}
                        >
                            <Text style={[Styles.rubicMedium, Styles.fontSize16, { color: COLORS.WHITE_SMOKE }]}>
                                Save Affirmation
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            {props.children}
        </View>
    );
}
