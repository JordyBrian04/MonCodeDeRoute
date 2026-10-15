import React from 'react';
import { View } from 'react-native';

import { SignShape } from '@/src/components/signs/SignShape';
import { AppText } from '@/src/components/ui/AppText';
import type { Block } from '@/src/data';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

export function LessonBlock({ block, accent }: { block: Block; accent: string }) {
  const { colors } = useTheme();

  switch (block.type) {
    case 'p':
      return <AppText style={{ marginBottom: spacing.sm }}>{block.text}</AppText>;

    case 'list':
      return (
        <View style={{ marginBottom: spacing.md, gap: 6 }}>
          {block.title ? <AppText variant="bodyBold">{block.title}</AppText> : null}
          {block.items.map((it, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
              <AppText color={accent} style={{ fontWeight: '800', minWidth: 18 }}>{block.ordered ? `${i + 1}.` : '•'}</AppText>
              <AppText style={{ flex: 1 }}>{it}</AppText>
            </View>
          ))}
        </View>
      );

    case 'key':
      return (
        <View style={{ backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.primary }}>
          <AppText variant="bodyBold" color={colors.primary}>⭐ {block.title ?? 'À retenir'}</AppText>
          <AppText>{block.text}</AppText>
        </View>
      );

    case 'warn':
      return (
        <View style={{ backgroundColor: colors.warningSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
          <AppText>⚠️ {block.text}</AppText>
        </View>
      );

    case 'mnemo':
      return (
        <View style={{ backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <AppText style={{ fontSize: 26, fontWeight: '800' }} color={colors.accent}>{block.code}</AppText>
            <AppText variant="bodyBold" style={{ flex: 1 }}>🧠 {block.title}</AppText>
          </View>
          {block.items.map((it, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={{ color: '#FFFFFF', fontWeight: '800' }}>{it.letter}</AppText>
              </View>
              <AppText style={{ flex: 1 }}>{it.text}</AppText>
            </View>
          ))}
        </View>
      );

    case 'example':
      return (
        <View style={{ backgroundColor: colors.infoSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md }}>
          <AppText variant="bodyBold" color={colors.info}>💡 {block.title}</AppText>
          <AppText>{block.text}</AppText>
        </View>
      );

    case 'table':
      return (
        <View style={{ marginBottom: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          {block.title ? (
            <View style={{ backgroundColor: colors.surfaceAlt, padding: spacing.sm }}>
              <AppText variant="bodyBold">{block.title}</AppText>
            </View>
          ) : null}
          {block.rows.map(([a, b], i) => (
            <View key={i} style={{ flexDirection: 'row', borderTopWidth: i === 0 && !block.title ? 0 : 1, borderTopColor: colors.border, backgroundColor: i % 2 ? colors.surfaceAlt : colors.surface }}>
              <View style={{ flex: 1.1, padding: spacing.sm }}>
                <AppText variant="small" style={{ fontWeight: '700' }}>{a}</AppText>
              </View>
              <View style={{ flex: 1, padding: spacing.sm, borderLeftWidth: 1, borderLeftColor: colors.border }}>
                <AppText variant="small">{b}</AppText>
              </View>
            </View>
          ))}
        </View>
      );

    case 'signs':
      return (
        <View style={{ marginBottom: spacing.md, gap: spacing.sm }}>
          {block.title ? <AppText variant="bodyBold">{block.title}</AppText> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {block.items.map((it, i) => (
              <View key={i} style={{ width: '30%', alignItems: 'center', gap: 4 }}>
                <SignShape spec={it.sign} size={68} />
                <AppText variant="caption" center muted>{it.label}</AppText>
              </View>
            ))}
          </View>
        </View>
      );
  }
}
