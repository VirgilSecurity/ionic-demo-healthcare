const { formatNamesList, reportError } = require('./utils');
const APP_CLASSIFICATION_VALUES = ['patient_physician', 'patient_physician_insurer'];

async function createIonicDataMarkings(client) {
    // find "classification" pre-defined data marking
    const classificationMarkingResponse = await client.findDataMarkings({ searchParams: { name: 'classification' }});
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
        await client.updateDataMarking(
            classificationMarking.id,
            {
                values: [
                    ...existingValues,
                    ...(missingValueNames.map(name => ({ name })))
                ]
            }
        );
    } else {
        console.log(`Classification ${formatNamesList(APP_CLASSIFICATION_VALUES, 'value', 'values')} already exist`);
    }
}

module.exports = createIonicDataMarkings;

if (require.main === module) {
    require('dotenv').config();
    const IonicClient = require('../server/ionic/client');

    const client = new IonicClient({
        baseUrl: process.env.IONIC_API_BASE_URL,
        tenantId: process.env.IONIC_TENANT_ID,
        authToken: process.env.IONIC_API_AUTH_TOKEN
    });

    createIonicDataMarkings(client)
    .then(() => console.log('Done!'))
    .catch(reportError);
}
