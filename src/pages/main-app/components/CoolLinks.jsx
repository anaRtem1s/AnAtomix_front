export default function CoolLinks({onNav}) {

  return (
    <div className="cpage-container">

      <button onClick={() => onNav("reader")}>🢦 Back to Feeds</button>

      <ul>
        <li><a href="https://www.rssboard.org/rss-validator/" rel="noreferrer" target="_blank">Check if your feed URL is valid</a></li>
        <li><a href="https://atlasflux.saynete.com/" rel="noreferrer" target="_blank"> Atlas des flux RSS (FR/ ENG)</a></li>
        <li><a href="https://www.privacyguides.org/en/news-aggregators/?h=youtube#youtube" rel="noreferrer" target="_blank"> YouTube channel to RSS feed converter</a></li>
        <li><a href="https://kill-the-newsletter.com/" rel="noreferrer" target="_blank">Kill the Newsletter - Get newsletters as feeds</a></li>
      </ul>
    </div>

  );
}


