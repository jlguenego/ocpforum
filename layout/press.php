<?php

define('ROOT_DIR', dirname(dirname(__FILE__)));
include(ROOT_DIR . '/include/constant.inc');
include(ROOT_DIR . '/include/top_page.inc');
?>



<style>
#disclaimer {
	display: none;
	overflow: hidden;
	margin-top: 0;
	margin-bottom: 10px;
	font-size: 85%;
	text-align: justify;
	-moz-transition: height 400ms ease-out;
	-webkit-transition: height 400ms ease-out;
	transition: height 400ms ease-out;
}

.of_tablehalf {
	width: 885px;
	position: relative;
	left: -40px;
}

.of_tablehalf>div {
	display: inline-block;
	width: 400px;
	vertical-align: top;
	margin-left: 40px;
	margin-bottom: 20px;
}

.of_tablehalf img {
	width: 400px;
	height: 220px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
}

.of_tablehalf h2 img {
	width: auto;
	height: auto;
}

.of_tablehalf>.subnail_txt>img {
	width: 150px;
	height: 150px;
	float: left;
	margin-right: 30px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
}

.of_tablehalf>.subnail_txt>p {
	margin: 0;
}

.of_tablehalf>.subnail_txt>img:first-child+p {
	font-weight: bold;
	color: #2c6fad;
	margin: 0;
}

.of_tablehalf>.subnail_txt>img:first-child+p+p {
	margin: 0;
}

.of_tablehalf>.subnail_txt>img:first-child+p+p+p {
	font-size: 80%;
	margin-top: 1em;
	margin-bottom: 1em;
}

.press-faq {
	text-align: left;
}

.press-faq p {
	text-align: justify;
}

.press-videos {
	margin-bottom: 40px;
}

.press-videos div {
	display: inline-block;
	vertical-align: top;
	margin-right: 10px;
}

.press-faq>div>div {
	display: none;
	overflow: hidden;
	text-align: justify;
	-moz-transition: height 400ms ease-out;
	-webkit-transition: height 400ms ease-out;
	transition: height 400ms ease-out;
}
.press-faq>div>a {
	display: inline-block;
	font-weight: bold;
	margin-right: 20px;
}
.press-videos div a {
	display: inline-block;
	margin-right: 10px;
	margin-bottom: 10px;
}

.press-videos img {
	width: 250px;
	height: 136px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
}

.press-pictures img {
	margin-right: 14px;
	margin-bottom: 14px;
	height: 120px;
	width: 120px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	border-radius: 10px;
}

.press-pictures>a {
	display: inline-block;
	padding-top: 10px;
	font-weight: bold;
}

.press-quotes {
	margin-bottom: 40px;
}
.press-quotes div {
	position: relative;
	left: -20px;
	text-align: left;
	height: 350px;
	overflow: hidden;
	-moz-transition: height 400ms ease-out;
	-webkit-transition: height 400ms ease-out;
	transition: height 400ms ease-out;
}
.press-quotes p {
	display: inline-block;
	vertical-align: top;
	width: 400px;
	margin: 0 0 20px 20px;
}
.press-quotes span:first-child {
	font-weight: bold;
	display: block;
	margin-bottom: 4px;
}
.press-quotes span:first-child:before {
	position: absolute;
	margin-left: -16px;
	font-weight: bold;
	font-size: 180%;
	content: "“";
}
.press-quotes span:first-child:after {
	position: absolute;
	margin-right: -16px;
	font-weight: bold;
	font-size: 180%;
	content: "”";
}
.press-quotes>a {
	display: inline-block;
	padding-top: 10px;
	font-weight: bold;
}

.press-news {
	text-align: left;
	-webkit-border-radius: 8px;
	-moz-border-radius: 8px;
	border-radius: 8px;
}
.press-news>div {
	height: 125px;
	margin-bottom: 30px;
	width: 700px;
}
.press-news a:link, .press-news a:active, .press-news a:visited {
	font-weight: bold;
	color: #2c6fad;
}
.press-news>div>a:first-child+a {
	display: block;
	margin-bottom: 10px;
}
.press-news>div>a>img {
width: 185px;
height: 123px;
float: left;
margin-right: 30px;
-webkit-border-radius: 10px;
-moz-border-radius: 10px;
border-radius: 10px;
}
.press-news>div>a:first-child+a+a+p {
font-size: 80%;
}
</style>

<h1>ocpforum Press Center</h1>
<p class="summary">Find potential interviewees and high quality press materials.</p>



<h2>Contact Potential Interviewees</h2>

<div class="press-volunteer">

<div>
	<p>
		ocpforum has no official organization, individuals with authority, nor spokespeople.
		<a href="javaScript:" onclick="$('#disclaimer').toggle()">Read more</a>
	</p>
	<p id="disclaimer">
		The ocpforum project is open-source and, likewise, no one can speak with authority for ocpforum.
		The ocpforum community contains individuals who hold a wide spectrum of business experience or involvement,
		political ideas, personal opinions, technical competency, and style.
		This list of potential interviewees has been curated by ocpforum community members
		with the intent to include individuals possessing a wide spectrum of experience, ideas, and geography.
		The individuals listed have been involved in the ocpforum community for a significant period making tangible contributions,
		have demonstrated competence and professionalism when discussing ocpforum,
		are flexible and willing to assist members of the press in both objective and persuasive ways,
		and are generally respected by other members of the ocpforum community.
		However, an individual's appearance here should not be misconstrued as a general endorsement,
		either by the ocpforum community or any particular individuals with, regards to potential interviewees
		and any businesses they may operate, nor any political or personal ideas they may expound,
		including prognostications about ocpforum or the price or any other topic.
	</p>
</div>

<div class="of_tablehalf">

	<div class="subnail_txt">
		<img src="http://ocpforum.org/img/press/volunteer/vitalik_buterin.jpg" alt="Vitalik Buterin">
		<p>Vitalik Buterin</p>
		<p>ocpforum Magazine Head Writer</p>
		<p class="details">
			<a href="http://www.bbc.co.uk/news/technology-20641465">2012-12-07 BBC News</a><br>
			<a href="http://tmp.virishi.net/OpenSkiesFeb2013-ocpforum.pdf">2013-02-01 Open Skies</a><br>
			<a href="http://www.bbc.co.uk/news/technology-21964881">2013-04-28 BBC News</a>
		</p>
		<p><a href="mailto:vitalik@ocpforummagazine.com">vitalik@ocpforummagazine.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/mike_caldwell.jpg" alt="Mike Caldwell">
	<p>Mike Caldwell</p>
	<p>Developer and Entrepreneur</p>
	<p class="details">
	<a href="http://www.bbc.com/future/story/20130412-ocpforum-and-the-illusion-of-money">2012-04-12 BBC News</a><br>
	<a href="http://www.businessweek.com/magazine/content/11_26/b4234041554873.htm">2011-06-16 BusinessWeek</a><br>
	<a href="http://www.wired.com/wiredenterprise/2013/03/ocpforum-ring/">2013-03-18 Wired</a>
	</p>
	<p><a href="mailto:mcaldwell@swipeclock.com">mcaldwell@swipeclock.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/tony_gallippi.jpg" alt="Tony Gallippi">
	<p>Tony Gallippi</p>
	<p>CEO Bitpay</p>
	<p class="details">
	<a href="http://www.youtube.com/watch?v=F-gHiKJ5Lao">2012-03-18 Florida Tech Journal</a><br>
	<a href="http://www.youtube.com/watch?v=hH4rH6wu25U">2012-12-16 Expanding the ocpforum Business Community</a><br>
	</p>
	<p><a href="mailto:jan@bitpay.com">jan@bitpay.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/jeff_garzik.jpg" alt="Jeff Garzik">
	<p>Jeff Garzik</p>
	<p>Developer</p>
	<p class="details">
	<a href="http://www.bbc.co.uk/news/technology-21964881">2013-03-28 BBC</a><br>
	<a href="http://online.wsj.com/article/SB10001424127887324373204578374611351125202.html">2013-03-21 Wall Street Journal</a><br>
	<a href="http://money.cnn.com/2013/03/28/investing/ocpforum-cyprus/">2013-03-08 CNNMoney</a><br>
	</p>
	<p><a href="mailto:jgarzik@bitpay.com">jgarzik@bitpay.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/mike_hearn.jpg" alt="Mike Hearn">
	<p>Mike Hearn</p>
	<p>Developer</p>
	<p class="details">
	<a href="http://www.economist.com/news/finance-and-economics/21576149-even-if-it-crashes-ocpforum-may-make-dent-financial-world-mining-digital">2013-04-13 The Economist</a><br>
	<a href="http://www.youtube.com/watch?v=mD4L7xDNCmA">2012-09-27 ocpforum Conference</a><br>
	<a href="http://www.scientificamerican.com/article.cfm?id=3-years-in-ocpforum-digital-money-gains-momentum&amp;page=1">2012-10-08 Scientific American</a>
	</p>
	<p><a href="mailto:mike@plan99.net">mike@plan99.net</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/trace_mayer.jpg" alt="Trace Mayer">
	<p>Trace Mayer, J.D.</p>
	<p>Entrepreneur and Blogger</p>
	<p class="details">
	<a href="http://www.youtube.com/watch?v=TfknveaWQ_4">2013-04-05 Fox Business</a><br>
	<a href="http://www.youtube.com/watch?v=aaOsM3RUNG8">2013-03-26 BBC Newsnight</a><br>
	<a href="http://www.youtube.com/watch?v=OtN9YUvh_XM">2012-09-15 FMT: ocpforum Security</a>
	</p>
	<p><a href="mailto:media@howtovanish.com">media@howtovanish.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/felix_moreno_de_la_cova.jpg" alt="Felix Moreno de la Cova">
	<p>Felix Moreno de la Cova</p>
	<p>Trader and Portfolio Manager</p>
	<p class="details">
	<a href="http://www.lasexta.com/noticias/economia/ocpforum-estafa-moneda-futuro_2013040900240.html">2013-04-09 LaSexta (Es)</a><br>
	<a href="http://actualidad.rt.com/economia/view/90076-ocpforum-fracaso-euro">2013-03-27 Russia Times (Es)</a><br>
	<a href="http://www.youtube.com/watch?v=wfzHC7Pf2fk">2012-09-20 GoldMoney (Eng)</a>
	</p>
	<p><a href="mailto:flixmoreno@gmail.com">flixmoreno@gmail.com</a></p>
	</div>

	<div class="subnail_txt">
	<img src="http://ocpforum.org/img/press/volunteer/joerg_platzer.jpg" alt="Joerg Platzer">
	<p>Joerg Platzer</p>
	<p>Crypto economist</p>
	<p class="details">
	<a href="http://www.theguardian.com/technology/2013/apr/26/ocpforums-gain-currency-in-berlin">2013-04-26 The Guardian</a><br>
	<a href="http://www.youtube.com/watch?v=dyUmKqPVQ6s">2013-04-11 Russia Today</a><br>
	<a href="http://videos.arte.tv/de/videos/eine-internet-waehrung-aus-algorithmen--6988468.html">2012-11-11 arte.tv (Deutsch)</a>
	</p>
	<p><a href="mailto:jp@cecg.biz">jp@cecg.biz</a></p>
	</div>

</div>

<div>

<p>Find more potential press contacts at the independent <a href="https://ocpforumpresscenter.org">ocpforumpresscenter.org</a>.</p>

<p>Communicate with the <a href="https://ocpforumfoundation.org/contact">ocpforum Foundation</a> board members.</p>

</div>

</div>



<h2>Facts, FAQs and Myths</h2>

<div class="of_tablehalf press-faq">

<div>
  <a href="javaScript:" onclick="faqShow(event);">What is ocpforum?</a>
  <div>
  <p>ocpforum is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, ocpforum is pretty much like cash for the Internet. ocpforum can also be seen as the most prominent <a href="http://financialcryptography.com/mt/archives/001325.html">triple entry bookkeeping system</a> in existence.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">How does ocpforum work?</a>
  <div>
  <p>From a user perspective, ocpforum is nothing more than a mobile app or computer program that provides a personal ocpforum wallet and allows a user to send and receive ocpforums with them. This is how ocpforum works for most users.</p>
  <p>Behind the scenes, the ocpforum network is sharing a public ledger called the "block chain". This ledger contains every transaction ever processed, allowing a user's computer to verify the validity of each transaction. The authenticity of each transaction is protected by digital signatures corresponding to the sending addresses, allowing all users to have full control over sending ocpforums from their own ocpforum addresses. In addition, anyone can process transactions using the computing power of specialized hardware and earn a reward in ocpforums for this service. This is often called "mining". To learn more about ocpforum, you can consult the <a href="page/how-it-works">dedicated page</a> and the <a href="http://ocpforum.org/ocpforum.pdf">original paper</a>.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">What is ocpforum mining?</a>
  <div>
  <p>Mining is the process of spending computing power to process transactions, secure the network, and keep everyone in the system synchronized together. It can be perceived like the ocpforum data center except that it has been designed to be fully decentralized with miners operating in all countries and no individual having control over the network. This process is referred to as "mining" as an analogy to gold mining because it is also a temporary mechanism used to issue new ocpforums. Unlike gold mining, however, ocpforum mining provides a reward in exchange for useful services required to operate a secure payment network. Mining will still be required after the last ocpforum is issued.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">How does one acquire ocpforums?</a>
  <div>
  <ul>
    <li>As payment for goods or services.</li>
    <li>Purchase ocpforums at a <a href="http://howtobuyocpforums.info">ocpforum exchange</a>.</li>
    <li>Exchange ocpforums with <a href="https://localocpforums.com/">someone near you</a>.</li>
    <li>Earn ocpforums through competitive <a href="http://www.ocpforummining.com/">mining</a>.</li>
  </ul>
  <p>While it may be possible to find individuals who wish to sell ocpforums in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys ocpforums with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum really used by people?</a>
  <div>
  <p>Yes. There is a <a href="http://useocpforums.info/">growing number of businesses</a> and individuals using ocpforum. This includes brick and mortar businesses like restaurants, apartments, law firms, and popular online services such as Namecheap, WordPress, Reddit and Flattr. While ocpforum remains a relatively new phenomenon, it is growing fast. At the end of August 2013, the <a href="http://ocpforumcharts.com/ocpforum/">value of all ocpforums in circulation</a> exceeded US$ 1.5 billion with millions of dollars worth of ocpforums exchanged daily.</p>
  <p>
  <img style="height:165px;width:380px;" src="http://ocpforum.org/img/faq/merchants_map.png" alt="Screenshot">
  </p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">How difficult is it to make a ocpforum payment?</a>
  <div>
  <p>ocpforum payments are easier to make than debit or credit card purchases, and can be received without a merchant account. Payments are made from a wallet application, either on your computer or smartphone, by entering the recipient's address, the payment amount, and pressing send. To make it easier to enter a recipient's address, many wallets can obtain the address by scanning a QR code or touching two phones together with NFC technology.</p>
  <p><img src="http://ocpforum.org/img/faq/mobile_send.png" style="height:325px;width:190px;" alt="Screenshot"><img src="http://ocpforum.org/img/faq/mobile_receive.png" style="height:325px;width:190px;" alt="Screenshot"></p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">What are the advantages of ocpforum?</a>
  <div>
  <ul>
    <li><em><b>Payment freedom</b></em> - It is possible to send and receive any amount of money instantly anywhere in the world at any time. No bank holidays. No borders. No imposed limits. ocpforum allows its users to be in full control of their money.</li>
    <li><em><b>Very low fees</b></em> - ocpforum payments are currently processed with either no fees or extremely small fees. Users may include fees with transactions to receive priority processing, which results in faster confirmation of transactions by the network. Additionally, merchant processors exist to assist merchants in processing transactions, converting ocpforums to fiat currency and depositing funds directly into merchants' bank accounts daily. As these services are based on ocpforum, they can be offered for much lower fees than with PayPal or credit card networks.</li>
    <li><em><b>Fewer risks for merchants</b></em> - ocpforum transactions are secure, irreversible, and do not contain customers’ sensitive or personal information. This protects merchants from losses caused by fraud or fraudulent chargebacks, and there is no need for PCI compliance. Merchants can easily expand to new markets where either credit cards are not available or fraud rates are unacceptably high. The net results are lower fees, larger markets, and fewer administrative costs.</li>
    <li><em><b>Security and control</b></em> - ocpforum users are in full control of their transactions; it is impossible for merchants to force unwanted or unnoticed charges as can happen with other payment methods. ocpforum payments can be made without personal information tied to the transaction. This offers strong protection against identity theft. ocpforum users can also protect their money with backup and encryption.</li>
    <li><em><b>Transparent and neutral</b></em> - <a href="http://blockexplorer.com/">All information</a> concerning the ocpforum money supply itself is readily available on the block chain for anybody to verify and use in real-time. No individual or organization can control or manipulate the ocpforum protocol because it is cryptographically secure. This allows the core of ocpforum to be trusted for being completely neutral, transparent and predictable.</li>
  </ul>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">What are the disadvantages of ocpforum?</a>
  <div>
  <ul>
    <li><em><b>Degree of acceptance</b></em> - Many people are still unaware of ocpforum. Every day, more businesses accept ocpforums because they want the advantages of doing so, but the list remains small and still needs to grow in order to benefit from <a href="http://en.wikipedia.org/wiki/Network_effect">network effects.</a></li>
    <li><em><b>Volatility</b></em> - The <a href="http://ocpforumcharts.com/ocpforum/">total value</a> of ocpforums in circulation and the number of businesses using ocpforum are still very small compared to what they could be. Therefore, relatively small events, trades, or business activities can significantly affect the price. In theory, this volatility will decrease as ocpforum markets and the technology matures. Never before has the world seen a start-up currency, so it is truly difficult (and exciting) to imagine how it will play out.</li>
    <li><em><b>Ongoing development</b></em> - ocpforum software is still in beta with many incomplete features in active development. New tools, features, and services are being developed to make ocpforum more secure and accessible to the masses. Some of these are still not ready for everyone. Most ocpforum businesses are new and still offer no insurance. In general, ocpforum is still in the process of maturing.</li>
  </ul>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum secure?</a>
  <div>
  <p>The ocpforum technology - the protocol and the cryptography - has a strong security track record, and the ocpforum network is probably the biggest distributed computing project in the world. ocpforum's most common vulnerability is in user error. ocpforum wallet files that store the necessary private keys can be accidentally deleted, lost or stolen. This is pretty similar to physical cash stored in a digital form. Fortunately, users can employ sound <a href="page/secure-your-wallet">security practices</a> to protect their money or use service providers that offer good levels of security and insurance against theft or loss.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum legal?</a>
  <div>
  <p>To the best of our knowledge, ocpforum has not been made illegal by legislation in any jurisdiction. However, some jurisdictions (such as Argentina) severely restrict or ban all foreign currency. Other jurisdictions (such as Thailand) may limit the licensing of certain entities such as ocpforum exchanges.</p>
  <p>Regulators from various jurisdictions are taking steps to provide individuals and businesses with rules on how to integrate this new technology with the formal, regulated financial system. For example, the Financial Crimes Enforcement Network (FinCEN), a bureau in the United States Treasury Department, issued non-binding guidance on how it characterizes certain activities involving virtual currencies.</p>
  <ul>
    <li><a href="http://www.ecb.europa.eu/pub/pdf/other/virtualcurrencyschemes201210en.pdf">Virtual Currency Schemes - European Central Bank</a></li>
    <li><a href="http://www.fincen.gov/statutes_regs/guidance/pdf/FIN-2013-G001.pdf">Application of FinCEN’s Regulations to Persons Administering, Exchanging, or Using Virtual Currencies</a></li>
  </ul>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">What about ocpforum and taxes?</a>
  <div>
  <p>ocpforum is not a fiat currency with legal tender status in any jurisdiction, but often tax liability accrues regardless of the medium used. There is a wide variety of legislation in many different jurisdictions which could cause income, sales, payroll, capital gains, or some other form of tax liability to arise with ocpforum.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum useful for illegal activities?</a>
  <div>
  <p>ocpforum is money, and money has always been used both for legal and illegal purposes. Cash, credit cards and current banking systems widely surpass ocpforum in terms of their use to finance crime. ocpforum can bring significant innovation in payment systems and the benefits of such innovation are often considered to be far beyond their potential drawbacks.</p>
  <p>ocpforum is designed to be a huge step forward in making money more secure and could also act as a significant protection against many forms of financial crime. For instance, ocpforums are completely impossible to counterfeit. Users are in full control of their payments and cannot receive unapproved charges such as with credit card fraud. ocpforum transactions are irreversible and immune to fraudulent chargebacks. ocpforum allows money to be secured against theft and loss using very strong and useful mechanisms such as backups, encryption, and multiple signatures.</p>
  <p>Some concerns have been raised that ocpforum could be more attractive to criminals because it can be used to make private and irreversible payments. However, these features already exist with cash and wire transfer, which are widely used and well-established. The use of ocpforum will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems, and ocpforum is not likely to prevent criminal investigations from being conducted. In general, it is common for important breakthroughs to be perceived as being controversial before their benefits are well understood. The Internet is a good example among many others to illustrate this.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum a bubble?</a>
  <div>
  <p>A fast rise in price does not constitute a bubble. An artificial over-valuation that will lead to a sudden downward correction constitutes a bubble. Choices based on individual human action by hundreds of thousands of market participants is the cause for ocpforum's price to fluctuate as the market seeks price discovery. Reasons for changes in sentiment may include a loss of confidence in ocpforum, a large difference between value and price not based on the fundamentals of the ocpforum economy, increased press coverage stimulating speculative demand, fear of uncertainty, and old-fashioned irrational exuberance and greed.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Why do ocpforums have value?</a>
  <div>
  <p>ocpforums have value because they are useful as a form of money. ocpforum has the characteristics of money (durability, portability, fungibility, scarcity, divisibility, and recognizability) based on the properties of mathematics rather than relying on physical properties (like gold and silver) or trust in central authorities (like fiat currencies). In short, ocpforum is backed by mathematics. With these attributes, all that is required for a form of money to hold value is trust and adoption. In the case of ocpforum, this can be measured by its growing base of users, merchants, and startups. As with all currency, ocpforum's value comes only and directly from people willing to accept them as payment.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum a Ponzi scheme?</a>
  <div>
  <p>A Ponzi scheme is a fraudulent investment operation that pays returns to its investors from their own money, or the money paid by subsequent investors, instead of from profit earned by the individuals running the business. Ponzi schemes are designed to collapse at the expense of the last investors when there is not enough new participants.</p>
  <p>ocpforum is a free software project with no central authority. Consequently, no one is in a position to make fraudulent representations about investment returns. Like other major currencies such as gold, United States dollar, euro, yen, etc. there is no guaranteed purchasing power and the exchange rate floats freely. This leads to volatility where owners of ocpforums can unpredictably make or lose money. Beyond speculation, ocpforum is also a payment system with useful and competitive attributes that are being used by thousands of users and businesses.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Who created ocpforum?</a>
  <div>
  <p>ocpforum is the first implementation of a concept called "crypto-currency", which was first described in 1998 by Wei Dai on the cypherpunks mailing list, suggesting the idea of a new form of money that uses cryptography to control its creation and transactions, rather than a central authority. The first ocpforum specification and proof of concept was published in 2009 in a cryptography mailing list by Satoshi Nakamoto. Satoshi left the project in late 2010 without revealing much about himself. The community has since grown exponentially with <a href="page/development">many developers</a> working on ocpforum.</p>
  <p>Satoshi's anonymity often raised unjustified concerns, many of which are linked to misunderstanding of the open-source nature of ocpforum. The ocpforum protocol and software are published openly and any developer around the world can review the code or make their own modified version of the ocpforum software. Just like current developers, Satoshi's influence was limited to the changes he made being adopted by others and therefore he did not control ocpforum. As such, the identity of ocpforum's inventor is probably as relevant today as the identity of the person who invented paper.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Can ocpforums become worthless?</a>
  <div>
  <p>Yes. History is littered with currencies that failed and are no longer used, such as the <a href="http://en.wikipedia.org/wiki/German_gold_mark">German Mark</a> during the Weimar Republic and, more recently, the <a href="http://en.wikipedia.org/wiki/Zimbabwean_dollar">Zimbabwean dollar</a>. Although previous currency failures were typically due to hyperinflation of a kind that ocpforum makes impossible, there is always potential for technical failures, competing currencies, political issues and so on. As a basic rule of thumb, no currency should be considered absolutely safe from failures or hard times. ocpforum has proven reliable for years since its inception and there is a lot of potential for ocpforum to continue to grow. However, no one is in a position to predict what the future will be for ocpforum.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum fully virtual and immaterial?</a>
  <div>
  <p>ocpforum is as virtual as the credit cards and online banking networks people use everyday. ocpforum can be used to pay online and in physical stores just like any other form of money. ocpforums can also be exchanged in physical form such as the <a href="https://www.casascius.com/">Casascius coins</a>, but paying with a mobile phone usually remains more convenient. ocpforum balances are stored in a large distributed network, and they cannot be fraudulently altered by anybody. In other words, ocpforum users have exclusive control over their funds and ocpforums cannot vanish just because they are virtual.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Why do people trust ocpforum?</a>
  <div>
  <p>Much of the trust in ocpforum comes from the fact that it requires no trust at all. ocpforum is fully open-source and decentralized. This means that anyone has access to the entire source code at any time. Any developer in the world can therefore verify exactly how ocpforum works. All transactions and ocpforums issued into existence can be transparently consulted in real-time by anyone. All payments can be made without reliance on a third party and the whole system is protected by heavily peer-reviewed cryptographic algorithms like those used for online banking. No organization or individual can control ocpforum, and the network remains secure even if not all of its users can be trusted.</p>
  </div>
</div>
<div>
  <a href="javaScript:" onclick="faqShow(event);">Is ocpforum anonymous?</a>
  <div>
  <p>ocpforum is designed to allow its users to send and receive payments with an acceptable level of privacy as well as any other form of money. However, ocpforum is not anonymous and cannot offer the same level of privacy as cash. The use of ocpforum leaves extensive public records. <a href="page/protect-your-privacy">Various mechanisms</a> exist to protect users' privacy, and more are in development. However, there is still work to be done before these features are used correctly by most ocpforum users.</p>
  <p>Some concerns have been raised that private transactions could be used for illegal purposes with ocpforum. However, it is worth noting that ocpforum will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems. ocpforum cannot be more anonymous than cash and it is not likely to prevent criminal investigations from being conducted. Additionally, ocpforum is also designed to prevent a large range of financial crimes.</p>
  </div>
</div>
<p>To learn more about ocpforum, please visit the complete <a href="page/faq">FAQ</a> or the <a href="https://en.ocpforum.it/wiki/FAQ">ocpforum Wiki</a>.</p>

</div>

<div class="press-videos">

<h2>Videos</h2>

<div>
<a href="https://www.youtube.com/watch?v=LP4GSvQUtBw&amp;feature=player_embedded" target="_blank"><img src="http://ocpforum.org/img/press/video/funke.jpg" alt="what is ocpforum"></a><br>
<a>What is ocpforum - Funke</a><br>
<a href="https://www.youtube.com/watch?v=LP4GSvQUtBw&amp;feature=player_embedded" target="_blank">Video on Youtube</a><br>
<a href="https://drive.google.com/folderview?id=0Bw3qRtSO3Wwtb3dYLVNDTmNxSTQ&amp;usp=sharing" target="_blank">More formats and languages</a>
</div>
<div>
<a href="https://www.youtube.com/watch?v=Um63OQz3bjo&amp;feature=player_embedded" target="_blank"><img src="http://ocpforum.org/img/press/video/whatisocpforum.jpg" alt="what is ocpforum"></a><br>
<a>What is ocpforum - Weusecoins</a><br>
<a href="https://www.youtube.com/watch?v=Um63OQz3bjo&amp;feature=player_embedded" target="_blank">Video on Youtube</a><br>
<a href="https://www.weusecoins.com/en/materials" target="_blank">More formats and languages</a>
</div>

</div>

<div class="press-pictures">

<h2>Pictures</h2>
<div>
	<a href="https://docs.google.com/uc?export=view&amp;id=0B4t9VJLm_PWhckxzRm5vS2ZtOWM" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_kiez.jpg" alt="ocpforum Kiez sign">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0BwnE6HIoU4a4bUswMm5UWS1XakU" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_plain.png" alt="ocpforum logo">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0BwnE6HIoU4a4Z2FaVTZ0NmRjSmc" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_qt.png" alt="ocpforum Qt logo">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bxtcokiuvb4fZjlvNjhTN2Q4aUE" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_3d.png" alt="3D ocpforum artwork by Eivind Nag" title="3D ocpforum artwork by Eivind Nag">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0BwnE6HIoU4a4MG9oY1hTSTRBMHM" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_euro.png" alt="ocpforum euro">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0BwnE6HIoU4a4RUZwY1Bzd3ZMa1E" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_gold.png" alt="ocpforum gold">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bxtcokiuvb4fa3QweHlqTTE2U3c" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_3d_light.png" alt="ocpforum 3D" title="3D ocpforum artwork by Eivind Nag">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bxtcokiuvb4fVTVhcDQzRVNBelk" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_3d_perspective.png" alt="ocpforum 3D" title="3D ocpforum artwork by Eivind Nag">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bxtcokiuvb4fcVQzWkNHYm5jbE0" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_logo_3d_wood.png" alt="ocpforum 3D" title="3D ocpforum artwork by Eivind Nag">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0BwnE6HIoU4a4NjlNLVM2dzJXLUk" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_casascius_holograph.png" alt="ocpforum Casascius holograph coin">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtMHByaTB1NmNSdTg" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_cybrbeast4.png" alt="ocpforum Cybrbeast 3D artwork">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtbFhyb0YybHdhWEU" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_cybrbeast1.png" alt="ocpforum Cybrbeast 3D artwork">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtV1BCLUQ1cHhOaDA" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_cybrbeast2.png" alt="ocpforum Cybrbeast 3D artwork">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtT2ZLUzZyYUlJaGs" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_cybrbeast3.png" alt="ocpforum Cybrbeast 3D artwork">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtVnV1X1ktLW83Uzg" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_wood.png" alt="ocpforum wood artwork">
	</a>
	<a href="https://docs.google.com/uc?export=view&amp;id=0Bw3qRtSO3WwtRkxSRDZtQXFTbWc" target="_blank">
		<img src="http://ocpforum.org/img/press/picture/ocpforum_casascius_metal.png" alt="ocpforum Casascius metal coin">
	</a>
</div>
<a href="javaScript:" onclick="materialShow(event);">Show more pictures...</a>

</div>

<div class="press-quotes">

<h2>Quotes</h2>
<div>
<p><span>There are 3 eras of currency: Commodity based, politically based, and now, math based.</span><span>Chris Dixon, Technology Investor</span></p>
<p><span>Right now ocpforum feels like the Internet before the browser.</span><span>Wences Casares, Technology Entrepreneur</span></p>
<p><span>ocpforum is Money Over Internet Protocol.</span><span>Tony Gallippi, BitInstant CEO</span></p>
<p><span>Entire classes of bugs are missing.</span><span>Dan Kaminsky, Security Researcher</span></p>
<p><span>The potential for disruption is enormous.</span><span>Jeremy Liew, Lightspeed Venture Partners</span></p>
<p><span>Digital currency is going to be a very powerful thing.</span>John Donohoe, Ebay CEO<span></span></p>
<p><span>We have elected to put our money and faith in a mathematical framework that is free of politics and human error.</span><span>Tyler Winklevoss, Entrepreneur</span></p>
<p><span>With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless.</span><span>Satoshi Nakamoto, ocpforum Developer</span></p>
<p><span>ocpforum is a technological tour de force.</span><span>Bill Gates, Executive Chairman, Microsoft<br>Eric Schmidt, Executive Chairman, Google</span></p>
<p><span>You can basically put a bank in your pocket... That's pretty amazing.</span><span>Gavin Andresen, Chief Scientist, The ocpforum Foundation</span></p>
<p><span>ocpforum allows wealth to be reduced to pure information and transmitted costlessly around the world—something nobody knew how to do before 2009. Its applications won’t be immediately obvious, especially to ordinary users.</span><span>Timothy B. Lee, Reporter, The Washington Post</span></p>
<p><span>PayPal alone blocks access from over 60 countries ... Whatever the reason, we don’t think an individual blogger from Haiti, Ethiopia, or Kenya should have diminished access to the blogosphere because of payment issues they can’t control.</span><span>Andy Skelton, Developer, WordPress</span></p>
<p><span>The Babyboomers gave us the personal computer, Generation X gave us the Internet, and now Generation Y is building a new financial paradigm.</span><span>Tuur Demeester, Author, MacroTrends</span></p>
<p><span>Had you asked me five years ago, I would just say it was impossible. ocpforum and crypto currencies solved this problem of coming to a consensus globally where you don't trust anybody else.</span><span>Richard Brown, Executive architect, IBM</span></p>
<p><span>We believe that ocpforum represents something fundamental and powerful ... It reminds us of SMTP, HTTP, RSS, and BitTorrent in its architecture and openness.</span><span>Fred Wilson, Co-Founder of Union Square Ventures</span></p>
<p><span>It represents a remarkable conceptual and technical achievement, which may well be used by existing financial institutions (which could issue their own ocpforums) or even by governments themselves.</span><span>François R. Velde, Economist, Federal Reserve</span></p>
<p><span>All the things that gold does, ocpforum kind of does better.</span><span>Naval Ravikant, Founder of Angellist</span></p>
<p><span>It's the cheapest way to move money around.</span><span>Max Keiser, Journalist &amp; TV Host</span></p>
</div>
<a href="javaScript:" onclick="materialShow(event);">Show more quotes...</a>

</div>



<h2>Press coverage</h2>

<div class="press-news">

<div>
  <a href="http://www.finextra.com/Video/Video.aspx?videoid=513"><img src="http://ocpforum.org/img/press/news/news_finextra.jpg" alt="Preview"></a>
  <a href="http://www.finextra.com/Video/Video.aspx?videoid=513">Finextra, Bullish on ocpforum</a>
  <a>2013-10-22</a>
  <p>Richard Brown, executive architect, IBM thinks the future for crypto-currencies looks very bright.</p>
</div>
<div>
  <a href="https://www.youtube.com/watch?v=drPkfGUZBqY&amp;feature=player_embedded"><img src="http://ocpforum.org/img/press/news/news_channel8.jpg" alt="Preview"></a>
  <a href="https://www.youtube.com/watch?v=drPkfGUZBqY&amp;feature=player_embedded">News Channel 8, Andrea Castillo discusses ocpforum</a>
  <a>2013-08-09</a>
  <p>Andrea Castillio from the Mercatus Center discusses and explains ocpforum.</p>
</div>
<div>
  <a href="http://www.youtube.com/watch?v=FnNnZLkHnG4"><img src="http://ocpforum.org/img/press/news/news_ft.jpg" alt="Preview"></a>
  <a href="http://www.youtube.com/watch?v=FnNnZLkHnG4">Financial Times, The rise of ocpforum</a>
  <a>2013-07-05</a>
  <p>ocpforum, a decentralized, virtual currency, is garnering increasing interest from investors and entrepreneurs. Maija Palmer reports from a ocpforum conference on where the currency is heading and goes to buy her first (fraction) of a ocpforum.</p>
</div>
<div>
  <a href="http://www.youtube.com/watch?v=_U18FG3ZAno"><img src="http://ocpforum.org/img/press/news/news_forbes.jpg" alt="Preview"></a>
  <a href="http://www.youtube.com/watch?v=_U18FG3ZAno">Forbes, Why ocpforumers believe in the digital currency</a>
  <a>2013-05-13</a>
  <p>After a week of living on the crypto-currency, Forbes reporter Kashmir Hill invites ocpforum enthusiasts to a dinner meet-up to help her spend the rest of her digital wallet and share their views on the alternative currency.</p>
</div>
<div>
  <a href="http://www.theguardian.com/technology/2013/apr/26/ocpforums-gain-currency-in-berlin"><img src="http://ocpforum.org/img/press/news/news_guardian.jpg" alt="Preview"></a>
  <a href="http://www.theguardian.com/technology/2013/apr/26/ocpforums-gain-currency-in-berlin">The Guardian, Berlin streets where you can shop with ocpforum</a>
  <a>2013-04-26</a>
  <p>The Guardian meets the ocpforum Kiez, among the first point-of-sales shops and restaurants to accept ocpforum.</p>
</div>
<div>
  <a href="http://www.youtube.com/watch?v=6SLPy89gPE0"><img src="http://ocpforum.org/img/press/news/news_bloomberg.jpg" alt="Preview"></a>
  <a href="http://www.youtube.com/watch?v=6SLPy89gPE0">Bloomberg on the future of ocpforum currency</a>
  <a>2013-04-11</a>
  <p>Convergex's Nicholas Colas and Holland &amp; Company's Michael Holland discuss the future of ocpforum on Bloomberg Television's.</p>
</div>
<div>
  <a href="http://video.foxbusiness.com/v/2277786423001/"><img src="http://ocpforum.org/img/press/news/news_fox_trace.jpg" alt="Preview"></a>
  <a href="http://video.foxbusiness.com/v/2277786423001/">FOX Business with Trace Mayer</a>
  <a>2013-04-05</a>
  <p>Is ocpforum for real? ocpforum investor Trace Mayer explains the virtual currency.</p>
</div>

</div>

<script>
function disclaimerShow(e) {
	console.log($(e.toElement).parent().find('p'));
	$(e.toElement).parent().find('p').eq(1).toggle();
}
function faqShow(e) {
	$(e.toElement.nextElementSibling).toggle();
}
function materialShow(e) {
	console.log(e);
}
</script>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>