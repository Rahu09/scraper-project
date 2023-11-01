// first custom api use
const owner = 'calcom';
const repo = 'cal.com';
const issueNumber = 9224;

const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

fetch(apiUrl, {
  headers: {
    Authorization: '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',
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    const labels = data.labels;
    // Access the label information and perform desired actions.
    labels.forEach(label => {
      console.log(label.name);
      console.log(label.color);
      // ...
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });