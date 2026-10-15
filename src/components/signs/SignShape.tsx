import React from 'react';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import type { SignSpec } from '@/src/data';

interface Props {
  spec: SignSpec;
  size?: number;
}

const BLACK = '#111111';

function octagonPoints(c: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    pts.push(`${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/** Dessine un panneau de signalisation à partir de sa description (viewBox 100×100). */
export function SignShape({ spec, size = 72 }: Props) {
  const { shape, border, fill, glyph, glyphColor = BLACK, text, textColor = BLACK, slash, outline } = spec;
  const sw = 7;
  let body: React.ReactNode;
  let cy = 50;

  switch (shape) {
    case 'triangle':
      body = <Polygon points="50,9 93,87 7,87" fill={fill} stroke={border} strokeWidth={sw + 3} strokeLinejoin="round" />;
      cy = 62;
      break;
    case 'triangleDown':
      body = <Polygon points="7,13 93,13 50,91" fill={fill} stroke={border} strokeWidth={sw + 3} strokeLinejoin="round" />;
      cy = 36;
      break;
    case 'circle':
      body = <Circle cx={50} cy={50} r={43} fill={fill} stroke={border} strokeWidth={sw + 2} />;
      break;
    case 'square':
      body = <Rect x={8} y={8} width={84} height={84} rx={10} fill={fill} stroke={border === fill ? '#FFFFFF' : border} strokeWidth={sw - 2} />;
      break;
    case 'rect':
      body = <Rect x={4} y={25} width={92} height={50} rx={6} fill={fill} stroke="#FFFFFF" strokeWidth={4} />;
      break;
    case 'octagon':
      body = (
        <>
          <Polygon points={octagonPoints(50, 47)} fill={fill} stroke={outline ?? border} strokeWidth={4} strokeLinejoin="round" />
          <Polygon points={octagonPoints(50, 41)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinejoin="round" />
        </>
      );
      break;
    case 'diamond':
      body = (
        <>
          <Polygon points="50,5 95,50 50,95 5,50" fill="#FFFFFF" stroke={outline ?? '#222'} strokeWidth={4} strokeLinejoin="round" />
          <Polygon points="50,18 82,50 50,82 18,50" fill={fill} stroke={outline ?? '#222'} strokeWidth={3} strokeLinejoin="round" />
        </>
      );
      break;
    default:
      body = null;
  }

  const g = glyphColor;
  const glyphEl = (() => {
    switch (glyph) {
      case 'exclam':
        return (
          <>
            <Rect x={46} y={cy - 18} width={8} height={22} rx={3} fill={g} />
            <Circle cx={50} cy={cy + 12} r={5} fill={g} />
          </>
        );
      case 'cross':
        return (
          <>
            <Line x1={36} y1={cy - 12} x2={64} y2={cy + 16} stroke={g} strokeWidth={7} strokeLinecap="round" />
            <Line x1={64} y1={cy - 12} x2={36} y2={cy + 16} stroke={g} strokeWidth={7} strokeLinecap="round" />
          </>
        );
      case 'arrowUp':
        return <Path d="M50 22 L72 48 H58 V76 H42 V48 H28 Z" fill={g} />;
      case 'arrowRight':
        return <Path d="M78 50 L52 28 V42 H24 V58 H52 V72 Z" fill={g} />;
      case 'priority':
        return (
          <>
            <Polygon points={`50,${cy - 18} 68,${cy} 50,${cy + 18} 32,${cy}`} fill="#FFFFFF" stroke={g} strokeWidth={3} />
            <Polygon points={`50,${cy - 11} 61,${cy} 50,${cy + 11} 39,${cy}`} fill="#F5C518" />
          </>
        );
      case 'roundabout':
        return (
          <G>
            <Path d={`M50 ${cy - 17} A17 17 0 0 1 66 ${cy - 4}`} stroke={g} strokeWidth={5} fill="none" strokeLinecap="round" />
            <Path d={`M67 ${cy + 6} A17 17 0 0 1 52 ${cy + 17}`} stroke={g} strokeWidth={5} fill="none" strokeLinecap="round" />
            <Path d={`M40 ${cy + 14} A17 17 0 0 1 35 ${cy - 8}`} stroke={g} strokeWidth={5} fill="none" strokeLinecap="round" />
            <Polygon points={`66,${cy - 12} 72,${cy - 2} 60,${cy - 2}`} fill={g} />
            <Polygon points={`58,${cy + 20} 48,${cy + 14} 58,${cy + 10}`} fill={g} />
            <Polygon points={`30,${cy - 4} 40,${cy - 4} 35,${cy - 14}`} fill={g} />
          </G>
        );
      default:
        return null;
    }
  })();

  const label = text ? (
    <SvgText
      x={50}
      y={shape === 'rect' ? 58 : cy + (shape === 'triangle' ? 10 : 12)}
      fontSize={text.length > 3 ? 24 : text.length > 2 ? 30 : 38}
      fontWeight="bold"
      fill={textColor}
      textAnchor="middle"
    >
      {text}
    </SvgText>
  ) : null;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {body}
      {glyphEl}
      {label}
      {slash ? <Line x1={22} y1={78} x2={78} y2={22} stroke="#D62828" strokeWidth={9} strokeLinecap="round" /> : null}
    </Svg>
  );
}
