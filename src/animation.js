const option = {
  delay: 500,
  count: 20,
};

const CONSTANT = {
  minSmoothCount: 60,
  smoothCount: 2,
};

function cleanPoints(points) {
  const timeThreshold = Date.now() - option.delay;

  const sliceIndex = points.findIndex(p => p.birth >= timeThreshold);
  const newPoints = sliceIndex !== -1 ? points.slice(sliceIndex) : [];


  for (let i = newPoints.length - 1; i > 0; i--) {
    const p = newPoints[i];
    if (p.x === newPoints[i - 1].x && p.y === newPoints[i - 1].y) {
      newPoints.splice(i - 1, 2);
      i--;
    }
  }

  for (let i = newPoints.length - 1; i > 1; i--) {
    const p = newPoints[i];
    if (p.x === newPoints[i - 2].x && p.y === newPoints[i - 2].y) {
      newPoints.splice(i - 1, 2);
      i--;
    }
  }

  return newPoints;
}

function smoothPoints(points, count) {
  const isShrink = count < points.length;
  const smoothCount = Math.max(CONSTANT.minSmoothCount, count);

  if (!isShrink && points.length > smoothCount) return points;

  const sp = [];
  const insertCount = Math.round(smoothCount / points.length) * CONSTANT.smoothCount;

  for (let i = 0; i < points.length - 1; i++) {
    const cur = points[i];
    sp.push(cur);
    const gapX = (points[i + 1].x - cur.x) / insertCount;
    const gapY = (points[i + 1].y - cur.y) / insertCount;

    for (let j = 1; j < insertCount; j++) {
      sp.push({
        x: cur.x + gapX * j,
        y: cur.y + gapY * j,
      });
    }
  }

  const lastItem = points[points.length - 1];
  if (lastItem) {
    sp.push(lastItem);
  }

  if (!isShrink) return sp;

  const step = Math.max(Math.floor(sp.length / count), 1);
  const shrinkPoints = sp.filter((p, i) => i !== 0 && i % step === 0);

  if (lastItem && shrinkPoints[shrinkPoints.length - 1] !== lastItem) {
    shrinkPoints.push(lastItem);
  }

  return shrinkPoints;
}

function draw(points) {

}





function animation(pointsRef) {
  const points = pointsRef.current;

  if (!points) return;

  // 根据点的生成时间、是否重合进行清理
  const cleanedPoints = cleanPoints(points);
  // 根据外界需求对点进行平滑处理，可能使点集变大、也可能缩小
  const smoothedPoints = smoothPoints(cleanedPoints, option.count);

  draw(smoothedPoints);

  requestAnimationFrame(() => {
    animation(pointsRef);
  });
}


export default animation;