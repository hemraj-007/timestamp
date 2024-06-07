type Timestamp = string; // e.g., '2023-04-01T10:00:00Z'

interface Device {
  logged_in: Timestamp;
  logged_out: Timestamp;
  lastSeenAt: Timestamp;
}

interface User {
  id: string;
  devices: Device[];
}

interface MonthlyStats {
  [month: string]: Set<string>;
}

function getMonthFromDate(date: Timestamp): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
}

function calculateMonthlyStats(users: User[]) {
  const loggedInUsers: MonthlyStats = {};
  const activeUsers: MonthlyStats = {};

  users.forEach(user => {
    user.devices.forEach(device => {
      const loggedInMonth = getMonthFromDate(device.logged_in);
      const activeMonth = getMonthFromDate(device.lastSeenAt);

      if (!loggedInUsers[loggedInMonth]) {
        loggedInUsers[loggedInMonth] = new Set();
      }
      loggedInUsers[loggedInMonth].add(user.id);

      if (!activeUsers[activeMonth]) {
        activeUsers[activeMonth] = new Set();
      }
      activeUsers[activeMonth].add(user.id);
    });
  });

  const loggedInUserCounts: { [month: string]: number } = {};
  const activeUserCounts: { [month: string]: number } = {};

  for (const month in loggedInUsers) {
    loggedInUserCounts[month] = loggedInUsers[month].size;
  }

  for (const month in activeUsers) {
    activeUserCounts[month] = activeUsers[month].size;
  }

  return { loggedInUserCounts, activeUserCounts };
}

// Example usage:
const users: User[] = [
  // Populate with user data
];

const stats = calculateMonthlyStats(users);
console.log('Monthly Logged In Users:', stats.loggedInUserCounts);
console.log('Monthly Active Users:', stats.activeUserCounts);
