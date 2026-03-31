import type { Meta, StoryObj } from '@storybook/react-vite';
import AddCustomerDialogView from './AddCustomerDialogView';
import { useForm } from '@tanstack/react-form';

const meta = {
  component: AddCustomerDialogView,
  render: (args) => {
    const form = useForm({
      defaultValues: {
        name: '',
        email: '',
      },
    });

    return <AddCustomerDialogView {...args} form={form} />;
  },
} satisfies Meta<typeof AddCustomerDialogView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    form: null,
    isUpdate: false,
    onClose: () => console.log('Submitted'),
  },
};

export const UpdateMode: Story = {
  args: {
    form: null,
    isUpdate: true,
    onClose: () => console.log('Updated'),
  },
};
