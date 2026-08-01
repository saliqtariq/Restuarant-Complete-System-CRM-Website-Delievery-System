type ReservationSlot = {
  reservation_time: string;
};

export function countOverlappingBookings(
  reservations: ReservationSlot[],
  slotMinutes: number,
  slotDuration: number
): number {
  const windowStart = slotMinutes - slotDuration;
  const windowEnd = slotMinutes + slotDuration;

  return reservations.filter((r) => {
    const [h, m] = r.reservation_time.split(":").map(Number);
    const mins = h * 60 + m;
    return mins > windowStart && mins < windowEnd;
  }).length;
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
