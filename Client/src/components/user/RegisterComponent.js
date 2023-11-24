import React from "react";
//import validator from 'validator';
import { API_URL } from "../../config/config";
import bcrypt from "bcryptjs";
import { useFormik } from "formik";
import * as yup from "yup";
import { createUser } from "../../slice/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    usr_fname: "",
    usr_lname: "",
    usr_username: "",
    usr_email: "",
    usr_phone: "",
    usr_password: "",
    usr_confirmpassword: "",
    usr_gender: "",
    usr_hash_password: "",
  };
  const validationSchema = yup.object().shape({
    usr_fname: yup
      .string()
      .min(3, "must be at least 3 character long")
      .required("First Name is Required"),
    usr_lname: yup.string().required("Last Name is Required"),
    usr_username: yup
      .string()
      .min(3, "must be at least 3 character long")
      .required("User Name is Required")
      .test("Unique Username", "User Name Already Exist", (value) => {
        return new Promise(async (resolve, reject) => {
          await axios
            .post(API_URL + "user/getUserByIndex/usr_username", {
              _value: value,
            })
            .then((res) => {
              if (res?.data.error === "yes") {
                resolve(false);
              }
              resolve(true);
            })
            .catch((err) => resolve(false));
        });
      }),
    usr_email: yup
      .string()
      .min(3, "must be at least 3 character long")
      .required("Email is Required")
      .email("Invalid email format")
      .test("Unique Email", "Email Already Exist", (value) => {
        return new Promise(async (resolve, reject) => {
          await axios
            .post(API_URL + "user/getUserByIndex/usr_email", { _value: value })
            .then((res) => {
              if (res?.data.error === "yes") {
                resolve(false);
              }
              resolve(true);
            })
            .catch((err) => resolve(false));
        });
      }),
    usr_phone: yup
      .number()
      .min(10, "must be at least 10 character long")
      .required("Phone Number is Required")
      .test("Unique Phone", "Phone Number Already Exist", (value) => {
        return new Promise(async (resolve, reject) => {
          await axios
            .post(API_URL + "user/getUserByPhone/usr_phone", { _value: value })
            .then((res) => {
              if (res?.data.error === "yes") {
                resolve(false);
              }
              resolve(true);
            })
            .catch((err) => resolve(false));
        });
      }),
    usr_password: yup
      .string()
      .min(8, "must be at least 8 character long")
      .required("Password is Required")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
        "Password should alteast one upper and lowercase and number and special character!!!"
      ),
    usr_confirmpassword: yup
      .string()
      .min(8, "must be at least 8 character long")
      .required("Confirm Password is Required")
      .oneOf([yup.ref("usr_password")]),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      values.usr_hash_password = bcrypt.hashSync(values.usr_password, 10);
      const postData = { user: values };
      console.log(postData);
      try {
        dispatch(createUser(postData));
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <section className="gradient-custom">
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-width align-items-center h-100">
          <div className="col-12 col-lg-9 col-xl-7">
            <div
              className="card shadow-2-strong card-registration"
              style={{ borderRadius: "15px" }}
            >
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="usr_fname">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="usr_fname"
                          onBlur={formik.handleBlur}
                          value={formik.values.usr_fname}
                          id="usr_fname"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_fname ? (
                          <span>{formik.errors.usr_fname}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="usr_lname">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="usr_lname"
                          onBlur={formik.handleBlur}
                          value={formik.values.usr_lname}
                          id="usr_lname"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_lname ? (
                          <span>{formik.errors.usr_lname}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4 d-flex align-items-center">
                      <div className="form-outline datepicker w-100">
                        <label htmlFor="birthdayDate" className="form-label">
                          User Name
                        </label>
                        <input
                          type="text"
                          name="usr_username"
                          onBlur={formik.handleBlur}
                          value={formik.values.usr_username}
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                          id="usr_username"
                        />
                        {formik.touched.usr_username ? (
                          <span>{formik.errors.usr_username}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <h6 className="mb-2 pb-1">Gender: </h6>
                      <div className="form-check form-check-inline">
                        <label
                          className="form-check-label"
                          htmlFor="maleGender"
                        >
                          Male
                        </label>
                        <input
                          className="form-check-input"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="radio"
                          name="usr_gender"
                          id="maleGender"
                          value="M"
                        />
                      </div>

                      <div className="form-check form-check-inline">
                        <label
                          className="form-check-label"
                          htmlFor="femaleGender"
                        >
                          Female
                        </label>
                        <input
                          className="form-check-input"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="radio"
                          name="usr_gender"
                          id="femaleGender"
                          value="F"
                        />
                      </div>

                      <div className="form-check form-check-inline">
                        <label
                          className="form-check-label"
                          htmlFor="otherGender"
                        >
                          Other
                        </label>
                        <input
                          className="form-check-input"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="radio"
                          name="usr_gender"
                          id="otherGender"
                          value="TG"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4 pb-2">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="usr_email">
                          Email
                        </label>
                        <input
                          type="email"
                          name="usr_email"
                          onBlur={formik.handleBlur}
                          value={formik.values.usr_email}
                          id="usr_email"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_email ? (
                          <span>{formik.errors.usr_email}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4 pb-2">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="usr_phone">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          onBlur={formik.handleBlur}
                          name="usr_phone"
                          value={formik.values.usr_phone}
                          id="usr_phone"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_phone ? (
                          <span>{formik.errors.usr_phone}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4 pb-2">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="usr_password">
                          Password
                        </label>
                        <input
                          type="password"
                          name="usr_password"
                          onBlur={formik.handleBlur}
                          value={formik.values.usr_password}
                          id="usr_password"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_password ? (
                          <span>{formik.errors.usr_password}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4 pb-2">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="confirmpass">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          onBlur={formik.handleBlur}
                          name="usr_confirmpassword"
                          value={formik.values.usr_confirmpassword}
                          id="confirmpass"
                          onChange={formik.handleChange}
                          className="form-control form-control-lg"
                        />
                        {formik.touched.usr_confirmpassword ? (
                          <span>{formik.errors.usr_confirmpassword}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      className="btn btn-primary btn-lg"
                      disabled={!formik.isValid}
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterComponent;

/*
class RegisterComponent extends Component{

    constructor(props){
        super(props);
        this.state = { user : {
                usr_fname : '',
                usr_lname : '',
                usr_username : '',
                usr_email : '',
                usr_phone: '',
                usr_password : '',
                usr_confirmpassword : '',
                usr_gender : '',
            },
            errors_msg : {
                usr_fname : '',
                usr_lname : '',
                usr_username : '',
                usr_email : '',
                usr_phone : '',
                usr_password : '',
                usr_confirmpassword : '',
                usr_gender : '',
            },
            success_msg : {
                usr_username : '',
                usr_email : '',
                usr_phone : '',
            },
            user_fields : {
                usr_fname : 'First Name',
                usr_lname : 'Last Name',
                usr_username : 'User Name',
                usr_email : 'Email',
                usr_phone: 'Phone',
                usr_password : 'Password',
                usr_confirmpassword : 'Confirm Password',
                usr_gender : 'Gender',
            },
            config: {
               serverUrl : API_URL
            },
            messages:{
                success_msg : '',
                err_msg : '',
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    

    componentDidMount(){
        var errorData = this.state.errors_msg;
        var successData = this.state.success_msg;
        this.setState({
            errors_msg : errorData
        });
        this.setState({
            success_msg : successData
        });
    }

    validation = (_fieldName, _value) => {
        var errorData = this.state.errors_msg;
        var successData = this.state.success_msg;
        var serverHostUrl = this.state.config.serverUrl;
        if(_value !== ''){
            errorData[_fieldName] = '';
            var data = {_value : _value};
            if(_fieldName === 'usr_username'){
                if(_value.length < 5){
                    successData[_fieldName] = '';
                    errorData[_fieldName] = 'Minimum Length is 5!!!';
                }
                else{
                    fetch(serverHostUrl+'/getUserByIndex/'+_fieldName, {
                        method: 'POST',
                        headers: {
                            'Origin':'*',
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => { return res.json(); })
                    .then((data) => {
                        if(data.error === 'no'){
                            errorData[_fieldName] = '';
                            successData[_fieldName] = data.message;
                        }
                        else{
                            successData[_fieldName] = '';
                            errorData[_fieldName] = data.message; 
                        }
                    });
                }
            }
            if(_fieldName === 'usr_email'){
                if(_value.length < 5){
                    successData[_fieldName] = '';
                    errorData[_fieldName] = 'Minimum Length is 5!!!';
                }
                else{
                    if(validator.isEmail(_value)){
                        fetch(serverHostUrl+'/getUserByIndex/'+_fieldName, {
                            method: 'POST',
                            headers: {
                                'Origin':'*',
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(res => { return res.json(); })
                        .then((data) => {
                            if(data.error === 'no'){
                                errorData[_fieldName] = '';
                                successData[_fieldName] = data.message;
                            }
                            else{
                                successData[_fieldName] = '';
                                errorData[_fieldName] = data.message; 
                            }
                        });
                    }
                    else{
                        successData[_fieldName] = '';
                        errorData[_fieldName] = 'Enter Valid Email!!!'; 
                    }
                }
            }
            if(_fieldName === 'usr_phone'){
                var pattern = new RegExp(/^[0-9\b]+$/);
                if (!pattern.test(_value)) {
                    errorData[_fieldName] = 'Please enter only number!!!';

                }
                else{
                    fetch(serverHostUrl+'/getUserByPhone/'+_fieldName, {
                        method: 'POST',
                        headers: {
                            'Origin':'*',
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => { return res.json(); })
                    .then((data) => {
                        if(data.error === 'no'){
                            errorData[_fieldName] = '';
                            successData[_fieldName] = data.message;
                        }
                        else{
                            successData[_fieldName] = '';
                            errorData[_fieldName] = data.message; 
                        }
                    });
                }
            }
            if(_fieldName === 'usr_password'){
                errorData[_fieldName] = '';
                var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                if(_value.length < 8){
                    errorData[_fieldName] = 'Password length should be 8 alphanumeric character!!!';
                }
                else if(!strongRegex.test(_value)){
                    errorData[_fieldName] = 'Password does not meet password pattern!!!';
                }
            }
            if(_fieldName === 'usr_confirmpassword'){
                errorData[_fieldName] = '';
                if(this.state.user.usr_password !== _value){
                    errorData[_fieldName] = 'Password does not match!!!';
                }
            }
            if(_fieldName === 'usr_gender'){
                const genderValue = this.state.user.usr_gender;
                console.log(this.state.user.usr_gender);
                this.setState({
                    genderValue: _value,
                });
            }
            this.setState({
                success_msg : successData
            });
            this.setState({
                errors_msg : errorData
            });
            //console.log(errorData);
        }
        else{
            errorData[_fieldName] = this.state.user_fields[_fieldName] + ' field is Required!!!';
            this.setState({
                errors_msg : errorData
            });
        }
        const validateData = this.state.user;
        validateData[_fieldName] = _value; 
        this.setState({
            user : validateData
        });
        //console.log(validateData);
    }

    setGender = (event) => {
        const selectedGender = event.target.value;
        var genderValue = this.state.user;
        genderValue.usr_gender = selectedGender;
        this.setState({
            user: genderValue,
        });
        console.log(this.state.user.usr_gender);
    }

    handleChange = (event) => {
        var curprop = event.target;
        var name = curprop.name;
        this.validation(name, curprop.value);
    }

    handleSubmit = (event) => {
        var valid = true;
        var postData = {};
        var serverHostUrl = this.state.config.serverUrl;
        for(var key in this.state.errors_msg){
            if(this.state.errors_msg[key] !== ''){
                valid = false;
            }
            if(key == 'usr_password'){
                postData['usr_hash_password'] = bcrypt.hashSync(this.state.user[key],10);
            }
            if(key !== 'usr_confirmpassword'){
                postData[key] = this.state.user[key];
            }
        }
        if(valid){
            console.log(postData);
            var data = {user : postData};
            fetch(serverHostUrl+'/auth/createUser', {
                method: 'POST',
                headers: {
                    'Origin':'*',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => { return res.json(); })
            .then((data) => {
                if(data.error === 'no'){
                    this.setState({messages : {success_msg : data.message}});
                    setTimeout(() => {
                        this.setState({messages : {success_msg : ''}});
                    },3000);
                }
                else{
                    this.setState({messages : {err_msg : data.message}});
                    setTimeout(() => {
                        this.setState({messages : {err_msg : ''}});
                    },3000);
                }
            });
            console.log('ready to submit');
        }
        else{
            console.log('Validation error');
        }
        
        event.preventDefault();
    }

    render(){
        return(
            <div className='container page-cont'>
                <div className='showMessages'>
                    <div className='successMsg feedback'>{this.state.messages.success_msg}</div>
                    <div className='errorMsg feedback'>{this.state.messages.err_msg}</div>
                </div>
                <h1>Register Page</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side'>First Name</label>
                        </div>
                        <div className='grid-item'>
                            <input type='text' required className='form-control input-sm' name="usr_fname" value={this.state.user.usr_fname} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_fname}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side'>Last Name</label>
                        </div>
                        <div className='grid-item'>
                            <input type='text' required className='form-control input-sm' name="usr_lname" value={this.state.user.usr_lname} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_lname}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >User Name</label>
                        </div>
                        <div className='grid-item'>
                            <input type='text' required className='form-control input-sm' name="usr_username" value={this.state.user.usr_username} onChange={this.handleChange} />
                                <div className='mk-lft-side errorMsg feedback'> {this.state.errors_msg.usr_username}</div>
                                <div className='mk-lft-side successMsg feedback'>{this.state.success_msg.usr_username}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >Email</label>
                        </div>
                        <div className='grid-item'>
                            <input type='text' required className='form-control input-sm' name="usr_email" value={this.state.user.usr_email} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_email}</div>
                            <div className='mk-lft-side successMsg feedback'>{this.state.success_msg.usr_email}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >Phone</label>
                        </div>
                        <div className='grid-item'>
                            <input type='text' required className='form-control input-sm' name="usr_phone" value={this.state.user.usr_phone} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_phone}</div>
                            <div className='mk-lft-side successMsg feedback'>{this.state.success_msg.usr_phone}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >Password</label>
                        </div>
                        <div className='grid-item'>
                            <input type='password' required className='form-control input-sm' name="usr_password" value={this.state.user.usr_password} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_password}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >Confirm Password</label>
                        </div>
                        <div className='grid-item'>
                            <input type='password' required className='form-control input-sm' name="usr_confirmpassword" value={this.state.user.usr_confirmpassword} onChange={this.handleChange} />
                            <div className='mk-lft-side errorMsg feedback'>{this.state.errors_msg.usr_confirmpassword}</div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <label className='lft-side' >Gender</label>
                        </div>
                        <div className='grid-item'>
                            <div className='radio_main_container'>
                                <div className='radio_container'>
                                    <input type="radio" name="usr_gender" id="male" value="M" 
                                        checked={this.state.user.usr_gender === 'M'} 
                                        onChange={this.setGender}  
                                    />
                                    <label className='radio_label'>Male</label>

                                    <input type="radio" name="usr_gender" id="female" value="F"
                                        checked={this.state.user.usr_gender === 'F'} 
                                        onChange={this.setGender} 
                                    />
                                    <label className='radio_label'>Female</label>
                                    
                                    <input type="radio" name="usr_gender" id="others" value="TG"
                                        checked={this.state.user.usr_gender === 'TG'} 
                                        onChange={this.setGender} 
                                    />
                                    <label className='radio_label'>Transgender</label>
                                </div>
                                <div className='errorMsg feedback'>{this.state.errors_msg.usr_gender}</div>
                            </div>
                        </div>
                    </div>
                    <div className='grid-container'>
                        <div className='grid-item'>
                            <input type='submit' className='btn btn-primary' value='Submit' />
                            <div className='mk-lft-side errorMsg feedback'> {this.state.messages.err_msg}</div>
                            <div className='mk-lft-side successMsg feedback'>{this.state.messages.success_msg}</div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default RegisterComponent;
*/
