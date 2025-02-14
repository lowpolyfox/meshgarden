import { useEffect, useState, type JSX } from 'react'

type HTMLTags = keyof JSX.IntrinsicElements
type NonTextHTMLTags =
  | 'img'
  | 'video'
  | 'audio'
  | 'source'
  | 'track'
  | 'picture'
  | 'iframe'
  | 'embed'
  | 'object'
type TextTags = Exclude<HTMLTags, NonTextHTMLTags>

export interface AnimatedTextProps {
  text: string
  delay?: number
  element?: TextTags
  animationTrigger: boolean
}

const AnimatedText = ({
  text,
  element = 'span',
  delay,
  animationTrigger,
}: AnimatedTextProps) => {
  const words = text.split(' ')
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (animationTrigger && !triggered) {
      setTriggered(true)
    }
  }, [animationTrigger, triggered])

  const Element = element
  return (
    <Element className="flex flex-wrap overflow-hidden whitespace-pre-wrap">
      {words.map((word, index) => {
        return (
          <span className="block overflow-hidden">
            <span
              key={index}
              className="block overflow-hidden transition-transform duration-[400ms] ease-out will-change-transform"
              style={{
                transform: triggered ? 'translateY(0)' : 'translateY(100%)',
                ...(delay && { transitionDelay: `${delay}ms` }),
              }}
            >
              {`${index < words.length - 1 ? `${word} ` : word}`}
            </span>
          </span>
        )
      })}
    </Element>
  )
}

export default AnimatedText
