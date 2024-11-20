import { ColumnOptions } from "typeorm";
import { add } from 'date-fns';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const defaultPriceColumn: ColumnOptions = { type: 'decimal', precision: 20, scale: 6 };

export const getDefaultPriceValue = (value: number): number => parseFloat(value.toString());

export const toUTCMidnight = (dateString: string, timezone: string): Date => {
    const localDate = new Date(`${dateString}T00:00:00`);

    const utcDate = zonedTimeToUtc(localDate, timezone);
    return utcDate;
};

export const toStartOfDate = (dateString: string, timezone: string): string => {
    return toUTCMidnight(dateString, timezone).toISOString();
}

export const toEndOfDate = (dateString: string, timezone: string): string => {
    const date = toUTCMidnight(dateString, timezone);
    const end = add(date, { hours: 23, minutes: 59, seconds: 59 });
    return end.toISOString();
}

export const utcToLocale = (dateString: string, timezone: string): string => {
    const zonedDate = utcToZonedTime(dateString, timezone);
    return format(zonedDate, 'yyyy-MM-dd');
};