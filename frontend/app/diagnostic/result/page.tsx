'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ─── 타입 ──────────────────────────────────────────────────────────────────
interface DiagnosticResult {
  case: 'normal' | 'perfect' | 'zero';
  strongest: string | null;
  weakest: string | null;
  correct_count: number;
  scores: {
    빈칸: number;
    주제: number;
    내용일치: number;
    순서배열: number;
  };
  sample_question: {
    id: number;
    question_subtype: string;
    question_text: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    correct_answer: number;
    explanation_vi: string;
    image_url: string | null;
    passage: string | null;
    level: number;
  } | null;
}

// ─── 해설 텍스트 ────────────────────────────────────────────────────────────
const EXPLANATIONS: Record<string, { strength: string; weakness: string; cta: string }> = {
  빈칸: {
    strength:
      '빈칸 추론 감각이 좋은 편이에요. 문맥 속 단서와 표현의 뉘앙스를 비교해 정답을 고를 수 있는 기본기가 있습니다. 다만 TOPIK II에서는 비슷해 보이는 표현 사이의 차이를 더 정교하게 구분해야 안정적으로 점수를 지킬 수 있어요.',
    weakness:
      '현재 가장 보완이 필요한 영역은 빈칸 문제예요. 어휘만 아는 것으로 해결되지 않고, 문장 앞뒤 단서와 표현의 쓰임을 함께 봐야 해서 실수하기 쉽습니다. 특히 시험장에서는 보기들이 다 맞아 보이기 때문에 감으로 고르면 오답이 반복됩니다.',
    cta: '빈칸 추론 훈련 시작하기',
  },
  주제: {
    strength:
      '핵심 메시지를 빠르게 잡는 힘이 있어요. 광고, 기사, 설명문에서 글쓴이가 무엇을 말하고 싶은지 비교적 잘 파악하는 편입니다. 이 감각은 TOPIK II 읽기의 중요한 기반이지만, 더 높은 점수를 위해서는 핵심과 세부 정보를 함께 연결하는 훈련이 필요해요.',
    weakness:
      '현재 가장 약한 영역은 주제 파악 문제예요. 기사나 설명문에서는 일부 단어만 보고 답을 고르면 함정에 걸리기 쉽습니다. 약점 훈련에서는 글의 중심 문장 찾기, 선택지 함정 구분, 지문별 핵심 요약 연습으로 주제 판단력을 잡아드립니다.',
    cta: '주제 찾기 훈련 시작하기',
  },
  내용일치: {
    strength:
      '정보 비교 능력이 안정적인 편이에요. 그림이나 짧은 글에서 조건을 확인하고 맞는 내용을 찾는 데 강점이 있습니다. 이 힘은 실수를 줄이는 데 도움이 되지만, 긴 글 독해까지 연결하려면 세부 정보 처리 속도를 더 끌어올릴 필요가 있어요.',
    weakness:
      '현재 가장 보완이 필요한 영역은 내용 일치 문제예요. 숫자, 조건, 대상, 시점 같은 세부 정보 하나만 놓쳐도 바로 오답이 됩니다. 약점 훈련에서는 비교 포인트를 빠르게 체크하는 방법과 자주 틀리는 함정을 반복 연습해 정확도를 높여드립니다.',
    cta: '정보 비교 훈련 시작하기',
  },
  순서배열: {
    strength:
      '글의 흐름을 읽는 힘이 있는 편이에요. 문장 사이의 연결 관계를 보고 앞뒤 순서를 판단하는 감각이 있습니다. 이 능력은 TOPIK II 중상위권으로 가는 데 매우 중요하고, 조금만 더 다듬으면 긴 글 독해에서도 큰 강점이 될 수 있어요.',
    weakness:
      '현재 가장 약한 영역은 순서 배열 문제예요. 단어 뜻을 아는 것보다 문장 사이의 연결과 전개 흐름을 읽는 힘이 더 중요합니다. 특히 혼자 공부하면 왜 틀렸는지가 명확히 남지 않아 같은 패턴의 실수가 반복됩니다.',
    cta: '문장 흐름 훈련 시작하기',
  },
};

// ─── 색상 상수 ──────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#1F4E79',
  secondary: '#2E75B6',
  accent: '#F5C518',
  background: '#F8FAFC',
  text: '#1A1A2E',
};

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────
export default function DiagnosticResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = sessionStorage.getItem('diagnosticResult');
      if (raw) {
        const parsed = JSON.parse(raw) as DiagnosticResult;
        if (!parsed.case || !['normal', 'perfect', 'zero'].includes(parsed.case)) {
          parsed.case = 'normal';
        }
        setResult(parsed);
      } else {
        // 데이터 없으면 진단 페이지로 리다이렉트
        router.push('/diagnostic');
        return;
      }
    } catch {
      setResult({ case: 'normal', strongest: null, weakest: null, correct_count: 0, scores: { 빈칸: 0, 주제: 0, 내용일치: 0, 순서배열: 0 }, sample_question: null });
    }
  }, []);

  useEffect(() => {
    if (!result) return;
    const score = Math.round((result.correct_count / 10) * 100);
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = score / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setScoreDisplay(score);
        clearInterval(timer);
      } else {
        setScoreDisplay(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [result]);

  if (!mounted || !result) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.primary, fontSize: 18 }}>결과를 불러오는 중...</div>
      </div>
    );
  }

  const score = Math.round((result.correct_count / 10) * 100);

  const radarData = {
    labels: ['빈칸', '주제찾기', '내용일치', '순서배열'],
    datasets: [
      {
        label: '나의 실력',
        data: [result.scores.빈칸, result.scores.주제, result.scores.내용일치, result.scores.순서배열],
        backgroundColor: 'rgba(245, 197, 24, 0.18)',
        borderColor: COLORS.accent,
        borderWidth: 2.5,
        pointBackgroundColor: COLORS.accent,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.accent,
        pointRadius: 5,
      },
    ],
  };

  const radarOptions: import('chart.js').ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, display: false },
        grid: { color: 'rgba(31,78,121,0.12)' },
        angleLines: { color: 'rgba(31,78,121,0.15)' },
        pointLabels: {
          font: { size: 14, weight: 600 },
          color: COLORS.primary,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw}점`,
        },
      },
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
      {/* 상단 헤더 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, fontSize: 20, padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
        >
          ←
        </button>
        <span style={{ fontWeight: 700, fontSize: 17, color: COLORS.text }}>진단 결과</span>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* ① 점수 섹션 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 24px 28px', textAlign: 'center', boxShadow: '0 2px 16px rgba(31,78,121,0.08)', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 8, letterSpacing: 1 }}>TOPIK 읽기 적응도</p>
          <div style={{ fontSize: 72, fontWeight: 800, color: COLORS.accent, lineHeight: 1, letterSpacing: -2 }}>
            {scoreDisplay}
          </div>
          <p style={{ fontSize: 15, color: '#94A3B8', marginTop: 6 }}>점 / 100점 만점</p>

          {result.case === 'perfect' && (
            <div style={{ marginTop: 24, padding: '18px 20px', background: '#F0FDF4', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.75, margin: 0 }}>
                10문항 전체 정답이에요. TOPIK II 읽기 핵심 유형에 대한 기본 적응력이 매우 좋습니다.<br />
                특정 한 유형만 강한 것이 아니라, 빈칸·주제·내용일치·순서배열 전반에서 고르게 안정적인 반응을 보였어요.<br /><br />
                무료 진단은 빠른 확인용 테스트라서, 긴 지문 독해나 실전 시간 관리까지는 충분히 확인하기 어렵습니다.<br />
                지금은 약점 보완보다 실전형 테스트로 독해력을 정밀하게 확인하는 것이 더 중요해요.
              </p>
            </div>
          )}
          {result.case === 'zero' && (
            <div style={{ marginTop: 24, padding: '18px 20px', background: '#FFF7ED', borderRadius: 12, textAlign: 'left' }}>
              <p style={{ fontSize: 14, color: '#9A3412', lineHeight: 1.75, margin: 0 }}>
                이번 진단에서는 대표 읽기 유형 전반에서 어려움이 확인됐어요.<br />
                아직 TOPIK II 읽기 문제 방식에 익숙하지 않을 가능성이 높습니다.<br /><br />
                문제를 많이 푸는 것보다, 빈칸 추론·주제 파악·내용 비교·문장 흐름 읽기 같은<br />
                핵심 전략을 순서대로 익히는 것이 더 중요합니다.<br />
                기초부터 유형별로 훈련하면 점수는 충분히 올라갈 수 있어요.
              </p>
            </div>
          )}
        </div>

        {/* ② 레이더 차트 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 16px rgba(31,78,121,0.08)', marginBottom: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 20, textAlign: 'center' }}>유형별 실력 분석</p>
          <div style={{ maxWidth: 300, margin: '0 auto' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>          
        </div>

        {/* ③ 강점·약점 카드 (normal만) */}
        {result.case === 'normal' && result.weakest && result.strongest && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12, paddingLeft: 2 }}>강점·약점 해설</p>
            <StrengthCard
              type="strong"
              label={result.strongest}
              text={EXPLANATIONS[result.strongest]?.strength ?? ''}
              cta={EXPLANATIONS[result.strongest]?.cta ?? '훈련 시작하기'}
              href={`/trial?type=${result.strongest}`}
            />
            <StrengthCard
              type="weak"
              label={result.weakest}
              text={EXPLANATIONS[result.weakest]?.weakness ?? ''}
              cta={EXPLANATIONS[result.weakest]?.cta ?? '훈련 시작하기'}
              href={`/trial?type=${result.weakest}`}
            />
          </>
        )}

        {/* ④ CTA 버튼 */}
        <div style={{ marginTop: 28 }}>
{result.case === 'normal' && result.weakest && (
  <>
    <GoldenButton onClick={() => router.push('/coming-soon')}>
      {EXPLANATIONS[result.weakest]?.cta ?? '훈련 시작하기'} →
    </GoldenButton>
    <button
      onClick={() => router.push('/coming-soon')}
      style={{
        width: '100%',
        padding: '14px 24px',
        background: 'transparent',
        color: '#1F4E79',
        border: '2px solid #1F4E79',
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 12,
      }}
    >
      틀린 문제 해설 받기 →
    </button>
  </>
)}
          {result.case === 'perfect' && (
            <GoldenButton onClick={() => router.push('/coming-soon')}>
              실전형 정밀 진단 시작하기 →
            </GoldenButton>
          )}
          {result.case === 'zero' && (
            <GoldenButton onClick={() => router.push('/coming-soon')}>
              기초부터 시작하기 →
            </GoldenButton>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────

function StrengthCard({
  type,
  label,
  text,
}: {
  type: 'strong' | 'weak';
  label: string;
  text: string;
  cta: string;
  href: string;
}) {
  const isWeak = type === 'weak';
  return (
    <div
      style={{
        background: isWeak ? '#FFF5F5' : '#F0FDF4',
        border: `1.5px solid ${isWeak ? '#FED7D7' : '#BBF7D0'}`,
        borderRadius: 12,
        padding: '20px 20px 16px',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{isWeak ? '⚠️' : '⭐'}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: isWeak ? '#C53030' : '#166534' }}>
          {isWeak ? '약점' : '강점'} — {label}
        </span>
      </div>
      <p style={{ fontSize: 14, color: isWeak ? '#742A2A' : '#14532D', lineHeight: 1.7, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

function GoldenButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px 24px',
        background: '#F5C518',
        color: '#1A1A2E',
        border: 'none',
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        letterSpacing: 0.3,
        boxShadow: '0 4px 16px rgba(245,197,24,0.35)',
        transition: 'opacity 0.15s, transform 0.1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
    >
      {children}
    </button>
  );
}