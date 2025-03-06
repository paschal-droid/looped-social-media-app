import { StyleSheet, Image, Dimensions, View } from "react-native";
import { color, scaling } from "../../themes/themes";

const {verticalScale, horizontalScale, fontScale} = scaling
const {width} = Dimensions.get('window')



const ParticipantVideoFallback = ({ participant}) => {
  // const profileImages = participant.custom.fields.profileImages.kind.listValue.values
  return (
    <View style={styles.background}>
      <Image source={{ uri: participant.image }} style={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.black,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: width/2.5,
    aspectRatio: 1/1,
    borderRadius: horizontalScale(100)
  },
});

export default ParticipantVideoFallback