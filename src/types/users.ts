/* src/types/users.ts */

/**
 * 사용자 권한 (리터럴 타입으로 강제하여 오타 원천 차단)
 */
export type UserRole = 'user' | 'admin';

/**
 * 통합된 User 도메인 모델
 * (기존 useAuth와 useMyProfile에 파편화되어 있던 데이터를 하나로 압축)
 */
export interface User {
  uid: string; // Firebase 또는 Discord의 고유 식별자
  email?: string | null; // 이메일 (디스코드 로그인 시 없을 수도 있으므로 optional)
  username: string; // 유저 닉네임
  photoUrl: string; // 프로필 이미지 URL
  role: UserRole; // 권한 (무조건 'user' 아니면 'admin'만 들어갈 수 있음)

  battletag?: string; // 오버워치 배틀태그 (useMyProfile에서 가져오던 것, 없을 수도 있음)

  // [note] 기존엔 new Date() 객체를 썼지만
  // 직렬화(JSON) 통신을 위해 최상단 도메인 모델에서는 보통 ISO string 사용.
  createdAt: string;
}
