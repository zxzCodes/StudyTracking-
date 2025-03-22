export function convertToMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
  } // convert hours and minutes to total minutes
  
  export function convertFromMinutes(totalMinutes: number): {
    hours: number;
    minutes: number;
  } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  } // convert total minutes to hours and minutes
  
  export function formatMinutes(totalMinutes: number): string {
    const { hours, minutes } = convertFromMinutes(totalMinutes);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  } // format total minutes to human readable string