import { Stack } from "expo-router";

export default function LoginLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="loginScreen" />
            <Stack.Screen name="register" />
            <Stack.Screen name="SelectLocation" />
        </Stack>
    );
}