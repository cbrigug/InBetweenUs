import { environment } from "../../environment.dev";
import { Coordinates } from "./distanceUtils";
import { CapacitorHttp } from "@capacitor/core";

const GOOGLE_API_KEY = environment.REACT_APP_GOOGLE_API_KEY;

export async function findMidpoint(
    personA: Coordinates,
    personB: Coordinates
): Promise<Coordinates> {
    try {
        // Define the starting and destination locations as coordinates
        const startLocation = personA;
        const destinationLocation = personB;

        // Define the departure time as next day at 4:00 AM UTC (optimal conditions)
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setUTCHours(4, 0, 0, 0);
        const departureTime = Math.floor(currentDate.getTime() / 1000);

        // Construct the URL for the Directions API request
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&mode=driving&departure_time=${departureTime}&traffic_model=optimistic&key=${GOOGLE_API_KEY}`;

        const response = await CapacitorHttp.get({ url });
        const route = response.data.routes[0];
        let accumulatedDistance = 0;
        let furthestCoordinates: Coordinates = { latitude: 0, longitude: 0 };

        const middleDistanceMeters = route.legs[0].distance.value / 2;

        // Iterate through the route's steps
        for (const step of route.legs[0].steps) {
            const stepDistance = step.distance.value || 0;
            accumulatedDistance += stepDistance;

            // If accumulated distance exceeds the maximum distance, break the loop
            if (accumulatedDistance > middleDistanceMeters) {
                // Calculate the proportion of the step to the maximum distance
                const proportion =
                    (middleDistanceMeters -
                        (accumulatedDistance - stepDistance)) /
                    stepDistance;

                // Calculate the coordinates at the specified proportion of the step
                const lat =
                    step.start_location.lat +
                    proportion *
                        (step.end_location.lat - step.start_location.lat);
                const lng =
                    step.start_location.lng +
                    proportion *
                        (step.end_location.lng - step.start_location.lng);

                furthestCoordinates = { latitude: lat, longitude: lng };
                break;
            }
        }

        return furthestCoordinates;
    } catch (error) {
        console.error("Error fetching directions:", error);
        throw error;
    }
}
