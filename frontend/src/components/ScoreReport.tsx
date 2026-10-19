type ScoreReportProps = {
  excellentTeachers: number
  goodTeachers: number
  needsSupportTeachers: number
  totalTeachers: number
}

function ScoreReport({
  excellentTeachers,
  goodTeachers,
  needsSupportTeachers,
  totalTeachers
}: ScoreReportProps) {

  const getPercentage = (count: number) => {
    if (totalTeachers === 0) return 0

    return (count / totalTeachers) * 100
  }

  return (
    <>
      <h2>Score Report</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Teachers</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Excellent (90+)</td>
              <td>{excellentTeachers}</td>
              <td>{getPercentage(excellentTeachers).toFixed(1)}%</td>
            </tr>

            <tr>
              <td>Good (80-89)</td>
              <td>{goodTeachers}</td>
              <td>{getPercentage(goodTeachers).toFixed(1)}%</td>
            </tr>

            <tr>
              <td>Needs Support (&lt;80)</td>
              <td>{needsSupportTeachers}</td>
              <td>{getPercentage(needsSupportTeachers).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ScoreReport