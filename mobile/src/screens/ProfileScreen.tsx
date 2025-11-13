import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Card, Button } from '../components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user?.name || 'Não informado'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email || 'Não informado'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Função</Text>
            <Text style={styles.value}>
              {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre o SkillUp</Text>
          <Text style={styles.sectionText}>
            Prepare-se para o futuro do trabalho desenvolvendo suas habilidades
            profissionais através de desafios práticos e trilhas de aprendizado.
          </Text>
        </Card>

        <Button
          title="Sair"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...theme.typography.h1,
    color: theme.colors.white,
  },
  infoContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  sectionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});

