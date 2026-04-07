import { useDaumPostcodePopup, type Address } from "react-daum-postcode";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export interface PostInfo {
  address: string;
  jibunAddress: string;
  zonecode: string;
  fullAddress: string;
}

interface props {
  onAddressSelect: (addrInfo: PostInfo) => void;
}

const Postcode = ({ onAddressSelect }: props) => {
  const { t } = useTranslation();
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    const obj = {
      address: data.address,
      jibunAddress: data.jibunAddress,
      zonecode: data.zonecode,
      fullAddress: fullAddress,
    };

    onAddressSelect(obj); // fullAddress를
    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    
    <Button type="button" onClick={handleClick}>{t("common.search")}</Button>
  );
};

export default Postcode;
