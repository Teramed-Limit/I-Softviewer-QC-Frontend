import { format, parse } from 'date-fns';

export default function formatDA(date, strFormat = 'MMM d, yyyy') {
    if (!date) {
        return;
    }

    // Goal: 'Apr 5, 1999'
    try {
        const parsedDateTime = parse(date, 'yyyyMMdd', new Date());
        return format(parsedDateTime, strFormat);
    } catch (err) {
        // swallow?
    }
}
