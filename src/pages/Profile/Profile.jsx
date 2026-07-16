/* src/pages/Profile/Profile.jsx */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/hooks";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { isValidBattletag } from "@/utils";
import "./Profile.css";

// 내 프로필 설정 UI (미니 컴포넌트)
const MyProfileSection = ({
  editUsername,
  setEditUsername,
  battletagInput,
  setBattletagInput,
  onSave,
  onDelete,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deletePassword,
  setDeletePassword,
  isPasswordUser,
  isProcessing,
  // ✨ 비밀번호 변경 관련 프롭스 추가
  showPasswordChange,
  setShowPasswordChange,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  onChangePassword,
}) => (
  <div className="profile-section section-me">
    <h3 className="section-title">⚙️ 내 프로필 설정</h3>
    <label className="profile-label">유저네임</label>
    <input
      type="text"
      value={editUsername}
      onChange={(e) => setEditUsername(e.target.value)}
      className="profile-input profile-username-input"
      placeholder="변경할 닉네임을 입력하세요"
    />
    <label className="profile-label">Battletag</label>
    <input
      type="text"
      value={battletagInput}
      onChange={(e) => setBattletagInput(e.target.value)}
      className="profile-input profile-battletag-input"
      placeholder="배틀태그 입력"
    />
    <p className="profile-tip battletag-tip">
      💡 입력하신 배틀태그는 마이페이지에서 연동 정보로 활용됩니다.
    </p>

    <button
      onClick={onSave}
      className="btn-save btn-profile-save"
      disabled={isProcessing}
    >
      {isProcessing ? "처리 중..." : "변경사항 저장"}
    </button>

    {/* ✨ 비밀번호 변경 영역 (이메일/비밀번호 유저에게만 보임) */}
    {isPasswordUser && (
      <div className="security-zone">
        <h4 className="security-title">🔒 보안 설정</h4>
        {!showPasswordChange ? (
          <button
            onClick={() => setShowPasswordChange(true)}
            className="btn-outline"
          >
            비밀번호 변경하기
          </button>
        ) : (
          <div className="password-change-box">
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="profile-input"
              style={{ marginBottom: "10px" }}
            />
            <input
              type="password"
              placeholder="새 비밀번호 (6자리 이상)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="profile-input"
              style={{ marginBottom: "10px" }}
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="profile-input"
              style={{ marginBottom: "15px" }}
            />

            <div className="delete-btn-group">
              <button
                onClick={onChangePassword}
                className="btn-save"
                disabled={isProcessing}
                style={{ flex: 1, marginTop: 0, padding: "12px" }}
              >
                {isProcessing ? "처리 중..." : "변경 완료"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                }}
                className="btn-outline"
                style={{ flex: 1 }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    )}

    {/* 기존 위험 구역 (회원 탈퇴) */}
    <div className="danger-zone">
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="btn-delete-account"
        >
          회원 탈퇴
        </button>
      ) : (
        <div className="delete-confirm-box">
          {isPasswordUser ? (
            <>
              <p className="delete-warning-text">
                탈퇴하려면 비밀번호를 입력해 주세요.
              </p>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="profile-input delete-password-input"
              />
            </>
          ) : (
            <p className="delete-warning-text discord-warning">
              디스코드 연동 계정입니다.
              <br />
              아래 버튼을 누르면 즉시 영구 탈퇴 처리됩니다.
            </p>
          )}

          <div className="delete-btn-group">
            <button
              onClick={() => onDelete(deletePassword)}
              className="btn-delete-account"
              disabled={isProcessing}
            >
              {isProcessing ? "처리 중..." : "영구 탈퇴"}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletePassword("");
              }}
              className="btn-outline"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

// 관리자 전용 UI (미니 컴포넌트)
const AdminSection = ({ userData, reportCount, onBan }) => (
  <div className="profile-section section-admin">
    <h3 className="section-title text-red">🚨 관리자 전용 정보</h3>
    <p className="admin-info">
      <strong>UID:</strong> {userData.uid}
    </p>
    <p className="admin-info">
      <strong>Email:</strong> {userData.email || "비공개(디스코드 가입 등)"}
    </p>
    <p className="admin-info">
      <strong>작성한 신고:</strong> {reportCount}건
    </p>
    <button onClick={onBan} className="btn-ban">
      이 유저 강제 정지하기
    </button>
  </div>
);

export function Profile() {
  const { uid: urlUid } = useParams();
  const navigate = useNavigate();
  const { user, isAuthLoading, isAdmin } = useAuth();

  // ✨ changePassword 훅 추가로 꺼내오기
  const { isProcessing, updateProfile, deleteAccount, changePassword } =
    useAccountManagement();

  // 상태 관리들
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordUser, setIsPasswordUser] = useState(null);

  // ✨ 비밀번호 변경용 상태 추가
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [targetUserData, setTargetUserData] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [battletagInput, setBattletagInput] = useState("");
  const [userReportCount, setUserReportCount] = useState(0);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (auth.currentUser) {
      const hasPassword = auth.currentUser.providerData.some(
        (provider) => provider.providerId === "password",
      );
      setIsPasswordUser(hasPassword);
    }

    const fetchTargetData = async () => {
      const myUid = user.uid || user.id;
      const targetUid = urlUid || myUid;
      setIsMe(myUid === targetUid);

      try {
        const targetRef = doc(db, "users", targetUid);
        const targetSnap = await getDoc(targetRef);

        if (targetSnap.exists()) {
          const data = targetSnap.data();
          setTargetUserData(data);

          if (myUid === targetUid) {
            setEditUsername(data.username || "");
            setBattletagInput(data.battletag || "");
          } else {
            const q = query(
              collection(db, "reports"),
              where("reporterUid", "==", targetUid),
            );
            const reportDocs = await getDocs(q);
            setUserReportCount(reportDocs.size);
          }
        } else {
          alert("존재하지 않는 유저입니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("프로필 로딩 에러:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTargetData();
  }, [user, isAuthLoading, urlUid, navigate]);

  const handleSave = async () => {
    if (!editUsername.trim()) {
      alert("유저네임을 입력해 주세요.");
      return;
    }
    if (battletagInput.trim() && !isValidBattletag(battletagInput)) {
      alert("올바른 배틀태그 형식이 아닙니다.");
      return;
    }

    let finalPhotoUrl = targetUserData?.photoUrl;
    if (!finalPhotoUrl || finalPhotoUrl.includes("ui-avatars.com")) {
      finalPhotoUrl = `https://ui-avatars.com/api/?name=${editUsername}&background=random&color=fff`;
    }

    await updateProfile(
      targetUserData,
      editUsername,
      battletagInput.trim(),
      finalPhotoUrl,
    );
  };

  const handleDeleteAccount = async (passwordInput) => {
    await deleteAccount(passwordInput, isPasswordUser);
  };

  // ✨ 비밀번호 변경 실행 함수
  const handlePasswordChangeSubmit = async () => {
    if (!currentPassword) return alert("현재 비밀번호를 입력해 주세요.");
    if (newPassword.length < 6)
      return alert("새 비밀번호는 최소 6자리 이상이어야 합니다.");
    if (newPassword !== confirmNewPassword)
      return alert("새 비밀번호가 일치하지 않습니다.");

    const success = await changePassword(currentPassword, newPassword);

    // 성공하면 창 닫고 인풋창 싹 비우기
    if (success) {
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  const handleAdminBan = () =>
    alert(
      `[관리자 권한] ${targetUserData.username} 유저를 제재했습니다. (기능 구현 예정)`,
    );

  if (loading || isAuthLoading)
    return <div className="profile-loading">데이터를 불러오는 중...</div>;
  if (!targetUserData) return null;

  const displayPhoto =
    targetUserData.photoUrl ||
    `https://ui-avatars.com/api/?name=${targetUserData.username || "유저"}&background=random&color=fff`;

  return (
    <div className="profile-wrapper">
      <div className="profile-box">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ⬅ 뒤로 가기
        </button>

        <div className="profile-header">
          <img
            src={displayPhoto}
            alt="프로필"
            className="profile-preview-img"
          />
          <h1 className="profile-username">
            {targetUserData.username}
            {targetUserData.role === "admin" && (
              <span className="badge-admin">👑</span>
            )}
          </h1>
          <p className="profile-date">
            가입일 :{" "}
            {targetUserData.createdAt
              ? targetUserData.createdAt.toDate().toLocaleDateString()
              : "기록 없음"}
          </p>
        </div>

        {isMe && (
          <MyProfileSection
            editUsername={editUsername}
            setEditUsername={setEditUsername}
            battletagInput={battletagInput}
            setBattletagInput={setBattletagInput}
            onSave={handleSave}
            onDelete={handleDeleteAccount}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            // ✨ 새로 추가된 프롭스들 전달
            showPasswordChange={showPasswordChange}
            setShowPasswordChange={setShowPasswordChange}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmNewPassword={confirmNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
            onChangePassword={handlePasswordChangeSubmit}
            isPasswordUser={isPasswordUser}
            isProcessing={isProcessing}
          />
        )}

        {!isMe && isAdmin && (
          <AdminSection
            userData={targetUserData}
            reportCount={userReportCount}
            onBan={handleAdminBan}
          />
        )}

        {!isMe && !isAdmin && (
          <div className="profile-section section-public">
            <div className="stats-box">
              <span className="stats-label">활동 점수 (신고 기여도)</span>
              <span className="stats-value">{userReportCount} 건</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
