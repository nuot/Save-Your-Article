const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio')
const db = require('mongojs')('articles_db')

app.use(express.urlencoded({extended : true}))
app.use(express.json())

require('./routes')(app)

require('mongoose').connect('mongodb://localhost/articles_db', { 
    useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
    .then(_ => app.listen(3000))
    .catch(e => console.log(e))

axios.get('https://www.stackoverflow.com')
    .then(({data}) =>{
        const $ = cheerio.load(data)
        const stackArr = []

        // getting a string of the document 
        // console.log($('h1.-title').text())
        //or
    //    console.log($('div.fl-shrink2').children('h1.-title').text())
        $('div.summary').each((i, elem) => {
            stackArr.push({
                title: $(elem).children('h3').children('a.question-hyperlink').text(),
                link: `https://stackoverflow.com${$(elem).children('h3').children('a.question-hyperlink').attr('href')}`
            })
        })
            db.stacks.insert(stackArr, _ => console.log('stacks added'))
            // console.log($(elem).children('h3').children('a.question-hyperlink').text())
            // console.log(`https://stackoverflow.com${$(elem).children('h3').children('a.question-hyperlink').attr('href')}`)
            // console.log($(elem).text())
            // console.log($(elem).attr('href'))
        
    })
    .catch(e => console.log(e))