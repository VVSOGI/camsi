export class MathUtils {
  static getBezierCurve = (t, p0, p1, p2) => {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  };

  static getBezierControlPoint = (t, targetPoint, p0, p2) => {
    if (t === 0.5) {
      return 2 * targetPoint - 0.5 * (p0 + p2);
    }

    const oneMinusT = 1 - t;
    const denominator = 2 * oneMinusT * t;

    return (targetPoint - oneMinusT * oneMinusT * p0 - t * t * p2) / denominator;
  };
}
