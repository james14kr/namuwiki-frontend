import { AppGrid, AppPagination, AppSelect, Button, Input, type ItemType } from "@/components";
import { toastMutation } from "@/lib/toast";
import { usePostAuthCode } from "@/queries/member.queries";
import React, { useState } from "react";

// 농장주 기기등록 페이지 //
const DeviceRegistration = () => {
  const usePostAuthCodeMutate = usePostAuthCode();
  // 인증번호 생성 저장 state 변수
  const [authCode, setAuthCode] = useState({
    authCode: "",
    memName: "",
    memTel: "",
  });

  const [deviceList, setDeviceList] = useState({
    memEmail: "",
    memName: "",
    memRole: "",
    memJoinData: "",
  });

  // input에 입력한 데이터 저장할 함수
  const handleAuthCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthCode({
      ...authCode,
      [e.target.name]: e.target.value,
    });
  };

  // 인증번호 생성 버튼 클릭 시 인증번호 생성 할 함수
  const postAuthCode = async () => {
    await toastMutation(
      usePostAuthCodeMutate.mutateAsync,
      authCode,
      "로딩중입니다",
      "인증번호가 생성되었습니다.",
      "인증번호 생성에 실패하였습니다."
    );
  };

  // select 기기 상태
  const status: ItemType[] = [
    {
      value: "status0",
      title: "선택",
    },
    {
      value: "status1",
      title: "온라인",
    },
    {
      value: "status2",
      title: "오프라인",
    },
  ];

  return (
    <div>
      <div>
        <h2>농장주 관리</h2>
      </div>
      <div>
        <h3>등록된 나무위키팜 기기 목록을 확인하세요.</h3>
      </div>
      <div className="mx-10 grid grid-flow-row grid-flow-col grid-cols-2">
        <div className="border-black">
          <p>총 등록 기기</p>
          <p>12대</p>
        </div>
        <div>
          <p>온라인 기기</p>
          <p>10대</p>
        </div>
        <div>
          <p>오프라인 기기</p>
          <p>2대</p>
        </div>
      </div>
      <div className="flex">
        <div>상태</div>
        <div>
          <AppSelect id="" items={status} />
        </div>
        <div>
          <Input
            placeholder="농장주 이름"
            onChange={(e) => handleAuthCode(e)}
            name="memName"
            value={authCode.memName}
          />
          <Input
            placeholder="농장주 연락처"
            onChange={(e) => handleAuthCode(e)}
            name="memTel"
            value={authCode.memTel}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              postAuthCode();
            }}
          >
            인증번호 생성
          </Button>
        </div>
        <div></div>
      </div>
      <div>
        {/* 인증번호 생성된 농장주 정보 list */}
        <AppGrid rowData={() => {}} />

        <AppPagination totalRow={100} />
      </div>
    </div>
  );
};

export default DeviceRegistration;
