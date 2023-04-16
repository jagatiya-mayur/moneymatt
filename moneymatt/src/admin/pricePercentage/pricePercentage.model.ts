import { model, Schema } from 'mongoose';
import { PricePercentage, PricePercentageDoc } from './pricePercentage.interface';


const pricePercentageSchema: Schema = new Schema<PricePercentage>(
    {
        giveAwayPer: { type: Number, default: 10 }
    }
);

const picePercentageModel = model<PricePercentageDoc>('pricePer', pricePercentageSchema);

export default picePercentageModel;
