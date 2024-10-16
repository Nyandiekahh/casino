import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%);
  padding: 20px;
  color: #ffd700;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px 0 0 5px;
  width: 200px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background: #ffd700;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ffed4a;
  }
`;

const NameList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 300px;
`;

const NameItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #ff8c8c;
  }
`;

const NavigationButton = styled(Link)`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background: #4ecdc4;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;

  &:hover {
    background: #45b7d1;
  }
`;

const NameInputPage = () => {
  const [names, setNames] = useState([]);
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const storedNames = localStorage.getItem('wheelNames');
    if (storedNames) {
      setNames(JSON.parse(storedNames));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wheelNames', JSON.stringify(names));
  }, [names]);

  const addName = () => {
    if (inputName.trim() !== '') {
      setNames([...names, inputName.trim()]);
      setInputName('');
    }
  };

  const removeName = (index) => {
    const newNames = names.filter((_, i) => i !== index);
    setNames(newNames);
  };

  return (
    <PageContainer>
      <Title>Add Names to the Wheel</Title>
      <InputContainer>
        <Input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter a name"
        />
        <AddButton onClick={addName}>Add</AddButton>
      </InputContainer>
      <NameList>
        {names.map((name, index) => (
          <NameItem key={index}>
            {name}
            <RemoveButton onClick={() => removeName(index)}>×</RemoveButton>
          </NameItem>
        ))}
      </NameList>
      <NavigationButton to="/wheel">Go to Wheel</NavigationButton>
    </PageContainer>
  );
};

export default NameInputPage;