import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import PaymentSlipUpload from './UploadSlip'
import './Profile.css'; // Import the CSS file for styling
import axiosInstance from '../axiosConfig';


export default function UserProfile({isOpen, onClose, userId, getAll}) {
  const [user, setUser] = useState({
    name: '',
    age: '',
    email: '',
    
  });
  const [editPassword, setEditPassword]= useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const[sidebar,setSidebar] = useState(isOpen);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFile , setSelectedFile] = useState (null);
  const [slip,setSlip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentStyle, setPaymentStyle] = useState({});

  const handleOpenModal = () => {
    setShowModal(true);
    
  };

 
  

  useEffect(()=>{
    fetchUserProfile();
  },[isOpen]);

  useEffect(() => {
    setSidebar(isOpen);
  }, [isOpen]); // Controls when the useEffect hook's function runs based on changes to dependencies.

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/student/get/${userId}`, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      if(err.response && err.response.status === 401){
        alert('You need to Sign back In')
    }else
      alert(err.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    // Append only the necessary fields from the user object
    if (user.name) formData.append('name', user.name);
    if (user.email) formData.append('email', user.email);
    if (user.age) formData.append('age', user.age);

    // Append the image file to the formData if a new file is selected
    if (selectedFile) {
        formData.append('image', selectedFile); // New file
    } else if (user.image) {
        // If no new file, send the existing image path
        formData.append('image', user.image);
    }
  try {
      await axiosInstance.put(`/student/update/${userId}`, formData, {headers: {
        'Content-Type': 'multipart/form-data'
    }, withCredentials: true });
      setIsEditing(false);
      alert('Profile updated successfully.');
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    
  };

  const handleClose = () => {
    setSidebar(false);
    onClose(); // Notify parent component that the sidebar is closed
  };

 
    

  const handleChangePassword = async (e) => {
        e.preventDefault();
        const user_Id = user.user;
        try {
            const response = await axiosInstance.post('/user/change-password', {
                user_Id,
                oldPassword,
                newPassword,
                confirmPassword
            });

            setMessage(response.data.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
           
            
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
           
        }
    };

    const handlePassword= ()=>{
        setEditPassword(true);
    }

    const handleSlip = () => {
      window.open('/upload-slip', '_blank', 'width=600,height=600');
    }
    const handleback=()=>{
      setEditPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
      setSlip(false);
      
    }

    const displayPaymentStatus = () => {
      if (!user.payments || user.payments.length === 0) {
          // No payments, mark as not paid
          setPaymentStatus('Your this month payment is pending');
          setPaymentStyle({ backgroundColor: 'red', border: '1px solid black', padding: '10px', fontWeight:'bold', color:'white' });
      } else {
          const recentPayment = user.payments[user.payments.length - 1];
          const paymentDate = recentPayment.paymentDate ? new Date(recentPayment.paymentDate) : null;

          // Check if the paymentDate is valid
          if (paymentDate && paymentDate instanceof Date && !isNaN(paymentDate)) {
              const currentDate = new Date();

              // Check if the payment is from this month
              if (paymentDate.getMonth() !== currentDate.getMonth() || paymentDate.getFullYear() !== currentDate.getFullYear()) {
                  // Payment is from a past month or invalid
                  setPaymentStatus('Your this month payment is pending');
                  setPaymentStyle({ backgroundColor: 'red', border: '1px solid black', padding: '10px', fontWeight:'bold', color:'white'});
              } else if (recentPayment.status === 'Pending') {
                  // Payment is current month but not approved
                  setPaymentStatus('Payment was submitted to admin review');
                  setPaymentStyle({ backgroundColor: 'yellow', border: '1px solid black', padding: '10px' , fontWeight:'bold', color:'black'});
              } else if (recentPayment.status === 'Rejected') {
                  // Payment is current month and rejected
                  setPaymentStatus('Your payment was rejected');
                  setPaymentStyle({ backgroundColor: 'red', border: '1px solid black', padding: '10px' , fontWeight:'bold', color:'white'});
              } else {
                  // Payment is current month and approved
                  setPaymentStatus('Your payment is approved');
                  setPaymentStyle({ backgroundColor: '#32CD32', border: '1px solid black', padding: '10px', fontWeight:'bold', color:'black' });
              }
          } else {
              // Invalid or missing payment date
              setPaymentStatus('Invalid or missing payment date');
              setPaymentStyle({ backgroundColor: 'red', border: '1px solid black', padding: '10px', fontWeight:'bold' , color:'white'});
          }
      }
  };

  useEffect(() => {
      displayPaymentStatus();
  }, [user.payments]);

  const handleCloseModal = () => {
    setShowModal(false);
    displayPaymentStatus();
  };

  const handlePaymentStatusRefresh = () => {
        displayPaymentStatus(); // Refresh payment status when called
    };

  return (
    <div className={`profile-sidebar ${sidebar ? 'open' : ''}`}>
      { /* slip ? (
        <>
        <PaymentSlipUpload />
        <button className="btn btn-primary"><i class="fa-solid fa-rotate-left " onClick={handleback} /></button>
        </>
        
      ):( */}
      <div className="container mt-25">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h1 mb-2" style={{color:"#fff"}}>User Profile</h1>
        <i className="fa-regular fa-circle-xmark h2 custom-hover-effect" onClick={handleClose}  />
      </div>

        <div className="card shadow-sm" >
          <div className="card-body text-center" >
            <div className="mb-3 d-flex align-items-center justify-content-center flex-wrap">
              {user.image ? (
                <img src={`http://localhost:8070${user.image}`} alt="User" className="img-fluid rounded-circle" width="150" height="150" />
              ) : (
                <div className="img-placeholder rounded-circle " style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}></div>
              )}
            </div>
            {isEditing && (
              <div className="form-group">
                <input type="file" className="form-control-file"  accept="image/*"  // Restrict to image file types 
                onChange={handleFileChange} />
              </div>
            )}
          </div >
        </div >
        {editPassword  ? (
          <form onSubmit={handleChangePassword}>
          <div className="form-group d-flex align-items-center">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>Old Password:</label>
              <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
              />
          </div>
          <div className="form-group d-flex align-items-center">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>New Password:</label>
              <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
              />
          </div>
          <div className="form-group d-flex align-items-center">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>Confirm Password:</label>
              <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
          </div>
          {message && <div>
            {(message === 'Password changed successfully') ? <p style={{color:'yellow', fontWeight:'bold'}}>{message}</p> :
              <p style={{color:'red', fontWeight:'bold'}}>{message}</p>}
            </div>}
            <div className="form-group d-flex align-items-center">
            <button type="submit" className="btn btn-primary">Save Password</button>
            
            <button className="btn btn-primary"><i class="fa-solid fa-rotate-left " onClick={handleback} /></button>
            
            </div>
          
      </form>
        ):(
          <div >
          <div className="card shadow-sm my-3">
          <div className="card-body text-left">
            <div className="form-group d-flex align-items-center">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                />
              ) : (
                <p style={{margin:'0'}}>{user.name}</p>
              )}
            </div>
            <div className="form-group d-flex align-items-start flex-wrap">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>Age:</label>
              {isEditing ? (
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={user.age}
                  onChange={handleInputChange}
                />
              ) : (
                <p style={{margin:'0'}}>{user.age}</p>
              )}
            </div>
            <div className="form-group d-flex align-items-start flex-wrap">
              <label style={{marginRight:'10px', fontWeight:'bold'}}>Email:</label>
              <p style={{margin:'0'}}>{user.email}</p>
            </div>
            
            {isEditing ? (
              <button className="btn btn-primary" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
          
        </div>
        
        <div className='mb-2'>
            <button className='btn btn-warning mt-0' onClick={handlePassword}>Change Password</button>
            <button className='btn btn-primary mt-0' onClick={handleOpenModal}>Upload Slip</button>
          </div>
          <div>
          <div style={paymentStyle}>
                {paymentStatus}
            </div>
          </div>
      </div>
      )}
      </div>
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} style={{zIndex:'5005'}}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Payment Slip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentSlipUpload studentId={userId} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} onPaymentStatusRefresh={handlePaymentStatusRefresh}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
