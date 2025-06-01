"use client";
import { useState, useEffect } from "react";
import MatchTracker from "@/components/MatchTracker";
import GameWeekSelector from "@/components/GameWeekSelector";
import { fetchFixtures, processFixtures } from "@/lib/api/footballApi";
import styles from "@/styles/page.module.css";
import "@/styles/global.css";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [gameWeeks, setGameWeeks] = useState([]);
  const [selectedGameWeek, setSelectedGameWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and process data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchFixtures();
        const { gameWeeks, currentRound, matches } = processFixtures(data);

        setGameWeeks(gameWeeks);
        setSelectedGameWeek(currentRound);
        setAllMatches(matches);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const intervalId = setInterval(loadData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter matches by game week
  useEffect(() => {
    if (selectedGameWeek && allMatches.length > 0) {
      setMatches(
        allMatches.filter((match) => match.gameWeek === selectedGameWeek)
      );
    }
  }, [selectedGameWeek, allMatches]);

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    acc[match.date] = [...(acc[match.date] || []), match];
    return acc;
  }, {});

  // Render
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const gameWeekNumber = selectedGameWeek
    ? selectedGameWeek.split(" - ")[1]
    : "";

  const handleGameWeekChange = (gameWeek) => {
    setSelectedGameWeek(gameWeek);
  };
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Premier League</h1>

        <div className={styles.gameWeekContainer}>
          <div className={styles.gameWeek}>Game Week {gameWeekNumber}</div>
          <GameWeekSelector
            gameWeeks={gameWeeks}
            selectedGameWeek={selectedGameWeek}
            onGameWeekChange={handleGameWeekChange}
          />
        </div>

        {Object.keys(matchesByDate).length > 0 ? (
          <MatchTracker matchesByDate={matchesByDate} />
        ) : (
          <div className={styles.noMatches}>
            No matches found for the selected game week.
          </div>
        )}
      </div>
    </main>
  );
}
