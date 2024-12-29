import { writable } from "svelte/store";

export const weatherWritable = writable("sunny");
export const temperatureWritable = writable(20);