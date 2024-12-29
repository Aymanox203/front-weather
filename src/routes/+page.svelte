<script>
    import { onMount } from "svelte";
    import { weatherWritable, temperatureWritable } from "../store";
    

    // new script

    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let dateText = now.toLocaleDateString(undefined, options);    
    let temperature = $state(20);
    temperatureWritable.subscribe((value)=>{temperature = value;})
    let time = $state('')
    let weather = $state("sunny");
    weatherWritable.subscribe((value)=>{weather = value;})
    let icon = $state('icons/sun.png');
    let suggestion = $state('');

    $effect(()=>{
        switch (weather) {
            case "sunny":
                icon = "icons/sun.png"; 
                suggestion = Number(temperature) >= 30 ? "It's hot! Wear light clothes like T-shirts and shorts." : "Sunny weather! Dress comfortably.";
                break;
            case "cloudy":
                icon = "icons/windy.png";
                suggestion = Number(temperature) >= 20 ? "It's cloudy but warm. Wear a windbreaker." : "cloudy and cold. Wear a warm jacket.";
                break;
            case "snowy":
                icon = "icons/snow.png"; 
                suggestion = "It's snowy! Wear a heavy coat, gloves, and boots.";
                break;
            case "rainy":
                icon = "icons/rain.png"; 
                suggestion = "It's rainy. Don't forget a waterproof jacket and an umbrella.";
                break;
            default:
                icon = "";
                suggestion = "Please select a valid weather type.";
                break;
        }
    })

    const testApi = async function(){
        const temp = temperature+1;
        const weatherCode = 1
        await fetch("/api/temperature",{
            headers:{'Content-Type': 'application/json'},
            method:"POST",
            body:JSON.stringify({"temperature":-20})
        });
        await fetch("/api/weather",{
            headers:{'Content-Type': 'application/json'},
            method:"POST",
            body:JSON.stringify({"weather":0})
        });
    }
    let failureCount = 0;
    const maxFailures = 5; 
    

    // Fetch temperature every 2 seconds
    onMount(()=>{
        const fetchData = async function() { 
        try {
            const response = await fetch('/api/temperature'); // Adjust path to your server endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch temperature');
            }
            const data = await response.json();

            // Update the writable store
            // temperatureWritable.set(data.temperature);
            temperature = data.temperature;
        } catch (error) {
            failureCount++;
            console.error('Error fetching temperature:', error);

            if (failureCount >= maxFailures) {
                console.error('Max failures reached. Stopping fetch.');
                clearInterval(intervalRef);
            }
        }
        try {
            const response = await fetch('/api/weather'); // Adjust path to your server endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch weather');
            }
            const data = await response.json();

            // Update the writable store
            weather = data.weather
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }
        const intervalRef = setInterval(fetchData, 1000);
    })

</script>

    <!-- svelte-ignore css_unused_selector -->
    <style>

.full-screen-background {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
}


.container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background: rgba(30, 30, 30, 0.9); /* Slight transparency */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    z-index: 1;
}

h1 {
    color: #ffffff;
}

.date {
    font-size: 24px;
    margin: 10px 0;
    color: #cccccc;
}

.temperature {
    font-size: 32px;
    margin: 10px 0;
    font-weight: bold;
    color: #f39c12;
}

/* select, input[type="number"] {
    width: 80%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #2a2a2a;
    color: #ffffff;
} */

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
} 

.icon img {
    margin: 20px 0;
    width: 80px;
    height: 80px;
}

.suggestion {
    font-size: 18px;
    color: #cccccc;
}

.credits {
    margin-top: 20px;
    font-size: 14px;
    color: #888888;
}

        
    </style>

<div class="full-screen-background" style={`background-image: url('icons/wall.jpg');`}>
    <div class="container">
        <h1>Weather Sensor Project</h1>
        <div class="date">{dateText}</div>
        <div class="temperature">{temperature} °C</div>
        <!-- <button onclick={testApi}>Test API</button> -->
        <div class="icon" id="weatherIcon">
            <img src={icon} alt="Weather Icon" id="weatherImg">
        </div>
        <div class="suggestion" id="clothingSuggestion">{suggestion}</div>
        <div class="credits">Designed by Chabab </div>
    </div>
</div>


