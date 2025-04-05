import { useState } from 'react'
import SceneEditor from '../components/SceneEditor'
import axios from 'axios'
import Nav from '../components/Nav'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CreateStory() {
  const [storyText, setStoryText] = useState('')
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [languages, setLanguages] = useState(['en'])
  const [videoUrl, setVideoUrl] = useState("");
  const supabase = createClientComponentClient()

  const handleParseStory = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/parse-story', {
        story_text: storyText
      })
      const rawScenes = response.data.scenes
      const sceneList = typeof rawScenes === 'string' ? parseGPTOutput(rawScenes) : rawScenes
      setScenes(sceneList)
    } catch (err) {
      console.error(err)
      setMessage('Error parsing story.')
    } finally {
      setLoading(false)
    }
  }

  const parseGPTOutput = (output) => {
    const lines = output.split('\n').filter(Boolean)
    const scenes = []
    let current = {}
    let narrationLines = []

    for (const line of lines) {
      if (line.toLowerCase().includes('scene')) {
        if (Object.keys(current).length) {
          current.narration_text = narrationLines.join(' ')
          scenes.push(current)
        }
        current = { setting: '', characters: '', action: '' }
        narrationLines = [line]
      } else {
        narrationLines.push(line)
        if (line.toLowerCase().includes('setting')) {
          current.setting = line.split(':')[1]?.trim()
        } else if (line.toLowerCase().includes('characters')) {
          current.characters = line.split(':')[1]?.trim()
        } else if (line.toLowerCase().includes('action')) {
          current.action = line.split(':')[1]?.trim()
        }
      }
    }

    if (Object.keys(current).length) {
      current.narration_text = narrationLines.join(' ')
      scenes.push(current)
    }

    return scenes
  }

  const handleSaveStory = async () => {
    const user = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: user.data.user.id,
        title: storyText.slice(0, 40),
        selected_languages: languages,
        status: 'draft'
      }])
    if (!error) setMessage('Story saved!')
    else setMessage('Error saving story.')
  }

  const generateImagesButton = async () => {
    setMessage("Generating images...");
    const updatedScenes = [...scenes];

    for (let i = 0; i < scenes.length; i++) {
      const prompt = `${scenes[i].setting} with ${scenes[i].characters}, ${scenes[i].action}`;
      const response = await axios.post('http://localhost:8000/generate-image', { prompt });

      if (response.data.image_url) {
        updatedScenes[i].image_url = response.data.image_url;
      }
    }

    setScenes(updatedScenes);
    setMessage("Images generated!");
  }

  const handleRenderVideo = async () => {
    const response = await axios.post("http://localhost:8000/render-video", {
      project_id: "story-" + Date.now(),
      scenes,
    });

    console.log(response.data.video_url);
    if (response.data.video_url) {
      setMessage("Video ready!");
      setVideoUrl(response.data.video_url); // <-- use useState for videoUrl
    } else {
      setMessage("Failed to render video.");
    }
  }
  
  return (
    <>
      <Nav />
      <div style={{ padding: 20 }}>
        <h2>Create a New Story</h2>
        <textarea
          rows={6}
          cols={60}
          placeholder="Write or paste your story here..."
          value={storyText}
          onChange={e => setStoryText(e.target.value)}
        /><br />
        <button onClick={handleParseStory} disabled={loading}>
          {loading ? 'Processing...' : 'Parse Story into Scenes'}
        </button>
        {message && <p>{message}</p>}
        {scenes.length > 0 && <>
          <SceneEditor scenes={scenes} setScenes={setScenes} />
            {scenes.map((scene, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <p><strong>Scene {index + 1}</strong></p>
              <p>{scene.setting} — {scene.characters} — {scene.action}</p>
              {scene.image_url && <img src={scene.image_url} alt={`Scene ${index + 1}`} width={400} />}
            </div>
          ))}
          <button onClick={handleSaveStory}>Save Story</button>
          <button onClick={generateImagesButton}>Generate Images</button>
          <button onClick={handleRenderVideo}>Create Video</button>
          {videoUrl && (
            <div>
              <h3>Your Video</h3>
              <video src={videoUrl} controls width="600" />
              <a href={videoUrl} download><button>Download</button></a>
            </div>
          )}
        </>}
      </div>
    </>
  )
}
