# Student Management System  

## Overview  
The **Student Management System** is a full-stack application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This system enables efficient student data management with features tailored for both users and administrators.  

## Key Features  
- **Authentication and Authorization**  
  - Secure login for users and admins.  
  - Role-based access to features and routes.  

- **Payment Slip Verification**  
  - Verify monthly student payments using uploaded payment slips.  

- **Z-Score-Based Student Ranking**  
  - Automatically rank students based on their Z-scores.  

- **Student Profiles**  
  - Manage individual profiles for seamless access to student information.  

- **User and Admin Dashboards**  
  - Separate interfaces for admins and users, providing tailored features and data visualization.  

## Tech Stack  
### Frontend:  
- React.js  
- Bootstrap (for styling)  

### Backend:  
- Node.js  
- Express.js  

### Database:  
- MongoDB  

### Other Tools:  
- JWT (JSON Web Tokens) for authentication  
- Multer for handling file uploads (payment slips)  

## Prerequisites  
Before running this project, ensure you have the following installed:  
- Node.js  
- MongoDB  
- npm or yarn  

## Getting Started  

### Clone the Repository  
```bash  
git clone https://github.com/Thrishanka051/student_management_system.git  
cd student-management-system  
```  

### Install Dependencies  

#### Backend:  
```bash  
cd backend  
npm install  
```  

#### Frontend:  
```bash  
cd ../frontend  
npm install  
```  

### Configure Environment Variables  
Create a `.env` file in the `backend` directory and include the following variables:  
```env  
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  
```  

### Run the Application  

#### Backend:  
```bash  
cd backend  
npm start  
```  

#### Frontend:  
```bash  
cd ../frontend  
npm start  
```  

The application should now be running at `http://localhost:3000`.  

## Project Structure  

```plaintext
student-management-system/  
│  
├── backend/  
│   ├── controllers/        # Logic for handling API requests  
│   ├── models/             # MongoDB models  
│   ├── routes/             # API endpoints  
│   ├── middleware/         # Authentication and error handling middleware  
│   └── server.js           # Entry point for the backend  
│  
├── frontend/  
│   ├── src/  
│       ├── components/     # React components  
│       ├── pages/          # Page components for routing  
│       ├── context/        # Context API for state management  
│       └── App.js          # Main React app  
│  
└── README.md  
```  



## Contributing  
Contributions are welcome!  
1. Fork the repository.  
2. Create a new branch.  
3. Make your changes and commit them.  
4. Open a pull request.  

