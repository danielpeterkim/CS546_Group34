import { players, reports } from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb';

export const createReport = async (
    filingPlayer,
    reportedPlayer,
    reportData
    ) => {
        if(!filingPlayer) throw 'Error: Missing filing player';
        if(!reportedPlayer) throw 'Error: Missing reported player';
        if(!reportData) throw 'Error: missing report reason';
        
        if (typeof filingPlayer !== 'string') throw 'Error: filing player must be a string';
        if (filingPlayer.trim().length === 0) throw 'Error: filing player name cannot be empty';
        if (typeof reportedPlayer !== 'string') throw 'Error: reported player must be a string';
        if (typeof reportedPlayer.trim().length === 0) throw 'Error: reported player name cannot be empty';
        if (filingPlayer.trim() === reportedPlayer.trim()) throw 'Error: you cannot report yourself!';
        if (typeof reportData !== 'object') throw 'Error: report data must be an object';
        if (!('reportType' in reportData) 
            || !(['reasonBadName', 'reasonHarassment', 'reasonOther'].includes(reportData.reportType.trim()))) {
            console.log(reportData);
            throw 'Error: invalid report type';
        }
        const reportType = reportData.reportType.trim();

        if (reportType === 'reasonOther' && !('reportDesc' in reportData)) throw 'Error: missing report description';
        if (reportType === 'reasonOther' && (typeof reportData.reportDesc !== 'string')) throw 'Error: report description must be a string';
        if (reportType === 'reasonOther' && reportData.reportDesc.trim().length > 50) throw 'Error: report description can be at most 50 characters';
        if (reportType === 'reasonOther'){
            reportData.reportDesc = reportData.reportDesc.trim();
        }

        const playersCollection = await players();
        const filingPlayerEntry = await playersCollection.findOne({username: filingPlayer});
        const reportedPlayerEntry = await playersCollection.findOne({username: reportedPlayer});

        if (!filingPlayerEntry) throw 'Error: could not find filing player';
        if (!reportedPlayerEntry) throw 'Error: could not find reported player';

        let report = {
            filingPlayer: filingPlayer.trim(),
            reportedPlayer: reportedPlayer.trim(),
            reportData: reportData,
            reportStatus: 'pending'
        }


        const reportCollection = await reports();

        
        const reportExists = await reportCollection.findOne({filingPlayer: filingPlayer.trim(), reportedPlayer: reportedPlayer.trim(), reportStatus: 'pending'});
        
        console.log(reportExists);

        if (!!reportExists) throw 'Error: you already have a pending report against this player.'

        const insertInfo = await reportCollection.insertOne(report);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: could not file report.';
        return {filedReport: true};
    }
