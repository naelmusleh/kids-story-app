import { useState } from 'react'

export default function SceneEditor({ scenes, setScenes }) {
  const handleChange = (index, field, value) => {
    const updated = [...scenes]
    updated[index][field] = value
    setScenes(updated)
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Edit Scenes</h3>
      {scenes.map((scene, index) => (
        <div key={index} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          <label>Scene {index + 1} - Setting:</label><br />
          <input value={scene.setting} onChange={e => handleChange(index, 'setting', e.target.value)} /><br />
          <label>Characters:</label><br />
          <input value={scene.characters} onChange={e => handleChange(index, 'characters', e.target.value)} /><br />
          <label>Action:</label><br />
          <textarea value={scene.action} onChange={e => handleChange(index, 'action', e.target.value)} /><br />
        </div>
      ))}
    </div>
  )
}