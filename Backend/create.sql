SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS location,
room_type,
dristor_rooms,
pipera_rooms,
guest,
reservation;

SET
    FOREIGN_KEY_CHECKS = 1;

CREATE TABLE location (
    location_id varchar(3) primary key,
    location_name varchar(64) not null,
    area varchar(32)
);

INSERT INTO
    location
VALUES
    ("PIP", "Acomodoro Apartments Next-Door", "Pipera"),
    ("DRI", "Acomodoro Residence", "Dristor");

CREATE TABLE room_type (
    type_id varchar(3) primary key,
    type_name varchar(32),
    capacity int,
    price int
);

INSERT INTO
    room_type
VALUES
    ("RES", "Studio", 2, 300),
    ("DPR", "ApartmentPlus", 4, 450),
    ("APT", "Apartment", 4, 600),
    ("DBL", "Double", 2, 180),
    ("TWN", "Twin", 2, 200),
    ("TRP", "Triple", 3, 250),
    ("FMR", "Family", 4, 300);

CREATE TABLE dristor_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id) on update cascade on delete cascade
);

CREATE TABLE pipera_rooms (
    room_number int primary key,
    type_id varchar(3),
    foreign key (type_id) references room_type (type_id) on update cascade on delete cascade
);

INSERT INTO
    dristor_rooms
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
    (56, "FMR");

INSERT INTO
    pipera_rooms
VALUES
    (8, "APT");

CREATE TABLE guest (
    guest_id int primary key auto_increment,
    guest_name varchar(64),
    date_of_birth date,
    document_number varchar(32)
);

INSERT INTO
    guest (guest_name, date_of_birth, document_number)
VALUES
    ("Alex Prunea", "2005-09-05", "12345678");

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
    (13, 1, "DRI", "2024-01-23", "2024-01-28", 2, 600);