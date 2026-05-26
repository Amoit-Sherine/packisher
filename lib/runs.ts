// Run times
// Mid-morning run: dispatches at 10:00am, cutoff 8:30am
// Evening run: dispatches at 5:30pm, cutoff 3:30pm
// Urgent: available until 4:30pm closing, dispatched within 1 hour, no guarantee
// After 4:30pm: closed, next available day only

export type RunSlot = "morning" | "evening" | "urgent" | "next_day";

export function assignRunSlot(
  timing: string,
  now: Date,
): {
  slot: RunSlot;
  dispatchTime: Date | null;
  message: string;
  eligible: boolean;
} {
  const timeInMinutes = now.getHours() * 60 + now.getMinutes();

  const MORNING_CUTOFF  = 8 * 60 + 30;   // 8:30am
  const EVENING_CUTOFF  = 15 * 60 + 30;  // 3:30pm
  const CLOSING_TIME    = 16 * 60 + 30;  // 4:30pm

  if (timing === "urgent") {
    if (timeInMinutes > CLOSING_TIME) {
      return {
        slot: "next_day", dispatchTime: null, eligible: false,
        message: "We are closed. Urgent bookings accepted until 4:30pm.",
      };
    }
    const dispatch = new Date(now);
    dispatch.setMinutes(dispatch.getMinutes() + 60);
    return {
      slot: "urgent", dispatchTime: dispatch, eligible: true,
      message: "Urgent — rider dispatched within 1 hour. No delivery guarantee.",
    };
  }

  if (timing === "same_day") {
    if (timeInMinutes > CLOSING_TIME) {
      return {
        slot: "next_day", dispatchTime: null, eligible: false,
        message: "Same day bookings are closed. Please schedule for tomorrow.",
      };
    }
    if (timeInMinutes > EVENING_CUTOFF) {
      return {
        slot: "next_day", dispatchTime: null, eligible: false,
        message: "Evening run is closed. Please book urgent or schedule for tomorrow.",
      };
    }
    if (timeInMinutes <= MORNING_CUTOFF) {
      const dispatch = new Date(now);
      dispatch.setHours(10, 0, 0, 0);
      return {
        slot: "morning", dispatchTime: dispatch, eligible: true,
        message: "On the mid-morning run — dispatching at 10:00am.",
      };
    }
    const dispatch = new Date(now);
    dispatch.setHours(17, 30, 0, 0);
    return {
      slot: "evening", dispatchTime: dispatch, eligible: true,
      message: "On the evening run — dispatching at 5:30pm.",
    };
  }

  // scheduled — customer picked a date
  return {
    slot: "morning", dispatchTime: null, eligible: true,
    message: "Scheduled for your chosen date.",
  };
}
