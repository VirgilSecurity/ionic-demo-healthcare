const appData = {
  appId: 'helloworld',
  userId: 'virgil_insurer',
  userAuth: 'password123',
  enrollmentUrl: 'http://localhost:8080/index.html' // will not be used
};

const sdk = new window.IonicSdk.ISAgent('https://preview-api.ionic.com/jssdk/latest/');

const register = function() {
  return sdk.enrollUser(appData)
  .then(resp => {
    if (resp.sdkResponseCode === 0) {
      // ignore resp.redirect and resp.notifier
      return fetchAssertion()
        .then(createDevice)
        .then(() => sdk.loadUser(appData));
    }
    else {
      console.log('Unexpected enrollment response: ', resp);
      return Promise.reject('Error enrolling');
    }
  });
}

const fetchAssertion = function() {
  console.log('Fetching assertion...');
  return fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: 'Test', 
      lastName: 'Physician', 
      email: 'test_insurer@virgilsecurity.com', 
      groupName: 'insurers'
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Assertion response was not OK');
    }
    return response.json();
  }).then(({ assertion, user }) => {
    console.log('Fetched assertion', assertion);
    console.log('Created user', user);
    return assertion;
  });
}

const createDevice = function(assertion) {
  console.log('Creating device...');
  return sdk.createDevice(assertion).then(device => {
    console.log('Created device', device);
    return device;
  });
}

const loadProfile = function() {
  return sdk.loadUser(appData)
  .catch(err => {
      console.error(err);
      if (
          err &&
          err.sdkResponseCode &&
          (err.sdkResponseCode === 40022 || err.sdkResponseCode === 40002)
      ) {
          console.log('registering...');
          return register();
      }
  });
}

const encryptText = function(){
  const data = document.getElementById('fieldToEncrypt').value;
  sdk.encryptStringChunkCipher({stringData: data, cipher: 'v2'})
  .then(res => {
      document.getElementById('encryptedText').innerText = res.stringChunk;
  })
  .catch(err => {
      console.log('err: ', err);
  });
}

const decryptText = function(){
  const data = document.getElementById('encryptedText').innerText;

  sdk.decryptStringChunkCipher({stringData: data})
  .then(res => {
      document.getElementById('decryptedText').innerText = res.stringChunk;
  });
}

loadProfile()
.then(res => {
  console.log('successfully loaded profile', res);
})
.catch(err => {
  console.error(err);
});