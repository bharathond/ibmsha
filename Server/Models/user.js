const connection = require('../config/db');
const bcrypt = require('bcryptjs');

class User{
    static userObject = {};
    static Result = {};
    tableName = 'user';

    constructor(){
        //this.userObject = connection.extend({tableName: this.tableName})
        this.userObject = new connection({tableName: this.tableName});
    }
    /**
     * 
     * @param {*} callback 
     * @returns 
     */
    getAllUser(callback) {
        var allUsers = this.userObject.find('all', {}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.length > 0 ){
                    this.Result = {status: 'Success', error: 'no', message: 'Record Exist!!!!!!' , data: row};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: 'Success', error: 'yes', message: 'No Record Exist!!!!!!' , data: 'No Records Exist!!!'};
                    return callback(this.Result);
                }
            }
        });
        return allUsers;
    }

    /**
     * 
     * @param {*} id 
     * @param {*} callback 
     */
    getUserById(id,callback){
        this.userObject.read(id, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.id != '' ){
                    this.Result = {status: 'Success', error: 'no', message: 'User exist!!!' , data: row};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: 'Success', error: 'yes', message: 'User not exist!!!' , data: 'User not Exist!!!'};
                    return callback(this.Result);
                }
            }
        });
    }

    /**
     * 
     * @param {*} _value 
     * @param {*} callback 
     */
     getUserByIdentity(_value,callback){

        this.userObject.find('first', {where: "usr_username = '"+_value+"' or usr_email = '"+_value+"' or usr_phone = '"+_value+"'"}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.id != '' ){
                    this.Result = {status: 'Success', error: 'no',  data: row};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: 'Success', error: 'yes', data: {}};
                    return callback(this.Result);
                }
            }
        });
    }

    /**
     * 
     * @param {*} _value 
     * @param {*} callback 
     */
    getUserByLogin(_value,callback){
        var userName =  _value.body.username;
        var password =  _value.body.password;
        var role = _value.body.role;

        this.userObject.find('first', {where: "(usr_username = '"+userName+"' or usr_email = '"+userName+"' or usr_phone = '"+userName+"') and user_role = '"+role+"'"}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err, message: 'Error while executing Query!!!'};
                return callback(this.Result);
            }
            else{
                if(row.length <= 0){
                    this.Result = {status: 'Success', error: 'yes', data:{}, message: 'Invalid User Name!!!'};
                    return callback(this.Result);
                }
                else{
                    bcrypt.compare(password, row.usr_hash_password, (err,isMatch) => {
                        if(err){
                            this.Result = {status: 'Success', error: 'yes', data: err, message: 'Password Doesn\'t Match!!!'};
                            return callback(this.Result);
                        }
                        else if(!isMatch){
                            this.Result = {status: 'Success', error: 'yes', data:{}, message: 'Password Doesn\'t Match!!!'};
                            return callback(this.Result);
                        }
                        else{
                            this.Result = {status: 'Success', error: 'no',  data: row, message: 'Login Success!!!'};
                            return callback(this.Result);
                        }
                        
                    });
                }
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} callback 
     */
     getUserByIndex(_index, _value, cond = '',callback){
        var returnMsg = '';
        if(cond !== ''){
            cond = _index+" like '%"+_value+"%'";
        }
        else{
            cond = _index+`= "${_value}"`;
        }
        this.userObject.find('all', {where: cond}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.length > 0){
                    if(_index == 'usr_email'){
                        returnMsg = 'Email';
                    }
                    else{
                        returnMsg = 'User';
                    }
                    this.Result = {status: 'Success', error: 'yes' , message: returnMsg+' already Exist!!!'};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: 'Success', error: 'no' , message: 'Available!!!'};
                    return callback(this.Result);
                }
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} callback 
     */
     getUserByPhone(_index, _value, cond = '', callback){
        if(cond !== ''){
            cond = _index+" like '%"+_value+"%'";
        }
        else{
            cond = _index+`= "${_value}"`;
        }
        this.userObject.find('all', {where: cond}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.length > 0){
                    this.Result = {status: 'Success', error: 'yes' , message: 'Phone no already Exist!!!'};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: 'Success', error: 'no' , message: 'Available!!!'};
                    return callback(this.Result);
                }
            }
        });
    }

    /**
     * 
     * @param {*} postData 
     * @param {*} callback 
     */
    createUser(postData,callback){
        this.userObject.find('first', {where: "usr_username = '"+postData.usr_username+"' or usr_email = '"+postData.usr_email+"' or usr_phone='"+postData.usr_phone+"'"}, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.length < 1){
                    var userObj = connection.extend({tableName: this.tableName});
                    var user = new userObj();
                    try{
                        let query = `insert into user (usr_fname,usr_lname,usr_username,usr_email,usr_phone,usr_password,usr_gender,usr_hash_password) values("${postData.usr_fname}","${postData.usr_lname}","${postData.usr_username}", "${postData.usr_email}" ,'${postData.usr_phone}',"${postData.usr_password}","${postData.usr_gender}","${postData.usr_hash_password}")`;
                        console.log(query); 
                        user.query(query,(err,row) => {
                            if(err){
                                this.Result = {status: false, error: 'yes',  data: err};
                                return callback(this.Result);
                            }
                            else{
                                this.Result = {status: true, error: 'no' , message: 'User Added Successfully!!!'};
                                return callback(this.Result);
                            }
                        });
                    }catch(error){
                        return callback(error.message);
                    }
                }
                else{
                    this.Result = {status: 'Success', error: 'yes' , message: 'User Already Exist!!!'};
                    return callback(this.Result);
                }
            }
        });
    }

    /**
     * 
     * @param {*} id 
     * @param {*} postData 
     * @param {*} callback 
     */
    updateUser(id,postData,callback){

        this.userObject.read(id, (err, row) => {
            if(err){
                this.Result = {status: 'Success', error: 'yes',  data: err};
                return callback(this.Result);
            }
            else{
                if(row.id != '' ){
                    var userObj = connection.extend({
                        tableName: this.tableName
                    })
                    var user = new userObj(postData);
                    user.set('id',row.id);
                    user.save((err,result) =>{
                        if(err){
                            this.Result = {status: 'Success', error: 'yes',  data: err};
                            return callback(this.Result);
                        }
                        else if(result.id != ''){
                            this.Result = {status: 'Success', error: 'No' , data: 'User Updated Successfully!!!'};
                            return callback(this.Result);
                        }
                    })
                }
                else{
                    this.Result = {status: 'Success', error: 'yes' , data: 'No Records Exist!!!'};
                    return callback(this.Result);
                }
            }
        });
    }
}

module.exports = User;

