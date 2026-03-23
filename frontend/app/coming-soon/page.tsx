'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function ComingSoonPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleNotify = async () => {
    setStatus('loading');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch('https://k-verse-production.up.railway.app/users/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id ?? null }),
      });
      if (!response.ok) throw new Error('API error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#1F4E79', borderRadius: 20, padding: '52px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(31,78,121,0.18)' }}>
        
        {/* 아이콘 */}
        <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>

        {/* 타이틀 */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 16, lineHeight: 1.3 }}>
          지금 열심히 개발 중이에요!
        </h1>

        {/* 부제목 */}
        <p style={{ fontSize: 18, color: '#B3CDE8', marginBottom: 20, lineHeight: 1.6 }}>
          베타 출시되면 가장 먼저 알려드릴게요 😊
        </p>

        {/* 설명 */}
        <p style={{ fontSize: 15, color: '#7BA7C8', marginBottom: 40, lineHeight: 1.8 }}>
          현재 K-Verse 베타 서비스를 준비 중입니다.<br />
          곧 출시 예정이며, 출시 즉시 이메일로 안내해 드릴게요.
        </p>

        {/* 출시 알림 버튼 */}
        {status === 'success' ? (
          <p style={{ fontSize: 16, color: '#F5C518', fontWeight: 700, marginBottom: 16 }}>
            신청 완료! 출시되면 바로 연락드릴게요 😊
          </p>
        ) : (
          <>
            <button
              onClick={handleNotify}
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: '#F5C518',
                color: '#1A1A2E',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                marginBottom: 12,
                boxShadow: '0 4px 16px rgba(245,197,24,0.35)',
              }}
            >
              {status === 'loading' ? '신청 중...' : '출시 알림 받기'}
            </button>
            {status === 'error' && (
              <p style={{ fontSize: 14, color: '#FCA5A5', marginBottom: 12 }}>
                잠시 후 다시 시도해주세요
              </p>
            )}
          </>
        )}

        {/* 돌아가기 버튼 */}
        <button
          onClick={() => router.push('/diagnostic/result')}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'transparent',
            color: '#B3CDE8',
            border: '2px solid #2E75B6',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          진단 결과로 돌아가기
        </button>

      </div>
    </div>
  );
}