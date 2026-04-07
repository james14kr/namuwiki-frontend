import { useState } from "react";
import {
  Button,
  Input,
  AppSelect,
  type ItemType,
  SectionCard,
  AppAlertDialog,
} from "@/components";
import {
  checkMobilePhoneRegex,
  checkNumberRegex,
  isNullOrEmpty,
  isWhitespace,
} from "@/utils/validate";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { infoToast } from "@/lib/toast";

const COLOR: ItemType[] = [
  { value: "화이트", title: "화이트" },
  { value: "블랙", title: "블랙" },
  { value: "레드", title: "레드" },
];

const RegisterSales = () => {
  const carModelList = [];

  const [buyer, setBuyer] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const [phoneError, setPhoneError] = useState<boolean>(false);

  const checkValidation = (value: string): boolean => {
    return !isNullOrEmpty(value) && !isWhitespace(value);
  };

  const check =
    checkValidation(buyer) &&
    checkValidation(color) &&
    checkValidation(carModel) &&
    !phoneError;

  const onSubmitHandler = () => {
    infoToast("Submit 이벤트");
  };

  return (
    <>
      <div className="flex h-full flex-col gap-5" onSubmit={onSubmitHandler}>
        <SectionCard title="자동차 모델 선택">
          <div className="flex items-center">
            <FieldLabel
              htmlFor="car-color"
              className="w-14 shrink-0 text-sm font-medium"
            >
              색상
            </FieldLabel>
            <AppSelect
              id="car-color"
              items={COLOR}
              placeholder="선택"
              value={color}
              onValueChange={setColor}
              className="w-60 max-w-none"
            />
            <FieldLabel
              htmlFor="car-model"
              className="ml-14 mr-6 shrink-0 text-sm font-medium"
            >
              모델
            </FieldLabel>
            <AppSelect
              id="car-model"
              items={carModelList}
              placeholder="선택"
              value={carModel}
              onValueChange={setCarModel}
              className="w-60 max-w-none"
            />
          </div>
        </SectionCard>
        <SectionCard title="구매자 등록">
          <div className="mb-6 flex items-center gap-6">
            <FieldLabel
              htmlFor="buyer"
              className="w-14 shrink-0 text-sm font-medium"
            >
              구매자명
            </FieldLabel>
            <Input
              id="buyer"
              className="w-60"
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
            />
          </div>
          <div className="flex gap-6">
            <FieldLabel
              htmlFor="buyer-phone"
              className="w-14 shrink-0 text-sm font-medium leading-9"
            >
              연락처
            </FieldLabel>
            <div>
              <Input
                id="buyer-phone"
                className="w-60"
                value={phone}
                onBlur={() => {
                  if (isNullOrEmpty(phone)) return;
                  if (!checkMobilePhoneRegex(phone)) return;

                  const first = phone.substring(0, 3);
                  const second = phone.substring(3, 7);
                  const third = phone.substring(7, 11);

                  setPhoneError(false);
                  setPhone(`${first}-${second}-${third}`);
                }}
                onFocus={() => {
                  setPhone(phone.replaceAll("-", ""));
                }}
                onChange={(e) => {
                  if (e.target.value.length === 12) return;
                  if (
                    !isNullOrEmpty(e.target.value) &&
                    !checkNumberRegex(e.target.value)
                  )
                    return;
                  if (!checkMobilePhoneRegex(e.target.value))
                    setPhoneError(true);
                  else setPhoneError(false);

                  if (isNullOrEmpty(e.target.value)) setPhoneError(false);
                  setPhone(e.target.value);
                }}
              />
              {phoneError && (
                <FieldDescription className="font-bold text-red-500">
                  연락처 형식이 잘못되었습니다.
                </FieldDescription>
              )}
              <FieldDescription>
                010, 011, 016, 017, 018, 019 로 시작하며 가운데 4자리, 마지막
                4자리 숫자로 구성된 한국 휴대폰 번호 형식을 허용합니다.
                <br />
                하이픈(-)은 생략 해주세요.
              </FieldDescription>
            </div>
          </div>
        </SectionCard>
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={!check}
            className="w-96"
            onClick={() => setOpen(true)}
          >
            등록
          </Button>
        </div>
      </div>
      <AppAlertDialog
        open={open}
        title="등록하시겠습니까?"
        description="강사님 Toast Mutation의 동작 확인을 위해 3초간 로딩 시간을 발생하게 해놔서 조금 기다리시면 됩니다."
        onOpenChange={(value) => setOpen(value)}
        onConfirm={onSubmitHandler}
      />
    </>
  );
};

export default RegisterSales;
