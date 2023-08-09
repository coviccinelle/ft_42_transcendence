import { useEffect, useRef } from "react"

export const GameZone = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext
    }
  })
}
