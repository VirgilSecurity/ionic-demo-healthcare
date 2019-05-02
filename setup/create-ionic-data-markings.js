require('dotenv').config();
const IonicClient = require('../server/ionic/client');

const APP_CLASSIFICATION_VALUES = ['patient_physician', 'patient_physician_insurer'];

const client = new IonicClient({
    baseUrl: process.env.IONIC_API_BASE_URL,
    tenantId: process.env.IONIC_TENANT_ID,
    authToken: process.env.IONIC_API_AUTH_TOKEN
});

async function createIonicDataMarkings() {
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
        console.log(`Creating classification values: ${missingValueNames.join(' and ')}`);
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
        console.log(`Classification values: ${APP_CLASSIFICATION_VALUES.join(' and ')} already exist`);
    }
}

module.exports = createIonicDataMarkings;

if (require.main === module) {
    createIonicDataMarkings()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error getting data markings: %o', err));
}
