const path=require('path');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();

app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')));
app.use(express.json());

let connection;

const mysqlOptions = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port : 3306,
    database: '21a5035',
    namedPlaceholders: true
};

const logMiddleware = (req ,res ,next)=>{
    console.log(req.method,req.url);
    next();
};

app.use(logMiddleware);

async function startServer(){
    try{
        connection = await mysql.createConnection(mysqlOptions);

        console.log('connected to study_db');

        app.listen(8000,() =>{
            console.log('start listening');
        });
        
    }catch(err){
        console.log('error connecting: ' + err);
        process.exit(1);
    }
}

startServer();

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

app.get('/', wrapAsync(async (req,res) =>{
    res.render(path.join(__dirname,'views','index.ejs'));
}));

app.post('/api/Species',wrapAsync(async(req,res) =>{
    const [rows,fields] = await connection.query('SELECT * FROM Species');
    res.status(200).json(rows);
}));

app.post('/api/Species/insert',wrapAsync(async(req,res)=>{
    const { DexNumber,name,HP,Attack,Defense,sAttack,sDefense,Speed }=req.body;
    const [rows,fields]= await connection.query(
        'INSERT INTO Species(DexNumber,name,HP,Attack,Defense,sAttack,sDefense,Speed) \
        VALUES(:DexNumber,:name,:HP,:Attack,:Defense,:sAttack,:sDefense,:Speed)',
        {DexNumber,name,HP,Attack:Attack,Defense:Defense,sAttack:sAttack,sDefense:sDefense,Speed:Speed}
    );
    res.status(200).json(rows);
}));

app.post('/api/Species/delete',wrapAsync(async(req,res) =>{
    const [rows,fields] = await connection.query(
        'DELETE FROM Species WHERE DexNumber = :id',
        {id:req.body.id}
    );
    res.status(200).json(rows);
}));

app.use((err,req,res,next) =>{
    if(err.status){
        return res.status(err.status).send(err.message);
    }
    console.log(err);
    res.status(500).send('Interial Server Error');
});