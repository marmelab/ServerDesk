import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CompanyMultiSelect } from '../components/CompanyMultiSelect';
import { StoryWrapper } from './StoryWrapper';
import { useState } from 'react';

const meta = {
  title: 'Components/CompanyMultiSelect',
  component: CompanyMultiSelect,
} satisfies Meta<typeof CompanyMultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoCompanies: Story = {
  render: (args) => (
    <StoryWrapper
      mockData={{
        companies: [],
      }}
    >
      <CompanyMultiSelect {...args} />
    </StoryWrapper>
  ),
  args: {
    selectedIds: [],
    onChange: fn(),
  },
};

export const MockedCompaniesAndNoSelected: Story = {
  render: (args) => {
    const [ids, setIds] = useState(args.selectedIds);

    return (
      <StoryWrapper
        mockData={{
          companies: [
            { id: 1, name: 'Acme Corp' },
            { id: 2, name: 'Globex' },
          ],
        }}
      >
        <CompanyMultiSelect
          {...args}
          selectedIds={ids}
          onChange={(newIds) => {
            setIds(newIds);
            args.onChange(newIds);
          }}
        />
      </StoryWrapper>
    );
  },
  args: {
    selectedIds: [],
    onChange: fn(),
  },
};

export const MockedCompaniesAndOneSelected: Story = {
  render: (args) => {
    const [ids, setIds] = useState(args.selectedIds);

    return (
      <StoryWrapper
        mockData={{
          companies: [
            { id: 1, name: 'Acme Corp' },
            { id: 2, name: 'Globex' },
          ],
        }}
      >
        <CompanyMultiSelect
          {...args}
          selectedIds={ids}
          onChange={(newIds) => {
            setIds(newIds);
            args.onChange(newIds);
          }}
        />
      </StoryWrapper>
    );
  },
  args: {
    selectedIds: [1],
    onChange: fn(),
  },
};
