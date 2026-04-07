import { AppSelect, Button, Input, type ItemType } from "@/components";
import React from "react";

// 기기 등록 페이지 //
const DeviceRegistration = () => {
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
        <h2>등록된 기기 현황</h2>
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
          <Input/>
          <Button> 검색 </Button>
        </div>
        <div>
          <Button>기기 등록</Button>
        </div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
};

export default DeviceRegistration;
