import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, ProgressBar } from '../components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useSkills } from '../contexts/SkillsContext';
import { useProgress } from '../contexts/ProgressContext';
import { Skill } from '../types';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { skills, isLoading, error: skillsError, refreshSkills } = useSkills();
  const { skillsWithProgress } = useProgress();

  const getSkillProgress = (skillId: string) => {
    const skillProgress = skillsWithProgress.find((sp) => sp.id === skillId);
    return skillProgress?.progress || { completed: 0, total: 0, percentage: 0 };
  };

  const renderSkillCard = ({ item }: { item: Skill }) => {
    const progress = getSkillProgress(item.id);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SkillDetail' as never, {
            skillId: item.id,
            skillName: item.name,
          } as never)
        }
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Trilha ${item.name}. ${progress.completed} de ${progress.total} desafios concluídos`}
        accessibilityHint="Toque para ver os desafios desta trilha"
      >
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🟦</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Progresso: {progress.completed} de {progress.total} desafios
            </Text>
            <ProgressBar
              progress={progress.percentage}
              showLabel={true}
              style={styles.progressBar}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Ver desafios →</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando trilhas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (skillsError && skills.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            {skillsError || 'Não foi possível carregar as trilhas'}
          </Text>
          <TouchableOpacity 
            onPress={refreshSkills}
            style={styles.retryButton}
            accessible
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting} accessibilityRole="header">
          Olá, {user?.name || 'Usuário'} 👋
        </Text>
        <Text style={styles.subtitle}>Suas trilhas de desenvolvimento</Text>
      </View>
      {skillsError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{skillsError}</Text>
          <TouchableOpacity 
            onPress={refreshSkills}
            style={styles.errorRetryButton}
            accessible
            accessibilityLabel="Tentar novamente"
          >
            <Text style={styles.errorRetryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={skills}
        renderItem={renderSkillCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma trilha disponível
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  progressText: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'flex-end',
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBannerText: {
    ...theme.typography.small,
    color: theme.colors.error,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  errorRetryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  errorRetryText: {
    ...theme.typography.small,
    color: theme.colors.error,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

