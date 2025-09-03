import React, { useState } from "react";
import "./TopStories.scss";

export default function TopStories() {
  const [stories, setStories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setNewStory({ ...newStory, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedStories = [...stories];
      updatedStories[editingIndex] = newStory;
      setStories(updatedStories);
      setEditingIndex(null);
    } else {
      setStories([...stories, newStory]);
    }
    setNewStory({ title: "", description: "", image: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewStory(stories[index]);
  };

  const handleDelete = (index) => {
    const updatedStories = stories.filter((_, i) => i !== index);
    setStories(updatedStories);
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <div className="top-stories">
        <h2>Top Stories</h2>
      <form className="story-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Story Title"
          value={newStory.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newStory.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newStory.image}
          onChange={handleChange}
        />
        <button type="submit">{editingIndex !== null ? "Save" : "Add Story"}</button>
      </form>

      <div className="stories-list">
        {stories.length === 0 ? (
          <p>No stories added yet.</p>
        ) : (
          stories.map((story, index) => (
            <div key={index} className="story-item">
              {story.image && <img src={story.image} alt={story.title} />}
              <h4>{story.title}</h4>
              <p>{story.description}</p>
              <div className="story-actions">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
