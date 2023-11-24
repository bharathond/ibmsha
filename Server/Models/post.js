const { populate } = require('dotenv');
const connection = require('../config/db');

class Post{
    static postObject = {};
    static Result = {};
    tableName = 'post';

    constructor(){
        this.postObject = new connection({tableName: this.tableName});
    }


    /**
     *  @param {*} callback
     *  Fetch All Post From Database
     */

    fetchAllPost(callback) {
        const posts = this.postObject.find('all', {order: ['id'], orderDESC:true} ,(err,result) => {
            if(err){
                this.Result = err;
                return callback(this.Result);
            }
            else{
                if(result.length > 0 ){
                    this.Result = result;
                    return callback(this.Result);
                }
                else{
                    this.Result = {};
                    return callback(this.Result);
                }
            }
            
        });
    }

    /**
     *  @param {*} callback
     *  Fetch Post by ID From Database
     */
    fetchPostById(postId,callback){
        const post = this.postObject.find('all',{
            where : 'post_id="'+postId+'"',
            order: ['id'], orderDESC:true
        },(err, row) => {
            if(err){
                this.Result = err;
                return callback(this.Result);
            }
            else{
                this.Result = row;
                return callback(this.Result);
            }
        });

    }

    /**
     *  @param {*} callback
     *  Fetch Post by Post Tag From Database
     */
    fetchPostByTag(postTag,callback){
        const tagPost = this.postObject.find('all',{
            where : 'post_tag="'+postTag+'"',
            order: ['id'], orderDESC:true
        },(err, result) => {
            if(err){
                this.Result = err;
                return callback(this.Result);
            }
            else{
                this.Result = result;
                return callback(this.Result);
            }
        });

    }

    /**
     *  @param {*} callback
     *  Filter Post by Search box From Database
     */
    fetchFilterPost(filterValue,callback){
        let whereCond = `(post_tag like '%${filterValue}%' or post_title like '%${filterValue}%' or post_content like '%${filterValue}%')`;
        const filterPost = this.postObject.find('all',{
            where : whereCond,
            order: ['id'], orderDESC:true
        },(err,result) => {
            if(err){
                this.Result = err
                return callback(this.Result);
            }
            else{
                this.Result = result;
                return callback(this.Result);
            }
         });
    }

    createPost(postData, callback){
        console.log(postData);
        var postObj = connection.extend({tableName: this.tableName});
        var post = new postObj();
        try{
            let query = `insert into post (post_id,post_image,post_title,post_tag,post_content,created_at) values("${postData.post_id}","${postData.post_image}","${postData.post_title}", "${postData.post_tag}" ,'${postData.post_content}',"${postData.created_at}")`;
            console.log(query); 
            post.query(query,(err,row) => {
                if(err){
                    this.Result = {status: false, error: 'yes',  data: err};
                    return callback(this.Result);
                }
                else{
                    this.Result = {status: true, error: 'no' , message: 'Post Added Successfully!!!'};
                    return callback(this.Result);
                }
            });
            
        }catch(error){
            return callback(error.message);
        }
    }
}

module.exports = Post;