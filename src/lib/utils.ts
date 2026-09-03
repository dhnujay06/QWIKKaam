export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getInitials(name: string): string {
  if (!name) return '';
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ').trim();
}

export function getTimeSlots(): { label: string; value: string }[] {
  const slots: { label: string; value: string }[] = [];
  let startHour = 7; // 7 AM
  const endHour = 19; // 7 PM

  while (startHour <= endHour) {
    const ampm = startHour >= 12 ? 'PM' : 'AM';
    const hour12 = startHour > 12 ? startHour - 12 : startHour;
    const nextHour12 = startHour + 1 > 12 ? startHour + 1 - 12 : startHour + 1;
    const nextAmpm = startHour + 1 >= 12 ? (startHour + 1 === 24 ? 'AM' : 'PM') : 'AM';
    
    slots.push({
      label: `${hour12}:00 ${ampm} - ${nextHour12}:00 ${nextAmpm}`,
      value: `${startHour}:00`
    });
    
    startHour++;
  }
  
  return slots;
}
