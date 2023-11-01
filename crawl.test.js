const { test, expect } = require('@jest/globals')
const { normalizeURL , getURLsFromHTML } = require('./crawl.js')

let arr = ['https://wagslane.dev/path/',
    'https://wagsLane.Dev/path',
    'https://wagslane.dev/path',
    'http://wagslane.dev/path'
]
let ans = 'wagslane.dev/path'
let bool = true
for (let i = 0; i < arr.length; i++) {
    test(`checking if ${arr[i]} is equal to 'wagslane.dev/path'` , () => { 
        expect(normalizeURL(arr[i])).toBe('https://wagslane.dev/path')
    })
}
let body = `<html>
            <body>
                <a href="/path/first/hello.txt"><span>Go to Bootq.dev</span></a>
                <p>yooooo<p/>
                <a href=''><span>Go to Boots.dev</span></a>
                <p>yooooo<p/>
                <a href='/path/first'><span>Go to Bootz.dev</span></a>
                <p>yooooo<p/>
                <a href='/path'><span>Go to Bootz.dev</span></a>
            </body>
            </html>`
let arr2 = [
            'https://wagslane.dev/path/first/hello.txt',
            'https://wagslane.dev',
            'https://wagslane.dev/path/first',
            'https://wagslane.dev/path'
]
test(`testing if all the links are present and in absloute form`, () => { 
    expect(getURLsFromHTML(body,'https://wagslane.dev')).toStrictEqual(arr2)
})