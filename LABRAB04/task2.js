const ut = require('./modules/utils');  

let query_insert = "INSERT INTO data_set \
(id, day, city, name, count) \
VALUES \
(NULL, '2021-06-22', 'Пермь', 'Усольцев Владислав', 3)";

const conn = ut.get_conn();

conn.promise()
    .query(query_insert)
    .then(() => console.log('row inserted'))
    .catch((err) => console.error(err))
    .then(conn.end());