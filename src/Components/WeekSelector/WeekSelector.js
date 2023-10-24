import React, { useState } from "react";

function getWeeksInMonth(month, year) {
  const weeks = [];
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  let currentMonday = firstDate;

  while (currentMonday.getDay() !== 1) {
    currentMonday.setDate(currentMonday.getDate() - 1);
  }

  while (currentMonday < lastDate) {
    const week = {};
    week.start = new Date(currentMonday);

    const currentFriday = new Date(currentMonday);
    currentFriday.setDate(currentMonday.getDate() + 6);

    week.end = currentFriday;
    weeks.push(week);

    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  return weeks;
}

function WeekSelector({ onWeekSelected }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const weeks = getWeeksInMonth(currentMonth, currentYear);

  const changeMonth = (event, offset) => {
    event.preventDefault();
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const selectWeek = (event, week) => {
    event.preventDefault();
    const selectedDays = [];
    let currentDay = new Date(week.start);

    while (currentDay <= week.end) {
      selectedDays.push({
        date: currentDay.toDateString(),
        day: DAYS[currentDay.getDay()],
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    onWeekSelected(selectedDays);
  };

  const formatDateWithoutYear = (date) => {
    return `${date.getDate()} ${MONTH[date.getMonth()]}`;
  };

  return (
    <div className="week-selector">
      <button onClick={(e) => changeMonth(e, -1)}>Prev Month</button>
      <span>
        {new Date(currentYear, currentMonth).toLocaleString("default", {
          month: "long",
        })}{" "}
        {currentYear}
      </span>
      <button onClick={(e) => changeMonth(e, 1)}>Next Month</button>

      <div className="weeks">
        {weeks.map((week, index) => (
          <button key={index} onClick={(e) => selectWeek(e, week)}>
            {`${formatDateWithoutYear(week.start)} - ${formatDateWithoutYear(
              week.end,
            )}`}
          </button>
        ))}
      </div>
    </div>
  );
}

const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default WeekSelector;
