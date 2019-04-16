const sdk = new window.IonicSdk.ISAgent('https://preview-api.ionic.com/jssdk/latest/');

async function fetchAssertion() {
  console.log('Fetching assertion...');
  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: 'Test', 
      lastName: 'Physician', 
      email: 'test_physician@virgilsecurity.com', 
      groupName: 'physicians'
    })
  });
  if (!response.ok) {
    throw new Error('Assertion response was not OK');
  }
  const { assertion, user } = await response.json();
  console.log('Fetched assertion', assertion);
  console.log('Created user', user);
  return assertion;
}

async function createDevice(registration) {
  console.log('Creating device...');
  const device = await sdk.createDevice(registration);
  console.log('Created device', device);
  return device;
}

async function handleEnrollment() {
  try {
    const assertion = await fetchAssertion();
    await createDevice(assertion);
    window.open('http://localhost:8080/');
  } catch (err) {
    console.error(err);
  }
}

const enrollBtn = document.getElementById('enroll-btn');
enrollBtn.addEventListener('click', handleEnrollment, false);