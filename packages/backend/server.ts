import path from 'path';
import mysql from 'mysql2/promise';
require('dotenv').config();
import express, { Request,Response,NextFunction } from 'express';
const app = express();
const PORT=process.env.PORT;

app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')));
app.use(express.json());

let connection:mysql.Connection;

const logMiddleware = (req:Request ,res:Response ,next:NextFunction)=>{
    console.log(req.method,req.url);
    next();
};

app.use(logMiddleware);

async function startServer(){
    try{
        connection = await mysql.createConnection({
            host: process.env.RDB_HOST,
            user: process.env.RDB_USER,
            password: process.env.RDB_PASSWORD,
            port : 3306,
            database: process.env.RDB_NAME,
            namedPlaceholders: true
        });

        console.log('connected to study_db');

        app.listen(PORT,() =>{
            console.log('start listening');
        });
        
    }catch(err){
        console.log('error connecting: ' + err);
        process.exit(1);
    }
}

startServer();

function wrapAsync(fn:(req:Request,res:Response,next:NextFunction)=>Promise<void>) {
    return function (req:Request, res:Response, next:NextFunction) {
        fn(req, res, next).catch(e => next(e));
    }
}
/*
app.get('/', wrapAsync(async (req,res) =>{
    const [rows,fields]= await connection.query('SHOW TABLES');
    console.log(rows);
    const tables=[];
    for(const table_name of rows){
        console.log(table_name);
        tables.push(table_name.Tables_in_21a5035);
    }
    console.log(tables);
    res.render(path.join(__dirname,'views','index.ejs'));
}));*/

app.get('/api/tables',wrapAsync(async(req:Request,res:Response)=>{
    const [rows,fields]= await connection.query('SHOW TABLES');
    res.status(200).json(rows);
}));

app.get('/api/Species',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query('SELECT * FROM Species');
    res.status(200).json(rows);
}));

app.get('/api/Species/:id',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'SELECT * FROM Species WHERE Dexnumber=:id',
        {id:req.params.id}
    );
    res.status(200).json(rows);
}));

app.post('/api/Species/insert',wrapAsync(async(req:Request,res:Response)=>{
    const { id,name,hp,Attack,Defense,sAttack,sDefense,Speed }=req.body;
    const [rows,fields]= await connection.query(
        'INSERT INTO Species(DexNumber,name,HP,Attack,Defense,sAttack,sDefense,Speed) \
        VALUES(:DexNumber,:name,:HP,:Attack,:Defense,:sAttack,:sDefense,:Speed)',
        {DexNumber:id,name,HP:hp,Attack,Defense,sAttack,sDefense,Speed}
    );
    res.status(200).json(rows);
}));

app.post('/api/Species/delete',wrapAsync(async(req:Request,res:Response) =>{
        const [rows,fields] = await connection.query(
            'DELETE FROM Species WHERE DexNumber = :id',
            {id:req.body.id}
        );
        res.status(200).json(rows);
}));

class CustomError extends Error {
    status?: number;
    message:string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status || 500;
        this.message = message;
    }
}

app.use((err:CustomError,req:Request,res:Response,next:NextFunction) =>{
    console.log(err);
    res.status(err.status || 500).send('Interial Server Error');
});