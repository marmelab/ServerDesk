import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import { InteractiveStory } from '../../stories/UtilsStories';

const meta = {
  title: 'Components/CompanyMultiSelect',
  component: CompanyMultiSelect,
  render: (args) => (
    <InteractiveStory mockData={MOCK_COMPANIES} initialIds={args.selectedIds}>
      <CompanyMultiSelect {...args} />
    </InteractiveStory>
  ),
} satisfies Meta<typeof CompanyMultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const MOCK_COMPANIES = {
  companies: [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Globex' },
  ],
};

export const NoCompanies: Story = {
  args: {
    selectedIds: [],
    onChange: fn(),
  },
};

export const MockedCompaniesAndNoSelected: Story = {
  args: {
    selectedIds: [],
    onChange: fn(),
  },
};

export const MockedCompaniesAndOneSelected: Story = {
  args: {
    selectedIds: [1],
    onChange: fn(),
  },
};
