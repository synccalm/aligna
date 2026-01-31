
import * as React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { scaleWidth } from "../../../Helper/responsive";
import { Styles } from "../../../Theme";
import { ProgressBar } from "../Other";
 
const data = [require('../../../Assets/img/girl.png'), require('../../../Assets/img/boy.png')];
 
function CarouselCS() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
 
  return (
    <View style={{ flex: 1}}>
      <Carousel
        ref={ref}
        style={{ width: scaleWidth(360), height: 220, justifyContent: "center", alignItems: 'center' }}
        data={data}
        width={scaleWidth(360)}
        height={220}
        autoPlay={true}
        loop={true}
        autoPlayInterval={6000}
        onProgressChange={progress}
        renderItem={({ index }) => (
            <View style= {[Styles.center, Styles.flexOne]}>
                <View
                    style={[{
                    width: scaleWidth(360),
                    height: 220,
                    justifyContent: "center",

                    },
                    Styles.borderRadius16,

                ]}
                >
                    <Image
                        source={data[index]}
                        resizeMode='cover'
                        style={{ width: scaleWidth(360), height: scaleWidth(220) }}
                    />
                </View>

                <View style={[Styles.paddingHorizontal31, Styles.marginTop16, {width: scaleWidth(300)}]}>
                    <ProgressBar percentage= {(index + 1) * 20}
                            height= {7}
                            backgroundColor= {'#E0E0E0'}
                            fillColor= {'#4CAF50'}
                            borderRadius= {5}
                            />
                </View>
          </View>
        )}
      />
 
      <Pagination.Custom
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50, height: 5, width: 5 }}
        activeDotStyle={{ backgroundColor: "#499FA4", borderRadius: 50, width: 30, height: 5 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
}
 
export default CarouselCS;