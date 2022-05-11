create table follows (
    follow_id serial primary key,
    following_id uuid not null,
    followed_id uuid not null,
    constraint fk_following_user foreign key(following_id) references users(user_id),
    constraint fk_followed_user foreign key(followed_id) references users(user_id)
);