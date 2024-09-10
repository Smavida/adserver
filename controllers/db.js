const { BigQuery } = require('@google-cloud/bigquery');
require('dotenv').config();

exports.insertBQ = async (mainObject, table, dataset = process.env.DATASET) => {
    try {
        const result = await new BigQuery().dataset(dataset).table(table).insert([mainObject]);
        return result;
    } catch (err) {
        return err;
    }
};
