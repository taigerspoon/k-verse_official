'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function ComingSoonPage() {
  const [notified, setNotified] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleNotify = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id })
      })
      setNotified(true)
    } catch (e) {
      alert('잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#1F4E79',
        borderRadius: '16px',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🚀</div>
        <h1 style={{
          color: '#F5C518',
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          지금 열심히 개발 중이에요!
        </h1>
        <p style={{
          color: '#FFFFFF',
          fontSize: '16px',
          marginBottom: '12px',
          lineHeight: '1.6'
        }}>
          베타 출시되면 가장 먼저 알려드릴게요 😊
        </p>
        <p style={{
          color: '#B0C4DE',
          fontSize: '14px',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          현재 K-Verse 베타 서비스를 준비 중입니다.<br/>
          출시 즉시 이메일로 안내해 드릴게요.
        </p>

        {!notified ? (
          <button
            onClick={handleNotify}
            disabled={loading}
            style={{
              background: '#F5C518',
              color: '#1A1A2E',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginBottom: '12px'
            }}
          >
            {loading ? '처리 중...' : '출시 알림 받기 🔔'}
          </button>
        ) : (
          <div style={{
            background: '#2E75B6',
            borderRadius: '8px',
            padding: '14px 32px',
            color: '#FFFFFF',
            fontSize: '16px',
            marginBottom: '12px'
          }}>
            신청 완료! 출시되면 바로 연락드릴게요 😊
          </div>
        )}

        <button
          onClick={() => router.back()}
          style={{
            background: 'transparent',
            color: '#B0C4DE',
            border: '1px solid #2E75B6',
            borderRadius: '8px',
            padding: '12px 32px',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          진단 결과로 돌아가기
        </button>
      </div>
    </div>
  )
}