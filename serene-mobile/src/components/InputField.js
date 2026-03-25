// import React from "react";
// import { View, TextInput, StyleSheet, Image } from "react-native";

// const InputField = ({
//   IconSource,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = "default",
//   ...props
// }) => {
//   return (
//     <View style={styles.inputContainer}>
//       {IconSource && (
//         <Image source={IconSource} style={styles.icon} resizeMode="contain" />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder={placeholder}
//         placeholderTextColor="#999"
//         secureTextEntry={secureTextEntry}
//         keyboardType={keyboardType}
//         {...props}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     height: 55,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   icon: {
//     marginRight: 10,
//     width: 18, // Define explicit dimensions for PNG
//     height: 18, // Define explicit dimensions for PNG
//     tintColor: "#999", // Optional: Apply a color tint if your PNGs are white
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//   },
// });

// export default InputField;
import React from "react";
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

const InputField = ({
  IconSource,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  RightIcon,           // ⬅️ Added: The Eye Icon
  onRightIconPress,    // ⬅️ Added: The function to toggle
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      {IconSource && (
        <Image source={IconSource} style={styles.icon} resizeMode="contain" />
      )}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />

      {/* ✅ If RightIcon exists, show it inside a TouchableOpacity */}
      {RightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconButton}>
          <Image 
            source={RightIcon} 
            style={styles.rightIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 55,
    // Optional: add a slight shadow for depth
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#999", // Matches your app theme
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "Quicksand-Medium", // Assuming you're still using Quicksand
  },
  rightIconButton: {
    padding: 5,
  },
  rightIcon: {
    width: 22,
    height: 22,
    tintColor: "#999", // Grey by default, turns purple when active via state
  },
});

export default InputField;