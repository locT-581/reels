import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from '../components/base/IconButton'
import { Heart, Share2, MessageCircle, Bookmark, MoreVertical } from 'lucide-react'

const meta = {
  title: 'Base/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: Heart,
    'aria-label': 'Like',
  },
}

export const WithCount: Story = {
  args: {
    icon: Heart,
    count: 1234,
    'aria-label': 'Like',
  },
}

export const Active: Story = {
  args: {
    icon: Heart,
    count: 1234,
    active: true,
    activeColor: '#FF2D55',
    'aria-label': 'Liked',
  },
}

export const Filled: Story = {
  args: {
    icon: Share2,
    variant: 'filled',
    'aria-label': 'Share',
  },
}

export const Outline: Story = {
  args: {
    icon: Bookmark,
    variant: 'outline',
    'aria-label': 'Save',
  },
}

export const Small: Story = {
  args: {
    icon: Heart,
    size: 'sm',
    'aria-label': 'Like',
  },
}

export const Large: Story = {
  args: {
    icon: Heart,
    size: 'lg',
    'aria-label': 'Like',
  },
}

export const ActionBar: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center p-4 bg-black/50 rounded-2xl">
      <IconButton
        icon={Heart}
        count={12400}
        aria-label="Like"
      />
      <IconButton
        icon={MessageCircle}
        count={324}
        aria-label="Comments"
      />
      <IconButton
        icon={Bookmark}
        count={89}
        aria-label="Save"
      />
      <IconButton
        icon={Share2}
        count={156}
        aria-label="Share"
      />
      <IconButton
        icon={MoreVertical}
        aria-label="More"
      />
    </div>
  ),
}

