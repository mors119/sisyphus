# Product UX and terminology contract

## Principles

1. Input should become knowledge.
2. Every interaction should reduce cognitive load.
3. The system should explain what it is doing.
4. Generated knowledge is reviewed before persistence.
5. Progress and partial failure are visible.
6. Important state is never communicated by color alone.
7. Existing primitives are reused before a new abstraction is created.
8. Shared UI remains independent from feature business logic.
9. Desktop, tablet, mobile, and extension preserve the same product hierarchy.

The interface gives users confidence that their input is preserved, generated
content is provisional until reviewed, and a completed action is actually
persisted.

## Preferred terminology

Use one term for one product action across labels, headings, help text,
analytics, and translations.

| Product action | Korean UI | English UI/code intent |
| --- | --- | --- |
| create a word entry | 단어 추가 | Add word |
| generate structured content | 확장하기 | Expand |
| persist reviewed knowledge | 지식에 추가 | Add to knowledge |
| repeat a failed operation | 다시 시도 | Retry |
| intentionally replace generated content | 다시 생성 | Regenerate |
| omit generated content | 제외 | Exclude |
| change existing content | 수정 | Edit |
| leave without applying | 취소 | Cancel |
| remove persisted content | 삭제 | Delete |
| authenticate | 로그인 | Sign in |
| end the session | 로그아웃 | Sign out |

### Distinctions

- `확장하기` starts temporary generation. It does not imply persistence.
- `지식에 추가` persists reviewed content. Do not label this same action
  `저장`, `등록`, or `완료` on another screen.
- `다시 시도` repeats a failed request without intentionally changing valid
  input.
- `다시 생성` requests replacement generated content and may change the
  result.
- `단어 추가` starts a new input flow; `새 단어 추가` is the completion
  screen action.
- `저장` remains appropriate for settings or profile changes where no knowledge
  creation occurs.
- `완료` describes a state, not the persistence action.

Use sentence-style labels. Avoid mixing English and Korean in one user-facing
surface unless the content itself requires it.

## Code, analytics, and i18n

- React component and analytics names use stable English intent:
  `expand`, `addToKnowledge`, `retry`, and `regenerate`.
- Translation keys group by product intent instead of copying visible text, for
  example `knowledge.actions.expand`.
- Korean and English locale files implement the same intent and state.
- The current backend `Note` entity is an implementation term. User-facing word
  and knowledge flows should not expose persistence naming when it conflicts
  with product language.
- Existing note-oriented screens keep their current labels until their
  page-specific issue migrates them; Issue #2 does not silently change product
  behavior or routes.

## Reference screen matrix

Current route names are included where they exist. Planned knowledge screens
are contracts for Issues #3 through #8, not implementations in Issue #2.

| Screen | Width | Primary action | Critical states | Current reference |
| --- | --- | --- | --- | --- |
| Login | narrow | 로그인 | idle, submitting, redirecting, auth error | `/auth/signin` |
| OAuth callback | narrow | none | bootstrapping, success redirect, failure | OAuth success/link handlers |
| Word input | wide | 확장하기 | idle, validating, expanding, failed | planned |
| Expansion progress | wide | context dependent | pending, active, completed, failed, skipped | planned |
| Knowledge review | wide | 지식에 추가 | editing, regenerating, saving, partial error | planned |
| Completion | medium | 새 단어 추가 | persisted success | planned |
| Word/note list | wide | 단어 추가 | loading, empty, error, populated | `/view` |
| Word/note detail | medium | context dependent | loading, not found, error, populated | view detail |
| Settings/profile | medium or narrow | 저장 | clean, dirty, saving, saved, error | `/user` |
| Requirements dashboard | wide | context dependent | loading, empty, error, populated | require dashboard |

## Flow rules

### Input and generation

- the input prompt is visually dominant
- validation keeps the entered word available
- progress appears when a reliable stage can be shown
- generated values are explicitly provisional
- partial failure identifies the affected field or stage

### Review and persistence

- editable generated fields retain user changes during recoverable failures
- regenerate and retry are visibly different actions
- exclusion is explicit and reversible until persistence
- one `지식에 추가` action is dominant
- navigation or panel dismissal warns before discarding review changes

### Completion

- successful persistence is stated directly
- the completion surface offers `추가한 지식 보기` and `새 단어 추가`
- focus moves to the completion heading
- the previous form is not left disabled without explanation

### Failure recovery

Error copy answers:

1. what failed
2. whether input or edits were preserved
3. the next available action

Examples:

```text
단어를 확장하지 못했습니다.
입력한 단어는 그대로 유지했습니다.
잠시 후 다시 시도해 주세요.
```

```text
생성한 설명을 저장하지 못했습니다.
수정한 내용은 이 화면에 남아 있습니다.
연결을 확인한 뒤 지식에 추가를 다시 선택해 주세요.
```

## Navigation and state continuity

- navigation labels match page titles
- active state includes more than color
- browser Back returns to the expected previous stage or screen
- OAuth deep links restore only safe redirect context
- closing navigation does not reset a form
- route changes warn when they would discard unsaved review or settings changes
- success returns users to a related destination, never an unrelated dashboard

## Platform language

Web and Chrome extension use the same action and state wording. The extension
may shorten explanatory copy because of space, but it must not substitute a
different term for login, retry, failure, or completion.

## Definition for future page work

A page follows this contract when a user can answer:

- Where am I?
- What is the one next action?
- Is content temporary, generated, edited, or persisted?
- What is happening now?
- Did anything fail, and was my work preserved?
- How do I recover or continue?

If those answers require page-specific colors, terminology, or behavior not
defined here, update the shared contract before inventing another visual
language.
