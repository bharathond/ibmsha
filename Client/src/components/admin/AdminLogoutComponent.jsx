import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogoutComponent() {
    let navigate = useNavigate();
    useEffect(() => {
        sessionStorage.removeItem('user');
        navigate('/');
    },[navigate])
}

export default AdminLogoutComponent;
