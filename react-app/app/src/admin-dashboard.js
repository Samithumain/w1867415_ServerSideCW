import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("email");
    const [message, setMessage] = useState(''); 
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/getAllAdmin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();

                if (data.error){
                    setMessage(data.error);
                }
                else{
                    setUsers(data.users);
                }

            


            } catch (error) {
                console.error("Error fetching users:", error);
               
                setMessage(error);

            }
        };

        fetchUsers();
    }, [token, email]);

    const handleRemoveUser = async (userId,username) => {
       
    //    envv
    
        if (username ===  process.env.REACT_APP_ADMIN_USERNAME) {
            console.log("You cannot remove the super admin")
            setMessage("You cannot remove the super admin")
            return;
        }
        // return
        try {
            const response = await fetch(`http://localhost:3000/deleteAdmin/${userId}/?email=${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id !== userId));
            } else {
                setMessage(response.error)
                console.error("Error removing user:", response.statusText);
            }
        } catch (error) {
            setMessage("Error removing user")

            console.error("Error removing user:", error);
        }
    };

    const handleRemoveApiKey = async (userId,apikey) => {
        try {
            const response = await fetch(`http://localhost:3000/deleteApiKey/${apikey}/?email=${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, ApiKey: null } : user
                ));
            } else {
                setMessage(response.error)

                console.error("Error removing API key:", response.statusText);
            }
        } catch (error) {
            setMessage("Error removing API key:")

            console.error("Error removing API key:", error);
        }
    };

    const handleregenkey = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/regenApiKey/${userId}/?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const newApiKey = await response.json();
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, ApiKey: newApiKey } : user
                ));
            } else {
                console.error("Error regenerating API key:", response.statusText);
            }
        } catch (error) {
            console.error("Error regenerating API key:", error);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Admin Dashboard</h1>
  {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
      
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">API Key</th>
                <th className="py-3 px-6 text-left">Requests</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">
                    {user.ApiKey ? (
                      <span className="text-sm font-mono break-all text-gray-700">{user.ApiKey.apiKey}</span>
                    ) : (
                      <span className="text-sm text-red-500">No API Key</span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {user.ApiKey ? (
                      <span className="text-sm text-gray-600">{user.ApiKey.apiCount}</span>
                    ) : (
                      <span className="text-sm text-red-500">No API Key</span>
                    )}
                  </td>
                  <td className="py-3 px-6 space-x-2">
                  <div className="flex space-x-2">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleRemoveUser(user.id,user.username)}
                    >
                        Remove
                    </button>

                    {user.ApiKey ? (
                        <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleRemoveApiKey(user.id, user.ApiKey.apiKey)}
                        >
                        Delete Key
                        </button>
                    ) : (
                        <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleregenkey(user.id)}
                        >
                        Regenerate Key
                        </button>
                    )}
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    );
};

export default AdminDashboard;
