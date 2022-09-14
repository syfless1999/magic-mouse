import { useEffect, useRef } from "react";
import animation from './animation';

const MAX_POINTS_LEN = 200; // 内存中最多保存多少点的数据

function App() {
  const canvasRef = useRef();

  useEffect(() => {

    const pointsRef = { current: [] };

    /**
     * 鼠标移动时
     * 1. 把最新的点压入队列中
     * 2. 如果队列过长，做截断处理
     */
    const handleMouseMove = (e) => {
      const { current: points } = pointsRef;
      const point = {
        x: e.x,
        y: e.y,
        birth: Date.now(),
      };

      points.push(point);

      if (points.length > MAX_POINTS_LEN) {
        pointsRef.current = points.slice(MAX_POINTS_LEN  * -1 / 2);
      }
    }

    const handleResize = () => {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove);

    animation(pointsRef);

    return () => {
      // 清理 points 终止 animation
      pointsRef.current = null;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>
    </canvas>
  );
}

export default App;
