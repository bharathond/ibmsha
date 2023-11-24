CREATE TABLE `nodeapp`.`menu` ( `id` INT(11) NOT NULL AUTO_INCREMENT , `mnu_name` VARCHAR(255) NOT NULL , `mnu_parent` INT(11) NOT NULL DEFAULT '0' , `mnu_url` TEXT NULL DEFAULT NULL , `mnu_created_by` INT(11) NULL DEFAULT NULL , `mnu_created_at` INT(11) NULL DEFAULT NULL , `mnu_updated_by` INT(11) NULL DEFAULT NULL , `mnu_updated_at` INT(11) NULL DEFAULT NULL , PRIMARY KEY (`mnu_id`), UNIQUE (`mnu_name`)) ENGINE = InnoDB;

CREATE TABLE `nodeapp`.`user` ( `usr_id` INT(11) NOT NULL AUTO_INCREMENT , `usr_fname` VARCHAR(50) NOT NULL , `usr_lname` VARCHAR(50) NOT NULL , `usr_username` VARCHAR(75) NOT NULL , `usr_email` VARCHAR(100) NOT NULL , `usr_password` TEXT NOT NULL , `usr_gender` ENUM('M','F','TG') NOT NULL DEFAULT 'M' , `usr_dob` DATE NULL , `usr_reset_hash` TEXT NULL , `usr_created_by` INT(11) NULL , `usr_created_at` INT(11) NULL , `usr_updated_by` INT(11) NULL , `usr_updated_at` INT(11) NULL , PRIMARY KEY (`usr_id`), UNIQUE (`usr_username`), UNIQUE (`usr_email`)) ENGINE = InnoDB;

ALTER TABLE `user` ADD `usr_phone` VARCHAR(20) NULL DEFAULT NULL AFTER `usr_email`;

ALTER TABLE `user` ADD UNIQUE(`usr_phone`);

ALTER TABLE `user` CHANGE `usr_phone` `usr_phone` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;

alter table user add column user_role enum('user','admin') not null default 'user';

ALTER TABLE user CHANGE COLUMN user_role user_role enum('user','admin') default 'user' AFTER usr_phone;

INSERT INTO `nodeapp`.`user` (`usr_fname`, `usr_lname`, `usr_username`, `usr_email`, `usr_phone`, `usr_password`, `usr_gender`, `usr_dob`) VALUES ('Ibramsha', 'A', 'ibmsha', 'bharath@mail.com', '9876543210', 'Ashmishara', 'M', '1989-12-18');


CREATE TABLE `nodeapp`.`post` ( 
`id` INT(11) NOT NULL AUTO_INCREMENT , 
`post_image` VARCHAR(100) NULL , 
`post_title` text NOT NULL , 
`post_content` text NOT NULL , 
`created_at` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;

ALTER TABLE `post` ADD `post_id` VARCHAR(20) Not NULL AFTER `id`;
ALTER TABLE `post` ADD `post_tag` VARCHAR(100) Not NULL DEFAULT 'PYTHON' AFTER `post_content`;

insert into post (post_id,post_title,post_content,created_at) 
values('f2926g58','Tutorial for Node 1', 'This is Node Program for learing Strucure','20230726150556');

