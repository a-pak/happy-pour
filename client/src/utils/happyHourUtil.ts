import { BarData } from "../model/IbarInterface";
import { HappyHourDTO, WeekDay } from "../model/IHappyHourInterface";

/**
 * Function checks if there is a currently active Happy Hour in the given Bar (BarData). 
 * @param bar BarData interface object
 * @returns Currently active Happy Hour or Null
 */
export function getCurrentHappyHour(bar : BarData): HappyHourDTO | null {
    if (!bar.happyHours) return null;

    const now = new Date();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    // Get current weekday in uppercase format matching your DTO (e.g., "MONDAY")
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    const activeHappyHour = bar.happyHours.find((hh: HappyHourDTO) => {
      // Check if today is in the happy hour's weekDays
      if (!hh.weekDays.includes(currentDay as WeekDay)) return false;

      const [startHour, startMinute] = hh.startTime.split(':').map(Number);
      const [endHour, endMinute] = hh.endTime.split(':').map(Number);
      const startTime = startHour + startMinute / 60;
      const endTime = endHour + endMinute / 60;

      return currentTime >= startTime && currentTime <= endTime; // Boolean to break .find function
    });

    return activeHappyHour ?? null;
  };