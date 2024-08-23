import type { Meta, StoryObj } from "@storybook/html";

import { renderCardBack } from "@/ui/cardBack";

const meta = {
  title: "Components/CardBack",
  tags: ["autodocs"],
  render: () => {
    return renderCardBack();
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
