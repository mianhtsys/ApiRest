import 'dotenv/config.js';
import app from "./app.js";
import logger from "./logs/logger.js";
import config from './config/env.js'; // Ensure environment variables are loaded
import { sequelize } from "./database/database.js";

async function main(){
    await sequelize.sync({force: false});
    //console.log('====>', config.PORT);
    const port = config.PORT;
    app.listen(port)
        //console.log("Server is running on port 3000");
        logger.info('Server started on port:' + port);
        logger.error('This is an error message');
        logger.warn('This is a warning message');
        logger.debug('This is a debug message');
        logger.fatal('This is a fatal message');
        
    
}

main();