-- Insert guests
INSERT INTO
    guest (guest_name, date_of_birth, document_number)
VALUES
    ("Adam Smith", "2005-09-05", "12345678"),
    ("John Doe", "1990-03-15", "87654321"),
    ("Jane Doe", "1985-12-10", "98765432"),
    ("Alice Johnson", "1975-07-20", "55555555");

-- Insert reservations
-- Past reservations
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
VALUES
    (13, 1, "DRI", "2023-12-10", "2023-12-15", 2, 600),
    (24, 2, "PIP", "2023-11-20", "2023-11-25", 4, 800);

-- Future reservations
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
VALUES
    (21, 3, "DRI", "2024-01-25", "2024-01-28", 2, 600),
    (8, 4, "PIP", "2024-02-05", "2024-02-10", 4, 800),
    (43, 1, "DRI", "2024-03-01", "2024-03-05", 2, 600),
    (16, 2, "PIP", "2024-03-15", "2024-03-20", 4, 800),
    (11, 3, "DRI", "2024-04-10", "2024-04-15", 2, 600),
    (39, 4, "PIP", "2024-04-20", "2024-04-25", 4, 800);

-- Reservations around today's date
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
VALUES
    (22, 1, "DRI", "2024-01-22", "2024-01-25", 2, 600),
    (4, 2, "PIP", "2024-01-28", "2024-02-02", 4, 800),
    (31, 3, "DRI", "2024-01-30", "2024-02-05", 2, 600),
    (5, 4, "PIP", "2024-02-01", "2024-02-06", 4, 800);

-- Reservations in the distant future
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
VALUES
    (37, 1, "DRI", "2024-06-01", "2024-06-07", 2, 600),
    (18, 2, "PIP", "2024-07-15", "2024-07-20", 4, 800),
    (52, 3, "DRI", "2024-08-10", "2024-08-15", 2, 600),
    (21, 4, "PIP", "2024-09-05", "2024-09-10", 4, 800);
