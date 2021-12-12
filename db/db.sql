alter table users 
add column name varchar(30) not null,
add column image_id int,
add column facebook_id int not null,
add column email varchar(60) not null;

alter table users 
add constraint fk_image 
foreign key(image_id) 
references images(image_id) 
on delete set null;