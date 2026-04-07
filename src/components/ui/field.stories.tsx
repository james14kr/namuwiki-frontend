import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "./field";
import { Input } from "./input";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Vertical: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="name">이름</FieldLabel>
        <Input id="name" placeholder="이름을 입력하세요" />
      </Field>
    </FieldGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="email">이메일</FieldLabel>
        <Input id="email" type="email" placeholder="example@email.com" />
      </Field>
    </FieldGroup>
  ),
};

export const Responsive: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="responsive">
        <FieldLabel htmlFor="phone">전화번호</FieldLabel>
        <Input id="phone" placeholder="010-0000-0000" />
      </Field>
    </FieldGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor="password">비밀번호</FieldLabel>
        <Input id="password" type="password" placeholder="비밀번호 입력" />
        <FieldDescription>비밀번호는 8자 이상이어야 합니다.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
};
