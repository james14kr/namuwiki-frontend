import type { Meta, StoryObj } from "@storybook/react-vite";
import Postcode from "./Postcode";

const meta: Meta<typeof Postcode> = {
  title: "App/Postcode/Postcode",
  component: Postcode,
};

export default meta;
type Story = StoryObj<typeof Postcode>;

export const Default: Story = {
  args: {
    onAddressSelect: (addrInfo) => {
      console.log("선택된 주소:", addrInfo);
      alert(`선택된 주소: ${addrInfo.fullAddress}`);
    },
  },
};
