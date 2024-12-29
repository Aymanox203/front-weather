import { json } from "@sveltejs/kit";
import { weatherWritable } from "../../../store";

const weatherMap = {
    0: "sunny",
    1: "cloudy",
    2: "snowy",
    3: "rainy"
};

export async function POST(requestEvent) {
    const { request } = requestEvent;
    const body = await request.json();
    const weatherCode = body?.weather;

    // Check if the weather code is defined
    if (weatherCode === undefined) {
        return json({ error: "Weather is not defined" }, { status: 400 });
    }

    // Validate that the weather code is a number and in the valid range
    if ( weatherCode < 0 || weatherCode > 3) {
        return json({ error: "Weather must be a number between 0 and 3" }, { status: 400 });
    }

    // Map the number to a weather type
    const weatherType = weatherMap[weatherCode];

    // Update the writable store
    weatherWritable.update(() => weatherType);

    // Return a success response
    return json({ message: "Weather updated successfully", weather: weatherType });
}

export async function GET() {
    let currentWeather = "";
    weatherWritable.subscribe((value) => { currentWeather = value }); // Get current value of the store
    
    return json({ weather: currentWeather });
}
