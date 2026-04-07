import { Button, Input, Postcode } from "@/components";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoIosEyeOff, IoMdEye, IoMdLock } from "react-icons/io";
import { IoIosCall } from "react-icons/io";
import { z } from "zod";
import type { PostInfo } from "@/components/postcode/Postcode";
import { errorToast, successToast, toastMutation } from "@/lib/toast";
import type { joinData } from "@/types/memberType";
import {
  usePostEmail,
  usePostJoinData,
  usePostNickname,
} from "@/queries/member.queries";
import { isNullOrEmpty } from "@/utils/validate";
import { GrUserWorker } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";

interface JoinFormProps {
  successJoin: (isSuccess: boolean) => void;
}

// zod + react hook 사용해서 실시간 유효성검사 실행
interface SignUpStoreStateType {
  memEmail: string;
  memPw: string;
  confirmData: string;
  memNickname: string;
  memName: string;
  memTel: string;
  memAdd: string;
  addDetail: string;
  memRole: string;
  farmName: string;
  authCode: string;
}

const JoinForm = ({ successJoin }: JoinFormProps) => {
  const usePostJoinDataMutate = usePostJoinData();

  /* input에서 입력받은 값 저장할 state 변수 */
  const [joinData, setJoinData] = useState<joinData>({
    memEmail: "",
    memPw: "",
    memNickname: "",
    memName: "",
    memTel: "",
    memAdd: "",
    addDetail: "",
    memRole: "USER",
    farmName: "",
    authCode: "",
  });

  // 이메일 구조분해할당
  const { memEmail } = joinData;
  const usePostEmailMutate = usePostEmail();

  // 닉네임 구조분해할당
  const { memNickname } = joinData;
  const usePostNicknameMutate = usePostNickname();

  //비밀번호 보이기 / 숨김 저장할 state 변수
  const [showPw, setShowPw] = useState(false);

  //비밀번호 확인 보이기 / 숨김 저장할 state 변수
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  //비밀번호 확인 데이터 담을 state 변수 - 비밀번호 확인은 서버로 전송하지 않으므로 별로도 관리
  const [confirmData, setConFirmData] = useState("");

  //에러 메시지 저장할 state 변수
  const [errorMsg, setErrorMsg] = useState<Partial<SignUpStoreStateType>>({});

  //권한 타입 저장 할 state 변수
  const [userType, setUserType] = useState<"FAMER" | "USER">("USER");

  //유효성 검사 실시할 함수
  const validateForm = (data: typeof joinData) => {
    //업데이트된 전체 데이터로 유효성 검사
    const res = signUpSchema.safeParse(data);

    // 만약 유효성검사 결과가 실패라면
    if (!res.success && res.error) {
      // 에러난 필드만 담은 객체 생성
      const fieldErrors: Partial<SignUpStoreStateType> = {};
      // issue : 에러 상세내용 조회
      res.error.issues.forEach((issue) => {
        //fiedlName변수에 배열로 저장된 에러 상세내용을 저장
        const fieldName = issue.path[0] as keyof SignUpStoreStateType;
        //만약
        if (!fieldErrors[fieldName]) {
          // 첫번째 에러만 표시
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrorMsg(fieldErrors);
    } else {
      setErrorMsg({});
    }
  };

  // zod 유효성 검사 스키마
  const signUpSchema = z.object({
    //1. 이메일
    memEmail: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .max(30, "이메일 길이는 30자 이하입니다.")
      .regex(
        /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        "이메일 형식이 올바르지 않습니다."
      ),

    //2. 비밀번호
    memPw: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .max(16, "비밀번호는 16자 이하이어야 합니다.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "비밀번호 형식이 올바르지 않습니다."
      ),

    //3. 비밀번호 확인
    confirmData: z
      .string()
      .min(1, "비밀번호 확인을 입력하세요.")
      .refine((confirmData) => joinData.memPw === confirmData, {
        message: "비밀번호가 일치하지 않습니다.",
      }),

    //4. 이름
    memName: z.string().min(2, "이름은 1자 이상이어야 합니다."),

    //5. 닉네임
    memNickname: z
      .string()
      .min(1, "닉네임을 입력해주세요.")
      .max(10, "닉네임은 10자 이하이어야 합니다."),

    //6. 전화번호
    memTel: z
      .string()
      .min(1, "전화번호를 입력해주세요.")
      .regex(/^010-[0-9]{4}-[0-9]{4}$/, "전화번호 형식이 올바르지 않습니다."),

    //7. 주소
    memAdd: z.string().min(1, "주소를 입력해주세요."),

    //8. 권한이 농장주 일 경우 실행할 유효성 검사 - 농장명 유효성 검사
    farmName:
      userType === "FAMER"
        ? z.string().min(1, "농장명을 입력해주세요.")
        : z.string().optional(), //undefined가 되어도 통과, null만 통과 X => 타입이 user일 때도 사용하기 위해서

    //9. 권한이 농장주 일 경우 실행할 유효성 검사 - 인증번호 유효성 검사
    authCode:
      userType === "FAMER"
        ? z.string().min(1, "인증번호를 입력해주세요.")
        : z.string().optional(),
  });

  const isDisable = signUpSchema.safeParse({ ...joinData, confirmData });

  // input 값 입력때마다 유효성 검사 실시
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    //1. 입력값 먼저 업데이트
    const updateData = { ...joinData, [name]: value, confirmData };
    setJoinData(updateData);
    //2. 유효성검사 함수 호출
    validateForm(updateData);
  };

  // 비밀번호 확인 유효성 검사실행 함수
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConFirmData(value);

    // joinData의 비밀번호랑 비교
    const isMatch = joinData.memPw === value;
    setErrorMsg((prev) => ({
      ...prev,
      confirmData:
        value === ""
          ? "비밀번호 확인을 입력하세요."
          : !isMatch
            ? "비밀번호가 일치하지 않습니다."
            : undefined,
    }));
  };

  // 버튼 누르면 joinData 전체 유효성 검사 실행 + 회원가입 등록
  const validate = async () => {
    // 전체 유효성 검사 실행 결과 저장

    // 만약 유효성검사 결과가 실패라면
    if (!isDisable.success) {
      const fieldErrors: Partial<SignUpStoreStateType> = {};

      isDisable.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SignUpStoreStateType;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrorMsg(fieldErrors);
      return false;
    }
    // 유효성 검사 결과가 성공이라면
    else {
      setErrorMsg({});
      await toastMutation(
        usePostJoinDataMutate.mutateAsync,
        joinData,
        "로딩 중입니다!",
        () => {
          successJoin(true);
          return "회원이 되신 것을 축하합니다!";
        },
        (error) => {
          console.error(error);
          return "어이쿠 실패입니다ㅜ.ㅜ";
        }
      );
      return true;
    }
  };

  // 주소 검색
  const selectAddress = (addrInfo: PostInfo) => {
    console.log(addrInfo);
    const updateData = { ...joinData, memAdd: addrInfo.fullAddress };
    setJoinData(updateData);
    validateForm(updateData);
  };

  // 이메일 중복 체크 함수
  const checkEmail = async () => {
    if (isNullOrEmpty(memEmail)) {
      errorToast("이메일을 입력하세요.");
      return;
    }

    usePostEmailMutate.mutate(memEmail, {
      onSuccess: (data) => {
        if (!isNullOrEmpty(data)) {
          errorToast("사용이 불가능합니다.");
        } else {
          successToast("사용가능합니다");
        }
      },
    });
  };

  // 닉네임 중복 체크 함수
  const checkNickname = async () => {
    if (isNullOrEmpty(memNickname)) {
      errorToast("닉네임을 입력하세요.");
      return;
    }

    usePostNicknameMutate.mutate(memNickname, {
      onSuccess: (data) => {
        if (!isNullOrEmpty(data)) {
          errorToast("사용이 불가능합니다.");
        } else {
          successToast("사용가능합니다");
        }
      },
    });
  };

  console.log(joinData);

  return (
    <div>
      <style>{`
        /* ── 필드 순차 등장 ── */
        @keyframes fieldFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jf-1  { animation: fieldFadeIn 0.3s ease-out 0.03s  both; }
        .jf-2  { animation: fieldFadeIn 0.3s ease-out 0.09s  both; }
        .jf-3  { animation: fieldFadeIn 0.3s ease-out 0.15s  both; }
        .jf-4  { animation: fieldFadeIn 0.3s ease-out 0.21s  both; }
        .jf-5  { animation: fieldFadeIn 0.3s ease-out 0.27s  both; }
        .jf-6  { animation: fieldFadeIn 0.3s ease-out 0.33s  both; }
        .jf-7  { animation: fieldFadeIn 0.3s ease-out 0.39s  both; }
        .jf-8  { animation: fieldFadeIn 0.3s ease-out 0.45s  both; }

        /* ── 에러 메시지 shake ── */
        @keyframes errShake {
          0%, 100% { transform: translateX(0);  }
          25%       { transform: translateX(-4px); }
          75%       { transform: translateX(4px);  }
        }
        .err-msg { animation: errShake 0.25s ease-in-out; }

        /* ── 회원가입 버튼 shine ── */
        @keyframes btnShine {
          0%   { left: -120%; }
          50%  { left: 140%;  }
          100% { left: 140%;  }
        }
        .btn-join { position: relative; overflow: hidden; }
        .btn-join:not(:disabled)::after {
          content: '';
          position: absolute;
          top: 0; left: -120%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-20deg);
          animation: btnShine 3.5s ease-in-out infinite 1.5s;
        }

        /* ── 섹션 구분선 ── */
        .section-divider {
          display: flex; align-items: center; gap: 8px;
          margin: 12px 0 10px;
        }
        .section-divider::before,
        .section-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, #bbf7d0);
        }
        .section-divider::after {
          background: linear-gradient(to left, transparent, #bbf7d0);
        }
      `}</style>

      <div className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-200">
        {/* 회원 유형 선택 */}
        <div className="mb-4 flex justify-center gap-3">
          <div
            onClick={() => {
              setUserType("FAMER");
              setJoinData((prev) => ({ ...prev, memRole: "FAMER" }));
            }}
            className={`flex-1 cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
              userType === "FAMER"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            {/* 농장주 */}
            <GrUserWorker />
            <p>농업인</p>
          </div>
          <div 
            onClick={() => {
              setUserType("USER");
              setJoinData((prev) => ({ ...prev, memRole: "USER" }));
            }}
            className={`flex-1 cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
              userType === "USER"
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}>
            {/* 일반 유저 */}
            <FaRegUser />
            <p>일반 유저</p>
          </div>
        </div>

        {/* ── 이메일 ── */}
        <div className="jf-1 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            이메일
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <CiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
              <Input
                className="rounded-xl border-green-300 bg-green-50/40 pl-10 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
                placeholder="이메일"
                name="memEmail"
                value={joinData.memEmail}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-xl border-green-400 font-semibold text-green-700 transition-all duration-200 hover:border-green-500 hover:bg-green-50 active:scale-95"
              onClick={() => checkEmail()}
            >
              중복 확인
            </Button>
          </div>
          {errorMsg.memEmail && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memEmail}
            </p>
          )}
        </div>

        {/* ── 비밀번호 ── */}
        <div className="jf-2 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            비밀번호
          </Label>
          <div className="relative">
            <IoMdLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
            <Input
              className="rounded-xl border-green-300 bg-green-50/40 pl-10 pr-11 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
              placeholder="대소문자,숫자,특수문자 조합 8~16자"
              type={showPw ? "text" : "password"}
              name="memPw"
              value={joinData.memPw}
              onChange={(e) => handleChange(e)}
            />
            <Button
              type="button"
              variant="link"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-green-500 transition-colors duration-150 hover:text-green-800"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? (
                <IoMdEye className="text-lg" />
              ) : (
                <IoIosEyeOff className="text-lg" />
              )}
            </Button>
          </div>
          {errorMsg.memPw && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memPw}
            </p>
          )}
        </div>

        {/* ── 비밀번호 확인 ── */}
        <div className="jf-3 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            비밀번호 확인
          </Label>
          <div className="relative">
            <IoMdLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
            <Input
              className="rounded-xl border-green-300 bg-green-50/40 pl-10 pr-11 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
              placeholder="비밀번호 확인"
              type={showPwConfirm ? "text" : "password"}
              name="confirmData"
              value={confirmData}
              onChange={(e) => handleConfirmChange(e)}
            />
            <Button
              type="button"
              variant="link"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-green-500 transition-colors duration-150 hover:text-green-800"
              onClick={() => setShowPwConfirm(!showPwConfirm)}
            >
              {showPwConfirm ? (
                <IoMdEye className="text-lg" />
              ) : (
                <IoIosEyeOff className="text-lg" />
              )}
            </Button>
          </div>
          {errorMsg.confirmData && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.confirmData}
            </p>
          )}
        </div>

        {/* ── 구분선 ── */}
        <div className="section-divider jf-4">
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-green-600">
            프로필 정보
          </span>
        </div>

        {/* ── 닉네임 ── */}
        <div className="jf-4 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            닉네임
          </Label>
          <div className="flex gap-2">
            <Input
              className="rounded-xl border-green-300 bg-green-50/40 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
              name="memNickname"
              value={joinData.memNickname}
              onChange={(e) => handleChange(e)}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0 rounded-xl border-green-400 font-semibold text-green-700 transition-all duration-200 hover:border-green-500 hover:bg-green-50 active:scale-95"
              onClick={() => checkNickname()}
            >
              중복 확인
            </Button>
          </div>
          {errorMsg.memNickname && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memNickname}
            </p>
          )}
        </div>

        {/* ── 이름 ── */}
        <div className="jf-5 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            이름
          </Label>
          <Input
            className="rounded-xl border-green-300 bg-green-50/40 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
            name="memName"
            value={joinData.memName}
            onChange={(e) => handleChange(e)}
          />
          {errorMsg.memName && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memName}
            </p>
          )}
        </div>

        {/* ── 전화번호 ── */}
        <div className="jf-6 mb-2.5">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            전화번호
          </Label>
          <div className="relative">
            <IoIosCall className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-green-600" />
            <Input
              className="rounded-xl border-green-300 bg-green-50/40 pl-10 text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
              placeholder="010-XXXX-XXXX"
              name="memTel"
              value={joinData.memTel}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {errorMsg.memTel && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memTel}
            </p>
          )}
        </div>

        {/* 농장주 전용 필드 - 농장명, 인증번호 */}
        {userType === "FAMER" && (
          <>
            <div>
              <Label className="mb-1.5 block text-sm font-semibold text-green-900">
                농장명
              </Label>
              <Input 
                className="rounded-xl border-green-300 bg-green-50/40 text-sm text-gray-800 transition-all duration-200 focus-visible:border-green-500 focus-visible:ring-green-500"
                placeholder="농장명을 입력하세요."
                name="farmName"
                value={joinData.farmName}
                onChange={e => {handleChange(e)}}
              />
              {errorMsg.farmName && (
                <p className="err-msg mt-1 pl-1 text-xs text-red-500">
                  {errorMsg.farmName}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block text-sm font-semibold text-green-900">
                인증번호
              </Label>
              <Input 
                className="rounded-xl border-green-300 bg-green-50/40 text-sm text-gray-800 transition-all duration-200 focus-visible:border-green-500 focus-visible:ring-green-500"
                placeholder="인증번호를 입력하세요."
                name="authCode"
                value={joinData.authCode}
                onChange={e => {handleChange(e)}}
              />
              {errorMsg.authCode && (
                <p className="err-msg mt-1 pl-1 text-xs text-red-500">
                  {errorMsg.authCode}
                </p>
              )}
            </div>
          </>
        )}
        
        {/* ── 구분선 ── */}
        <div className="section-divider jf-7">
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-green-600">
            주소
          </span>
        </div>

        {/* ── 주소 ── */}
        <div className="jf-7 mb-1">
          <Label className="mb-1.5 block text-sm font-semibold text-green-900">
            주소
          </Label>
          <div className="flex gap-2">
            <Input
              className="rounded-xl border-green-300 bg-green-50/40 text-sm text-gray-800 transition-all duration-200 focus-visible:border-green-500 focus-visible:ring-green-500"
              readOnly={true}
              name="memAdd"
              value={joinData.memAdd}
              onChange={(e) => handleChange(e)}
            />

            <Postcode onAddressSelect={selectAddress} />
          </div>
          {errorMsg.memAdd && (
            <p className="err-msg mt-1 pl-1 text-xs text-red-500">
              {errorMsg.memAdd}
            </p>
          )}
        </div>

        {/* ── 상세 주소 ── */}
        <div className="jf-7 mb-4">
          <Input
            className="rounded-xl border-green-300 bg-green-50/40 text-sm text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus-visible:border-green-500 focus-visible:ring-green-500"
            placeholder="상세주소 입력(선택사항)"
            name="addDetail"
            value={joinData.addDetail}
            onChange={(e) => handleChange(e)}
          />
        </div>

        {/* ── 회원가입 버튼 ── */}
        <div className="jf-8">
          <Button
            type="button"
            className="btn-join w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md shadow-green-200/60 transition-all duration-200 hover:bg-green-700 hover:shadow-lg hover:shadow-green-200/80 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-green-200 disabled:shadow-none"
            disabled={!isDisable.success}
            onClick={() => {
              validate();
            }}
          >
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
};
export default JoinForm;
