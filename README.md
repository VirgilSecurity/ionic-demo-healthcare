# Ionic Healthcare Demo

The Demo App - is a simple web application, that illustrates how distinct roles within a Customer's application can be defined and used to restrict ePHI access in a HIPAA-compliant manner, the Use Case involves a hypothetical business scenario involving a Patient, Physician or Insurance Provider. Read more in our [quickstart guide](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083143/Quickstart).

## Prerequisites
- Node.js >= 10 is required
- Ionic and AWS credentials

#### Ionic credentials
- Create and configure an [Ionic Account](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083092/Create+and+Configure+Ionic+Account)

#### AWS credentials
1. Create an [AWS account](https://portal.aws.amazon.com/billing/signup) for storing encrypted data
2. Create an _Access Key_ for your AWS user
3. Create a DynamoDB table named "IonicDemoState" (any name will do as long as it matches the one in your environment config below)
4. Set the _Primary key_ to be the `key` attribute of type `String`. The sort key is not needed

## Configure and Run the Demo

- Clone the Demo application:
```
git clone https://github.com/VirgilSecurity/ionic-demo-healthcare.git
```

- Using the command line interface copy the file `.env.example` under the name `.env`:
```
cp .env.example .env
```
- Fill in the Ionic and AWS values inside of .env file. The following environment variables must be defined to run the server:

| Variable Name | Sample Value |
| ------------- | ------------ |
| IONIC_ENROLLMENT_ENDPOINT | URL of your Ionic Enrollment Server. Used for SAML assertion generation |
| IONIC_IDP_PRIVATE_KEY | Private key to use to sign SAML assertions |
| IONIC_TENANT_ID | Your Ionic tenant ID |
| IONIC_API_AUTH_TOKEN | Your Ionic API Key Secret Token (for accessing Management API). Must include SCIM User and Group management scopes |
| AWS_ACCESS_KEY_ID | Your AWS Access Key ID. This is read by the `aws-sdk` to authenticate requests to DynamoDB |
| AWS_SECRET_ACCESS_KEY | Your AWS Access Secret Key. This is read by the `aws-sdk` to authenticate requests to DynamoDB |

- Install dependencies:

```
npm install
```

- Run the `setup` script:
```
npm run setup
```

- The `setup` script created three groups in Ionic Dashboard: _Patients_, _Physicians_ and _Insurers_.

> The "setup" script also created Ionic _Data Marking Values_ and  _Data Policies_ in Ionic Dashboard. The Quickstart guide explains their purpose.


-  Run the Demo with the following command:

```
npm start
```
- Browse to http://localhost:8080 to explore the Demo.
