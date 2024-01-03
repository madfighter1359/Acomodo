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
