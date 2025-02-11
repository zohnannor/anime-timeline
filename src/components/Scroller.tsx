import styled, { css } from 'styled-components'
import { clamp, path } from '../util'
import { MouseEvent as MouseEventReact, useEffect, useRef, useState } from 'react'
import { SCROLLER_SIZE } from '../constants'

type ScrollHoverAreaProps = {
  $forcedVisible: boolean
}

export const ScrollerHoverArea = styled.div<ScrollHoverAreaProps>`
  position: fixed;
  bottom: 0;
  height: 80px;
  width: 100vw;
  display: flex;
  justify-content: center;

  &:hover > div {
    bottom: 50px
  }

  ${(p) => p.$forcedVisible && css`
    & > div {
      bottom: 50px;
    }
  `}
`

type ScrollProps = {
  $offset: number
}

export const ScrollerWrapper = styled.div<ScrollProps>`
  transition: bottom 0.2s ease-in-out;
  position: absolute;
  bottom: -60px;
  height: 10px;
  width: ${SCROLLER_SIZE}px;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));

  & > img {
    position: absolute;
    width: 48px;
    height: 48px;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
    left: ${({ $offset }) => $offset * SCROLLER_SIZE}px;
    transform: translateX(-20px) scale(1);
  }

  & > img:hover {
    cursor: grab;
    transform: translateX(-20px) scale(1.05);
  }

  & > img:active {
    cursor: grabbing;
    transform: translateX(-20px) scale(0.95);
  }

`

export const Scroller = () => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef<boolean>(false)
  const [_, setT] = useState<number>(Date.now())
  const [offset, setOffset] = useState<number>(0)

  const updatePageScroll = (offsetRaw: number) => {
    const offset = clamp(offsetRaw, 0, 1)
    const el = document.body
    setOffset(clamp(offset, 0, 1))
    el.scrollLeft = (el.scrollWidth - el.clientWidth) * offset
  }

  const onPageScrollChange = () => {
    const el = document.body
    setOffset((el.scrollLeft) / (el.scrollWidth - el.clientWidth))
  }

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging.current || !scrollerRef.current) return
    const offset = (e.pageX - scrollerRef.current.offsetLeft) / SCROLLER_SIZE;
    updatePageScroll(offset)
  }

  const stopDragging = () => {
    isDragging.current = false
    setT(Date.now())
  }

  useEffect(() => {
    document.body.addEventListener("scroll", onPageScrollChange)
    window.addEventListener("mousemove", handleDrag)
    window.addEventListener("mouseup", stopDragging)
    return () => {
      window.removeEventListener("mousemove", handleDrag)
      window.removeEventListener("mouseup", stopDragging)
      document.body.removeEventListener("scroll", onPageScrollChange)
    }
  }, [])

  const handleScrollerClick = (e: MouseEventReact<HTMLDivElement>) => {
    const offset = (e.pageX - e.currentTarget.offsetLeft) / SCROLLER_SIZE;
    updatePageScroll(offset)
  }

  return (
    <ScrollerHoverArea $forcedVisible={isDragging.current}>
      <ScrollerWrapper ref={scrollerRef} $offset={offset} onClick={handleScrollerClick}>
        <img 
          src={path`pochita.png`} 
          draggable={false}
          onMouseDown={() => isDragging.current = true}
        />
      </ScrollerWrapper>
    </ScrollerHoverArea>
  )
}
