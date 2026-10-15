import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LessonBlock } from '@/src/components/lesson/LessonBlocks';
import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Header } from '@/src/components/ui/Header';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Screen } from '@/src/components/ui/Screen';
import { getChapter, questionsOf } from '@/src/data';
import { isChapterUnlocked, isChapterValidated } from '@/src/features/progress/selectors';
import { openQuiz } from '@/src/navigation';
import { useAppStore } from '@/src/store/useAppStore';
import { chapterColors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapterId = Number(id);
  const chapter = getChapter(chapterId);
  const router = useRouter();
  const { colors } = useTheme();
  const steps = useAppStore((s) => s.steps);
  const lessonsRead = useAppStore((s) => s.lessonsRead);
  const markLessonRead = useAppStore((s) => s.markLessonRead);

  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [viewH, setViewH] = useState(0);
  const [contentH, setContentH] = useState(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const max = Math.max(1, contentSize.height - layoutMeasurement.height);
    const p = Math.min(1, Math.max(0, contentOffset.y / max));
    setProgress(p);
    if (p > 0.92) setReachedEnd(true);
  }, []);

  if (!chapter) {
    return (
      <Screen>
        <Header title="Chapitre introuvable" />
      </Screen>
    );
  }

  const color = chapterColors[chapter.id - 1];
  const unlocked = isChapterUnlocked(steps, chapter.id);
  const validated = isChapterValidated(steps, chapter.id);
  const read = !!lessonsRead[chapter.id];
  const shortContent = contentH > 0 && viewH > 0 && contentH <= viewH + 40;
  const canFinish = read || reachedEnd || shortContent;

  if (!unlocked) {
    return (
      <Screen scroll={false} contentStyle={{ justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <AppText style={{ fontSize: 64 }}>🔒</AppText>
        <AppText variant="h2" center>Chapitre verrouillé</AppText>
        <AppText muted center>Valide d’abord l’étape précédente du parcours (16/20 minimum) pour débloquer ce chapitre.</AppText>
        <Button title="Retour" onPress={() => router.back()} />
      </Screen>
    );
  }

  const onLayoutScroll = (e: LayoutChangeEvent) => setViewH(e.nativeEvent.layout.height);

  const finishLesson = () => {
    if (!read) markLessonRead(chapter.id);
    haptic.success();
    openQuiz(router, 'chapter', `ch${chapter.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <Header title={`Chapitre ${chapter.id}`} subtitle={chapter.shortTitle} />
        <ProgressBar value={read ? 1 : progress} color={color} height={6} style={{ marginBottom: spacing.sm }} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
        onScroll={onScroll}
        scrollEventThrottle={64}
        onLayout={onLayoutScroll}
        onContentSizeChange={(_, h) => setContentH(h)}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedIn>
          <View style={{ backgroundColor: color + '22', borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, gap: 4 }}>
            <AppText style={{ fontSize: 44 }}>{chapter.emoji}</AppText>
            <AppText variant="h1">{chapter.title}</AppText>
            <AppText muted>{chapter.summary}</AppText>
            <AppText variant="caption" color={color} style={{ fontWeight: '800' }}>{chapter.pages} · {chapter.sections.length} parties · {questionsOf(chapter.id).length} questions</AppText>
          </View>
        </AnimatedIn>

        {chapter.sections.map((sec, i) => (
          <AnimatedIn key={sec.id} index={i + 1}>
            <View style={{ marginBottom: spacing.xl }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.md }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 18 }}>{sec.emoji}</AppText>
                </View>
                <AppText variant="h2" style={{ flex: 1 }}>{sec.title}</AppText>
              </View>
              {sec.blocks.map((b, j) => (
                <LessonBlock key={j} block={b} accent={color} />
              ))}
            </View>
          </AnimatedIn>
        ))}
      </ScrollView>

      <View style={{ padding: spacing.lg, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>
        {!canFinish ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <Ionicons name="arrow-down" size={16} color={colors.textMuted} />
            <AppText variant="small" muted>Lis la leçon jusqu’en bas pour débloquer le questionnaire</AppText>
          </View>
        ) : null}
        <Button
          title={validated ? 'Refaire le questionnaire /20' : 'J’ai terminé la leçon → questionnaire /20'}
          icon="checkmark-circle"
          disabled={!canFinish}
          onPress={finishLesson}
        />
        {validated ? <Button title="Révision libre (sans pression)" variant="secondary" small onPress={() => openQuiz(router, 'review', String(chapter.id))} /> : null}
      </View>
    </SafeAreaView>
  );
}
