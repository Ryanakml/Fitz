import { Link } from "expo-router";
import { View } from "react-native";

const SignIn = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/(auth)/sign-up" style={{ color: "blue", marginTop: 10 }}>
        Sign In
      </Link>
    </View>
  );
};

export default SignIn;
