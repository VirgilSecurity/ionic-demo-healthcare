class DataPolicy {
    constructor({ policyId, description, ruleCombiningAlgId, enabled }) {
        this.policy = {
            policyId,
            description,
            ruleCombiningAlgId,
            enabled
        };
    }

    when(condition) {
        this.policy.target = {
            condition
        };
        return this;
    }

    allowIf(condition, description) {
        return this._addRule('Permit', condition, description);
    }

    denyIf(condition, description) {
        return this._addRule('Deny', condition, description);
    }

    toJSON() {
        return this.policy;
    }

    _addRule(effect, condition, description) {
        const rules = this.policy.rules || (this.policy.rules = []);
        rules.push({
            effect,
            description,
            condition
        });
        return this;
    }
}

const Attributes = {
    resource: {
        classification: { category: 'resource', id: 'classification' }
    },
    subject: {
        group: { category: 'subject', id: 'group' }
    }
};

function or(funcA, funcB) {
    return {
        functionId: 'or',
        args: [ funcA, funcB ]
    };
}

function stringAtLeastOneMemberOf(attribute, values) {
    const valuesArr = Array.isArray(values) ? values : (values && [values]);
    return {
        functionId: 'string-at-least-one-member-of',
        args: [
            attribute,
            {
                dataType: 'string',
                value: valuesArr
            }
        ]
    }
}

module.exports = {
    DataPolicy,
    Attributes,
    or,
    stringAtLeastOneMemberOf
};
