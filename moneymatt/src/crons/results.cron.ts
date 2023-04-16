import * as cron from "node-cron";
import { getPeriod, getYantraPeriod } from "../utils/utils";
import resultsService from "../common/results/results.service";
import yantraResultsService from "../common/yantraResults/yantraResults.service";
import { logger } from "../utils/logger";

// result Initlialiation cron 
cron.schedule("*/3 * * * *", async () => {
    try {
        setImmediate(async () => {
            const date: Date = new Date();
            const period: number = getPeriod(date);

            await resultsService.initializeResult(period, date);

            setTimeout(async () => {
                await resultsService.resultDeclaration(period);
            }, 170 * 1000);

            const nextDate: Date = new Date(date.getTime() + 180 * 1000);
            const nextPeriod: number = getPeriod(nextDate);

            await resultsService.initializeFutureResult(nextPeriod, date);

            logger.info(`[Initialized Result Executed Successfully] ===> Activity Cron`);
        });
    }
    catch (error: any) {
        console.log(error);
        logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});

cron.schedule("0 0 * * *", async () => {
    try {
        await resultsService.deleteResults();

        logger.info(`[Initialized Delete Result Executed Successfully] ===> Activity Cron`);
    }
    catch (error: any) {
        console.log(error);
        logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});

//yantra result Initlialiation cron 
cron.schedule("*/5 * * * *", async () => {
    try {
        setImmediate(async () => {
            const date: Date = new Date();
            const period: number = getYantraPeriod(date);

            await yantraResultsService.initializeResult(period, date);

            setTimeout(async () => {
                await yantraResultsService.resultDeclaration(period);
            }, 290 * 1000);

            const nextDate: Date = new Date(date.getTime() + 300 * 1000);
            const nextPeriod: number = getYantraPeriod(nextDate);

            await yantraResultsService.initializeFutureResult(nextPeriod, date);

            logger.info(`[Initialized Result Executed Successfully] ===> Activity yantra Cron`);
        })
    }
    catch (error: any) {
        console.log(error);
        logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});

cron.schedule("0 0 * * *", async () => {
    try {
        await yantraResultsService.deleteResults();

        logger.info(`[Initialized Delete Result Executed Successfully] ===> Activity yantra Cron`);
    }
    catch (error: any) {
        console.log(error);
        logger.error(`[Cron Error] ===> Activity Cron:: Message:: ${error.message}, \n Stack:: ${error.stack || 'something went wrong'}`);
    }
});



