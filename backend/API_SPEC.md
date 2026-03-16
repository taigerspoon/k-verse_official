# K-Verse Backend API 명세서

> 베이스 URL: `http://localhost:3000` (개발) / 배포 후 변경 예정  
> 최종 업데이트: 2026-03-16

---

## 공통 사항

- **Content-Type**: `application/json`
- **응답 형식**: JSON

---

## 1. 서버 상태 확인

### `GET /`

서버가 정상 작동 중인지 확인합니다.

**요청**
```
GET http://localhost:3000/
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

questions 테이블의 전체 문제를 가져옵니다.

**요청**
```
GET http://localhost:3000/questions
```

**응답**
```json
[
  {
    "id": 1,
    "created_at": "2026-03-16T01:33:40.511+00:00",
    "question_text": "[듣기] 다음을 듣고 이어지는 말로 알맞은 것을 고르십시오.\n여자: 누구하고 공부했어요?\n남자: ___________",
    "option_1": "어제 공부했어요.",
    "option_2": "오후에 공부했어요.",
    "option_3": "친구하고 공부했어요.",
    "option_4": "한국어를 공부했어요.",
    "correct_answer": 3,
    "explanation_vi": null,
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

특정 문제 1개의 상세 정보를 가져옵니다.

**요청**
```
GET http://localhost:3000/questions/1
```

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| id | URL | number | ✅ | 문제 ID |

**응답 (성공)**
```json
{
  "id": 1,
  "created_at": "2026-03-16T01:33:40.511+00:00",
  "question_text": "[듣기] 다음을 듣고 이어지는 말로 알맞은 것을 고르십시오.\n여자: 누구하고 공부했어요?\n남자: ___________",
  "option_1": "어제 공부했어요.",
  "option_2": "오후에 공부했어요.",
  "option_3": "친구하고 공부했어요.",
  "option_4": "한국어를 공부했어요.",
  "correct_answer": 3,
  "explanation_vi": null,
  "level": 1,
  "question_type": "듣기",
  "exam_year": 2024,
  "exam_round": 96
}
```

**응답 (실패 - 없는 ID)**
```json
{
  "error": "JSON object requested, multiple (or no) rows returned"
}
```

---

## 4. 답변 제출

### `POST /answers`

유저가 문제에 답변을 제출합니다. 정답 여부를 자동으로 계산하고 user_answers 테이블에 저장합니다.

**요청**
```
POST http://localhost:3000/answers
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

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| user_id | number | ✅ | 유저 ID |
| question_id | number | ✅ | 문제 ID |
| selected_answer | number | ✅ | 유저가 선택한 보기 번호 (1~4) |

**응답 (성공)**
```json
{
  "success": true,
  "is_correct": true,
  "data": [
    {
      "id": 1,
      "created_at": "2026-03-16T01:53:29.382+00:00",
      "user_id": 1,
      "question_id": 1,
      "selected_answer": 3,
      "is_correct": true
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| success | boolean | 저장 성공 여부 |
| is_correct | boolean | 정답 여부 (자동 계산) |
| data | array | 저장된 레코드 |

---

## 5. AI 오답 해설 (Explain AI)

### `POST /explain`

틀린 문제에 대해 Claude AI가 베트남어로 해설을 제공합니다.

**요청**
```
POST http://localhost:3000/explain
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

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| question | string | ✅ | 문제 텍스트 |
| wrongAnswer | string | ✅ | 유저가 선택한 오답 |
| correctAnswer | string | ✅ | 정답 |

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
