# Ionic Healthcare Demo

Sample Healthcare app using Ionic.

## API

### Register User

Generates a SAML assertion for device enrollment in Ionic.com. Registers a new User if it doesn't already exist. If a User with the given `email` exists, but is not a member of the Group specified by `groupName` - an error is returned, otherwise returns the `user` record an `assertion` object to be passed into Ionic JS SDK completing device enrollment.

#### Request

`POST` /register

*Headers:*
```
Content-Type: application/json
```

*Body* (all fields are required)
```json
{
  "email": "user@example.com",
  "groupName": "patients|physicians|insurers",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response

*Body*
```json
{
   "assertion":{
      "X-Ionic-Reg-Uidauth": "string",
      "X-Ionic-Reg-Stoken": "string",
      "X-Ionic-Reg-Ionic-API-Urls": "string",
      "X-Ionic-Reg-Enrollment-Tag": "string",
      "X-Ionic-Reg-Pubkey": "string"
   },
   "user": {
      "id": "5cb5f865e5a7320cf0fdf0ee",
      "schemas": [
         "urn:scim:schemas:core:1.0"
      ],
      "meta": {
         "created":"2019-04-16T15:44:37Z",
         "lastModified":"2019-04-16T15:44:37Z",
         "location":"/v2/5c7ec51be5a7322a83fd22a5/scim/Users/5cb5f865e5a7320cf0fdf0ee",
         "version":"2"
      },
      "name":{
         "formatted":"Test Patient",
         "familyName":"Patient",
         "givenName":"Test"
      },
      "emails":[
         {
            "value":"test_patient@virgilsecurity.com"
         }
      ],
      "groups":[
         {
            "value":"5cab158ce5a7320cf0fd0416",
            "display":"Patients"
         }
      ]
   }
}
```

### Get App State

Returns the current application state

#### Request

`GET` /state

#### Response

*Body* (values may be `undefined`)

```json
{
	"medical_history": "history",
	"office_visit_notes": "notes",
	"prescription": "prescription",
	"insurer_reply": "insurer reply"
}
```

### Update App State

Updates the current application state

#### Request

`PUT` /state

*Headers*
```
Content-Type: application/json
```

*Body* (all fields are optional, but at least one is required)
```json
{
    "medical_history": "my medical history",
    "office_visit_notes": "my visit notes",
	"prescription": "my prescription",
	"insurer_reply": "my insurer reply"
}
```

#### Response

*Body*
```json
{
	"medical_history": "my medical history",
    "office_visit_notes": "my visit notes",
	"prescription": "my prescription",
	"insurer_reply": "my insurer reply"
}
```

### Errors

Errors are returned as JSON with the following format:

```json
{
  "error": "An error occured"
}
```

Validation error responses also include `errors` property:

```json
{
  "error": "Invalid request body",
  "errors": [
    {
      "param": "email",
      "message": "Invalid value"
    }
  ]
}
```

Client errors have HTTP status code `400`, Server errors - `500`

## Prerequisites

### Ionic

1. Configure [Enrollment with generated assertion](https://dev.ionic.com/platform/enrollment/generated-assertion) in your Ionic Enrollment server.
2. Create an _API Key_ in Ionic Dashboard. The key must allow _API access_, _Creating and Reading Users_ and _Reading Groups_.
3. Create three groups in Ionic Dashboard: _Patients_, _Physicians_ and _Insurers_. You will need to get IDs of these groups and replace the ones defined in [this file](server/ionic/predefined-groups.js) with your appropriate ids.
4. Create two _Data Marking Values_ for the pre-defined _classification_ attribute: `"patient_physician"` and `"patient_physician_insurer"`.
5. Create two _Data Policies_:
    * One that applies to data marked with _classification_ matching *patient_physician* and allows access when the user is in any of the groups _Patients_ or _Physicians_
    * Another one that applies to data marked with _classification_ matching *patient_physician_insurer* and allows access when the user is in any of the groups _Patients_, _Physicians_ or _Insurers_

### AWS

1. Create an _Access Key_ for your AWS user.
2. Create a DynamoDB table named "IonicDemoState" (any name will do as long as it matches the one in your environment config below)
3. Set the _Primary key_ to be the `key` attribute of type `String`. The sort key is not needed.

## Development

Node.js >= 10 is required

### Configure environment

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

Copy the file `.env.example` under the name `.env`:

```
cp .env.example .env
```

and fill in the values.

### Install dependencies

First for the server

```
npm i
```

Then for the client

```
cd client
npm i
cd ..
```

### Run

```
npm run dev
```

The server will be listening for connections on port `8080`. Any changes to the `server.js` file will cause the server to be restarted automatically.

### Debug

To see debug logs printed to the console, set the `DEBUG` environment variable to `virgil_ionic`

```bash
DEBUG=virgil_ionic npm statrt
```
