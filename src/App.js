import React, { useState, useEffect, useCallback } from 'react';
import { FiThumbsUp, FiTrash2 } from 'react-icons/fi';

import API from './services/api';

import './styles.css';

const App = () => {
  const [repositories, setRepositories] = useState([]);

  const [formData, setFormData] = useState({ title: '', url: '', techs: [] });

  useEffect(() => {
    API.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  const handleAddRepository = useCallback(
    async event => {
      event.preventDefault();

      const response = await API.post('repositories', {
        title: formData.title,
        url: formData.url,
        techs: formData.techs,
      });

      setRepositories([...repositories, response.data]);
      setFormData({ title: '', url: '', techs: [] });
    },
    [repositories, formData],
  );

  const handleRemoveRepository = useCallback(async id => {
    await API.delete(`repositories/${id}`);

    setRepositories(previousState => {
      return previousState.filter(repository => repository.id !== id);
    });
  }, []);

  const handleLikeRepository = useCallback(async id => {
    await API.post(`repositories/${id}/like`);
  }, []);

  const handleInputChange = useCallback(
    event => {
      const { name, value } = event.target;

      if (name === 'techs') {
        const techsArray = value.split(',');
        setFormData({ ...formData, [name]: techsArray });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    },
    [formData],
  );

  return (
    <div className='container'>
      <form onSubmit={handleAddRepository}>
        <fieldset>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='title'>Titulo</label>
              <input
                type='text'
                name='title'
                id='title'
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='url'>URL</label>
              <input
                type='text'
                name='url'
                id='url'
                onChange={handleInputChange}
              />
            </div>

            <div className='field'>
              <label htmlFor='techs'>Tecnologias</label>
              <input
                type='text'
                name='techs'
                id='techs'
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <button type='submit'>Adicionar</button>
      </form>

      <ul className='repository-list' data-testid='repository-list'>
        {repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleLikeRepository(repository.id)}>
              Like
              <FiThumbsUp />
            </button>

            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
