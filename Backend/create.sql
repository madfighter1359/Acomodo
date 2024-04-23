--Clear old data and create new database
SET
    FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS acomodo;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE DATABASE acomodo;

USE acomodo;

CREATE TABLE location (
    location_id varchar(3) primary key not null,
    location_name varchar(64) not null,
    area varchar(32) not null,
    image varchar(256) not null
);

INSERT INTO
    location
VALUES
    (
        "PIP",
        "Acomodoro Apartments Next-Door",
        "Pipera",
        "https://www.acomodo.ro/wp-content/uploads/2020/01/1-39-2048x1365.jpg.webp"
    ),
    (
        "DRI",
        "Acomodoro Residence",
        "Dristor",
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/472121158.jpg?k=eace370a0f64e0b4050eb7bfbeee2ba119d23c495b51ebe73328e71b40091dc3&o=&hp=1"
    );

CREATE TABLE room_type (
    type_id varchar(3) primary key not null,
    type_name varchar(32) not null,
    capacity int not null,
    price int not null,
    beds int not null,
    image varchar(256) not null
);

INSERT INTO
    room_type
VALUES
    (
        "RES",
        "Studio",
        2,
        300,
        1,
        "https://d3hj7i5wny7p5d.cloudfront.net/upload/rooms/13054-m.jpg"
    ),
    (
        "DPR",
        "Apartment Plus",
        4,
        600,
        2,
        "https://d3hj7i5wny7p5d.cloudfront.net/upload/rooms/13055-m.jpg"
    ),
    (
        "APT",
        "Apartment",
        4,
        450,
        2,
        "https://d3hj7i5wny7p5d.cloudfront.net/upload/rooms/13056-m.jpg"
    ),
    (
        "DBL",
        "Double",
        2,
        180,
        1,
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/472120586.jpg?k=20e9b73c3de67dff69d7f3380baeae130944b60928f1a1a312ac5d2844a514e9&o=&hp=1"
    ),
    (
        "TWN",
        "Twin",
        2,
        200,
        2,
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/472111196.jpg?k=7e53ca85446dae77747e837d80e023c51e33fd2ae11fea37e32ebd5046a3fd65&o=&hp=1"
    ),
    (
        "TRP",
        "Triple",
        3,
        250,
        2,
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/472103342.jpg?k=9bd7dcdcf58ce0695c217a540bd06d7cb4673b8606ad5d893f9482a54c806252&o=&hp=1"
    ),
    (
        "FMR",
        "Family",
        4,
        300,
        2,
        "https://cf.bstatic.com/xdata/images/hotel/max1280x900/472120654.jpg?k=66b1b02d44c53e73c11219ca1f994291968249fb2785d26a4647138a4670e778&o=&hp=1"
    );

CREATE TABLE dri_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id)
);

CREATE TABLE pip_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id)
);

INSERT INTO
    dri_rooms
VALUES
    (11, "DBL"),
    (13, "DBL"),
    (21, "DBL"),
    (22, "DBL"),
    (23, "DBL"),
    (24, "DBL"),
    (26, "DBL"),
    (31, "DBL"),
    (33, "DBL"),
    (34, "DBL"),
    (41, "DBL"),
    (43, "DBL"),
    (44, "DBL"),
    (51, "DBL"),
    (53, "DBL"),
    (54, "DBL"),
    (57, "DBL"),
    (36, "FMR"),
    (46, "FMR"),
    (56, "FMR"),
    (12, "TWN"),
    (14, "TWN"),
    (25, "TWN"),
    (27, "TWN"),
    (35, "TWN"),
    (37, "TWN"),
    (45, "TWN"),
    (47, "TWN"),
    (55, "TWN"),
    (32, "TRP"),
    (42, "TRP"),
    (52, "TRP");

INSERT INTO
    pip_rooms
VALUES
    (8, "APT"),
    (24, "APT"),
    (29, "APT"),
    (31, "APT"),
    (35, "APT"),
    (39, "APT"),
    (43, "APT"),
    (45, "APT"),
    (50, "APT"),
    (51, "APT"),
    (52, "APT"),
    (53, "APT"),
    (55, "APT"),
    (4, "RES"),
    (5, "RES"),
    (9, "RES"),
    (10, "RES"),
    (11, "RES"),
    (12, "RES"),
    (13, "RES"),
    (16, "RES"),
    (17, "RES"),
    (18, "RES"),
    (19, "RES"),
    (20, "RES"),
    (21, "RES"),
    (23, "RES"),
    (25, "RES"),
    (28, "RES"),
    (38, "RES"),
    (41, "RES"),
    (42, "RES"),
    (46, "RES"),
    (56, "RES"),
    (22, "DPR"),
    (36, "DPR");


CREATE TABLE guest (
    guest_id int primary key auto_increment,
    guest_name varchar(64) not null,
    date_of_birth date not null,
    document_number varchar(32) not null,
    email varchar(128) not null,
    firebase_uid varchar(128),
    unique (firebase_uid)
);

INSERT INTO
    guest (guest_name, date_of_birth, document_number)
VALUES
    ("John Doe", "2000-08-06", "12345678");

CREATE TABLE reservation (
    reservation_id int primary key not null auto_increment,
    room_number int not null,
    guest_id int not null,
    location_id varchar(3) not null,
    check_in_date date not null,
    check_out_date date not null,
    number_guests int not null,
    price int not null,
    foreign key (guest_id) references guest (guest_id),
    foreign key (location_id) references location (location_id)
);


CREATE TABLE transaction (
    transaction_id int primary key not null auto_increment,
    reservation_id int not null,
    transaction_date date not null,
    payment_method varchar(8) not null CHECK (payment_method IN ("cash", "card", "transfer")),
    amount int not null,
    paid boolean not null,
    foreign key (reservation_id) references reservation (reservation_id)
);

