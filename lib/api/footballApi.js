const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const HOST = process.env.NEXT_PUBLIC_API_HOST;

const headers = {
  "x-rapidapi-key": API_KEY,
  "x-rapidapi-host": HOST,
};

// Get current season
const getCurrentSeason = () => {
  const currentYear = new Date().getFullYear();
  return new Date().getMonth() < 6 ? currentYear - 1 : currentYear;
};

// Fetch all fixtures for Premier League
export const fetchFixtures = async () => {
  const season = getCurrentSeason();
  const response = await fetch(
    `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=${season}`,
    { method: "GET", headers }
  );
  return response.json();
};

// Process raw API data into clean format
export const processFixtures = (data) => {
  if (!data.response) throw new Error("No fixtures found");

  // Extract and sort game weeks
  const rounds = new Set();
  data.response.forEach((fixture) => {
    if (fixture.league?.round) rounds.add(fixture.league.round);
  });

  const sortedGameWeeks = Array.from(rounds).sort((a, b) => {
    const numA = parseInt(a.split(" - ")[1]);
    const numB = parseInt(b.split(" - ")[1]);
    return numA - numB;
  });

  // Find current game week
  const now = new Date();
  let currentRound = null;

  // Logic to determine current round
  const liveMatch = data.response.find((fixture) =>
    ["1H", "2H", "HT"].includes(fixture.fixture.status.short)
  );

  if (liveMatch) {
    currentRound = liveMatch.league.round;
  } else {
    // If no live match, find the next upcoming match
    const upcomingMatches = data.response
      .filter((fixture) => new Date(fixture.fixture.date) > now)
      .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    if (upcomingMatches.length > 0) {
      currentRound = upcomingMatches[0].league.round;
    } else {
      // If no upcoming matches, use the last played round
      const pastMatches = data.response
        .filter((fixture) => fixture.fixture.status.short === "FT")
        .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));

      if (pastMatches.length > 0) {
        currentRound = pastMatches[0].league.round;
      } else {
        // Fallback to first round
        currentRound = sortedGameWeeks[0];
      }
    }
  }

  // Process matches
  const processedMatches = data.response.map((fixture) => ({
    id: fixture.fixture.id,
    date: new Date(fixture.fixture.date).toISOString().split("T")[0],
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeScore: fixture.goals.home ?? 0,
    awayScore: fixture.goals.away ?? 0,
    status: ["FT", "AET", "PEN"].includes(fixture.fixture.status.short)
      ? "FINISHED"
      : ["1H", "2H", "HT"].includes(fixture.fixture.status.short)
      ? "LIVE"
      : "SCHEDULED",
    time: fixture.fixture.status.elapsed || "0",
    gameWeek: fixture.league.round,
  }));

  return {
    gameWeeks: sortedGameWeeks,
    currentRound,
    matches: processedMatches,
  };
};
