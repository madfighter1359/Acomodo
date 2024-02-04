-- create table Locations (
--     ID int primary key,
--     LocationName varchar(64),
--     Studio int,
--     Apartment int,
--     ApartmentPlus int,
--     DoubleBed int,
--     Twin int,
--     Triple int,
--     Family int
-- );
-- show create table locations;
create table Rooms (
    RoomName varchar(64) primary key,
    Capacity int,
    Price int
);

insert into
    rooms
values
    ("Studio", 2, 300),
    ("Apartment", 4, 450),
    ("ApartmentPlus", 4, 600),
    ("DoubleBed", 2, 180),
    ("Twin", 2, 200),
    ("Triple", 3, 250),
    ("Family", 4, 300);

--reservation table: 
--guest table
create table Guests (
    GuestID int primary key auto_increment,
    Name varchar(64),
    DoB date,
    DocNumber varchar(32)
);

create table Reservations (
    ReservationID int primary key auto_increment,
    GuestID int not null,
    CheckIn date,
    CheckOut date,
    Guests int,
    Price int, -- in pennies
    foreign key (GuestID) references Guests (GuestID)
);

create table PiperaRooms (
    roomNr int primary key,
    roomType varchar(16) check (
        roomType in ("Studio", "Apartment", "ApartmentPlus")
    )
)
create table DristorRooms (
    roomNr int primary key,
    roomType varchar(16) check (
        roomType in ("Double", "Twin", "Triple", "Family")
    ),
)
-- RESERVATION-> roomNr, location, guestid, 
create table Reservations (
    ReservationID int primary key auto_increment,
    GuestID int not null,
    RoomNr int, --check? fkey?
    Loaction varchar(12) check (Location in ("")),
    CheckIn date,
    CheckOut date,
    Guests int,
    Price int, -- in pennies
    foreign key (GuestID) references Guests (GuestID)
);

select
    room_number
from
    reservation
where
    check_in_date not between "2024-01-21" and "2024-01-22"
    and check_out_date not between "2024-01-21" and "2024-01-22";

select
    dristor_rooms.room_number
from
    dristor_rooms,
    reservation
where
    not dristor_rooms.room_number = any (
        select
            room_number
        from
            reservation
    );

select
    dristor_rooms.room_number
from
    dristor_rooms,
    reservation
where
    not dristor_rooms.room_number = any (
        select
            room_number
        from
            reservation
        where
            (? < check_out_date)
            and (check_in_date < ?)
    );

select
    room_number
from
    reservation
where
    (? < check_out_date)
    and (check_in_date < ?);

--working
SELECT
    room_number
FROM
    dristor_rooms
WHERE
    NOT room_number = ANY (
        SELECT
            room_number
        FROM
            reservation
        WHERE
            (? < check_out_date)
            AND (check_in_date < ?)
    );

SELECT
    dristor_rooms.room_number
FROM
    dristor_rooms,
    room_type
WHERE
    dristor_rooms.type_id = room_type.type_id
    AND capacity >= ?;

SELECT
    price
FROM
    room_type
WHERE
    capacity >= ?
    AND type_id = ANY (
        SELECT
            type_id
        FROM
            ?
    )
ORDER BY
    price
LIMIT
    1;

SELECT
    count(room_type.type_id),
    room_type.type_id,
    price,
    type_name
FROM
    dristor_rooms,
    room_type
WHERE
    (
        NOT room_number = ANY (
            SELECT
                room_number
            FROM
                reservation
            WHERE
                ("2024-01-26" < check_out_date)
                AND (check_in_date < "2024-01-29")
        )
    )
    AND dristor_rooms.type_id = room_type.type_id
    AND capacity >= 2
GROUP BY
    room_type.type_id;

SELECT
    room_number,
    price
FROM
    dri_rooms,
    room_type
WHERE
    (
        NOT room_number = ANY (
            SELECT
                room_number
            FROM
                reservation
            WHERE
                ("2024-04-24" < check_out_date)
                AND (check_in_date < "2024-04-29")
        )
    )
    AND dri_rooms.type_id = room_type.type_id
    AND dri_rooms.type_id = "DBL"
    AND capacity >= 3
ORDER BY
    room_number ASC
LIMIT
    1;

SELECT
    room_number,
    price
FROM
    dri_rooms,
    room_type
WHERE
    (
        NOT room_number = ANY (
            SELECT
                room_number
            FROM
                reservation
            WHERE
                ("2024-05-24" < check_out_date)
                AND (check_in_date < "2024-05-29")
        )
    )
    AND dri_rooms.type_id = room_type.type_id
    AND capacity >= 3
ORDER BY
    room_number ASC
LIMIT
    1;