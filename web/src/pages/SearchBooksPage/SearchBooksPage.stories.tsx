import type { Meta, StoryObj } from "@storybook/react";

import SearchBooksPage from "./SearchBooksPage";

const meta: Meta<typeof SearchBooksPage> = {
  component: SearchBooksPage,
};

export default meta;

type Story = StoryObj<typeof SearchBooksPage>;

export const Primary: Story = {};
