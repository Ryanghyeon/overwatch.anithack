/* src/hooks/useAccountManagement.js */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useCheckDuplicate } from "@/hooks/useCheckDuplicate";

export const useAccountManagement = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { checkUsername, checkBattletag } = useCheckDuplicate();

  // 1. 프로필 업데이트 로직
  const updateProfile = async (
    targetUserData,
    editUsername,
    battletagInput,
    finalPhotoUrl,
  ) => {
    setIsProcessing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("유저 정보를 찾을 수 없습니다.");

      // 닉네임 중복 체크
      const isUsernameTaken = await checkUsername(
        editUsername,
        currentUser.uid,
      );
      if (isUsernameTaken) {
        setIsProcessing(false);
        return alert(
          "이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.",
        );
      }

      // 배틀태그 중복 체크
      if (battletagInput) {
        const isBattletagTaken = await checkBattletag(
          battletagInput,
          currentUser.uid,
        );
        if (isBattletagTaken) {
          setIsProcessing(false);
          return alert("이미 등록된 Battletag입니다.");
        }
      }

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          username: editUsername,
          photoUrl: finalPhotoUrl,
          battletag: battletagInput,
        },
        { merge: true },
      );

      alert("프로필이 성공적으로 업데이트되었습니다! ✨");
      window.location.reload();
    } catch (error) {
      console.error("업데이트 에러:", error);
      alert("업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. 회원 탈퇴 로직
  const deleteAccount = async (passwordInput, isPasswordUser) => {
    setIsProcessing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("유저 정보를 찾을 수 없습니다.");

      if (isPasswordUser && !passwordInput) {
        alert("비밀번호를 입력해 주세요.");
        return false;
      }

      if (isPasswordUser) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          passwordInput,
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);
      localStorage.removeItem("user");

      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate("/");
      return true;
    } catch (error) {
      console.error("탈퇴 에러:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("비밀번호가 일치하지 않습니다.");
      } else if (error.code === "auth/requires-recent-login") {
        alert("보안을 위해 다시 로그인한 후 탈퇴를 진행해 주세요.");
        await auth.signOut();
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("탈퇴 중 오류가 발생했습니다: " + error.message);
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. 비밀번호 변경 로직 (뼈대 추가 완료!)
  const changePassword = async (currentPassword, newPassword) => {
    setIsProcessing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("유저 정보를 찾을 수 없습니다.");

      // 1. 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      // 2. 새 비밀번호로 업데이트
      await updatePassword(currentUser, newPassword);

      alert("비밀번호가 성공적으로 변경되었습니다!");
      return true;
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("현재 비밀번호가 일치하지 않습니다.");
      } else {
        alert("비밀번호 변경 중 오류가 발생했습니다.");
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    updateProfile,
    deleteAccount,
    changePassword,
  };
};
