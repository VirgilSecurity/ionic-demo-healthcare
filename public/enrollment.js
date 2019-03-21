const sdk = new window.IonicSdk.ISAgent('http://localhost:8080/ionic/');

async function generateAssertion() {
  console.log('Fetching assertion...');
  const response = await fetch('assertion');
  if (!response.ok) {
    throw new Error('Assertion response was not OK');
  }
  const registration = await response.json();
  console.log('Fetched assertion', registration);
  return registration;
}

async function createDevice(registration) {
  console.log('Creating device...');
  const device = await sdk.createDevice(registration);
  console.log('Created device', device);
  return device;
}

async function handleEnrollment() {
  try {
    const assertion = await generateAssertion();
    await createDevice(assertion);
    window.open('http://localhost:8080/');
  } catch (err) {
    console.error(err);
  }
}

const enrollBtn = document.getElementById('enroll-btn');
enrollBtn.addEventListener('click', handleEnrollment, false);