import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '../components/typography/Text'

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'title', 'subtitle', 'body', 'caption', 'label', 'overline'],
    },
    videoSafe: { control: 'boolean' },
    truncate: { control: 'boolean' },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Display: Story = {
  args: {
    variant: 'display',
    children: 'Display Text',
  },
}

export const Title: Story = {
  args: {
    variant: 'title',
    children: 'Title Text',
  },
}

export const Subtitle: Story = {
  args: {
    variant: 'subtitle',
    children: 'Subtitle Text',
  },
}

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'Body text for regular content. This is the default variant used for most text.',
  },
}

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Caption text for smaller details',
  },
}

export const Label: Story = {
  args: {
    variant: 'label',
    children: 'LABEL TEXT',
  },
}

export const Overline: Story = {
  args: {
    variant: 'overline',
    children: 'OVERLINE TEXT',
  },
}

export const VideoSafe: Story = {
  args: {
    variant: 'title',
    children: 'Text with drop shadow for video overlay',
    videoSafe: true,
  },
  parameters: {
    backgrounds: { default: 'gray' },
  },
}

export const Truncated: Story = {
  args: {
    variant: 'body',
    children: 'This is a very long text that will be truncated with ellipsis when it exceeds the container width',
    truncate: true,
    className: 'max-w-[200px]',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 text-white">
      <Text variant="display">Display</Text>
      <Text variant="title">Title</Text>
      <Text variant="subtitle">Subtitle</Text>
      <Text variant="body">Body text</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="label">Label</Text>
      <Text variant="overline">Overline</Text>
    </div>
  ),
}

