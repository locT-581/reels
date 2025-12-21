import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LikeButton } from '../components/interactions/LikeButton'
import { SaveButton } from '../components/interactions/SaveButton'
import { ShareButton } from '../components/share/ShareButton'

// LikeButton
const LikeButtonMeta = {
  title: 'Interactions/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LikeButton>

export default LikeButtonMeta
type LikeButtonStory = StoryObj<typeof LikeButtonMeta>

export const Default: LikeButtonStory = {
  args: {
    count: 1234,
    isLiked: false,
  },
}

export const Liked: LikeButtonStory = {
  args: {
    count: 1235,
    isLiked: true,
  },
}

export const Interactive: LikeButtonStory = {
  render: () => {
    const InteractiveLike = () => {
      const [isLiked, setIsLiked] = useState(false)
      const [count, setCount] = useState(1234)
      
      const handleLike = () => {
        setIsLiked(!isLiked)
        setCount(prev => isLiked ? prev - 1 : prev + 1)
      }
      
      return (
        <LikeButton
          count={count}
          isLiked={isLiked}
          onLike={handleLike}
        />
      )
    }
    return <InteractiveLike />
  },
}

// SaveButton
export const SaveDefault: LikeButtonStory = {
  render: () => <SaveButton isSaved={false} onSave={() => {}} />,
}

export const Saved: LikeButtonStory = {
  render: () => <SaveButton isSaved={true} onSave={() => {}} />,
}

export const InteractiveSave: LikeButtonStory = {
  render: () => {
    const InteractiveSaveButton = () => {
      const [isSaved, setIsSaved] = useState(false)
      return <SaveButton isSaved={isSaved} onSave={() => setIsSaved(!isSaved)} />
    }
    return <InteractiveSaveButton />
  },
}

// ShareButton
export const Share: LikeButtonStory = {
  render: () => <ShareButton count={156} onShare={() => {}} />,
}

// Action Bar
export const ActionBar: LikeButtonStory = {
  render: () => {
    const ActionBarDemo = () => {
      const [isLiked, setIsLiked] = useState(false)
      const [isSaved, setIsSaved] = useState(false)
      const [likeCount, setLikeCount] = useState(12400)
      
      return (
        <div className="flex flex-col gap-6 items-center p-4 bg-black/60 backdrop-blur-xl rounded-2xl">
          <LikeButton
            count={likeCount}
            isLiked={isLiked}
            onLike={() => {
              setIsLiked(!isLiked)
              setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
            }}
          />
          <SaveButton
            isSaved={isSaved}
            onSave={() => setIsSaved(!isSaved)}
          />
          <ShareButton
            count={156}
            onShare={() => console.log('Share clicked')}
          />
        </div>
      )
    }
    return <ActionBarDemo />
  },
}

