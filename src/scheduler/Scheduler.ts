import { schedule as scheduleTask, ScheduledTask, validate as validateTask } from 'node-cron'

import { DayOfMonth, DayOfWeek, Hour, Interval, Minute, Month, Range, Second } from '../models'

/**
 * Function that can be run in the scheduler.
 */
type SchedulerFunction = () => void

/**
 * Schedule the task every ___________. i.e. 'every minute'
 */
export type ScheduleWildcard = '*'

/**
 * Schedule market actions ahead of time.
 */
export class Scheduler {
	public static WILDCARD: ScheduleWildcard = '*'

	/**
	 * Run a function on a second-by-second basis.
	 * @param callback The function to call.
	 * @param every The interval, in seconds.
	 */
	public static secondInterval(callback: SchedulerFunction, every: number): ScheduledTask {
		return this.schedule(callback, null, null, null, null, null, new Interval(Scheduler.WILDCARD, every))
	}

	/**
	 * Run a function in a minutely interval.
	 * @param callback The function to call.
	 * @param every The interval, in minutes.
	 */
	public static minuteInterval(callback: SchedulerFunction, every: number): ScheduledTask {
		return this.schedule(callback, null, null, null, null, new Interval(Scheduler.WILDCARD, every))
	}

	/**
	 * Run a function in an hourly interval.
	 * @param callback The function to call.
	 * @param every The interval, in hours.
	 */
	public static hourInterval(callback: SchedulerFunction, every: number): ScheduledTask {
		return this.schedule(callback, null, null, null, new Interval(Scheduler.WILDCARD, every))
	}

	/**
	 * Run a function on a daily basis.
	 * @param callback The function to call.
	 * @param every The interval, in number of days.
	 */
	public static dailyInterval(callback: SchedulerFunction, every: number): ScheduledTask {
		return this.schedule(callback, null, null, new Interval(Scheduler.WILDCARD, every), null, null)
	}

	/**
	 * Schedule a function called precisely at a certain time, range, or interval.
	 * @param callback The function to call.
	 * @param dayOfWeek The day of the week to call the function. Leave undefined or null for every day of the week.
	 * @param month The month to call the function. Leave undefined or null for every month of the year.
	 * @param day The day of the month to call the function. Leave undefined or null for every day of the month.
	 * @param hour The hour of the day to call the function. Leave undefined or null for every hour of the day.
	 * @param minute The minute of the hour to call the function. Leave undefined or null for every minute of every hour.
	 * @param second The second of the minute to call the function. Leave undefined or null for every second of every minute.
	 */
	public static schedule(
		callback: SchedulerFunction,
		dayOfWeek:
			| DayOfWeek
			| Interval<Range<DayOfWeek> | DayOfWeek | ScheduleWildcard>
			| Range<DayOfWeek>
			| ScheduleWildcard
			| null = Scheduler.WILDCARD,
		month:
			| Month
			| Interval<Range<Month> | Month | ScheduleWildcard>
			| Range<Month>
			| ScheduleWildcard
			| null = Scheduler.WILDCARD,
		day:
			| DayOfMonth
			| Interval<Range<DayOfMonth> | DayOfMonth | ScheduleWildcard>
			| Range<DayOfMonth>
			| ScheduleWildcard
			| null = Scheduler.WILDCARD,
		hour:
			| Hour
			| Interval<Range<Hour> | Hour | ScheduleWildcard>
			| Range<Hour>
			| ScheduleWildcard
			| null = Scheduler.WILDCARD,
		minute:
			| Minute
			| Interval<Range<Minute> | Minute | ScheduleWildcard>
			| Range<Minute>
			| ScheduleWildcard
			| null = Scheduler.WILDCARD,
		second?: Second | Interval<Range<Second> | Second | ScheduleWildcard> | Range<Second> | ScheduleWildcard | null,
	): ScheduledTask {
		let cronExpression = ''
		if (second !== undefined) {
			cronExpression += `${second} `
		}
		cronExpression += `${minute == null ? Scheduler.WILDCARD : minute} `
		cronExpression += `${hour == null ? Scheduler.WILDCARD : hour} `
		cronExpression += `${day == null ? Scheduler.WILDCARD : day} `
		cronExpression += `${month == null ? Scheduler.WILDCARD : month} `
		cronExpression += `${dayOfWeek == null ? Scheduler.WILDCARD : dayOfWeek}` // <-- No extra space here
		this.validate(cronExpression)
		return this.perform(callback, cronExpression)
	}

	/**
	 * Validate a CRON expression.
	 * @param cronExpression The CRON expression to validate.
	 */
	private static validate(cronExpression: string): void {
		const isExpressionValid = validateTask(cronExpression)
		if (!isExpressionValid) {
			throw new Error(`Invalid CRON expression: '${cronExpression}'`)
		}
	}

	/**
	 * Schedule a valid CRON expression.
	 * @param callback The function to call.
	 * @param cronExpression The CRON expression to perform.
	 */
	private static perform(callback: SchedulerFunction, cronExpression: string): ScheduledTask {
		return scheduleTask(cronExpression, callback)
	}
}
