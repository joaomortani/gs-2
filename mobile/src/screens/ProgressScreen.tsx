import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Card, ProgressBar } from '../components';
import { theme } from '../theme';
import { useProgress } from '../contexts/ProgressContext';
import { SkillWithProgress } from '../types';

export default function ProgressScreen() {
  const { skillsWithProgress, isLoading, error, refreshProgress } = useProgress();

  const renderSkillProgress = ({ item }: { item: SkillWithProgress }) => {
    const progress = item.progress || { completed: 0, total: 0, percentage: 0 };

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              {progress.completed} de {progress.total} desafios concluídos
            </Text>
          </View>
        </View>
        <ProgressBar
          progress={progress.percentage}
          showLabel={true}
          style={styles.progressBar}
        />
      </Card>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando progresso...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && skillsWithProgress.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>
            {error || 'Não foi possível carregar o progresso'}
          </Text>
          <TouchableOpacity 
            onPress={refreshProgress}
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
        <Text style={styles.title} accessibilityRole="header">Seu progresso</Text>
      </View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity 
            onPress={refreshProgress}
            style={styles.errorRetryButton}
            accessible
            accessibilityLabel="Tentar novamente"
          >
            <Text style={styles.errorRetryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={skillsWithProgress}
        renderItem={renderSkillProgress}
        keyExtractor={(item, index) => item.id || `skill-${index}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não iniciou nenhuma trilha
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
  title: {
    ...theme.typography.h2,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    marginTop: theme.spacing.sm,
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
});

