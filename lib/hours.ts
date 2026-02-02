type OpeningHoursPeriod = {
    open?: {
        day: number;
        time: string;
    };
    close?: {
        day: number;
        time: string;
    };
};

type OpeningHours = {
    periods?: OpeningHoursPeriod[];
    open_now?: boolean;
};

const VANCOUVER_TIME_ZONE = 'America/Vancouver';
const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

const parseMinutes = (time: string) => {
    const hours = Number(time.slice(0, 2));
    const minutes = Number(time.slice(2));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }
    return hours * 60 + minutes;
};

const getCurrentVancouverMinutes = (now: Date = new Date()) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: VANCOUVER_TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find((part) => part.type === 'weekday')?.value ?? 'Sun';
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
    const dayIndexMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    };
    const dayIndex = dayIndexMap[weekday] ?? 0;
    return dayIndex * MINUTES_PER_DAY + hour * 60 + minute;
};

const parseOpeningHours = (openingHours: any | null): OpeningHours | null => {
    if (!openingHours) {
        return null;
    }
    if (typeof openingHours === 'string') {
        return JSON.parse(openingHours) as OpeningHours;
    }
    return openingHours as OpeningHours;
};

const isOpenFromPeriods = (openingHours: OpeningHours | null, now: Date = new Date()) => {
    if (!openingHours?.periods || openingHours.periods.length === 0) {
        return false;
    }

    const nowMinutes = getCurrentVancouverMinutes(now);
    return openingHours.periods.some((period) => {
        if (!period.open) {
            return false;
        }
        if (!period.close) {
            return true;
        }
        const openMinutes = parseMinutes(period.open.time);
        const closeMinutes = parseMinutes(period.close.time);
        if (openMinutes === null || closeMinutes === null) {
            return false;
        }
        const openTotal = period.open.day * MINUTES_PER_DAY + openMinutes;
        let closeTotal = period.close.day * MINUTES_PER_DAY + closeMinutes;
        if (closeTotal <= openTotal) {
            closeTotal += MINUTES_PER_WEEK;
        }
        const normalizedNow = nowMinutes < openTotal ? nowMinutes + MINUTES_PER_WEEK : nowMinutes;
        return normalizedNow >= openTotal && normalizedNow < closeTotal;
    });
};

export const computeIsOpenNow = (openingHours: any | null, fallback = false, now: Date = new Date()) => {
    try {
        const parsedHours = parseOpeningHours(openingHours);
        if (!parsedHours) {
            return fallback;
        }
        if (parsedHours.periods && parsedHours.periods.length > 0) {
            return isOpenFromPeriods(parsedHours, now);
        }
        if (typeof parsedHours.open_now === 'boolean') {
            return parsedHours.open_now;
        }
        return fallback;
    } catch {
        return fallback;
    }
};

