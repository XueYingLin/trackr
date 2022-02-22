
export type Person = {
  id: string,
  name: string,
  photoUrl: string,
  expectations: Expectation[],
}

export function getPeople() {
  return [
    {
      id: "caitlin",
      name: "Caitlin",
      photoUrl: "/images/caitlin.jpg",
      expectations: [
        {
          id: "1",
          activityName: "Practice Piano",
          expectedTime: everyDay(30)
        },
        {
          id: "2",
          activityName: "Go to bed before 8:30pm",
          expectedTime: []
        },
        {
          id: "3",
          activityName: "Spin on head three times",
          expectedTime: []
        }
      ]
    },
    {
      id: "michael",
      name: "Michael",
      photoUrl: "/images/michael.jpg",
      expectations: [
        {
          id: "1",
          activityName: "Practice Piano",
          expectedTime: everyDay(30)
        }
      ]
    },
  ]
}

export function getActivities(person: Person, day: Date): Activities {
  return ActivitiesImpl.create(person.expectations, [
    {
      activityId: "3",
      isPassed: true,
    }
  ], day.getDay());
}

export type Expectation = {
  /** Unique id for this activity. */
  id: string,

  /** The name of this activity. E.g. "Play piano" */
  activityName: string,

  /**
   * The amount of time in minutes expected for this activity for the given week day.
   * Sunday = 0. If undefined, this is not a timed activity, and is instead a yes / no.
   */
  expectedTime: number[],
}

export interface Activities {
  getExpectations(): Expectation[];
  isTimeBased(activityId: string): boolean;
  getCompletionState(activityId: string): CompletionState;
  setCompletionState(activityId: string, state: CompletionState): Activities;
}

export enum CompletionState {
  NotStarted,
  InProgress,
  Done,
  Pass
}

/** Represents a set of activities for a given day. */
class ActivitiesImpl implements Activities {
  private expectations: Map<string, Expectation>;
  private activities: Map<string, ActivityLog>;
  private dayOfWeek: number;

  static create(expectations: Expectation[], activities: ActivityLog[], dayOfWeek: number): Activities {
    const activitiesMap = new Map();
    const expectationsMap = new Map();
    for (var activity of activities) {
      activitiesMap.set(activity.activityId, activity);
    }
    for (var expectation of expectations) {
      expectationsMap.set(expectation.id, expectation);
    }

    return new this(expectationsMap, activitiesMap, dayOfWeek);
  }

  createCopy(): ActivitiesImpl {
    return new ActivitiesImpl(new Map(this.expectations), new Map(this.activities), this.dayOfWeek);
  }

  private constructor(expectations: Map<string, Expectation>, activities: Map<string, ActivityLog>, dayOfWeek: number) {
    this.expectations = expectations;
    this.activities = activities;
    this.dayOfWeek = dayOfWeek;
  }

  getTimeSpent(activityId: string) {
    const activity = this.activities.get(activityId);
    if (activity) {
      return activity.timeSpentSeconds;
    }
    return 0;
  }

  isTimeBased(activityId: string) {
    return this.expectations.get(activityId)?.expectedTime[this.dayOfWeek] !== undefined;
  }

  getCompletionState(activityId: string) {
    const activity = this.activities.get(activityId);

    if (activity?.isPassed) {
      return CompletionState.Pass;
    }

    if (this.isTimeBased(activityId)) {
      const expectation = this.expectations.get(activityId);
      if (expectation) {
        const timeSpent = this.getTimeSpent(activityId);
        if (timeSpent && timeSpent >= expectation.expectedTime[this.dayOfWeek] * 60) {
          return CompletionState.Done
        } else if (timeSpent && timeSpent > 0) {
          return CompletionState.InProgress
        }
        return CompletionState.NotStarted
      }
    }
    return activity?.isDone ? CompletionState.Done : CompletionState.NotStarted
  }

  getExpectations() {
    return Array.from(this.expectations.values());
  }

  setCompletionState(activityId: string, state: CompletionState): Activities {
    const copy = this.createCopy();
    let activity = copy.activities.get(activityId);
    if (!activity) {
      activity = {
        activityId
      }
      copy.activities.set(activityId, activity)
    }

    activity.isDone = state === CompletionState.Done;
    activity.isPassed = state === CompletionState.Pass;

    console.log("Done? ", activity.isDone)

    return copy;
  }
}

export type ActivityLog = {
  activityId: string,
  /** Is this activity complete? */
  isDone?: boolean,
  /** Is this activity passed? */
  isPassed?: boolean,
  /** Number of seconds spent so far on this activity. */
  timeSpentSeconds?: number
}

function everyDay(timeMinutes: number) {
  const result = []
  for (var i = 0; i < 7; i++) {
    result.push(timeMinutes);
  }
  return result;
}