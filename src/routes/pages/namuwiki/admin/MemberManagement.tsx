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
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import { useGetMemberList, usePostAddAdmin } from "@/queries/member.queries";
import Modal from "@/components/modal/modal";
import type { MemberData } from "@/types/memberType";

// 사용자 관리 페이지
const MemberManagement = () => {
  const usePostAddAdminMutate = usePostAddAdmin();
  const { data, isLoading } = useGetMemberList();
  const memberData = data as MemberData[];

  // 전체 사용자 저장 state 변수
  const [memberList, setMemberList] = useState<MemberData[]>([]);

  // 한 페이지에 보여줄 행 수
  const PAGE_SIZE = 5;
  // 현재페이지 -> 초기값은 1이니 처음엔 1페이지, 페이지 누를 때 마다 setCurrentPage(page)로 업데이트
  const [currentPage, setCurrentPage] = useState(1);

  // 모달 열 변수
  const [isOpen, setIsOpen] = useState(false);

  // 사용자 추가 데이터 저장할 state 변수
  const [addAdmin, setAddAdmin] = useState({
    memEmail: "",
    memPw: "",
  });

  // 날짜 형식 문자열로 변환
  const date = new Date();
  const formattedDate = date.toDateString().split("T")[0];

  // 사용자 수 카운트 저장할 변수
  // ?? 0 : null 병합 연산자 => 왼쪽 값이 null 또는 undefined일 경우에만 오른쪽 값인 0을 반환
  const totalCount = data?.length;
  const farmerCount = data?.filter((m) => m.memRole === "FARMER").length ?? 0;
  const userCount = data?.filter((m) => m.memRole === "USER").length ?? 0;
  const adminCount = data?.filter((m) => m.memRole === "ADMIN").length ?? 0;

  // 현재 페이지 데이터만 잘라서 저장한 변수 생성
  // (시작 인덱스부터 끝 인덱스 직전까지 잘라내기), slice(위치기준으로 자르기)
  const paginateData =
    data?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? [];

  // 컬럼 정의
  const columnDefs: ColDef[] = [
    { field: "memEmail", headerName: "이메일", flex: 3 },
    { field: "memName", headerName: "이름", flex: 1 },
    { field: "memTel", headerName: "연락처", flex: 3 },
    { field: "memRole", headerName: "권한", flex: 1 },
    {
      field: "memJoinDate",
      headerName: "가입 날짜",
      flex: 3,
      // valueFormatter: AgGrid에서 셀에 값을 표시하기 전에 변환해주는 옵션
      valueFormatter: (params) => {
        // 날짜값이 null 이나 undefined면 "-" 표시 => 방어코드, 없으면 undefined 일 때 터질 수 있음
        if (!params.value) return "-"; 
        return new Date(params.value).toLocaleDateString("ko-KR");
      },
    },
    {
      headerName: "관리",
      flex: 2,
      cellRenderer: () => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button>권한 변경</Button>
          <Button>삭제</Button>
        </div>
      ),
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

  // 사용자 추가 데이터 입력 변경할 함수
  const handleAddAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddAdmin({
      ...addAdmin,
      [e.target.name]: e.target.value,
    });
  };

  // 사용자 추가 실행할 함수
  const insertAddAdmin = async () => {
    //mutation실행
    await toastMutation(
      usePostAddAdminMutate.mutateAsync,
      addAdmin,
      "로딩중입니다.",
      "관리자가 추가되었습니다.",
      "관리자추가 중 오류가 발생했습니다."
    );
    setAddAdmin({
      memEmail: "",
      memPw: "",
    });
  };

  console.log("날짜", data?.[0]);

  return (
    <div>
      {isOpen && (
        <Modal onClick={() => setIsOpen(false)}>
          <h3>관리자 추가</h3>
          <Input
            name="memEmail"
            value={addAdmin.memEmail}
            onChange={(e) => handleAddAdmin(e)}
            placeholder="이메일"
          />
          <Input
            name="memPw"
            value={addAdmin.memPw}
            onChange={(e) => handleAddAdmin(e)}
            placeholder="비밀번호"
          />
          <Button onClick={() => insertAddAdmin()}>추가</Button>
        </Modal>
      )}
      <div>
        <h2>사용자 관리</h2>
      </div>
      <div>
        <h3>
          나무위키팜 시스템을 사용하는 사용자를 관리하고 그 권한을 설정하세요.
        </h3>
      </div>
      <div className="mx-10 grid grid-flow-row grid-flow-col grid-cols-4 gap-5">
        <div className="flex gap-4 border border-green-600">
          <p>총 사용자</p>
          <p>{totalCount}명</p>
        </div>
        <div className="flex gap-4 border border-green-600">
          <p>일반 사용자</p>
          <p>{userCount}명</p>
        </div>
        <div className="flex gap-4 border border-green-600">
          <p>농장주</p>
          <p>{farmerCount}명</p>
        </div>
        <div className="flex gap-4 border border-green-600">
          <p>관리자</p>
          <p>{adminCount}명</p>
        </div>
      </div>
      {/* 구분선 */}
      <div className="my-4 w-full border bg-gray-500"></div>
      <div className="flex justify-around">
        <div>권한</div>
        <div>
          <AppSelect id="admin" items={admin} />
        </div>
        <div>
          <Input placeholder="이메일 또는 이름 입력" name="farmerName" />
        </div>
        <div>
          <Button onClick={() => {}}>검색</Button>
        </div>
        <div>
          <Button onClick={() => setIsOpen(true)}>사용자 추가</Button>
        </div>
      </div>
      <div className="ag-then-alpine h-52">
        {/* 인증번호 생성된 농장주 정보 list */}
        {isLoading && <p>로딩 중 입니다.</p>}
        <AppGrid
          //rowData에 데이터 넣으면 알아서 렌더링 해줌
          rowData={paginateData}
          columnDefs={columnDefs}
          rowHeight={40}
          className="h-full"
        />
        <AppPagination
          totalRow={data?.length ?? 0}
          maxRow={PAGE_SIZE}
          onPageClick={(page) => {setCurrentPage(page + 1); console.log("클릭페이지", page)}}
        />
      </div>
    </div>
  );
};

export default MemberManagement;
