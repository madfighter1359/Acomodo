SET
    FOREIGN_KEY_CHECKS = 0;

-- DROP TABLE IF EXISTS location,
-- room_type,
-- dri_rooms,
-- pip_rooms,
-- guest,
-- reservation;
DROP DATABASE IF EXISTS acomodo;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE DATABASE acomodo;

USE acomodo;

CREATE TABLE location (
    location_id varchar(3) primary key,
    location_name varchar(64) not null,
    area varchar(32),
    image varchar(256)
);

INSERT INTO
    location
VALUES
    (
        "APA",
        "Acomodo Premium Apartments",
        "Edinburgh",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "ACM",
        "Acomodo Modern",
        "Glasgow",
        "https://images.unsplash.com/photo-1465804575741-338df8554e02?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );

CREATE TABLE room_type (
    type_id varchar(3) primary key,
    type_name varchar(32),
    capacity int,
    price int,
    beds int,
    image varchar(256)
);

INSERT INTO
    room_type
VALUES
    (
        "STU",
        "Studio",
        2,
        100,
        1,
        "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "APP",
        "Apartment Plus",
        4,
        200,
        2,
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "APT",
        "Apartment",
        4,
        150,
        2,
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "DBL",
        "Double",
        2,
        50,
        1,
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "TWN",
        "Twin",
        2,
        75,
        2,
        "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "TRP",
        "Triple",
        3,
        100,
        2,
        "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ),
    (
        "FMR",
        "Family",
        4,
        125,
        2,
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );

CREATE TABLE acm_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id) on update cascade on delete cascade
);

CREATE TABLE apa_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id) on update cascade on delete cascade
);

INSERT INTO
    acm_rooms
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
    apa_rooms
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
    (4, "STU"),
    (5, "STU"),
    (9, "STU"),
    (10, "STU"),
    (11, "STU"),
    (12, "STU"),
    (13, "STU"),
    (16, "STU"),
    (17, "STU"),
    (18, "STU"),
    (19, "STU"),
    (20, "STU"),
    (21, "STU"),
    (23, "STU"),
    (25, "STU"),
    (28, "STU"),
    (38, "STU"),
    (41, "STU"),
    (42, "STU"),
    (46, "STU"),
    (56, "STU"),
    (22, "APP"),
    (36, "APP");

CREATE TABLE guest (
    guest_id int primary key auto_increment,
    guest_name varchar(64),
    date_of_birth date,
    document_number varchar(32),
    email varchar(128),
    firebase_uid varchar(128),
    unique (firebase_uid)
);

INSERT INTO
    guest (guest_name, date_of_birth, document_number)
VALUES
    ("John Doe", "2000-08-06", "12345678");

CREATE TABLE reservation (
    reservation_id int primary key auto_increment,
    room_number int not null,
    guest_id int not null,
    location_id varchar(3) not null,
    check_in_date date not null,
    check_out_date date not null,
    number_guests int,
    price int,
    foreign key (guest_id) references guest (guest_id),
    foreign key (location_id) references location (location_id)
);

INSERT INTO
    reservation (
        room_number,
        guest_id,
        location_id,
        check_in_date,
        check_out_date,
        number_guests,
        price
    )
values
    (13, 1, "ACM", "2024-02-27", "2024-01-29", 2, 100);

INSERT INTO
    reservation (
        room_number,
        guest_id,
        location_id,
        check_in_date,
        check_out_date,
        number_guests,
        price
    )
values
    (13, 1, "ACM", "2024-03-01", "2024-03-06", 2, 250);

CREATE TABLE transaction (
    transaction_id int primary key auto_increment,
    reservation_id int not null,
    transaction_date date,
    payment_method varchar(8) CHECK (payment_method IN ("cash", "card", "transfer")),
    amount int,
    paid boolean,
    foreign key (reservation_id) references reservation (reservation_id)
);

INSERT INTO
    transaction (
        reservation_id,
        transaction_date,
        payment_method,
        amount,
        paid
    )
values
    (1, "2024-02-23", "cash", 100, true);