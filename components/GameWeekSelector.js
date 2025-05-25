"use client";

import styles from "@/styles/GameWeekSelector.module.css";

export default function GameWeekSelector({
  gameWeeks,
  selectedGameWeek,
  onGameWeekChange,
}) {
  const handleChange = (e) => {
    onGameWeekChange(e.target.value);
  };

  // Format game week for display in dropdown
  const formatGameWeek = (gameWeek) => {
    const parts = gameWeek.split(" - ");
    return `GW ${parts[1]}`;
  };

  return (
    <div className={styles.selectorContainer}>
      <select
        className={styles.selector}
        value={selectedGameWeek || ""}
        onChange={handleChange}
      >
        {gameWeeks.map((gameWeek) => (
          <option key={gameWeek} value={gameWeek}>
            {formatGameWeek(gameWeek)}
          </option>
        ))}
      </select>
    </div>
  );
}
