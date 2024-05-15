// src/components/Home.js
import './style.css'; 
import { useState } from 'react';
import axios from 'axios';

function Home() {
    const [recordname, setRecordname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [masterpassword, setMasterpassword] = useState('');
    const [recordnameToFetch, setRecordnameToFetch] = useState('');
    const [masterpasswordToFetch, setMasterpasswordToFetch] = useState('');
    const [fetchedPassword, setFetchedPassword] = useState('');

    const handleAddPassword = async (event) => {
        event.preventDefault();
        if (!recordname || !username || !password || !masterpassword) {
            alert("Fill all the fields");
            return;
        }
        try {
            const params = new URLSearchParams({ recordname, username, password, masterpassword });
            await axios.get(`/addpassword?${params.toString()}`);
            setRecordname('');
            setUsername('');
            setPassword('');
            setMasterpassword('');
           
        } catch (error) {
            alert('Failed to add password. Please try again.');
        }
    };
    

    const handleFetchPassword = async (event) => {
        event.preventDefault();
        if (!recordnameToFetch || !masterpasswordToFetch) {
            alert("Please enter all the fields");
            return;
        }
        try {
            const params = new URLSearchParams({ recordnameToFetch, masterpasswordToFetch });
            const response = await axios.get(`/fetchdata?${params.toString()}`);
            const { username, password } = response.data;
            setFetchedPassword(`Username: ${username}, Password: ${password}`);
        } catch (error) {
            alert('Failed to fetch password. Please try again.');
        }
    };
    
    return (
        <div className='background'>
            <h2 className='h1'>Password Manager</h2>
            <div className='form'>
                <form onSubmit={handleAddPassword} className='form1'>
                    <label>RECORD NAME</label><br /><br />
                    <input type='text' name="recordname" onChange={(e) => setRecordname(e.target.value)} value={recordname} /><br /><br />
                    <label>USERNAME</label><br /><br />
                    <input type='text' name="username" onChange={(e) => setUsername(e.target.value)} value={username} /><br /><br />
                    <label>PASSWORD</label><br /><br />
                    <input type='password' name="password" onChange={(e) => setPassword(e.target.value)} value={password} /><br /><br />
                    <label>MASTER PASSWORD</label><br /><br />
                    <input type='password' name="masterpassword" onChange={(e) => setMasterpassword(e.target.value)} value={masterpassword} /><br /><br />
                    <button type='submit' className='btn1'>ADD</button><br /><br />
                </form>
                <form onSubmit={handleFetchPassword} className='form2'>
                    <label>RECORD NAME</label><br /><br />
                    <input type='text' name="recordnameToFetch" onChange={(e) => setRecordnameToFetch(e.target.value)} value={recordnameToFetch} /><br /><br />
                    <label>MASTER PASSWORD</label><br /><br />
                    <input type='password' name="masterpasswordToFetch" onChange={(e) => setMasterpasswordToFetch(e.target.value)} value={masterpasswordToFetch} /><br /><br />
                    <button type='submit' className='btn3'>FETCH</button><br /><br />
                </form>
                {fetchedPassword && <p>{fetchedPassword}</p>}
            </div>
        </div>
    );
}

export default Home;
