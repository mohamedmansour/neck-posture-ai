import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { InferenceType } from './ai'
import Camera from './camera'

interface Score {
  latest: string
  latestLabel: string
  avg: {
    "MoveToTheLeft": number
    "MoveLittleToTheLeft": number
    "Okay": number
    "MoveLittleToTheRight": number
    "MoveToTheRight": number
  },
  total: number
}

function scoreToText(score: string): string {
  switch (score) {
    case 'MoveLittleToTheLeft':
      return 'Move a little more to the left'
    case 'MoveLittleToTheRight':
      return 'Move a little more to the right'
    case 'MoveToTheRight':
      return 'Move more to the right'
    case 'MoveToTheLeft':
      return 'Move more to the left'
    default:
      return 'Great posture!'
  }
}

// The overlay that displays the scores.
function Overlay({ loading, score }) {
  return (
    <div className="overlay">
      <h1>Neck Posture AI {loading && (<span>(requires camera)</span>)}</h1>
      {loading && (
        <div className="loading-wrapper"><div></div><div></div></div>
      )}

      {!loading && (
        <div className="score">
          <h3 className={score.latest}>{score.latestLabel}</h3>
          <div className="statistics">
            <table>
              <tbody>
              {Object.keys(score.avg).map((s, index) => (
                <tr key={index}>
                  <td>{scoreToText(s)}</td>
                  <td>{((score.avg[s] / score.total)*100).toFixed(0)}%</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="footer">
            Created by <a href="https://mohamedmansour.com">mohamed</a> using <a href="https://lobe.ai/">lobe.ai</a>. Read <a href="https://github.com/mohamedmansour/neck-posture-ai.git">source code</a>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState<Score>({
    latest: 'Okay',
    latestLabel: 'Great posture!',
    avg: {
      MoveToTheLeft: 0,
      MoveLittleToTheLeft: 0,
      Okay: 0,
      MoveLittleToTheRight: 0,
      MoveToTheRight: 0
    },
    total: 0
  })

  // Aggregate the scores after every frame change.
  const onFrameChange = (score: InferenceType) => {
    const new_scores = Object.entries(score).sort((a, b) => b[1] - a[1])
    const [top_score_id, top_score_number] =  new_scores[0]

    setScore(score => {
      score.latest = top_score_id
      score.latestLabel = scoreToText(top_score_id)
      score.avg[top_score_id] = score.avg[top_score_id] + 1
      score.total = score.total + 1
      return {...score}
    })
  }

  return (
    <div className="canvas">
      <Camera onFrameChange={onFrameChange} onLoaded={() => setLoading(false)} />
      <Overlay loading={loading} score={score} />
    </div>   
  )
}

ReactDOM.render(<App />, document.getElementById('root'))