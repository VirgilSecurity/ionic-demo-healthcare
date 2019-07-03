# Ionic Healthcare Demo

The Demo App is a simple web application that illustrates how distinct roles within a customer's application can be defined and used to restrict ePHI access in a HIPAA-compliant manner. The Demo App is based on use case involving a hypothetical business scenario involving a patient, physician and insurance provider. Read more in our [quickstart guide](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083143/Healthcare+Quickstart+Guide?atlOrigin=eyJpIjoiZWI0MWNiNzVhMWVkNDNkZmEzMzJkNTE2ZmEwYmZmOWMiLCJwIjoiYyJ9).

## Prerequisites
- Node.js >= 10 is required
- Ionic and AWS credentials
- Supported browsers: Chrome, Firefox, Safari, Opera.

### Ionic credentials
- [Create and configure an Ionic Account](https://virgil.atlassian.net/wiki/spaces/VI/pages/1079083092/Create+and+Configure+Ionic+Account)
- [Configure the Ionic Enrollment service to support a SAML Assertions](https://virgil.atlassian.net/wiki/spaces/VI/pages/1107263521/Configuring+an+Enrollment+Server+to+Support+a+SAML+Assertions)

### AWS credentials
1. Create an [AWS account](https://portal.aws.amazon.com/billing/signup) to store your app's encrypted data
2. Create an _Access Key_ for your AWS user. Use this guide to [get your AWS Security Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).

## Configure and Run the Demo

- Clone the Demo application:
```
git clone https://github.com/VirgilSecurity/ionic-demo-healthcare.git
```

- Using the command line interface, copy the file `.env.example` under the name `.env`:
```
# for FreeBSD / Linux / Mac OS:
cp .env.example .env

# for Windows OS:
copy .env.example .env

```
- Fill in the Ionic and AWS values inside of .env file. The following environment variables must be defined to run the server:

| Variable Name | Description |
| ------------- | ------------ |
| IONIC_ENROLLMENT_ENDPOINT | URL of your Ionic Enrollment Server. Used for SAML assertion generation |
| IONIC_IDP_PRIVATE_KEY_PATH | Path to private key file (PEM) to use to sign SAML assertions |
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

> The "setup" script also created Ionic _Data Marking Values_ and  _Data Policies_ in Ionic Dashboard. To learn more about groups, data markings and data policies, explore the Quickstart guide.


-  Run the Demo with the following command:

```
npm start
```
- Browse to http://localhost:8080 to explore the Demo and see how the Ionic Policy Engine can be used to grant data access via encryption keys to users based on the Data Policy logic.
