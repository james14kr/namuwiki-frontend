import {
  AppGrid,
  AppPagination,
  Button,
  DatePicker,
  Input,
} from "@/components";
import Modal from "@/components/modal/modal";
import { toastMutation } from "@/lib/toast";
import { useGetFarmerList, useSelectUnregFarmerCount } from "@/queries/admin.queries";
import { usePostAuthCode } from "@/queries/member.queries";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

// 농장주 인증번호 관리 페이지 //
const DeviceRegistration = () => {
  const { data, isLoading } = useGetFarmerList();
  const usePostAuthCodeMutate = usePostAuthCode();
  //useQueryClient : 캐시 저장소에 접근하는 훅
  const queryClient = useQueryClient();
  const {data: unregFarmerCount} = useSelectUnregFarmerCount();

  // 인증번호 생성 저장 state 변수
  const [authCode, setAuthCode] = useState({
    authCode: "",
    memName: "",
    memTel: "",
  });

  //선택한 날짜가 저장 될 state 변수
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // 선택한 날짜 필터링한 데이터 담을 변수
  const filteredData = selectedDate
    ? data?.filter((m) => {
        return (
          new Date(m.createTime).toLocaleDateString("ko-KR") ===
          selectedDate.toLocaleDateString("ko-KR")
        );
      })
    : data;

  // 날짜 변수
  const today = new Date();

  // 이번달 발급 : 이번달 1일 이후에 등록된 것
  // ?? 0 : null 병합 연산자 => 왼쪽 값이 null 또는 undefined일 경우에만 오른쪽 값인 0을 반환
  const thisMonthCount =
    data?.filter((m) => {
      const joinDate = new Date(m.createTime);
      return (
        joinDate.getFullYear() === today.getFullYear() &&
        joinDate.getMonth() === today.getMonth()
      );
    }).length ?? 0;

  // 최근 7일 발급
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const recentSevenCount =
    data?.filter((m) => {
      return new Date(m.createTime) >= sevenDaysAgo;
    }).length ?? 0;

  // 미등록 농장주: authCode는 있지만 회원가입을 하지 않은 농장주
  const unregisteredFarmerCount = data?.filter(() => {}).length ?? 0;

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

    // invalidateQueries : queryKey 캐시 무효화해 다시 불러와! 라는 기능을 가짐
    queryClient.invalidateQueries({ queryKey: ["members"] });

    // 변경 완료되면 모달 창 닫기
    setIsOpen(false);
  };

  // 한 페이지에 보여줄 행 수
  const PAGE_SIZE = 5;
  // 현재페이지 -> 초기값은 1이니 처음엔 1페이지, 페이지 누를 때 마다 setCurrentPage(page)로 업데이트
  const [currentPage, setCurrentPage] = useState(1);

  // 모달 열 변수
  const [isOpen, setIsOpen] = useState(false);

  // 사용자 수 카운트 저장할 변수
  const totalCount = data?.length;

  // 현재 페이지 데이터만 잘라서 저장한 변수 생성
  // (시작 인덱스부터 끝 인덱스 직전까지 잘라내기), slice(위치기준으로 자르기)
  const paginateData =
    filteredData?.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    ) ?? [];

  // 공통 셀 스타일 (버튼과 높이 맞춤)
  const centeredCellStyle = {
    display: "flex",
    alignItems: "center",
    height: "100%",
  };

  // 컬럼 정의
  const columnDefs: ColDef[] = [
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
      field: "createTime",
      headerName: "등록 날짜",
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
      field: "authCode",
      headerName: "인증번호",
      flex: 2,
      cellStyle: centeredCellStyle,
    },
    {
      field: "isUsed",
      headerName: "상태",
      flex: 2,
      cellStyle: centeredCellStyle,
      cellRenderer: (params: { value: string }) => {
        return params.value === "Y"
          ? (<span style={{color: "#16a34a", fontWeight: 600}}>등록완료</span>)
          : (<span style={{color: "#dc2626", fontWeight: 600}}>미등록</span>);
      },
    },
  ];

  console.log(data);

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* 인증번호 발급 모달 */}
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
              인증번호 생성
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Input
                placeholder="농업인 성명"
                onChange={(e) => handleAuthCode(e)}
                name="memName"
                value={authCode.memName}
              />
              <Input
                placeholder="농업인 연락처"
                onChange={(e) => handleAuthCode(e)}
                name="memTel"
                value={authCode.memTel}
              />
              <div style={{ marginTop: "8px" }}>
                <Button
                  className="w-full"
                  onClick={() => postAuthCode()}
                >
                  인증번호 발급
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900">인증번호 관리</h2>
        <p className="mt-1 text-sm text-gray-500">
          나무위키팜의 시스템을 이용하는 농업인의 인증번호를 관리하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            총 발급 건수
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-800">
              {totalCount ?? 0}
            </p>
            <p className="text-sm text-gray-500">건</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            이번 달 발급
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">
              {thisMonthCount}
            </p>
            <p className="text-sm text-gray-500">건</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            최근 7일 발급
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">
              {recentSevenCount}
            </p>
            <p className="text-sm text-gray-500">건</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-green-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            미등록 농장주
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-green-700">
              {unregFarmerCount}
            </p>
            <p className="text-sm text-gray-500">명</p>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mb-5 border-t border-gray-200" />

      {/* 필터 및 검색 바 */}
      <div className="mb-4 flex items-end gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">이름</label>
          <Input placeholder="이름 입력" name="memName" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">전화번호</label>
          <Input placeholder="전화번호 입력" name="memTel" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">날짜</label>
          <DatePicker
            id="datepicker-default"
            placeholder="날짜를 선택하세요."
            onChange={(date) => setSelectedDate(date)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-transparent select-none">ㅤ</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}>검색</Button>
            <Button onClick={() => setIsOpen(true)}>인증번호 발급</Button>
          </div>
        </div>
      </div>

      {/* 데이터 그리드 */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {isLoading && (
          <div className="flex h-16 items-center justify-center text-sm text-gray-400">
            로딩 중 입니다.
          </div>
        )}
        <div
          className="ag-theme-alpine"
          style={{ height: "300px", width: "100%" }}
        >
          <AppGrid
            rowData={paginateData}
            columnDefs={columnDefs}
            rowHeight={48}
            className="h-full"
          />
        </div>
        <div className="border-t border-gray-100 px-4 py-3">
          <AppPagination
            totalRow={filteredData?.length ?? 0}
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

export default DeviceRegistration;
