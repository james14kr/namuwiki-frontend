import { AppSelect, Button, Input, Label, type ItemType } from "@/components";

const Kjk = () => {
  const test : ItemType[] = [
    {
      value: "1",
      title: "값 1",
    },
    {
      value: "2",
      title: "값 2",
      disabled: true
    },
    {
      value: "3",
      title: "값 3",
    },
    {
      value: "4",
      title: "값 4",
    },
    {
      value: "5",
      title: "값 5",
    },
  ];

  return (
    <>
      <div>회원가입</div>
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name=""
          // value={}
          // onChange={}
        />
      </div>
      <div>
        <Label htmlFor="pw">비밀번호</Label>
        <Input id="pw" type="password" />
      </div>
      <div>
        <Label htmlFor="pw2">비밀번호 확인</Label>
        <Input id="pw2" type="password" />
      </div>
      <div>
        <Label htmlFor="pw2">연락처</Label>
        <Input id="pw2" type="password" />
      </div>

      <div className="flex gap-12">
        <Button className="bg-red-700 text-zinc-100">회원가입</Button>
        <Button className="w-[30%] bg-slate-950 text-zinc-100">취 소</Button>
      </div>

      <div>
        <AppSelect id="asdf" items={test} label="셀렉트일" description="asdfsadf"  />
      </div>
    </>
  );
};

export default Kjk;
