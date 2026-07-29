import { useState, useEffect, useRef } from 'react';
import { dragon9Time } from '../services/Dragon9Time.js';
import { eventBus, EVENTS } from '../services/EventBus.js';

export function useDragon9Clock() {
  const [time, setTime] = useState(dragon9Time.fromStandardDate());
  const intervalRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const d9 = dragon9Time.fromStandardDate();
      setTime(d9);
      eventBus.emit(EVENTS.D9_TICK, d9);

      if (d9.isApex && d9.apexProgress < 0.05) {
        eventBus.emit(EVENTS.D9_APEX_ENTER, d9);
      }
      if (!d9.isApex && time.isApex) {
        eventBus.emit(EVENTS.D9_APEX_EXIT, d9);
      }
      if (d9.cycle !== time.cycle) {
        eventBus.emit(EVENTS.D9_CYCLE_CHANGE, d9);
      }
    };

    update();
    intervalRef.current = setInterval(update, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const display = dragon9Time.formatDisplay(time);
  const nextApex = dragon9Time.getNextApex();

  return { time, display, nextApex };
}
