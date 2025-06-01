import styles from "@/styles/MatchTracker.module.css";

export default function MatchTracker({ matchesByDate }) {
  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Sort dates in chronological order
  const sortedDates = Object.keys(matchesByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className={styles.matchTracker}>
      {sortedDates.map((date) => (
        <div key={date} className={styles.dateGroup}>
          <h2 className={styles.dateHeading}>{formatDate(date)}</h2>

          <div className={styles.matchesList}>
            {matchesByDate[date].map((match) => (
              <div
                key={match.id}
                className={`${styles.matchCard} ${
                  match.status === "LIVE"
                    ? styles.liveMatch
                    : match.status === "FINISHED"
                    ? styles.finishedMatch
                    : styles.scheduledMatch
                }`}
              >
                <div className={styles.matchStatus}>
                  {match.status === "LIVE" && (
                    <span className={styles.liveIndicator}>
                      ● LIVE {match.time}&apos;
                    </span>
                  )}
                  {match.status === "FINISHED" && "Full Time"}
                  {match.status === "SCHEDULED" && "Upcoming"}
                </div>

                <div className={styles.matchTeams}>
                  <div className={styles.team}>
                    <span className={styles.teamName}>{match.homeTeam}</span>
                    <span className={styles.score}>{match.homeScore}</span>
                  </div>

                  <div className={styles.team}>
                    <span className={styles.teamName}>{match.awayTeam}</span>
                    <span className={styles.score}>{match.awayScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
