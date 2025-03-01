
// the following to client.js
// if (process.env.TRACKING_ID) googleAnalytics(process.env.TRACKING_ID);

export const googleAnalytics = (gaID) => {
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    gtag('js', new Date())
  
    gtag('config', gaID)
  
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`
    document.body.appendChild(script)
  }