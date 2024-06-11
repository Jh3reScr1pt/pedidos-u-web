import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, url_sb, loadCartData, fetchUserId } = useContext(StoreContext);
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const authUrl = `${url_sb}/api/student/auth`;
        const createUserUrl = `${url}/api/user/register`;
        const loginUserUrl = `${url}/api/user/login`;

        try {
            const responseU = await axios.post(authUrl, null, {
                params: {
                    email: data.email,
                    password: data.password
                }
            });
            if (responseU.data.token) {
                // Llamada a la API de Express para verificar/crear usuario
                
                const response = await axios.post(loginUserUrl, data);
                if(!response.data.success){
                    const newUserResponse = await axios.post(createUserUrl, {
                        name: responseU.data.name,
                        lastname: responseU.data.lastname,
                        email: responseU.data.email_inst
                    });
                    setToken(newUserResponse.data.token);
                    localStorage.setItem('token', newUserResponse.data.token);
                    fetchUserId({ token: newUserResponse.data.data.token });
                    loadCartData({ token: newUserResponse.data.data.token });
                    setShowLogin(false);
                    toast.success('Bienvenido ' + responseU.data.name + '\n Es hora de comer ');
                }
                
                console.log(response.data.message);
                setToken(response.data.data.token);
                localStorage.setItem('token', response.data.data.token);
                fetchUserId({ token: response.data.data.token });
                loadCartData({ token: response.data.data.token });
                setShowLogin(false);
                toast.success('Inicio de sesión exitoso \n Bienvenido ' + responseU.data.name + '\n Es hora de comer');
        }
        } catch (error) {
            toast.error(error.response.data || 'Error al iniciar sesión');
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Bienvenido</h2>
                </div>
                <p>Una mente alimentada, aprobación asegurada</p>
                <div className="login-popup-inputs">
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Correo Institucional'
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Contraseña'
                        required
                    />
                </div>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                <button>Continuar</button>
            </form>
        </div>
    );
};

export default LoginPopup;
