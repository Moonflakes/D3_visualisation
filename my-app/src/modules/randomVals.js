export function randomVal(min, max) {
    return min + Math.round(Math.random() * (max - min));
}

export function points(length = 10, yMin = 0, yMax = 10) {
    return new Array(length).fill().map((p, x) => {
        return {
            x: x,
            y: randomVal(yMin, yMax)
        }
    });
}

export function collection(nbLines = 3, nbPoints, yMin, yMax) {
    return new Array(nbLines).fill().map(l => {
        return points(nbPoints, yMin, yMax);
    });
}