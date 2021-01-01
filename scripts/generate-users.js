// generator.js
const fs = require('fs')
const faker = require('faker')
const argv = require('yargs').argv

const lines = argv.lines || 1000
const filename = argv.output || '20210101091646-add-users-up.sql'
const writeStream = fs.createWriteStream('../migrations/sqls/'+filename)

const createUser = () => {
    const title = faker.name.firstName().replace(/[^\w\s]/gi, '');
    const balance = faker.random.number(10000)
    const email = faker.internet.email();
  
    return `('${title}','${email}',${balance});\n`
  }
  
  const startWriting = (writeStream, encoding, done) => {
  let i = lines
  function writing(){
    let canWrite = true
    do {
      i--
      let post = 'INSERT INTO users (`name`, `email`, `balance`) VALUES ' + createUser()
      //check if i === 0 so we would write and call `done`
      if(i === 0){
        // we are done so fire callback
        writeStream.write(post, encoding, done)
      }else{
        // we are not done so don't fire callback
        writeStream.write(post, encoding)
      }
      //else call write and continue looping
    } while(i > 0 && canWrite)
    if(i > 0 && !canWrite){
      //our buffer for stream filled and need to wait for drain
      // Write some more once it drains.
      writeStream.once('drain', writing);
    }
  }
  writing()
}

//write our `header` line before we invoke the loop
//writeStream.write(`\n`, 'utf-8')
//invoke startWriting and pass callback
startWriting(writeStream, 'utf-8', () => {
    writeStream.end()
})