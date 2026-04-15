import React from 'react';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const userData = {
    firstName: "Quoc Khanh",
    lastName: "Truong",
    studentId: "ITCSIU23015",
    phone: "+84 38-485-xxxx",
    email: "ITCSIU23015@student.hcmiu.edu.vn",
    country: "Vietnam",
    university: "International University"
  };

  return (
    <div className="personal-info">
      <h1>Personal Information</h1>
      <div className="info-card">
        <div className="info-grid">
          <div className="input-field">
            <label>First Name</label>
            <input type="text" defaultValue={userData.firstName} readOnly />
          </div>
          <div className="input-field">
            <label>Last Name</label>
            <input type="text" defaultValue={userData.lastName} readOnly />
          </div>

          <div className="input-field">
            <label>Student ID</label>
            <input type="text" defaultValue={userData.studentId} readOnly />
          </div>
          <div className="input-field">
            <label>Phone Number</label>
            <input type="text" defaultValue={userData.phone} readOnly />
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <input type="email" defaultValue={userData.email} readOnly />
          </div>
          <div className="input-field">
            <label>Country</label>
            <input type="text" defaultValue={userData.country} readOnly />
          </div>

          <div className="input-field full-width">
            <label>University</label>
            <input type="text" defaultValue={userData.university} readOnly />
          </div>
        </div>

        <button className="edit-btn">EDIT</button>
      </div>
    </div>
  );
};

export default PersonalInfo;
