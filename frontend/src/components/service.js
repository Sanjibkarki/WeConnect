import React, { useState } from 'react';
import { useSelector} from "react-redux";
import axiosInstance from '../utils/setauthaxios';
const Service = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const user = useSelector(state => state.auth.user);
  const [numStudents, setNumStudents] = useState(0);
  const [students, setstudents] = useState([]);
  const handleNumStudentsChange = (e) => {
    let num = parseInt(e.target.value, 10) || 0;
    if (num > 50) num = 50;
    setNumStudents(num);

    setstudents(Array(num).fill(''));
  };

  const handleStudentNameChange = (index, value) => {
    const newstudents = [...students];
    newstudents[index] = value;
    setstudents(newstudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const body = JSON.stringify({'host':user,'students':students});
      const res = await axiosInstance.post('http://127.0.0.1:8000/api/user',body);
  
    } catch (err) {
      console.log(err)
    }
    
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
            value={students[index]}
            name={`value${index + 1}`}
            onChange={(e) => handleStudentNameChange(index, e.target.value)} 
          />
        </div>
      ))}
      {isAuthenticated && <button type="submit">Submit</button>}
    </form>
  );
};

export default Service;
