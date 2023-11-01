const { JSDOM } = require('jsdom')

let normalizeURL = (inputUrl)=>{
  let url = new URL(inputUrl)
  let [protocal, hostname, pathname ] = [url.protocol, url.hostname, url.pathname]
  if(protocal == 'http:') protocal='https:'
  if(pathname.charAt(pathname.length-1) == '/') pathname=pathname.substring(0,pathname.length-1)
  return `${protocal}//${hostname}${pathname}`
}

let getURLsFromHTML = (htmlBody, baseURL)=>{
  let ans = []
  const dom = new JSDOM(htmlBody);
  let arr = dom.window.document.querySelectorAll('a')

  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i].href;
    
    if(ele.length >= baseURL.length && ele.substring(0,baseURL.length) != baseURL) ans[i] = baseURL+ele
    else if(ele.length >= baseURL.length && ele.substring(0,baseURL.length) == baseURL) ans[i] = ele
    else ans[i] = baseURL+ele
  }
  return ans
}
  
async function crawlPage(baseURL, currentURL, pages){
  let ans = pages;
  if(currentURL.charAt(0) == '/' || currentURL.substring(0,baseURL.length) != baseURL) {
    return ans;
  }
      console.log(currentURL);
  currentURL = normalizeURL(currentURL)

  if( ans[currentURL] != undefined){
    ans[currentURL] = ans[currentURL]+1;
    return ans;
  } else {
    ans[currentURL] = 1;
    try {
      let response = await fetch(currentURL)
      const status = response.ok;
      const content = response.headers.get('Content-Type');
      
      if(!status) throw new Error(`${response.status}  error`)
      else if(content.substring(0,9) != 'text/html') throw new Error(`content type is not text/html error it is${content}`)
      else{
        let text = await response.text();
        //getting all the url in the current page
        let urlArr =getURLsFromHTML(text,baseURL);
        for (let i = 0; i < urlArr.length; i++) {
          const ele = urlArr[i];
          ans = await crawlPage(baseURL,ele,ans);
        }
      }  
    } catch (error) {
      console.log(error);
    }
  }
  return ans;
}

let pages = {}
function main(){
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  readline.question(`What's your name?`, async function (num) {
      let arr = num.split(" ")
      if (arr.length > 1)
        console.log('cli arg is more than one')
      else if (arr.length < 1)
        console.log('cli arg is less than one')
      else {
        console.log(`starting web crawling with ${num}`)
        pages = await crawlPage(num, num, pages)
      }
      console.log(pages);
      readline.close()
    });
}

main()

module.exports = {
    normalizeURL,
    getURLsFromHTML
}