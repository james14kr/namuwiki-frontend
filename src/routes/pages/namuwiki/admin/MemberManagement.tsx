import {
  AppGrid,
  AppPagination,
  AppSelect,
  Button,
  Input,
  Postcode,
  type ItemType,
} from "@/components";
import { toastMutation } from "@/lib/toast";
import React, { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { ColDef } from "ag-grid-community";
import { useGetMemberList, usePostAddAdmin } from "@/queries/member.queries";
import Modal from "@/components/modal/modal";
import type { MemberData } from "@/types/memberType";
import type { PostInfo } from "@/components/postcode/Postcode";

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
    memNickname: "",
    memName: "",
    memTel: "",
    memAdd: "",
    addDetail: "",
  });

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

  // 공통 셀 스타일 (버튼과 높이 맞춤)
  const centeredCellStyle = {
    display: "flex",
    alignItems: "center",
    height: "100%",
  };

  // 컬럼 정의
  const columnDefs: ColDef[] = [
    {
      field: "memEmail",
      headerName: "이메일",
      flex: 3,
      cellStyle: centeredCellStyle,
    },
    {
      field: "memName",
      headerName: "이름",
      flex: 1,
      cellStyle: centeredCellStyle,
    },
    {
      field: "memTel",
      headerName: "연락처",
      flex: 3,
      cellStyle: centeredCellStyle,
    },
    {
      field: "memRole",
      headerName: "권한",
      flex: 1,
      cellStyle: centeredCellStyle,
    },
    {
      field: "memJoinDate",
      headerName: "가입 날짜",
      flex: 3,
      cellStyle: centeredCellStyle,
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
        <div style={{ display: "flex", gap: "6px", alignItems: "center", height: "100%" }}>
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

  // 주소 검색
  const selectAddress = (addrInfo: PostInfo) => {
    console.log(addrInfo);
    const updateData = { ...addAdmin, memAdd: addrInfo.fullAddress };
    setAddAdmin(updateData);
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
      memNickname: "",
      memName: "",
      memTel: "",
      memAdd: "",
      addDetail: "",
    });
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* 관리자 추가 모달 */}
      {isOpen && (
        <Modal onClick={() => setIsOpen(false)}>
          <div style={{ width: "320px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#166534",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "2px solid #dcfce7",
              }}
            >
              관리자 추가
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Input
                name="memEmail"
                value={addAdmin.memEmail}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="이메일"
              />
              <Input
                type="password"
                name="memPw"
                value={addAdmin.memPw}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="비밀번호"
              />
              <Input
                name="memNickname"
                value={addAdmin.memNickname}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="닉네임"
              />
              <Input
                name="memName"
                value={addAdmin.memName}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="이름"
              />
              <Input
                name="memTel"
                value={addAdmin.memTel}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="전화번호"
              />
              <Input
                name="memAdd"
                value={addAdmin.memAdd}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="주소"
              />
              <Postcode onAddressSelect={selectAddress} />
              <Input
                name="addDetail"
                value={addAdmin.addDetail}
                onChange={(e) => handleAddAdmin(e)}
                placeholder="상세주소"
              />
              <div style={{ marginTop: "8px" }}>
                <Button onClick={() => insertAddAdmin()}>추가</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900">사용자 관리</h2>
        <p className="mt-1 text-sm text-gray-500">
          나무위키팜 시스템을 사용하는 사용자를 관리하고 그 권한을 설정하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">총 사용자</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-800">{totalCount ?? 0}</p>
            <p className="text-sm text-gray-500">명</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">일반 사용자</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">{userCount}</p>
            <p className="text-sm text-gray-500">명</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">농장주</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">{farmerCount}</p>
            <p className="text-sm text-gray-500">명</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">관리자</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">{adminCount}</p>
            <p className="text-sm text-gray-500">명</p>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mb-5 border-t border-gray-200" />

      {/* 필터 및 검색 바 */}
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
        <span className="whitespace-nowrap text-sm font-semibold text-gray-600">권한</span>
        <div className="w-36">
          <AppSelect id="admin" items={admin} />
        </div>
        <div className="flex-1">
          <Input placeholder="이메일 또는 이름 입력" name="farmerName" />
        </div>
        <Button onClick={() => {}}>검색</Button>
        <Button onClick={() => setIsOpen(true)}>사용자 추가</Button>
      </div>

      {/* 데이터 그리드 */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {isLoading && (
          <div className="flex h-16 items-center justify-center text-sm text-gray-400">
            로딩 중 입니다.
          </div>
        )}
        <div className="ag-theme-alpine" style={{ height: "300px", width: "100%" }}>
          <AppGrid
            rowData={paginateData}
            columnDefs={columnDefs}
            rowHeight={48}
            className="h-full"
          />
        </div>
        <div className="border-t border-gray-100 px-4 py-3">
          <AppPagination
            totalRow={data?.length ?? 0}
            maxRow={PAGE_SIZE}
            onPageClick={(page) => {
              setCurrentPage(page + 1);
              console.log("클릭페이지", page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
