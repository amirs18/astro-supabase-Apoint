import { Fragment, memo, useCallback, useState } from "react";
import {
  availabilityPreferencesSchema,
  zeroToSixSchema,
  type AvailabilityPreferences,
  type zeroToSixLiteral,
} from "../../lib/zod.schemas";
import axios from "axios";
import _ from "lodash";

function getDayFromNumber(day: number) {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Unknown";
  }
}

function ProviderAvailabilityPreferences({
  availability_preferences,
  providerId,
}: {
  availability_preferences: AvailabilityPreferences;
  providerId: number;
}) {
  const [availabilityPreferencesState, setAvailabilityPreferencesState] =
    useState<AvailabilityPreferences>(availability_preferences);

  const changeStateForOneDay = useCallback(
    (
      day: zeroToSixLiteral,
      availability_preferences_day: AvailabilityPreferences[zeroToSixLiteral],
    ) => {
      setAvailabilityPreferencesState((prev) => {
        if (_.isEqual(prev[day], availability_preferences_day)) {
          return prev;
        }
        return { ...prev, [day]: availability_preferences_day };
      });
    },
    [],
  );

  function handleSubmit(): void {
    axios.patch("/api/provider", {
      availability_preferences: availabilityPreferencesSchema.parse(
        availabilityPreferencesState,
      ),
      id: providerId,
    });
  }

  return (
    <>
      {Array.from({ length: 7 }, (_, i) => i).map((i) => {
        const day = zeroToSixSchema.parse(i);
        return (
          <ProviderAvailabilityPreferencesByDay
            availability_preferences={availabilityPreferencesState}
            day={day}
            changeStateForOneDay={changeStateForOneDay}
            key={day}
          />
        );
      })}
      <button className="btn" onClick={handleSubmit}>
        Update working hours{" "}
      </button>
    </>
  );
}

const ProviderAvailabilityPreferencesByDay = memo(
  function ProviderAvailabilityPreferencesByDay({
    availability_preferences,
    day,
    changeStateForOneDay,
  }: {
    availability_preferences: AvailabilityPreferences;
    day: zeroToSixLiteral;
    changeStateForOneDay: (
      day: zeroToSixLiteral,
      availability_preferences_day: AvailabilityPreferences[zeroToSixLiteral],
    ) => void;
  }) {
    const addNewWindow = useCallback(() => {
      changeStateForOneDay(day, [
        ...availability_preferences[day],
        { endTime: "", startTime: "" },
      ]);
    }, [availability_preferences, day, changeStateForOneDay]);

    return (
      <>
        <div className="">{getDayFromNumber(day)}</div>
        <div className="mx-auto grid grid-cols-4 gap-4">
          {availability_preferences[day].map((timeWindow, i) => (
            <Fragment key={i}>
              <div>
                <label className="block min-w-20 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Start time:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"></div>
                  <input
                    type="time"
                    id={`start-time-${day}-${i}`}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={timeWindow.startTime}
                    onChange={(e) => {
                      changeStateForOneDay(
                        day,
                        availability_preferences[day].map((timeWindow, idx) =>
                          idx === i
                            ? { ...timeWindow, startTime: e.target.value }
                            : timeWindow,
                        ),
                      );
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block min-w-20 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  End time:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none"></div>
                  <input
                    type="time"
                    id={`end-time-${day}-${i}`}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={timeWindow.endTime}
                    required
                    onChange={(e) => {
                      changeStateForOneDay(
                        day,
                        availability_preferences[day].map((timeWindow, idx) =>
                          idx === i
                            ? { ...timeWindow, endTime: e.target.value }
                            : timeWindow,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
            </Fragment>
          ))}
          <button className="btn" onClick={addNewWindow}>
            Add New window
          </button>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to avoid unnecessary re-renders
    return _.isEqual(
      prevProps.availability_preferences[prevProps.day],
      nextProps.availability_preferences[nextProps.day],
    );
  },
);

export {
  ProviderAvailabilityPreferences,
  ProviderAvailabilityPreferencesByDay,
};
