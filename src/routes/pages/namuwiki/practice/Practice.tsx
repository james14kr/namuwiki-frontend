import { AppSelect, Button, Input, Label, type ItemType } from "@/components";
import { Value } from "@radix-ui/react-select";
import { id } from "date-fns/locale";
import React, { useState } from "react";

const Practice = () => {
  const [inputData, setInputData] = useState({
    name: "",
    age: 0,
    birth: "",
  });

  // const test: ItemType[] = [
  //   {
  //     value: "1",
  //     title: "값 1",
  //   },
  //   {
  //     value: "2",
  //     title: "값 2",
  //   },
  //   {
  //     value: "3",
  //     title: "값 3",
  //   },
  //   {
  //     value: "4",
  //     title: "값 4",
  //     disabled: true
  //   },
  //   {
  //     value: "5",
  //     title: "값 5",
  //   },
  //   {
  //     value: "6",
  //     title: "값 6",
  //   },
  //   {
  //     value: "7",
  //     title: "값 7",
  //   },
  // ];
  const test2: ItemType[] = [
    {
      value: "주스1",
      title: "사과당근주스",
    },
    {
      value: "주스2",
      title: "오렌지주스",
    },
    {
      value: "주스3",
      title: "포도주스",
    },
    {
      value: "감귤주스",
      title: "감귤주스",
    },
    {
      value: "파인애플주스",
      title: "파인애플주스",
    },
    {
      value: "키위주스",
      title: "키위주스",
    },
  ];
  

  return (
    <div className="flex items-center justify-center bg-white">
      <div>
        <div>
          <h2>회원가입</h2>
        </div>
        <div className="w-56">
          <Label htmlFor="name">이름</Label>
          <Input id="name" />
        </div>
        <div>
          <Label htmlFor="age">나이</Label>
          <Input id="age" type="number" />
        </div>
        <div>
          <Label htmlFor="birth">생년월일</Label>
          <Input id="birth" />
        </div>
        <div>
          <Button variant="destructive" className="w-44 font-bold">
            확인
          </Button>
        </div>
        <div>
          <Input type="radio" />
        </div>
        <div>
          <AppSelect id="asdf" items={test2} />
        </div>
      </div>
    </div>
  );
};

export default Practice;
