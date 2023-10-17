// DAO: dentro de cada DAO configuramos el CRUD en las distintas persistencias. (Memoria, file o db)
// Factory: Es para definir que tipo de persisitencia usamos

const connectionFn = require("../connection");

const factoryFn = ((config)=>{
    //console.log(config.persistence)
    switch(config.persistence){
        case "MONGO":
            CONNECTION_MONGO = `mongodb+srv://${config.db_user}:${config.db_password}@${config.db_host}/${config.db_name}?retryWrites=true&w=majority`;
            console.log(`Sistema conectado a la base de datos dbAtlas`)
            connectionFn(CONNECTION_MONGO); 
            break;
        case "LOCAL":
            CONNECTION_MONGO = `mongodb://${config.db_host}/${config.db_name}`;
            console.log(`Sistema conectado a la base local`)
            connectionFn(CONNECTION_MONGO);
            break;
    }
})

module.exports = factoryFn;