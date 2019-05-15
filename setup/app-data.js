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
            description: 'User is in the group Patients',
            ruleCombiningAlgId: 'deny-overrides',
            appliesToGroup: PATIENTS,
            allowDataMarkedWith: [MEDICAL_HISTORY, OFFICE_VISIT_NOTES, PRESCRIPTION_ORDER, INSURANCE_REPLY],
            get ruleDescription() {
                return `Allow access if data is marked with classification matching ${this.allowDataMarkedWith.join(', ')}`;
            }
        },
        {
            policyId: 'Healthcare Demo Physicians',
            description: 'User is in the group Physicians',
            ruleCombiningAlgId: 'deny-overrides',
            appliesToGroup: PHYSICIANS,
            allowDataMarkedWith: [MEDICAL_HISTORY, OFFICE_VISIT_NOTES, PRESCRIPTION_ORDER, INSURANCE_REPLY],
            get ruleDescription() {
                return `Allow access if data is marked with classification matching ${this.allowDataMarkedWith.join(', ')}`;
            }
        },
        {
            policyId: 'Healthcare Demo Insurers',
            description: 'User is in the group Insurers',
            ruleCombiningAlgId: 'deny-overrides',
            appliesToGroup: INSURERS,
            allowDataMarkedWith: [OFFICE_VISIT_NOTES, INSURANCE_REPLY],
            get ruleDescription() {
                return `Allow access if data is marked with classification matching ${this.allowDataMarkedWith.join(', ')}`;
            }
        }
    ]
}
