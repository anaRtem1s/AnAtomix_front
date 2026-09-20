//! VOIR POUR TAGS, SIMPLIFIER
// 
export default function CoolLinks() {

  return (
    <>
      <button onClick={() => onNav("reader")}>🢦 Back to Feeds</button>
      <ul>
        <li><a href="https://www.rssboard.org/rss-validator/" rel="external" target="_blank">Check if Feed URL is valid</a></li>
        <li><a href="https://atlasflux.saynete.com/" rel="external" target="_blank"> Atlas des flux RSS</a></li>
        <li><a href="https://www.privacyguides.org/en/news-aggregators/?h=youtube#youtube" rel="external" target="_blank"> YouTube Channel to RSS Feed Converter</a></li>
        <li><a href="https://kill-the-newsletter.com/" rel="external" target="_blank"></a>Kill the Newsletter - Get newsletters as feeds</li>
      </ul>
    </>

  );
}


