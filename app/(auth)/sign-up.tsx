import { Link } from "expo-router";
import { View } from "react-native";

const SignUp = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/(auth)/sign-up" style={{ color: "blue", marginTop: 10 }}>
        Sign Up
      </Link>
    </View>
  );
};

export default SignUp;
