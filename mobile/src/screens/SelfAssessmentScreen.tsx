import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import selfAssessmentData from '../data/selfAssessment.json';
import api from '../config/api';

interface Answer {
  questionId: number;
  value: number;
  score: number;
}

export default function SelfAssessmentScreen() {
  const navigation = useNavigation();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = selfAssessmentData.questions;
  const answerOptions = selfAssessmentData.answerOptions;
  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.id];

  const handleAnswer = (option: typeof answerOptions[0]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: {
        questionId: currentQuestionData.id,
        value: option.value,
        score: option.score,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateSkillScores = (): Record<string, number> => {
    const skillScores: Record<string, number> = {};

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        Object.entries(question.skillMapping).forEach(([skillName, weight]) => {
          if (!skillScores[skillName]) {
            skillScores[skillName] = 0;
          }
          skillScores[skillName] += answer.score * weight;
        });
      }
    });

    return skillScores;
  };

  const getSkillLevel = (score: number): 'fraco' | 'medio' | 'forte' => {
    if (score <= 15) return 'fraco';
    if (score <= 30) return 'medio';
    return 'forte';
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter((q) => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Avaliação incompleta',
        'Por favor, responda todas as perguntas antes de continuar.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const skillScores = calculateSkillScores();
      
      // Buscar skills do backend para obter os IDs
      const skillsResponse = await api.get('/skills?isActive=true&limit=100');
      const skills = skillsResponse.data?.data?.items || [];
      
      // Mapear scores para assessments
      const assessments = Object.entries(skillScores).map(([skillName, score]) => {
        const skill = skills.find((s: any) => s.name === skillName);
        if (!skill) return null;
        
        const level = getSkillLevel(score);
        // Converter nível para score de 1-10
        let assessmentScore = 1;
        if (level === 'medio') assessmentScore = 5;
        if (level === 'forte') assessmentScore = 8;
        
        return {
          skillId: skill.id,
          score: assessmentScore,
        };
      }).filter(Boolean);

      if (assessments.length === 0) {
        Alert.alert('Erro', 'Não foi possível encontrar as skills correspondentes.');
        return;
      }

      // Salvar assessments
      await api.post('/assessment/submit-multiple', {
        assessments,
      });

      // Navegar para tela de resultado
      navigation.navigate('AssessmentResult' as never, {
        skillScores,
        skillLevels: Object.fromEntries(
          Object.entries(skillScores).map(([skill, score]) => [
            skill,
            getSkillLevel(score),
          ])
        ),
        recommendedSkill: Object.entries(skillScores).sort(([, a], [, b]) => b - a)[0]?.[0],
      } as never);
    } catch (error: any) {
      console.error('Erro ao enviar autoavaliação:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua autoavaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Autoavaliação Inicial</Text>
        <Text style={styles.subtitle}>
          Responda as perguntas para descobrir suas habilidades
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} de {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Pergunta {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{currentQuestionData.text}</Text>

          <View style={styles.optionsContainer}>
            {answerOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  currentAnswer?.value === option.value && styles.optionButtonActive,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentAnswer?.value === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <Button
            title="Anterior"
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
            style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          />
          <Button
            title={currentQuestion === questions.length - 1 
              ? (isSubmitting ? 'Salvando...' : 'Finalizar')
              : 'Próxima'}
            onPress={handleNext}
            disabled={!currentAnswer || isSubmitting}
            loading={isSubmitting}
            style={[styles.navButton, (!currentAnswer || isSubmitting) && styles.navButtonDisabled]}
          />
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
  questionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  questionText: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  optionTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
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

