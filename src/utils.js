// Utility function to generate a symmetrical C-shape pattern for any n >= 5
export function generateSymmetricalCShapePattern(n) {
  // 1. Find the best row count for a square-like C
  let bestRows = 3, minDiff = n;
  for (let rows = 3; rows <= n; rows++) {
    const spine = rows - 2;
    const remaining = n - spine;
    if (remaining < 2) continue;
    const top = Math.ceil(remaining / 2);
    const bottom = Math.floor(remaining / 2);
    const maxRowLen = Math.max(top, bottom, 1);
    const diff = Math.abs(maxRowLen - rows);
    if (diff < minDiff) {
      minDiff = diff;
      bestRows = rows;
    }
  }

  // 2. Calculate top, bottom, and spine rows
  const spineRows = bestRows - 2;
  let remaining = n - spineRows;
  let top = Math.ceil(remaining / 2);
  let bottom = Math.floor(remaining / 2);

  // 3. Build the pattern
  const pattern = [
    Array(top).fill(1),
    ...Array(spineRows).fill([1]),
    Array(bottom).fill(1)
  ];

  // 4. If top and bottom are not equal, move a box to a new spine row in the middle
  if (top !== bottom) {
    if (top > bottom) {
      pattern[0].pop();
    } else {
      pattern[pattern.length - 1].pop();
    }
    const insertAt = Math.floor(pattern.length / 2);
    pattern.splice(insertAt, 0, [1]);
  }

  return pattern;
} 