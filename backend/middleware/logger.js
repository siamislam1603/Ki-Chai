import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import {rootDir} from '../util/rootDir.js';

export const logEvents=async(message,logFileName)=>{
    const dateTime=`${format(new Date(), 'MMM dd, yyyy h:mm:saa')}`;
    const logItem=`${dateTime}\t${uuidv4()}\t${message}}`;
    try {
        if(!fs.existsSync(path.join(rootDir(),'logs'))){
            await fsPromises.mkdir(path.join(rootDir(),'logs'));
        }
        await fsPromises.appendFile(path.join(rootDir(),'logs',logFileName),logItem);
    } catch (error) {
        console.log(error);
    }
}

export const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log');
    next();
}