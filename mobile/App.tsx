import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SkillsProvider } from './src/contexts/SkillsContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SelfAssessmentScreen from './src/screens/SelfAssessmentScreen';
import AssessmentResultScreen from './src/screens/AssessmentResultScreen';
import { theme } from './src/theme';
import api from './src/config/api';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasAssessment, setHasAssessment] = React.useState<boolean | null>(null);
  const [checkingAssessment, setCheckingAssessment] = React.useState(true);

  const checkAssessment = React.useCallback(async () => {
    try {
      setCheckingAssessment(true);
      const response = await api.get('/assessment/me');
      const assessments = response.data?.data?.assessments || [];
      setHasAssessment(assessments.length > 0);
    } catch (error) {
      // Se não tem assessment, assume que não fez
      setHasAssessment(false);
    } finally {
      setCheckingAssessment(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      checkAssessment();
    } else {
      setHasAssessment(null);
    }
  }, [isAuthenticated, checkAssessment]);

  // Re-verificar assessment periodicamente quando autenticado
  React.useEffect(() => {
    if (isAuthenticated && hasAssessment === false) {
      const interval = setInterval(() => {
        checkAssessment();
      }, 2000); // Verifica a cada 2 segundos
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, hasAssessment, checkAssessment]);

  if (isLoading || (isAuthenticated && checkingAssessment)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : !hasAssessment ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SelfAssessment" component={SelfAssessmentScreen} />
          <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
        </Stack.Navigator>
      ) : (
        <SkillsProvider>
          <ProgressProvider>
            <StatusBar style="dark" backgroundColor={theme.colors.white} />
            <AppNavigator />
          </ProgressProvider>
        </SkillsProvider>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

