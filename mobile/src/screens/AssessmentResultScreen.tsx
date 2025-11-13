import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Button } from '../components';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const RADAR_SIZE = width * 0.7;
const CENTER = RADAR_SIZE / 2;
const MAX_SCORE = 50;

interface AssessmentResultScreenProps {
  route: {
    params: {
      skillScores: Record<string, number>;
      skillLevels: Record<string, 'fraco' | 'medio' | 'forte'>;
      recommendedSkill: string;
    };
  };
}

export default function AssessmentResultScreen({ route }: AssessmentResultScreenProps) {
  const navigation = useNavigation();
  const { skillScores, skillLevels, recommendedSkill } = route.params;

  const skills = Object.keys(skillScores);
  const skillValues = Object.values(skillScores);

  const getLevelColor = (level: 'fraco' | 'medio' | 'forte') => {
    switch (level) {
      case 'fraco':
        return theme.colors.error;
      case 'medio':
        return theme.colors.warning;
      case 'forte':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getLevelLabel = (level: 'fraco' | 'medio' | 'forte') => {
    switch (level) {
      case 'fraco':
        return 'Fraco';
      case 'medio':
        return 'Médio';
      case 'forte':
        return 'Forte';
      default:
        return '';
    }
  };

  // Calcular pontos do radar
  const getRadarPoints = () => {
    const angleStep = (2 * Math.PI) / skills.length;
    const points = skills.map((skill, index) => {
      const angle = (index * angleStep) - Math.PI / 2; // Começar do topo
      const score = skillScores[skill];
      const normalizedScore = Math.min(score / MAX_SCORE, 1);
      const radius = CENTER * 0.8 * normalizedScore;
      const x = CENTER + radius * Math.cos(angle);
      const y = CENTER + radius * Math.sin(angle);
      return { x, y, skill, score, level: skillLevels[skill] };
    });
    return points;
  };

  const radarPoints = getRadarPoints();

  const handleContinue = () => {
    // O App.tsx verifica a cada 2 segundos se há assessment
    // e automaticamente mostrará o AppNavigator quando detectar
    // Por enquanto, apenas aguardamos a detecção automática
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Seu Perfil de Habilidades</Text>
          <Text style={styles.subtitle}>
            Baseado na sua autoavaliação, aqui está seu radar de habilidades
          </Text>
        </View>

        <View style={styles.radarContainer}>
          <View style={styles.radarWrapper}>
            {/* Círculos de referência */}
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <View
                key={scale}
                style={[
                  styles.radarCircle,
                  {
                    width: RADAR_SIZE * 0.8 * scale * 2,
                    height: RADAR_SIZE * 0.8 * scale * 2,
                    borderRadius: RADAR_SIZE * 0.8 * scale,
                  },
                ]}
              />
            ))}

            {/* Labels das skills ao redor */}
            {radarPoints.map((point, index) => {
              const angle = (index * (2 * Math.PI) / skills.length) - Math.PI / 2;
              const labelRadius = RADAR_SIZE * 0.45;
              const labelX = labelRadius * Math.cos(angle);
              const labelY = labelRadius * Math.sin(angle);
              
              return (
                <View
                  key={index}
                  style={[
                    styles.skillLabel,
                    {
                      transform: [
                        { translateX: labelX },
                        { translateY: labelY },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.skillLabelText}>
                    {point.skill.substring(0, 10)}
                  </Text>
                  <View
                    style={[
                      styles.skillDot,
                      { backgroundColor: getLevelColor(point.level) },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.skillsList}>
          {skills.map((skill) => {
            const score = skillScores[skill];
            const level = skillLevels[skill];
            const percentage = Math.min((score / MAX_SCORE) * 100, 100);

            return (
              <View key={skill} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(level) },
                    ]}
                  >
                    <Text style={styles.levelText}>{getLevelLabel(level)}</Text>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getLevelColor(level),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.scoreText}>{score} pontos</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Skill Recomendada</Text>
          <Text style={styles.recommendationSkill}>{recommendedSkill}</Text>
          <Text style={styles.recommendationText}>
            Com base na sua autoavaliação, recomendamos focar no desenvolvimento de{' '}
            <Text style={styles.recommendationSkillInline}>{recommendedSkill}</Text>.
            Esta é a área onde você demonstrou maior potencial!
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Continuar para o App"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  radarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  radarWrapper: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.colors.border,
    opacity: 0.3,
  },
  skillLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillLabelText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skillsList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  skillItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  skillName: {
    ...theme.typography.h3,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  levelText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: '600',
  },
  progressBarContainer: {
    gap: theme.spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  recommendationCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  recommendationTitle: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  recommendationSkill: {
    ...theme.typography.h1,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  recommendationText: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    lineHeight: 24,
  },
  recommendationSkillInline: {
    fontWeight: '700',
  },
  footer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  continueButton: {
    marginTop: theme.spacing.md,
  },
});

