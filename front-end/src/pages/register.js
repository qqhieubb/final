import Head from 'next/head';
import { useState } from 'react';

const Register = () => {
  const [name, setName]=useState('')
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.table({name,email,password})
  }

  return (
    <div>
      <Head>
        <title>Register Page</title>
      </Head>
      <div className="container">
        <div className="register-container">
          <h1 className="text-center">Register</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your Name" required/>
          
            <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your Email" required/>
          
            <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your Password" required/>
           <button type="submit" className="btn btn-primary btn-block">Register</button>
          </form>

         
        </div>
      </div>
    </div>
  );
}

export default Register;