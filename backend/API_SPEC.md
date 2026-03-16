# K-Verse Backend API 명세서

> 베이스 URL: `http://localhost:4000` (개발) / 배포 후 변경 예정  
> 최종 업데이트: 2026-03-16

---

## 공통 사항

- **Content-Type**: `application/json`
- **응답 형식**: JSON

---

## 0. 구글 로그인 (Google OAuth)

K-Verse는 Supabase Auth를 통해 구글 로그인을 지원합니다.  
백엔드 서버가 아닌 **프론트엔드에서 Supabase 클라이언트로 직접 처리**합니다.

### 프론트엔드 구현 방법 (Next.js)

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 구글 로그인 버튼 클릭 시
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000' // 로그인 후 이동할 페이지
  }
})
```

### 로그인 후 유저 정보 가져오기

```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log(user.id)    // user_id (Supabase Auth UUID)
console.log(user.email) // 이메일
```

### 로그아웃

```javascript
await supabase.auth.signOut()
```

### 인증 상태
- **현재 MVP 단계**: 백엔드 API는 토큰 없이 호출 가능
- **추후 배포 시**: JWT 토큰 검증 미들웨어 추가 예정

---

## 1. 서버 상태 확인

### `GET /`

**요청**
```
GET http://localhost:4000/
```

**응답**
```json
{
  "message": "K-Verse 백엔드 서버 작동 중! 🎉"
}
```

---

## 2. 문제 전체 목록

### `GET /questions`

**요청**
```
GET http://localhost:4000/questions
```

**응답**
```json
[
  {
    "id": 1,
    "question_text": "[듣기] 다음을 듣고...",
    "option_1": "어제 공부했어요.",
    "option_2": "오후에 공부했어요.",
    "option_3": "친구하고 공부했어요.",
    "option_4": "한국어를 공부했어요.",
    "correct_answer": 3,
    "level": 1,
    "question_type": "듣기",
    "exam_year": 2024,
    "exam_round": 96
  }
]
```

---

## 3. 문제 1개 상세

### `GET /questions/:id`

**요청**
```
GET http://localhost:4000/questions/1
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| id | URL | number | ✅ | 문제 ID |

---

## 4. 답변 제출

### `POST /answers`

**요청**
```
POST http://localhost:4000/answers
Content-Type: application/json
```

**요청 Body**
```json
{
  "user_id": 1,
  "question_id": 1,
  "selected_answer": 3
}
```

**응답**
```json
{
  "success": true,
  "is_correct": true,
  "data": [...]
}
```

---

## 5. 점수 조회

### `GET /scores/:user_id`

**요청**
```
GET http://localhost:4000/scores/1
```

**응답**
```json
{
  "total": 15,
  "correct": 10,
  "accuracy": 66.7
}
```

---

## 6. AI 오답 해설

### `POST /explain`

**요청**
```
POST http://localhost:4000/explain
Content-Type: application/json
```

**요청 Body**
```json
{
  "question": "다음 중 맞는 것을 고르세요",
  "wrongAnswer": "1",
  "correctAnswer": "2"
}
```

**응답**
```json
{
  "explanation": "Xin chào! Tôi là giáo viên tiếng Hàn của bạn...."
}
```

---

## DB 테이블 구조

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | int8 | PK, 자동생성 |
| email | text | 이메일 |
| display_name | text | 닉네임 |
| level | int2 | 현재 급수 (1~4) |
| native_language | text | 모국어 (기본값: vi) |
| target_language | text | 학습 언어 (기본값: ko) |
| created_at | timestamp | 자동생성 |

### questions
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | int8 | PK, 자동생성 |
| question_text | text | 문제 내용 |
| option_1 ~ 4 | text | 보기 4개 |
| correct_answer | int2 | 정답 번호 (1~4) |
| explanation_vi | text | 베트남어 해설 (AI 생성) |
| level | int2 | 문제 난이도 급수 |
| question_type | text | 문제 유형 (듣기/읽기/쓰기) |
| exam_year | int2 | 출제 연도 |
| exam_round | int2 | 출제 회차 |
| created_at | timestamp | 자동생성 |

### user_answers
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | int8 | PK, 자동생성 |
| user_id | int8 | FK → users.id |
| question_id | int8 | FK → questions.id |
| selected_answer | int2 | 유저가 선택한 번호 |
| is_correct | bool | 정오 여부 |
| created_at | timestamp | 자동생성 |
