import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

const meta: Meta<typeof ImageUploader> = {
  title: "App/Upload/ImageUploader",
  component: ImageUploader,
};

export default meta;
type Story = StoryObj<typeof ImageUploader>;

const Wrapper = (props: React.ComponentProps<typeof ImageUploader>) => {
  const [files, setFiles] = useState<File[]>(props.files ?? []);
  return <ImageUploader {...props} files={files} onChange={setFiles} />;
};

export const Default: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    files: [],
    multiple: true,
    usePreview: true,
  },
};

export const SingleFile: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    files: [],
    multiple: false,
    usePreview: true,
  },
};

export const NoPreview: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    files: [],
    multiple: true,
    usePreview: false,
  },
};
