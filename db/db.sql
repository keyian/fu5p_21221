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

alter table images 
add column filename text unique not null,
add column filepath text not null,
add column mimetype text not null,
add column size BIGINT not null;

create table item_likes (
    item_like_id serial primary key,
    item_id int not null,
    user_id int not null,
    like_status boolean not null,
    constraint fk_item foreign key(item_id) references items(item_id),
    constraint fk_user foreign key(user_id) references users(user_id)
);
