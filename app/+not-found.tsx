import { useRouter } from 'expo-router';
import React from 'react';

import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Screen } from '@/src/components/ui/Screen';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen scroll={false} contentStyle={{ justifyContent: 'center', gap: 16 }}>
      <AppText variant="hero" center>🚧</AppText>
      <AppText variant="h2" center>Page introuvable</AppText>
      <Button title="Retour à l’accueil" onPress={() => router.replace('/')} />
    </Screen>
  );
}
