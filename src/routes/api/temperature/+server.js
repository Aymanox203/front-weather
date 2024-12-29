import { json } from "@sveltejs/kit"
import { temperatureWritable } from "../../../store"

export async function POST(requestEvent){
    const { params, request } = requestEvent;
    const body = await request.json();
    const temp = body?.temperature;
    
    // Check if the temperature is defined
    if (temp === undefined) {
        return json({ error: "Temperature is not defined" }, { status: 400 });
    }
    // Check if the temperature is within the valid range
    if (typeof temp !== "number" || temp < -40 || temp > 80) {
        return json({ error: "Temperature must be a number between -40 and 80" }, { status: 400 });
    }
    
    // Update the writable store
    temperatureWritable.update(()=>temp);
    


    // Return a success response
    return json({ message: "Temperature updated successfully", temperature: temp });
}

export async function GET() {
    let temp = 0;
    temperatureWritable.subscribe((value)=>{temp = value}); // Get current value of the store
    return json({ temperature: temp });
}