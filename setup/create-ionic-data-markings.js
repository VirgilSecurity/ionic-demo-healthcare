const { formatNamesList, reportError } = require('./utils');
const { APP_CLASSIFICATION_VALUES } = require('./app-data');

async function createIonicDataMarkings(client) {
    // find "classification" pre-defined data marking
    const classificationMarkingResponse = await client.dataMarkings.listMarkings({ filter: { name: 'classification' }});
    const classificationMarking = classificationMarkingResponse.Resources[0];
    if (!classificationMarking) {
        throw new Error('Could not find "classification" data marking');
    }

    // check that values used by the demo app exist
    const existingValues = (classificationMarking.detail.values || []);
    const missingValueNames = APP_CLASSIFICATION_VALUES.filter(
        val => existingValues.map(existing => existing.name).includes(val) === false
    );

    if (missingValueNames.length > 0) {
        console.log(`Creating classification ${formatNamesList(missingValueNames, 'value', 'values')}`);
        await client.dataMarkings.updateMarking(
            classificationMarking.id,
            {
                detail: {
                    values: [
                        ...existingValues,
                        ...(missingValueNames.map(name => ({ name })))
                    ]
                }
            }
        );
    } else {
        console.log(`Classification ${formatNamesList(APP_CLASSIFICATION_VALUES, 'value', 'values')} already exist`);
    }
}

module.exports = createIonicDataMarkings;

if (require.main === module) {
    require('dotenv').config();
    const { IonicApiClient } = require('ionic-admin-sdk');

    const client = new IonicApiClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        auth: {
            type: 'bearer',
            secretToken: process.env.IONIC_API_AUTH_TOKEN
        }
    });

    createIonicDataMarkings(client)
    .then(() => console.log('Done!'))
    .catch(reportError);
}
