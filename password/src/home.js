

import './style.css'; 
import { useState } from 'react';
import axios from 'axios';

function Home(){
 
    const [recordname,setRecordvalue]=useState('');
    const[username,setUsernamevalue]=useState('');
    const [password,setPasswordvalue]=useState('');
    const [masterpassword,setMasterpasswordvalue]=useState('');
    const [recordname1,setRecordvalue1]=useState('');
    const [masterpassword1,setMasterpasswordvalue1]=useState('');

    const handleRecord =(event)=>{
        setRecordvalue(event.target.value);
    }
    const handleRecord1 =(event)=>{
        setRecordvalue1(event.target.value);
    }
    const handleUsername =(event)=>{
        setUsernamevalue(event.target.value);
    }
    const handlePassword =(event)=>{
        setPasswordvalue(event.target.value);
    }
    const handleMasterpassword=(event)=>{
        setMasterpasswordvalue(event.target.value);
    }
    const handleMasterpassword1=(event)=>{
        setMasterpasswordvalue1(event.target.value);
    }
    //////////////////////////////////////////////////////////////////////////////////
    const handleSubmit=async(event)=>{
    
        event.preventDefault();
        if(!recordname||!username||!password){
            alert("fill the fields");
        }
        try{
            await axios.post('/add', { recordname, username, password, masterpassword });
            setRecordvalue('');
            setUsernamevalue('');
            setPasswordvalue('');
            setMasterpasswordvalue('');
          
            alert('Password added successfully');
          } catch (error) {
           alert('Failed to add password. Please try again.');
          }
        };
        //////////////////////////////////////////////////////////////////////////
    const handleFetch=async(event)=>{

        event.preventDefault();
       
        if(!masterpassword1||!recordname1)
        {
            alert("please enter the  fields")
        }
        try{
            await axios.post('/fetch', { recordname1, masterpassword1 });
            setRecordvalue1('');
            setMasterpasswordvalue1('');
          
            alert('fecthed successfully');
          } catch (error) {
           alert('Failed Please try again.');
          }
        };

    

    return(
<div className='background'>
<h2 className='h1'>𝕻𝖆𝖘𝖘𝖜𝖔𝖗𝖉 𝕸𝖆𝖓𝖆𝖌𝖊𝖗</h2>
<div className='form'>
    <form onSubmit={handleSubmit} method='post' action='/add'>
        <label >RECORD NAME</label><br></br><br></br>
        <input type='text' name="recordname" onChange={handleRecord} value={recordname}></input><br></br><br></br>
        <label >USERNAME NAME</label><br></br><br></br>
        <input type='text' name="username" onChange={handleUsername} value={username}></input><br></br><br></br>
        <label >PASSWORD</label><br></br><br></br>
        <input type='password' name="password" onChange={handlePassword} value={password}></input><br></br><br></br>
        <label >MASTER PASSWORD</label><br></br><br></br>
        <input type='password' name="masterpassword" onChange={handleMasterpassword} value={masterpassword}></input><br></br><br></br>
        <button type='submit' name='add' className='btn1'>ADD</button><br></br><br></br>
    </form>
    <form action='/fetch' onSubmit={handleFetch} method='post' className='form2'>
    <label >RECORD NAME</label><br></br><br></br>
        <input type='text' name="recordname1" onChange={handleRecord1} value={recordname1}></input><br></br><br></br>
    <label >MASTER PASSWORD</label><br></br><br></br>
        <input type='password' name="masterpassword1" onChange={handleMasterpassword1} value={masterpassword1}></input><br></br><br></br>
    <button type='submit' name='fetch' className='btn3'>FETCH</button><br></br><br></br>
    </form>
    
</div>







</div>





    );
}
export default Home;