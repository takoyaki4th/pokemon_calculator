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

//error処理をつける
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

//Speciesテーブルのapi
app.get('/api/Species',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query('SELECT * FROM Species');
    res.status(200).json(rows);
}));

app.get('/api/Species/all_pokemon',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query('SELECT DexNumber as id,name FROM Species'); //分かりやすいからidにした
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
    let { id,name,hp,Attack,Defense,sAttack,sDefense,Speed,type1,type2 }=req.body;
    if(type2===""){
        type2=null;
    }
    const [rows,fields]= await connection.query(
        'INSERT INTO Species(DexNumber,name,HP,Attack,Defense,sAttack,sDefense,Speed,type1,type2) \
        VALUES(:DexNumber,:name,:HP,:Attack,:Defense,:sAttack,:sDefense,:Speed,:type1,:type2)',
        {DexNumber:id,name,HP:hp,Attack,Defense,sAttack,sDefense,Speed,type1,type2}
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

//movesテーブルのapi
app.get('/api/moves/id/:id',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'SELECT * FROM moves WHERE id = :id',
        {id:req.params.id}
    );
    res.status(200).json(rows);
}));

app.get('/api/moves/name/:name',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'SELECT * FROM moves WHERE name = :name',
        {name:req.params.name}
    );
    res.status(200).json(rows);
}));


app.post('/api/moves/insert',wrapAsync(async(req:Request,res:Response) =>{
    const { name,damage_class,power,type } = req.body;
    const [rows,fields] = await connection.query(
        'INSERT INTO moves(name,damage_class,power,type) \
        VALUES(:name,:damage_class,:power,:type)',
        {name,damage_class,power,type}
    );
    res.status(200).json(rows);
}));

app.post('/api/moves/delete',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'DELETE FROM moves WHERE id = :id',
        {id:req.body.id}
    );
    res.status(200).json(rows);
}));

//moveLearnMap(ポケモンと覚える技を対応させるデータベース)
app.get('/api/moveLearnMap/id/:id',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'SELECT * FROM moveLearnMap WHERE id = :id',
        {id:req.params.id}
    );
    res.status(200).json(rows);
}));

app.get('/api/moveLearnMap/dex_number/:dex_number',wrapAsync(async(req:Request,res:Response)=>{
    const [rows,fields] = await connection.query(
        'SELECT id,name FROM moves WHERE damage_class != "status" AND id IN(SELECT move_id FROM moveLearnMap WHERE dex_number = :dex_number)',
        {dex_number:req.params.dex_number}
    );
    res.status(200).json(rows);
}));

app.post('/api/moveLearnMap/insert',wrapAsync(async(req:Request,res:Response) =>{
    const { dex_number,move_id } = req.body;
    const [rows,fields] = await connection.query(
        'INSERT INTO moveLearnMap(dex_number,move_id) \
        VALUES(:dex_number,:move_id)',
        {dex_number,move_id}
    );
    res.status(200).json(rows);
}));

app.post('/api/moveLearnMap/delete',wrapAsync(async(req:Request,res:Response) =>{
    const [rows,fields] = await connection.query(
        'DELETE FROM moveLearnMap WHERE id = :id',
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
};

app.use((err:CustomError,req:Request,res:Response,next:NextFunction) =>{
    console.log(err);
    res.status(err.status || 500).send('Interial Server Error');
});
