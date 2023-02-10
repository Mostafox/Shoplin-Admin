const createClient = require('@sanity/client')

const client = createClient({
  projectId: 'reagl8yb',
  dataset: 'production',
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: '2022-01-12', // use current date (YYYY-MM-DD) to target the latest API version
})

client
  .fetch(`*[type == Shop]`)
  .then((data) => {
    data.forEach(element => {
    console.log(element)
  })
  console.log(data);
})
  .catch(console.error);
