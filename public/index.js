const appData = {
  appId: 'helloworld',
  userId: 'virgil_developer',
  userAuth: 'password123',
  enrollmentUrl: 'http://localhost:8080/enrollment.html'
};

const sdk = new window.IonicSdk.ISAgent('http://localhost:8080/ionic/');

const register = function() {
  return sdk.enrollUser(appData)
  .then(resp => {
      if(resp)
          if (resp.redirect) {
              window.open(resp.redirect);
              return resp.notifier;
          }
      else {
          return Promise.reject("Error enrolling");
      }
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