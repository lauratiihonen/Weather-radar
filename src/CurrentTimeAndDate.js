// Function to retrieve current time and date
function getCurrentTimeAndDate() {
  const dt = new Date();
  const h = dt.getHours().toString().padStart(2, "0");
  const m = dt.getMinutes().toString().padStart(2, "0");
  const d = dt.getDate().toString().padStart(2, "0");
  const mth = (dt.getMonth() + 1).toString().padStart(2, "0");

  // Returning time as HH:MM and date as DD.MM
  const time = `${h}:${m}`;
  const date = `${d}.${mth}.`;

  return { time, date };
}

export default getCurrentTimeAndDate;
