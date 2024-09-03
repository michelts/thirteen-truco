import type { Meta, StoryObj } from "@storybook/html";

import { Card } from "@/core";
import { Suit } from "@/types";
import { renderCard } from "@/ui/card";

type CardProps = Parameters<typeof renderCard>[0];

const meta = {
  title: "Components/Card",
  tags: ["autodocs"],
  render: (args) => {
    return renderCard(args);
  },
} satisfies Meta<CardProps>;

export default meta;
type Story = StoryObj<CardProps>;

export const SevenOfHearts: Story = {
  args: new Card(7, Suit.Hearts),
};

export const AceOfSpades: Story = {
  args: new Card(1, Suit.Spades),
};

export const KingOfDiamonds: Story = {
  args: new Card(12, Suit.Diamonds),
};

export const JacOfClubs: Story = {
  args: new Card(11, Suit.Clubs),
};

export const QueenOfHearts: Story = {
  args: new Card(10, Suit.Hearts),
};
