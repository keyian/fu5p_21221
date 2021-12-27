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

select column_name, data_type from information_schema.columns where table_name = 'places';

select column_name, data_type from information_schema.columns where table_name = 'images';

select column_name, data_type from information_schema.columns where table_name = 'users';

select column_name, data_type from information_schema.columns where table_name = 'items';



alter table places
alter column coordinates type float[];

alter table places
add constraint goog_place_unique unique (google_place_id);

alter table images
add column item_id int,
add constraint fk_item
foreign key(item_id)
references items(item_id)
on delete set null;

alter table items
add column description text;

SELECT (con.conname, con.contype)
       FROM pg_catalog.pg_constraint con
            INNER JOIN pg_catalog.pg_class rel
                       ON rel.oid = con.conrelid
            INNER JOIN pg_catalog.pg_namespace nsp
                       ON nsp.oid = connamespace
       WHERE rel.relname = 'items';

alter table comments
add column user_id int,
add constraint fk_user
foreign key(user_id)
references users(facebook_id)
on delete set null;

alter table item_likes
add constraint fk_user
foreign key(user_id)
references users(facebook_id)
on delete set null;

alter table items
add column user_id int,
add constraint fk_user
foreign key(user_id)
references users(facebook_id)
on delete set null;

alter table items
drop constraint fk_user,
drop column user_id;

alter table items
add constraint fk_user
foreign key(creator_id)
references users(facebook_id)
on delete set null;

alter table items
add column main_image_filepath text not null;

alter table items
alter column creator_id type bigint;

--test on my item query... need an item first
insert into items(name, creator_id, price, place_id, likes, image_id, description)
values ('poop', 557357067800523, 2, 11, 0, 26, 'blah blah');

with inserted_item as 
(insert into items(name, creator_id, price, place_id, likes, image_id, description)
values('poop', 557357067800523, 2, 11, 0, 26, 'blah blah') 
returning *)
select * from inserted_item
inner join images on inserted_item.image_id = images.image_id
inner join places on inserted_item.place_id = places.place_id;

insert into users(name, picture, facebook_id, email) 
values('Keyian Vafai', 
'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=557357067800523&height=50&width=50&ext=1642009943&hash=AeSQ-1u5sXnGDvZaWgU', 
'557357067800523', 
'ksv216@nyu.edu')

with inserted_user as (insert into users(name, picture, facebook_id, email) 
values('Keyian Vafai', 
'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=557357067800523&height=50&width=50&ext=1642009943&hash=AeSQ-1u5sXnGDvZaWgU', 
557357067800523, 
'ksv216@nyu.edu') 
on conflict(facebook_id)
do nothing)
inserted_user
union
select * from users where facebook_id = 557357067800523;

--without alias?
insert into users(name, picture, facebook_id, email) 
values('Keyian Vafai', 
'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=557357067800523&height=50&width=50&ext=1642009943&hash=AeSQ-1u5sXnGDvZaWgU', 
557357067800523, 
'ksv216@nyu.edu') 
on conflict(facebook_id)
do nothing
union
select * from users where facebook_id = 557357067800523;


--simple case without worry about concurrent writing..?
WITH ins_user AS (
   INSERT INTO users(name, picture, facebook_id, email)
   VALUES ('Keyian Vafai', 
'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=557357067800523&height=50&width=50&ext=1642009943&hash=AeSQ-1u5sXnGDvZaWgU', 
557357067800523, 
'ksv216@nyu.edu')
   ON CONFLICT ON CONSTRAINT names_name_key DO NOTHING  -- no lock needed
   RETURNING id
   )
SELECT id FROM ins
UNION  ALL
SELECT id FROM names
WHERE  name = 'bob'  -- only executed if no INSERT
LIMIT  1;

with inserted_item as 
(insert into items(name, creator_id, price, place_id, likes, image_id, description)
values('poopie500', 557357067800523, 17, 11, 0, 26, 'blue blue') 
returning *)
select * from inserted_item
inner join images on inserted_item.image_id = images.image_id
inner join places on inserted_item.place_id = places.place_id;

select*from items where item_id = 34 inner join comments on items.item_id = comments.item_id;

select i.*, c.comment_text, c.user_name, c.user_id
from items i
inner join comments c on i.item_id = c.item_id;

alter table items
add column created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

alter table comments
alter column user_id type bigint;

alter table item_likes
alter column user_id type bigint;

select il.like_status, il.item_id, u.*
from item_likes il
inner join users u on u.facebook_id = il.user_id
group by facebook_id;

update items set likes = 0 where item_id = 40;

SELECT (con.conname, con.contype)
       FROM pg_catalog.pg_constraint con
            INNER JOIN pg_catalog.pg_class rel
                       ON rel.oid = con.conrelid
            INNER JOIN pg_catalog.pg_namespace nsp
                       ON nsp.oid = connamespace
       WHERE rel.relname = 'users';


alter table users drop column facebook_id cascade;

alter table users
   add column user_id serial primary key;




alter table items
drop constraint fk_user;

alter table items
add constraint fk_user
foreign key(creator_id)
references users(user_id)
on delete set null;

alter table item_likes
drop constraint fk_user;

alter table item_likes
add constraint fk_user
foreign key(user_id)
references users(user_id)
on delete set null;

alter table comments
drop constraint fk_user;

alter table comments
add constraint fk_user
foreign key(user_id)
references users(user_id)
on delete set null;

alter table users
add constraint email_unique
unique(email);

alter table users
add column password varchar(255)


alter table users
alter column user_id type uuid;

--set of instructions to drop and re-add user constraint with uuid....
alter table users
alter column password set not null;

alter table users 
drop column user_id cascade;

alter table users
add column user_id uuid DEFAULT uuid_generate_v4();

alter table items

alter table items
add constraint fk_user
foreign key(creator_id)
references users(user_id)
on delete set null;

alter table item_likes
add constraint fk_user
foreign key(user_id)
references users(user_id)
on delete set null;

alter table comments
add constraint fk_user
foreign key(user_id)
references users(user_id)
on delete set null;

alter table items 
drop column creator_id,
add column creator_id uuid,
add constraint fk_user
foreign key (creator_id)
references users(user_id)
on delete set null;

alter table item_likes 
drop column user_id,
add column user_id uuid,
add constraint fk_user
foreign key (user_id)
references users(user_id)
on delete set null;

alter table comments 
drop column user_id,
add column user_id uuid,
add constraint fk_user
foreign key (user_id)
references users(user_id)
on delete set null;

alter table items
add constraint not_null_creator

alter table items
alter column price type float;