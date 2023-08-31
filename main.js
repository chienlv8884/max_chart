const fetchData = require('./fetch_data')
const build = require('./build')

async function main() {
    await fetchData()
    await build()
}
main()
