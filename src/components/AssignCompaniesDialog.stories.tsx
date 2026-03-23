import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignCompaniesDialog } from './AssignCompaniesDialog';
import { StoryWrapper } from '../stories/StoryWrapper';
import { http, HttpResponse } from 'msw';

const commonHandlers = [
  http.delete(
    '*/rest/v1/user_companies*',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(
    '*/rest/v1/user_companies*',
    () => new HttpResponse(null, { status: 201 }),
  ),
];

const meta = {
  title: 'Components/AssignCompaniesDialog',
  component: AssignCompaniesDialog,
  render: (args) => <AssignCompaniesDialog key={args.agent?.id} {...args} />,
  args: {
    open: true,
    onOpenChange: fn(),
    agent: {
      id: '1',
      name: 'John Doe',
      email: 'john@doe.com',
      companies: [{ id: 1, name: 'Acme Corp' }],
    },
  },
  parameters: {
    msw: { handlers: commonHandlers },
  },
  decorators: [
    (Story) => (
      <StoryWrapper
        mockData={{
          companies: [
            { id: 1, name: 'Acme Corp' },
            { id: 2, name: 'Globex' },
          ],
        }}
      >
        <Story />
      </StoryWrapper>
    ),
  ],
} satisfies Meta<typeof AssignCompaniesDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AgentWithoutCompanies: Story = {
  args: {
    open: true,
    onOpenChange: fn(),
    agent: {
      id: 'agent-456',
      name: 'New Agent',
      companies: [],
    } as any,
  },
};
