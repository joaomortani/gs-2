import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Card, Button } from '../components';
import { theme } from '../theme';
import { challengeService } from '../modules/challenges/challenge.service';
import { useProgress } from '../contexts/ProgressContext';
import { Challenge, ChallengeWithProgress } from '../types';
import { RootStackParamList } from '../navigation/types';

type SkillDetailRouteProp = RouteProp<RootStackParamList, 'SkillDetail'>;

export default function SkillDetailScreen() {
  const route = useRoute<SkillDetailRouteProp>();
  const { skillId } = route.params;
  const { completeChallenge, history, refreshHistory } = useProgress();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
    refreshHistory();
  }, [skillId]);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await challengeService.listBySkill(skillId);
      setChallenges(data.sort((a, b) => a.orderIndex - b.orderIndex));
    } catch (err: any) {
      console.error('Erro ao carregar desafios:', err);
      setError(err.message || 'Não foi possível carregar os desafios');
    } finally {
      setIsLoading(false);
    }
  };

  const getChallengeProgress = (challengeId: string): ChallengeWithProgress['progress'] => {
    if (!history || !Array.isArray(history)) {
      return undefined;
    }
    const progress = history.find((h) => h.challengeId === challengeId);
    return progress || undefined;
  };

  const handleComplete = async (challengeId: string) => {
    try {
      setCompletingId(challengeId);
      setError(null);
      await completeChallenge(challengeId);
      // Aguardar um pouco para garantir que o backend processou
      await new Promise(resolve => setTimeout(resolve, 200));
      // Recarregar o histórico para atualizar o estado dos desafios
      await refreshHistory();
    } catch (err: any) {
      console.error('Erro ao completar desafio:', err);
      setError(err.message || 'Não foi possível completar o desafio');
    } finally {
      setCompletingId(null);
    }
  };

  const renderChallenge = ({ item }: { item: Challenge }) => {
    const progress = getChallengeProgress(item.id);
    const isCompleted = progress?.status === 'done';
    const isCompleting = completingId === item.id;

    return (
      <Card 
        style={styles.challengeCard}
        variant={isCompleted ? 'success' : 'default'}
      >
        <View style={styles.challengeHeader}>
          <View style={[styles.challengeNumber, isCompleted && styles.challengeNumberCompleted]}>
            {isCompleted ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : (
              <Text style={styles.number}>{item.orderIndex}</Text>
            )}
          </View>
          <View style={styles.challengeContent}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.challengeDescription}>{item.description}</Text>
            )}
          </View>
        </View>
        {isCompleted ? (
          <View style={styles.completedButton}>
            <Text style={styles.completedText}>Concluído ✓</Text>
          </View>
        ) : (
          <Button
            title="Marcar como concluído"
            onPress={() => handleComplete(item.id)}
            loading={isCompleting}
            disabled={isCompleting}
            style={styles.completeButton}
            accessibilityLabel={`Marcar desafio ${item.orderIndex} como concluído`}
            accessibilityHint="Ao pressionar, este desafio será marcado como concluído"
          />
        )}
      </Card>
    );
  };

  const completedCount = challenges.filter((c) => {
    const progress = getChallengeProgress(c.id);
    return progress?.status === 'done';
  }).length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando desafios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && challenges.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={loadChallenges}
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
        <Text style={styles.title} accessibilityRole="header">
          {completedCount} de {challenges.length} desafios concluídos
        </Text>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity 
              onPress={loadChallenges}
              style={styles.errorRetryButton}
              accessible
              accessibilityLabel="Tentar novamente"
            >
              <Text style={styles.errorRetryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum desafio disponível
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
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
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
  list: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  challengeCard: {
    marginBottom: theme.spacing.md,
  },
  challengeHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  challengeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  challengeNumberCompleted: {
    backgroundColor: theme.colors.success,
  },
  number: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '600',
  },
  checkmark: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '700',
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  challengeDescription: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
  },
  completeButton: {
    marginTop: theme.spacing.sm,
  },
  completedButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '600',
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

