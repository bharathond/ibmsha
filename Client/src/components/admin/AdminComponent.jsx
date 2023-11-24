import React, { useState } from 'react'
import loginImage from '../../Assert/images/login-image.png';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../../slice/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';

function LoginComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginMsg,setLoginMsg] = useState('');
    const [msgColor,setMsgColor] = useState('red');
    //Bharath142511

    const initialValues = {
        userName: '',
        password: '',
    };
    const validationSchema = yup.object().shape({
        userName : yup.string().min(3,'must be at least 3 character long')
                    .required('User Name is Required'),
        
        password : yup.string().required('Password is Required'),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
            let loginData = {'username' : values.userName, 'password' : values.password, 'role' : 'admin'};
            try{
                const data = dispatch(adminLogin(loginData));
                data.then((res) => {
                    console.log(res);
                    if(res?.payload?.error === 'yes'){
                        setLoginMsg(res?.payload?.message);
                        setTimeout(() => {
                            setLoginMsg('');
                        }, 3000);
                    }
                    else{
                        setLoginMsg('Login Success!!!');
                        setMsgColor('green');
                        setTimeout(() => {
                            navigate('/');
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            }catch(error){
                console.error(error);
            }
        },
    });

    return (
        <>  
            <section className="gradient-custom">
                <div className="container py-5 h-100">
                <div className="row justify-content-center align-width align-items-center h-100">
                    <div className="col-12 col-lg-9 col-xl-7">
                        <div className="card shadow-2-strong card-registration" style={{"borderRadius": "15px"}}>
                            <div className="card-body p-4 p-md-5">
                                <div className="login-container">
                                    <div className="circle circle-one"></div>
                                    <div className="form-container">
                                        <img src={loginImage} alt="illustration" className="illustration" />
                                        <h1 className="opacity">LOGIN</h1>
                                        <span style={{color:msgColor}}>{loginMsg}</span>
                                        <form onSubmit={formik.handleSubmit}>
                                            <input type="text" name='userName' onBlur={formik.handleBlur} value={formik.values.userName} onChange={formik.handleChange} className="form-control form-control-lg" id="userName" />
                                            { formik.touched.userName ? <span>{formik.errors.userName}</span> : null }
                                            <input type="password" name='password' onBlur={formik.handleBlur} value={formik.values.password} id="password" onChange={formik.handleChange} className="form-control form-control-lg" />
                                            { formik.touched.password ? <span>{formik.errors.password}</span> : null }
                                            { /*
                                                <input value={username} onChange={ e => setUsername(e.target.value) } type="text" placeholder="USERNAME" />
                                                <input value={password} onChange={ e => setPassword(e.target.value) } type="password" placeholder="PASSWORD" />
                                                */
                                            }   
                                            <button type='submit' className="opacity">SUBMIT</button>
                                        </form>
                                    </div>
                                    <div className="circle circle-two"></div>
                                </div>
                                </div>
                            </div>
                       </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginComponent
