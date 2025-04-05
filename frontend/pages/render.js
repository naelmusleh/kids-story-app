import { useState } from 'react'
import axios from 'axios'
import Nav from '../components/Nav'

export default function GenerateVideo() {
  const [projectId, setProjectId] = useState('')
  const [languages, setLanguages] = useState(['en'])
  const [message, setMessage] = useState('')
  const [videoUrls, setVideoUrls] = useState([])

  const handleGenerateVideo = async () => {
    setMessage('Rendering video...')
    try {
      const response = await axios.post('http://localhost:8000/render-video', {
        project_id: projectId,
        languages: languages
      })
      setVideoUrls(response.data.videos)
      setMessage('Video(s) ready!')
    } catch (err) {
      console.error(err)
      setMessage('Error generating video.')
    }
  }

  return (
    <>
      <Nav />
      <div style={{ padding: 20 }}>
        <h2>Render Final Video</h2>
        <input
          type="text"
          placeholder="Enter Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        /><br />
        <label>Select Languages:</label><br />
        <select multiple value={languages} onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value)
          setLanguages(selected)
        }}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
          <option value="fr">French</option>
        </select><br /><br />
        <button onClick={handleGenerateVideo}>Generate Final Video</button>
        <p>{message}</p>
        {videoUrls.map((url, idx) => (
          <div key={idx}>
            <p>Language: {languages[idx]}</p>
            <video width="400" controls>
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video><br />
            <a href={url} download>Download Video</a>
          </div>
        ))}
      </div>
    </>
  )
}