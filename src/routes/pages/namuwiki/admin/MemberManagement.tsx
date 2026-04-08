import {
  AppGrid,
  AppPagination,
  AppSelect,
  Button,
  Input,
  type ItemType,
} from "@/components";
import { toastMutation } from "@/lib/toast";
import React, { useState } from "react";

interface MemberData {
  memEmail: string;
  memName: string;
  memTel: string;
  memRole: string;
  memJoinData: string;
}

const MemberManagement = () => {
  // 전체 사용자 저장 state 변수
  const [deviceReg, setDeviceReg] = useState({
    memEmail: "",
    memName: "",
    memTel: "",
    memRole: "",
    memJoinData: "",
    
  });

  // 컬럼 정의
  const columnDefs: ColDef<MemberData>[] = [
    { field: "memEmail", headerName: "이메일", flex: 1 },
    { field: "memName", headerName: "이름", flex: 1 },
    { field: "memTel", headerName: "연락처", flex: 4 },
    { field: "memRole", headerName: "권한", flex: 1 },
    { field: "memJoinData", headerName: "가입 날짜", flex: 4 },
    //{ field: "admin", headerName: "관리", flex: 5 },
  ];

  const [rowData, setRowData] = useState<MemberData[]>([]);

  // 실제 데이터가 저장된 변수
  const rowDatas = [
    {
      memEmail: "yj",
      memName: "kim",
      memTel: "010-1111-2222",
      memRole: "user",
      memJoinData: "2026-02-11",
    },
  ];

  // select 기기 상태
  const admin: ItemType[] = [
    {
      value: "admin0",
      title: "선택",
    },
    {
      value: "admin1",
      title: "농장주",
    },
    {
      value: "admin2",
      title: "일반 유저",
    },
  ];

  return (
    <div>
      <div>
        <h2>사용자 관리</h2>
      </div>
      <div>
        <h3>
          나무위키팜 시스템을 사용하는 사용자를 관리하고 그 권한을 설정하세요.
        </h3>
      </div>
      <div className="mx-10 grid grid-flow-row grid-flow-col grid-cols-2">
        <div className="border-black">
          <p>총 사용자</p>
          <p>12명</p>
        </div>
        <div>
          <p>농장주</p>
          <p>10명</p>
        </div>
        <div>
          <p>관리자</p>
          <p>2명</p>
        </div>
      </div>
      {/* 구분선 */}
      <div className="w-72 bg-gray-500"></div>
      <div className="flex justify-around">
        <div>권한</div>
        <div>
          <AppSelect id="" items={admin} />
        </div>
        <div>
          <Input placeholder="이메일 또는 이름 입력" name="farmerName" />
        </div>
        <div>
          <Button
            onClick={() => {}}
          >
            검색
          </Button>
        </div>
        <div>
          <Button>사용자 추가</Button>
        </div>
      </div>
      <div>
        {/* 인증번호 생성된 농장주 정보 list */}
        <AppGrid rowData={rowDatas} columnDefs={columnDefs} />
        <AppPagination totalRow={100} />
      </div>
    </div>
  );
};

export default MemberManagement;
