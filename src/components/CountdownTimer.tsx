import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endTime: Date | string | number;
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime).getTime() - Date.now();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) {
    return (
      <div className="text-red-600 font-semibold">
        Auction Ended
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="font-semibold">{String(timeLeft.hours).padStart(2, '0')}</span>
      <span>:</span>
      <span className="font-semibold">{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span>:</span>
      <span className="font-semibold">{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}
