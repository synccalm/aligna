/*
 *   File : tab.tsx
 *   Author URI : https://evoqins.com
 *   Description :tab component
 *   Integrations : null
 *   Version : v1.1
 */
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Styles } from '../../../Theme';

type CustomTabProp = {
  type: number;
  data: any[];
  selectedId: number;
  isDisable?: boolean;
  onSelect: (id: number) => void;
};

const Tabs: React.FC<CustomTabProp> = (props: CustomTabProp) => {
  const flatListRef = useRef<FlatList>(null);
  const [data, setData] = useState<any>(props.data);
  const [selectedId, setSelectedId] = useState<number>(1);

  useEffect(() => {
    setSelectedId(props.selectedId);
  }, [props.selectedId]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    const index = data?.findIndex((item: any) => item?.id === selectedId);
    if (index >= 0) {
      flatListRef?.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.1,
      });
    }
  }, [selectedId]);

  const handleTabPress = (itemId: number, index: number) => {
    if (selectedId !== itemId) {
      setSelectedId(itemId);
      props.onSelect(itemId);
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.1,
      });
    }
  };

  return (
    <View
      style={[
        props.type != 1 && [
          Styles.backgroundColorLightishLavendarBlue,
          Styles.borderWidth1,
          Styles.borderColorLightLavendarBlue,
          Styles.borderRadius12,
        ],
      ]}
    >
      <FlatList
        data={data ?? []}
        ref={flatListRef}
        bounces={false}
        horizontal
        overScrollMode="never"
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `key-${index}`}
        onScrollToIndexFailed={({ index }) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.1,
            });
          }, 100);
        }}
        contentContainerStyle={[]}
        renderItem={({ item, index }) => {
          const isSelected = selectedId === item.id;
          return (
            <>
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => handleTabPress(item.id, index)}
                disabled={props.isDisable}
                style={[
                  props.type != 1
                    ? [
                        Styles.paddingVertical8,
                        Styles.marginVertical4,
                        Styles.marginHorizontal4,
                        Styles.center,
                        Styles.borderRadius8,
                        Styles.width156,
                      ]
                    : Styles.marginRight12,

                  props.type != 1 && isSelected && Styles.backgroundColorPureWhite,
                ]}
              >
                <View>
                  <Text
                    style={[
                      Styles.flexWrap,
                      Styles.fontSize14,
                      props.type == 1 ? Styles.lineHeight20 : Styles.lineHeight16,
                      Styles.rubikRegular,
                      isSelected ? Styles.colorPrimary : Styles.colorCynder,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {props.type == 1 && isSelected && (
                    <View
                      style={[
                        Styles.height1,
                        Styles.backgroundColorPrimary,
                        Styles.borderRadius8,
                        Styles.marginTop6,
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      />
    </View>
  );
};

export default Tabs;
