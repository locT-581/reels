import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../components/base/Avatar'

const meta = {
  title: 'Base/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    showFollowRing: { control: 'boolean' },
    isLive: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
  },
}

export const WithFallback: Story = {
  args: {
    src: '',
    alt: 'John Doe',
    fallback: 'John Doe',
  },
}

export const ExtraSmall: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    alt: 'User',
    size: 'xs',
  },
}

export const Small: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=4',
    alt: 'User',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=5',
    alt: 'User',
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=6',
    alt: 'User',
    size: 'xl',
  },
}

export const WithFollowRing: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=7',
    alt: 'User',
    showFollowRing: true,
  },
}

export const Live: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=8',
    alt: 'Live user',
    isLive: true,
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="XS" size="xs" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="SM" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="MD" size="md" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="LG" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=5" alt="XL" size="xl" />
    </div>
  ),
}

export const FallbackColors: Story = {
  render: () => (
    <div className="flex gap-2">
      <Avatar fallback="Alice" alt="Alice" />
      <Avatar fallback="Bob" alt="Bob" />
      <Avatar fallback="Charlie" alt="Charlie" />
      <Avatar fallback="Diana" alt="Diana" />
      <Avatar fallback="Eve" alt="Eve" />
    </div>
  ),
}

