import React, { useState, useEffect } from "react";
import { FiThumbsUp, FiTrash2 } from "react-icons/fi";

import API from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    techs: [],
  });

  useEffect(() => {
    API.get("repositories").then((response) => {
      console.log("GET repositories response: ", response);
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    console.log("form data: ", formData);
    const response = await API.post("repositories", {
      title: formData.title,
      url: formData.url,
      techs: formData.techs,
    });
    console.log("POST repositories response: ", response);
    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    await API.delete(`repositories/${id}`);
    setRepositories((previousState) => {
      return previousState.filter((repository) => repository.id !== id);
    });
  }

  async function handleLikeRepository(id) {
    await API.post(`repositories/${id}/like`);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    if (name === "techs") {
      console.log("techs - value: ", value);
      const techsArray = value.split(",");
      console.log(techsArray);
      setFormData({ ...formData, [name]: techsArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleAddRepository}>
        <fieldset>
          <div className="field-group">
            <div className="field">
              <label htmlFor="title">Titulo</label>
              <input
                type="text"
                name="title"
                id="title"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="url">URL</label>
              <input
                type="text"
                name="url"
                id="url"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="techs">Tecnologias</label>
              <input
                type="text"
                name="techs"
                id="techs"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <button type="submit">Adicionar</button>
      </form>

      <ul className="repository-list" data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <FiThumbsUp onClick={() => handleLikeRepository(repository.id)} />
            <FiTrash2 onClick={() => handleRemoveRepository(repository.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
