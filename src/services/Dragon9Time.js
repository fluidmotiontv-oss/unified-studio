/**
 * Dragon 9 Time System
 * - 1 Dragon Hour = 54 standard minutes
 * - 1 Dragon Day = 26.667 Dragon Hours = 1440 standard minutes (24h)
 * - Two 13-Hour Cycles per day
 * - Two Apex periods of 18 minutes each (9° peak, 1° = 2 min)
 * - Apex accounts for the 0.667 hours (40 min) -> actually 36 min total for both apexes
 * 
 * Wait: 26 hours * 54 min = 1404 min. 1440 - 1404 = 36 min. Two apexes = 2 * 18 = 36 min. ✓
 */

export class Dragon9Time {
  constructor() {
    this.DRAGON_HOUR_MINUTES = 54;
    this.DRAGON_DAY_HOURS = 26;
    this.CYCLE_HOURS = 13;
    this.APEX_MINUTES = 18;
    this.DEGREE_MINUTES = 2;
    this.TOTAL_STANDARD_MINUTES = 1440; // 24h
  }

  /**
   * Convert standard Date to Dragon 9 time
   */
  fromStandardDate(date = new Date()) {
    const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
    const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

    // Calculate Dragon time
    const dragonDayProgress = minutesSinceMidnight / this.TOTAL_STANDARD_MINUTES;

    // Total dragon minutes in a day = 26 * 54 = 1404 dragon minutes + 36 apex minutes
    // But we treat apex as special periods outside the 26 hours
    const standardMinutesToday = minutesSinceMidnight;

    // Determine cycle and position
    let cycle = 1;
    let cycleMinutes = standardMinutesToday;

    // First cycle: 0-702 min (13 * 54)
    // First apex: 702-720 min (18 min)
    // Second cycle: 720-1422 min
    // Second apex: 1422-1440 min

    const firstCycleEnd = this.CYCLE_HOURS * this.DRAGON_HOUR_MINUTES; // 702
    const firstApexEnd = firstCycleEnd + this.APEX_MINUTES; // 720
    const secondCycleEnd = firstApexEnd + firstCycleEnd; // 1422
    const secondApexEnd = secondCycleEnd + this.APEX_MINUTES; // 1440

    let isApex = false;
    let apexProgress = 0;
    let cycleProgress = 0;

    if (standardMinutesToday < firstCycleEnd) {
      cycle = 1;
      cycleMinutes = standardMinutesToday;
      cycleProgress = cycleMinutes / firstCycleEnd;
    } else if (standardMinutesToday < firstApexEnd) {
      cycle = 1;
      isApex = true;
      apexProgress = (standardMinutesToday - firstCycleEnd) / this.APEX_MINUTES;
    } else if (standardMinutesToday < secondCycleEnd) {
      cycle = 2;
      cycleMinutes = standardMinutesToday - firstApexEnd;
      cycleProgress = cycleMinutes / firstCycleEnd;
    } else {
      cycle = 2;
      isApex = true;
      apexProgress = (standardMinutesToday - secondCycleEnd) / this.APEX_MINUTES;
    }

    // Convert cycle minutes to dragon time
    const dragonHour = Math.floor(cycleMinutes / this.DRAGON_HOUR_MINUTES);
    const remainingMinutes = cycleMinutes % this.DRAGON_HOUR_MINUTES;
    const dragonMinute = Math.floor(remainingMinutes);
    const dragonSecond = Math.floor((remainingMinutes - dragonMinute) * 60);

    // Degrees (1° = 2 minutes)
    const totalDegrees = (cycleMinutes / this.DEGREE_MINUTES) % 360;
    const degree = Math.floor(totalDegrees);
    const minuteDegree = Math.floor((totalDegrees - degree) * 60);

    return {
      dragonHour,
      dragonMinute,
      dragonSecond,
      cycle,
      isApex,
      apexProgress,
      cycleProgress,
      degree,
      minuteDegree,
      dayProgress: dragonDayProgress,
      standardTime: date,
      formatted: `${String(dragonHour).padStart(2, '0')}:${String(dragonMinute).padStart(2, '0')}:${String(dragonSecond).padStart(2, '0')}`,
      cycleLabel: `Cycle ${cycle} — ${isApex ? 'APEX' : `H${dragonHour} M${dragonMinute}`}`,
    };
  }

  /**
   * Get next apex time from now
   */
  getNextApex(date = new Date()) {
    const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes();
    const firstApexStart = this.CYCLE_HOURS * this.DRAGON_HOUR_MINUTES;
    const firstApexEnd = firstApexStart + this.APEX_MINUTES;
    const secondApexStart = firstApexEnd + firstApexStart;

    let minutesUntil = 0;
    let whichApex = 1;

    if (minutesSinceMidnight < firstApexStart) {
      minutesUntil = firstApexStart - minutesSinceMidnight;
      whichApex = 1;
    } else if (minutesSinceMidnight < firstApexEnd) {
      minutesUntil = 0;
      whichApex = 1;
    } else if (minutesSinceMidnight < secondApexStart) {
      minutesUntil = secondApexStart - minutesSinceMidnight;
      whichApex = 2;
    } else if (minutesSinceMidnight < secondApexStart + this.APEX_MINUTES) {
      minutesUntil = 0;
      whichApex = 2;
    } else {
      minutesUntil = this.TOTAL_STANDARD_MINUTES - minutesSinceMidnight + firstApexStart;
      whichApex = 1;
    }

    return { minutesUntil, whichApex };
  }

  /**
   * Format for display
   */
  formatDisplay(d9Time) {
    if (d9Time.isApex) {
      return {
        main: 'APEX',
        sub: `${Math.floor(d9Time.apexProgress * 100)}% — ${d9Time.cycle === 1 ? 'First' : 'Second'} Ascension`,
        detail: `9° Peak • ${d9Time.minuteDegree}′`,
        color: '#ffd93d',
      };
    }
    return {
      main: d9Time.formatted,
      sub: `Cycle ${d9Time.cycle} — Hour ${d9Time.dragonHour}/13`,
      detail: `${d9Time.degree}° ${d9Time.minuteDegree}′ • ${Math.floor(d9Time.cycleProgress * 100)}%`,
      color: '#00f5ff',
    };
  }
}

export const dragon9Time = new Dragon9Time();
