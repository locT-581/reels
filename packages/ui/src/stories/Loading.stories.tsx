import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../components/loading/Skeleton'
import { BlurPlaceholder } from '../components/loading/BlurPlaceholder'

const SkeletonMeta = {
  title: 'Loading/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
  },
} satisfies Meta<typeof Skeleton>

export default SkeletonMeta
type SkeletonStory = StoryObj<typeof SkeletonMeta>

export const Text: SkeletonStory = {
  args: {
    variant: 'text',
    className: 'w-48',
  },
}

export const Circular: SkeletonStory = {
  args: {
    variant: 'circular',
    className: 'w-12 h-12',
  },
}

export const Rectangular: SkeletonStory = {
  args: {
    variant: 'rectangular',
    className: 'w-64 h-32',
  },
}

export const Rounded: SkeletonStory = {
  args: {
    variant: 'rounded',
    className: 'w-64 h-32',
  },
}

export const VideoCard: SkeletonStory = {
  render: () => (
    <div className="w-[180px] space-y-2">
      <Skeleton variant="rounded" className="w-full aspect-[9/16]" />
      <div className="flex gap-2">
        <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-2/3" />
        </div>
      </div>
    </div>
  ),
}

export const CommentSkeleton: SkeletonStory = {
  render: () => (
    <div className="w-[300px] space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  ),
}

// BlurPlaceholder stories
export const BlurPlaceholderDefault: SkeletonStory = {
  render: () => (
    <BlurPlaceholder
      src="https://picsum.photos/200/300"
      blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
      className="w-[200px] h-[300px]"
    />
  ),
}

export const BlurPlaceholderGrid: SkeletonStory = {
  render: () => (
    <div className="grid grid-cols-3 gap-2">
      <BlurPlaceholder
        blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
        className="aspect-[9/16]"
      />
      <BlurPlaceholder
        blurHash="LGF5]+Yk^6#M@-5c,1J5@[or[Q6."
        className="aspect-[9/16]"
      />
      <BlurPlaceholder
        blurHash="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        className="aspect-[9/16]"
      />
    </div>
  ),
}

