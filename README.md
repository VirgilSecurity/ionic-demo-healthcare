# Ionic Healthcare Demo

The Demo App - is a simple web application, that illustrates how distinct roles within a Customer's application can be defined and used to restrict ePHI access in a HIPAA-compliant manner, the Use Case involves a hypothetical business scenario involving a Patient, Physician or Insurance Provider. Read more in our [quickstart guide](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083143/Quickstart).

## Clone the Demo
```
git clone https://github.com/VirgilSecurity/ionic-demo-healthcare.git
```

## Prerequisites
First of all, you need to get Ionic and AWS credentials, and then use them to set up and run the Demo App.

### Ionic
1. Create and configure an [Ionic Account](https://dashboard.ionic.com). Go through this [guide](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083092/Create+and+Configure+Ionic+Account) to find out how to do that, as a result, you'll get necessary credentials.
2. Run the `NO_NAME` script:
```
run NO_NAME
```
  the script:
  - creates three groups in Ionic Dashboard: _Patients_, _Physicians_ and _Insurers_. You will need to get IDs of these groups and replace the ones defined in [this file](server/ionic/predefined-groups.js) with your appropriate ids.
  - creates two _Data Marking Values_ for the pre-defined _classification_ attribute: `"patient_physician"` and `"patient_physician_insurer"`
  - creates two _Data Policies_:
    * One that applies to data marked with _classification_ matching *patient_physician* and allows access when the user is in any of the groups _Patients_ or _Physicians_
    * Another one that applies to data marked with _classification_ matching *patient_physician_insurer* and allows access when the user is in any of the groups _Patients_, _Physicians_ or _Insurers_
More information you will fine in the Quickstart guide.

### AWS
1. Create an [AWS account](https://portal.aws.amazon.com/billing/signup) for storing encrypted data
2. Create an _Access Key_ for your AWS user.
3. Create a DynamoDB table named "IonicDemoState" (any name will do as long as it matches the one in your environment config below)
4. Set the _Primary key_ to be the `key` attribute of type `String`. The sort key is not needed.

## Development
- Node.js >= 10 is required

## Configure Demo App

The following environment variables must be defined to run the server:

| Variable Name | Sample Value | Description |
| ------------- | ------------ | ----------- |
| IONIC_IDP_ENTITY_ID | ionic-assertion | Identity provider name configured on your Ionic Enrollment Server. Used for SAML assertion generation |
| IONIC_ASSERTION_CONSUMER_SERVICE | IonicEP | Name of the SAML asssertion consumer configured on your Ionic Enrollment Server. Used for SAML assertion generation |
| IONIC_ENROLLMENT_ENDPOINT | https://enrollment.ionic.com/.../saml | URL of your Ionic Enrollment Server. Used for SAML assertion generation |
| IONIC_IDP_PRIVATE_KEY | Private Key in PEM format | Private key to use to sign SAML assertions |
| IONIC_API_BASE_URL | https://api.ionic.com | Ionic Management APIs base URL for your tenant |
| IONIC_TENANT_ID | - | Your Ionic tenant ID |
| IONIC_API_AUTH_TOKEN | - | Your Ionic API Key Secret Token (for accessing Management API). Must include SCIM User and Group management scopes |
| AWS_ACCESS_KEY_ID | - | Your AWS Access Key ID. This is read by the `aws-sdk` to authenticate requests to DynamoDB |
| AWS_SECRET_ACCESS_KEY | - | Your AWS Access Secret Key. This is read by the `aws-sdk` to authenticate requests to DynamoDB |
| AWS_DYNAMODB_ENDPOINT | http://localhost:8000 | Your DynamoDB endpoint |
| AWS_DYNAMODB_TABLE_NAME | IonicDemoState | Name of the configured DynamoDB table |

- Using the command line interface copy the file `.env.example` under the name `.env`:

```
cp .env.example .env
```
- fill in the Ionic and AWS values inside of .env file.


## Install dependencies

- First for the server:

```
npm i
```

- Then for the client:

```
cd client
npm i
cd ..
```

## Run the Demo
- use the following command to run the Demo:

```
npm start
```
- then, browse to http://localhost:8080

The server will be listening for connections on port `8080`. The server will also serve the client side now, so it will be avalable at https://localhost:8080.

## What's next?
Explore our quickstart guide to find out how Ionic tech works, and what steps you need to go through to create and set up own Ionic Project.  

## Additional information

### Run Demo in development mode
If you need to run the Demo in development mode, use the following command:

```
npm run dev
```

The client side will be served on port `3000` and the server will be listening for connections on port `8080`. Any changes to the source code files will cause the server and the client to be restarted automatically.


### Debug

To see debug logs printed to the console, set the `DEBUG` environment variable to `virgil_ionic`

```
DEBUG=virgil_ionic npm start
```

## References
- [Backend Server API](/API.md)
