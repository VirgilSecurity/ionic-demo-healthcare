const MEDICAL_HISTORY = 'Medical History';
const OFFICE_VISIT_NOTES = 'Office Visit Notes';
const PRESCRIPTION_ORDER = 'Prescription Order';
const INSURANCE_REPLY = 'Insurance Reply';

const PATIENTS = 'Patients';
const PHYSICIANS = 'Physicians';
const INSURERS = 'Insurers';

module.exports = {
    APP_CLASSIFICATION_VALUES: [
        MEDICAL_HISTORY,
        OFFICE_VISIT_NOTES,
        PRESCRIPTION_ORDER,
        INSURANCE_REPLY
    ],

    APP_GROUP_NAMES: [PATIENTS, PHYSICIANS, INSURERS],

    APP_POLICIES: [
        {
            policyId: 'Healthcare Demo Patients',
            ruleCombiningAlgId: 'first-applicable',
            appliesToGroup: [PATIENTS],
            allowDataMarkedWith: [MEDICAL_HISTORY, OFFICE_VISIT_NOTES, PRESCRIPTION_ORDER, INSURANCE_REPLY]
        },
        {
            policyId: 'Healthcare Demo Physicians',
            ruleCombiningAlgId: 'first-applicable',
            appliesToGroup: [PHYSICIANS],
            allowDataMarkedWith: [MEDICAL_HISTORY, OFFICE_VISIT_NOTES, PRESCRIPTION_ORDER, INSURANCE_REPLY]
        },
        {
            policyId: 'Healthcare Demo Insurers',
            ruleCombiningAlgId: 'first-applicable',
            appliesToGroup: [INSURERS],
            allowDataMarkedWith: [OFFICE_VISIT_NOTES, INSURANCE_REPLY]
        }
    ]
}
