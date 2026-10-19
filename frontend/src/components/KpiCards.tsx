type KpiCardsProps = {
  totalTeachers: number
  averageScore: number
  highestScore: number
  highPerformers: number
}

function KpiCards({
  totalTeachers,
  averageScore,
  highestScore,
  highPerformers
}: KpiCardsProps) {
  return (
    <div className="kpi-grid">
      <div>
        <h3>Total Teachers</h3>
        <p>{totalTeachers}</p>
      </div>

      <div>
        <h3>Average Score</h3>
        <p>{averageScore.toFixed(1)}</p>
      </div>

      <div>
        <h3>Highest Score</h3>
        <p>{highestScore}</p>
      </div>

      <div>
        <h3>90+ Teachers</h3>
        <p>{highPerformers}</p>
      </div>
    </div>
  )
}

export default KpiCards