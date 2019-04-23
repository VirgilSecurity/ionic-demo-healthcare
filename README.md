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


## Development

Node.js >= 10 is required

### Configure environment

The following environment variables must be defined to run the server:

| Variable Name | Sample Value | Description |
| ------------- | ------------ | ----------- |
| IDP_ENTITY_ID | ionic-assertion | Identity provider name configured on your Ionic Enrollment Server. Used for SAML assertion generation |
| ASSERTION_CONSUMER_SERVICE | IonicEP | Name of the SAML asssertion consumer configured on your Ionic Enrollment Server. Used for SAML assertion generation |
| ENROLLMENT_ENDPOINT | https://enrollment.ionic.com/.../saml | URL of your Enrollment Server. Used for SAML assertion generation |
| PRIVATE_KEY | Private Key in PEM format | Private key to use to sign SAML assertions |
| IONIC_API_BASE_URL | https://api.ionic.com | Ionic Management APIs base URL for your tenant |
| IONIC_TENANT_ID | - | Your Ionic tenant ID |
| IONIC_API_AUTH_TOKEN | - | Your Ionic API Key Secret Token (for accessing Management API). Must include SCIM User and Group management scopes |
| AWS_ACCESS_KEY_ID | - | Your AWS Access Key ID |
| AWS_SECRET_ACCESS_KEY | - | Your AWS Access Secret Key |
| AWS_DYNAMODB_ENDPOINT | http://localhost:8000 | Your DynamoDB endpoint |
| AWS_DYNAMODB_TABLE_NAME | IonicDemoState | Name of the configured DynamoDB table |

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
