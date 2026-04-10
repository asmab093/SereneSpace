import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({ title, onPress ,disabled,style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.buttonWrapper, style]}
      disabled={disabled}
    >
      <LinearGradient
        colors={["#7B61FF", "#78469A"]} // Deep purple gradient
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    // ⬅️ Changed width to fixed 274px (dp)
    width: 250,
    marginVertical:12,
    borderRadius: 17,
    alignSelf: "center",
  },
  gradient: {
    height: 55,
    width: "100%", // Fills the 274 width set by buttonWrapper
    paddingVertical: 0, // Removed vertical padding since height is fixed

    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    fontWeight: "600",
  },
});

export default CustomButton;
