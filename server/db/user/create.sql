INSERT into users (first_name, last_name, hash, email, phone_number, street_address, city, state, zip)
values ($1,$2,$3,$4,$5,$6,$7, $8, $9) returning first_name, last_name, email, phone_number;