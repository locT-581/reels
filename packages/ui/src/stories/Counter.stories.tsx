import type { Meta, StoryObj } from '@storybook/react'
import { Counter } from '../components/typography/Counter'
import { useState, useEffect } from 'react'

const meta = {
  title: 'Typography/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 1234,
  },
}

export const Thousands: Story = {
  args: {
    value: 12500,
  },
}

export const Millions: Story = {
  args: {
    value: 3500000,
  },
}

export const Small: Story = {
  args: {
    value: 9999,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    value: 9999,
    size: 'lg',
  },
}

export const Animated: Story = {
  render: () => {
    const AnimatedCounter = () => {
      const [count, setCount] = useState(0)
      
      useEffect(() => {
        const interval = setInterval(() => {
          setCount(prev => prev + Math.floor(Math.random() * 100))
        }, 1000)
        return () => clearInterval(interval)
      }, [])
      
      return <Counter value={count} size="lg" />
    }
    
    return <AnimatedCounter />
  },
}

export const LikeCounter: Story = {
  render: () => {
    const LikeButton = () => {
      const [likes, setLikes] = useState(1234)
      const [liked, setLiked] = useState(false)
      
      const handleClick = () => {
        setLiked(!liked)
        setLikes(prev => liked ? prev - 1 : prev + 1)
      }
      
      return (
        <button 
          onClick={handleClick}
          className="flex flex-col items-center gap-1"
        >
          <div className={`text-2xl ${liked ? 'text-red-500' : 'text-white'}`}>
            ❤️
          </div>
          <Counter value={likes} />
        </button>
      )
    }
    
    return <LikeButton />
  },
}

