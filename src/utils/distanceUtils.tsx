export interface Coordinates {
    latitude: number;
    longitude: number;
}

interface ShiftedCoordinates {
    halfOne: Coordinates;
    halfTwo: Coordinates;
}

function calcPerpendicularSlope(personA: Coordinates, personB: Coordinates) {
    const slope =
        (personB.longitude - personA.longitude) /
        (personB.latitude - personA.latitude);
    return -1 / slope;
}

export function addDistanceToCenterCoords(
    personA: Coordinates,
    personB: Coordinates,
    center: Coordinates,
    radius: number,
    flexibility: number
): ShiftedCoordinates {
    const diameter = radius * 2 * flexibility;
    // angle should be the slope of the perpendicular line that connects personA and personB
    // we add pi to get the other side of the line
    let angle = Math.atan(calcPerpendicularSlope(personA, personB));

    // calculate the coordinates of a line that is pointed in the direction of angle, traversing it n meters
    // we want to search a new area so we go the full diameter of the search area
    const halfOneShiftedX =
        center.longitude + (diameter / 111111) * Math.cos(angle);
    const halfOneShiftedY =
        center.latitude + (diameter / 111111) * Math.sin(angle);

    const halfTwoShiftedX =
        center.longitude + (diameter / 111111) * Math.cos(angle + Math.PI);
    const halfTwoShiftedY =
        center.latitude + (diameter / 111111) * Math.sin(angle + Math.PI);

    const halfOne: Coordinates = {
        latitude: halfOneShiftedY,
        longitude: halfOneShiftedX,
    };
    const halfTwo: Coordinates = {
        latitude: halfTwoShiftedY,
        longitude: halfTwoShiftedX,
    };

    return { halfOne, halfTwo };
}
