//Работу выполнил: Усольцев Владислав ПИНб-31

const mysql = require("mysql2");
const express = require("express");

const paramsDB = {
    host: "pgsha.ru",
    port: "35006",
    user: "soft0059",
    password: "6kf2Km2U",
    database: "soft0059_labrab06"
};

const pool = mysql.createPool(paramsDB);

function get_connection() {
    return mysql.createConnection(paramsDB);
}

const app = express();
const urlencodedParser = express.urlencoded({extended: false});
app.use('/css', express.static(__dirname + '/css'));
app.set("view engine", "hbs");


app.get("/", function(req, res) {
    let query = "SELECT * FROM auto";
    pool.query(query, function(err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            auto: data
        });
    });
});

app.get("/create", function(req, res) {
    res.render("create.hbs");
});

app.post("/create", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const brand = req.body.brand;
    const model = req.body.model;
    const color = req.body.color;
    const priceOpt = req.body.priceOpt;
    const priceRoz = req.body.priceRoz;
    let query = "INSERT INTO auto (brand, model, color, priceOpt, priceRoz) VALUES (?,?,?,?,?)";
    let params = [brand, model, color, priceOpt, priceRoz];
    pool.query(query, params, function(err, data) {
        if (err) return console.error(err);
        res.redirect("/");
    });
});

app.get("/edit/:id", function(req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM auto WHERE id=?", [id], function(err, data) {
        if (err) return console.error(err);
        res.render("edit.hbs", {
            auto: data[0]
        });
    });
});

app.post("/edit", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const brand = req.body.brand;
    const model = req.body.model;
    const color = req.body.color;
    const priceOpt = req.body.priceOpt;
    const priceRoz = req.body.priceRoz;
    let query = "UPDATE auto SET brand=?, model=?, color=?, priceOpt=?, priceRoz=? WHERE id=?";
    let params = [brand, model, color, priceOpt, priceRoz, id];
    pool.query(query, params, function(err, data) {
        if (err) return console.error(err);
        res.redirect("/");
    });
});

app.post("/delete/:id", function(req, res) {
    const id = req.params.id;
    pool.query("DELETE FROM auto WHERE id=?", [id], function(err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/sort/:field.:direct", function(req, res) {
    const field = req.params.field;
    const direct = req.params.direct;
    let query = "SELECT * FROM auto ORDER BY " + field + " " + direct;
    pool.query(query, function(err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            auto: data
        });
    });
});

app.get("/recover", function(req, res) {
    let query_truncate = "TRUNCATE `auto`";
    let query_insert = "INSERT INTO `auto` \
    (`id`, `brand`, `model`, `color`, `priceOpt`, `priceRoz`) VALUES \
    (NULL,'Mercedes-Benz','W205','Черный',1550000,2000000), \
    (NULL,'Opel','Insignia','Красный',900000,1300000), \
    (NULL,'Lada','Granta','Белый',500000,750000), \
    (NULL,'Lexus','GS IV 350','Серый',2000000,2700000), \
    (NULL,'Toyota','Camry VIII','Белый',1800000,2000000), \
    (NULL,'Renault','Kaptur I','Желтый',720000,1050000), \
    (NULL,'Peugeot','508 I GT','Черный',890000,1250000), \
    (NULL,'Mazda','CX-5','Красный',1550000,1800000), \
    (NULL,'Audi','A4 V','Желтый',2500000,3000000), \
    (NULL,'Porsche','Macan','Черный',3500000,4200000), \
    (NULL,'Suzuki','Grand Vitara','Черный',850000,1150000);";
    
    const conn = get_connection();

    conn.promise()
        .query(query_truncate)
        .then(() => {
            conn.promise()
                .query(query_insert)
                .catch((err) => console.error(err));
        })
        .then(() => {
            conn.promise()
                .query('SELECT * FROM auto')
                .then(([data]) => {
                    res.render('index.hbs', {
                        auto: data
                    });
                })
        .then(conn.end())
        .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
})

app.get("/clear", function(req, res) {
    let query_truncate = "TRUNCATE auto";
    
    const conn = get_connection();

    conn.promise()
    .query(query_truncate)
    .then(() => {
        conn.promise()
            .query('SELECT * FROM auto')
            .then(([data]) => {
                res.render('index.hbs', {
                    auto: data
                });
            })
            .then(conn.end())
            .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

app.listen(3000, function() {
    console.log("смотрим работу через браузер - http://localhost:3000/");
    let isWin = process.platform === "win32";
    let hotKeys = isWin? "Ctrl+C": "Ctrl+D";
    console.log(`остановить сервер - ${hotKeys}`);
});