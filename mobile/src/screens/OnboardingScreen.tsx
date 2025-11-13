import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button } from '../components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { skillsService } from '../modules/skills/skill.service';
import { Skill } from '../types';
import api from '../config/api';

export default function OnboardingScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assessments, setAssessments] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const data = await skillsService.list();
      setSkills(data.filter((skill) => skill.isActive));
    } catch (error) {
      console.error('Erro ao carregar skills:', error);
      Alert.alert('Erro', 'Não foi possível carregar as skills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreChange = (skillId: string, score: number) => {
    setAssessments((prev) => ({
      ...prev,
      [skillId]: score,
    }));
  };

  const handleNext = () => {
    if (currentStep < skills.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const missingSkills = skills.filter((skill) => !assessments[skill.id]);
    if (missingSkills.length > 0) {
      Alert.alert(
        'Avaliação incompleta',
        'Por favor, avalie todas as skills antes de continuar.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const assessmentsArray = Object.entries(assessments).map(([skillId, score]) => ({
        skillId,
        score,
      }));

      await api.post('/assessment/submit-multiple', {
        assessments: assessmentsArray,
      });

      // Após salvar, o App.tsx vai detectar que agora tem assessment
      // e mostrará a home automaticamente
      Alert.alert('Sucesso', 'Avaliação concluída! Vamos começar sua jornada.');
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando skills...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentSkill = skills[currentStep];
  const currentScore = assessments[currentSkill?.id] || 0;
  const progress = ((currentStep + 1) / skills.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avaliação Inicial</Text>
        <Text style={styles.subtitle}>
          Avalie seu nível atual em cada skill para personalizarmos sua jornada
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} de {skills.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentSkill && (
          <View style={styles.skillCard}>
            <Text style={styles.skillName}>{currentSkill.name}</Text>
            <Text style={styles.skillDescription}>{currentSkill.description}</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>
                Como você avalia seu nível atual nesta skill?
              </Text>
              <Text style={styles.scoreValue}>{currentScore > 0 ? currentScore : '?'}</Text>

              <View style={styles.scoreButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreButton,
                      currentScore === score && styles.scoreButtonActive,
                    ]}
                    onPress={() => handleScoreChange(currentSkill.id, score)}
                  >
                    <Text
                      style={[
                        styles.scoreButtonText,
                        currentScore === score && styles.scoreButtonTextActive,
                      ]}
                    >
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.scoreLabels}>
                <Text style={styles.scoreLabelText}>Iniciante</Text>
                <Text style={styles.scoreLabelText}>Avançado</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <Button
            title="Anterior"
            onPress={handlePrevious}
            disabled={currentStep === 0}
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          />
          {currentStep < skills.length - 1 ? (
            <Button
              title="Próxima"
              onPress={handleNext}
              disabled={!currentScore}
              style={[styles.navButton, !currentScore && styles.navButtonDisabled]}
            />
          ) : (
            <Button
              title={isSubmitting ? 'Salvando...' : 'Finalizar'}
              onPress={handleSubmit}
              disabled={!currentScore || isSubmitting}
              loading={isSubmitting}
              style={[styles.navButton, (!currentScore || isSubmitting) && styles.navButtonDisabled]}
            />
          )}
        </View>
      </View>
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
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  skillCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillName: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.sm,
  },
  skillDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  scoreContainer: {
    marginTop: theme.spacing.md,
  },
  scoreLabel: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  scoreValue: {
    ...theme.typography.h1,
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  scoreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  scoreButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  scoreButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  scoreButtonText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  scoreButtonTextActive: {
    color: theme.colors.white,
  },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  scoreLabelText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

