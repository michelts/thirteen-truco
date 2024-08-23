import type { Meta, StoryObj } from "@storybook/html";

import { renderCardDeck } from "@/ui/cardDeck";

const meta = {
  title: "Components/CardDeck",
  tags: ["autodocs"],
  render: () => {
    return renderCardDeck();
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
