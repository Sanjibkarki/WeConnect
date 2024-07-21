import React, { useState } from 'react';

const Service = () => {
  const [numStudents, setNumStudents] = useState(0);
  const [studentNames, setStudentNames] = useState([]);

  const handleNumStudentsChange = (e) => {
    let num = parseInt(e.target.value, 10) || 0;
    if (num > 50) num = 50;
    setNumStudents(num);

    // Initialize or adjust the studentNames array length
    setStudentNames(Array(num).fill(''));
  };

  const handleStudentNameChange = (index, value) => {
    const newStudentNames = [...studentNames];
    newStudentNames[index] = value;
    setStudentNames(newStudentNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Student names:', studentNames);
  };

  return (
    <form className='form-student' onSubmit={handleSubmit}>
      <div>
        <label>Number of Students:</label>
        <input max={50} min={0}
          type="number" 
          value={numStudents} 
          onChange={handleNumStudentsChange} 
        />
      </div>
      
      {Array.from({ length: numStudents }, (_, index) => (
        <div key={index}>
          <label>Student {index + 1} Name:</label>
          <input 
            type="text"
            value={studentNames[index]} 
            onChange={(e) => handleStudentNameChange(index, e.target.value)} 
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Service;
