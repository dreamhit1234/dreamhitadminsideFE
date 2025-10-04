import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TopStories.scss";

export default function TopStories() {
  const [stories, setStories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    image: "",
  });

  // ✅ Fetch stories from backend when component loads
  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/topstories");
      setStories(res.data);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  const handleChange = (e) => {
    setNewStory({ ...newStory, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update story in backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // update
        await axios.put(`http://localhost:8080/topstories/${editingId}`, newStory);
      } else {
        // create
        await axios.post("http://localhost:8080/topstories", newStory);
      }
      setNewStory({ title: "", description: "", image: "" });
      setEditingId(null);
      fetchStories(); // refresh list
    } catch (err) {
      console.error("Error saving story:", err);
    }
  };

  // ✅ Edit existing story
  const handleEdit = (story) => {
    setEditingId(story.id);
    setNewStory({
      title: story.title,
      description: story.description,
      image: story.image,
    });
  };

  // ✅ Delete story from backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/topstories/${id}`);
      fetchStories();
    } catch (err) {
      console.error("Error deleting story:", err);
    }
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
        <button type="submit">
          {editingId ? "Save Changes" : "Add Story"}
        </button>
      </form>

      <div className="stories-list">
        {stories.length === 0 ? (
          <p>No stories added yet.</p>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="story-item">
              {story.image && <img src={story.image} alt={story.title} />}
              <h4>{story.title}</h4>
              <p>{story.description}</p>
              <div className="story-actions">
                <button onClick={() => handleEdit(story)}>Edit</button>
                <button onClick={() => handleDelete(story.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
