/** Numeric anchors avoid punctuation, duplicate headings, and non-Latin slug collisions. */
export function createHeadingCollector() {
  const headings = [];
  let index = 0;
  return {
    headings,
    add(depth, text) {
      const id = `section-${++index}`;
      if (depth === 2 || depth === 3) headings.push({ id, depth, text });
      return id;
    }
  };
}

export function seriesNeighbours(slugs, current) {
  const index = slugs.indexOf(current);
  return index < 0 ? { previous: null, next: null } : {
    previous: slugs[index - 1] || null,
    next: slugs[index + 1] || null
  };
}

export function readingProgress(start, end, position) {
  return end <= start ? (position >= end ? 1 : 0) : Math.max(0, Math.min(1, (position - start) / (end - start)));
}
