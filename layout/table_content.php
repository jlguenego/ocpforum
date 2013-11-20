<?php

define('BASE_DIR', '..');


include(BASE_DIR . '/include/top_page.inc');

?>

<style>
</style>
<h1>Frequently Asked Questions</h1>
<p class="summary">Find answers to recurring questions and myths about Bitcoin.</p>


<div id="content_table"></div>

<h2><a name="general">General</a></h2>

<h3><a name="what-is-bitcoin">What is Bitcoin?</a></h3>
<p>Bitcoin is a consensus network that enables a new payment system and a completely digital money. It is the first decentralized peer-to-peer payment network that is powered by its users with no central authority or middlemen. From a user perspective, Bitcoin is pretty much like cash for the Internet. Bitcoin can also be seen as the most prominent <a href="http://financialcryptography.com/mt/archives/001325.html">triple entry bookkeeping system</a> in existence.</p>

<h3><a name="who-created-bitcoin">Who created Bitcoin?</a></h3>
<p>Bitcoin is the first implementation of a concept called "crypto-currency", which was first described in 1998 by Wei Dai on the cypherpunks mailing list, suggesting the idea of a new form of money that uses cryptography to control its creation and transactions, rather than a central authority. The first Bitcoin specification and proof of concept was published in 2009 in a cryptography mailing list by Satoshi Nakamoto. Satoshi left the project in late 2010 without revealing much about himself. The community has since grown exponentially with <a href="/en/development">many developers</a> working on Bitcoin.</p>
<p>Satoshi's anonymity often raised unjustified concerns, many of which are linked to misunderstanding of the open-source nature of Bitcoin. The Bitcoin protocol and software are published openly and any developer around the world can review the code or make their own modified version of the Bitcoin software. Just like current developers, Satoshi's influence was limited to the changes he made being adopted by others and therefore he did not control Bitcoin. As such, the identity of Bitcoin's inventor is probably as relevant today as the identity of the person who invented paper.</p>

<h3><a name="who-controls-the-bitcoin-network">Who controls the Bitcoin network?</a></h3>
<p>Nobody owns the Bitcoin network much like no one owns the technology behind email. Bitcoin is controlled by all Bitcoin users around the world. While developers are improving the software, they can't force a change in the Bitcoin protocol because all users are free to choose what software and version they use. In order to stay compatible with each other, all users need to use software complying with the same rules. Bitcoin can only work correctly with a complete consensus among all users. Therefore, all users and developers have a strong incentive to protect this consensus.</p>

<h3><a name="how-does-bitcoin-work">How does Bitcoin work?</a></h3>
<p>From a user perspective, Bitcoin is nothing more than a mobile app or computer program that provides a personal Bitcoin wallet and allows a user to send and receive bitcoins with them. This is how Bitcoin works for most users.</p>
<p>Behind the scenes, the Bitcoin network is sharing a public ledger called the "block chain". This ledger contains every transaction ever processed, allowing a user's computer to verify the validity of each transaction. The authenticity of each transaction is protected by digital signatures corresponding to the sending addresses, allowing all users to have full control over sending bitcoins from their own Bitcoin addresses. In addition, anyone can process transactions using the computing power of specialized hardware and earn a reward in bitcoins for this service. This is often called "mining". To learn more about Bitcoin, you can consult the <a href="/en/how-it-works">dedicated page</a> and the <a href="http://bitcoin.org/bitcoin.pdf">original paper</a>.</p>

<h3><a name="is-bitcoin-really-used-by-people">Is Bitcoin really used by people?</a></h3>
<p>Yes. There is a <a href="http://usebitcoins.info/">growing number of businesses</a> and individuals using Bitcoin. This includes brick and mortar businesses like restaurants, apartments, law firms, and popular online services such as Namecheap, WordPress, Reddit and Flattr. While Bitcoin remains a relatively new phenomenon, it is growing fast. At the end of August 2013, the <a href="http://bitcoincharts.com/bitcoin/">value of all bitcoins in circulation</a> exceeded US$ 1.5 billion with millions of dollars worth of bitcoins exchanged daily.</p>
<p>
<img src="http://bitcoin.org/img/faq/merchants_map.png" alt="Screenshot">
</p>

<h3><a name="how-does-one-acquire-bitcoins">How does one acquire bitcoins?</a></h3>
<ul>
  <li>As payment for goods or services.</li>
  <li>Purchase bitcoins at a <a href="http://howtobuybitcoins.info">Bitcoin exchange</a>.</li>
  <li>Exchange bitcoins with <a href="https://localbitcoins.com/">someone near you</a>.</li>
  <li>Earn bitcoins through competitive <a href="http://www.bitcoinmining.com/">mining</a>.</li>
</ul>
<p>While it may be possible to find individuals who wish to sell bitcoins in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys bitcoins with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.</p>

<h3><a name="how-difficult-is-it-to-make-a-bitcoin-payment">How difficult is it to make a Bitcoin payment?</a></h3>
<p>Bitcoin payments are easier to make than debit or credit card purchases, and can be received without a merchant account. Payments are made from a wallet application, either on your computer or smartphone, by entering the recipient's address, the payment amount, and pressing send. To make it easier to enter a recipient's address, many wallets can obtain the address by scanning a QR code or touching two phones together with NFC technology.</p>
<p>
<img src="http://bitcoin.org/img/faq/mobile_send.png" alt="Screenshot">
<img src="http://bitcoin.org/img/faq/mobile_receive.png" alt="Screenshot">
</p>

<h3><a name="what-are-the-advantages-of-bitcoin">What are the advantages of Bitcoin?</a></h3>
<ul>
  <li><em><b>Payment freedom</b></em> - It is possible to send and receive any amount of money instantly anywhere in the world at any time. No bank holidays. No borders. No imposed limits. Bitcoin allows its users to be in full control of their money.</li>
  <li><em><b>Very low fees</b></em> - Bitcoin payments are currently processed with either no fees or extremely small fees. Users may include fees with transactions to receive priority processing, which results in faster confirmation of transactions by the network. Additionally, merchant processors exist to assist merchants in processing transactions, converting bitcoins to fiat currency and depositing funds directly into merchants' bank accounts daily. As these services are based on Bitcoin, they can be offered for much lower fees than with PayPal or credit card networks.</li>
  <li><em><b>Fewer risks for merchants</b></em> - Bitcoin transactions are secure, irreversible, and do not contain customers’ sensitive or personal information. This protects merchants from losses caused by fraud or fraudulent chargebacks, and there is no need for PCI compliance. Merchants can easily expand to new markets where either credit cards are not available or fraud rates are unacceptably high. The net results are lower fees, larger markets, and fewer administrative costs.</li>
  <li><em><b>Security and control</b></em> - Bitcoin users are in full control of their transactions; it is impossible for merchants to force unwanted or unnoticed charges as can happen with other payment methods. Bitcoin payments can be made without personal information tied to the transaction. This offers strong protection against identity theft. Bitcoin users can also protect their money with backup and encryption.</li>
  <li><em><b>Transparent and neutral</b></em> - <a href="http://blockexplorer.com/">All information</a> concerning the Bitcoin money supply itself is readily available on the block chain for anybody to verify and use in real-time. No individual or organization can control or manipulate the Bitcoin protocol because it is cryptographically secure. This allows the core of Bitcoin to be trusted for being completely neutral, transparent and predictable.</li>
</ul>

<h3><a name="what-are-the-disadvantages-of-bitcoin">What are the disadvantages of Bitcoin?</a></h3>
<ul>
  <li><em><b>Degree of acceptance</b></em> - Many people are still unaware of Bitcoin. Every day, more businesses accept bitcoins because they want the advantages of doing so, but the list remains small and still needs to grow in order to benefit from <a href="http://en.wikipedia.org/wiki/Network_effect">network effects.</a></li>
  <li><em><b>Volatility</b></em> - The <a href="http://bitcoincharts.com/bitcoin/">total value</a> of bitcoins in circulation and the number of businesses using Bitcoin are still very small compared to what they could be. Therefore, relatively small events, trades, or business activities can significantly affect the price. In theory, this volatility will decrease as Bitcoin markets and the technology matures. Never before has the world seen a start-up currency, so it is truly difficult (and exciting) to imagine how it will play out.</li>
  <li><em><b>Ongoing development</b></em> - Bitcoin software is still in beta with many incomplete features in active development. New tools, features, and services are being developed to make Bitcoin more secure and accessible to the masses. Some of these are still not ready for everyone. Most Bitcoin businesses are new and still offer no insurance. In general, Bitcoin is still in the process of maturing.</li>
</ul>

<h3><a name="why-do-people-trust-bitcoin">Why do people trust Bitcoin?</a></h3>
<p>Much of the trust in Bitcoin comes from the fact that it requires no trust at all. Bitcoin is fully open-source and decentralized. This means that anyone has access to the entire source code at any time. Any developer in the world can therefore verify exactly how Bitcoin works. All transactions and bitcoins issued into existence can be transparently consulted in real-time by anyone. All payments can be made without reliance on a third party and the whole system is protected by heavily peer-reviewed cryptographic algorithms like those used for online banking. No organization or individual can control Bitcoin, and the network remains secure even if not all of its users can be trusted.</p>

<h3><a name="can-i-make-money-with-bitcoin">Can I make money with Bitcoin?</a></h3>
<p>You should never expect to get rich with Bitcoin or any emerging technology. It is always important to be wary of anything that sounds too good to be true or disobeys basic economic rules.</p>
<p>Bitcoin is a growing space of innovation and there are business opportunities that also include risks. There is no guarantee that Bitcoin will continue to grow even though it has developed at a very fast rate so far. Investing time and resources on anything related to Bitcoin requires entrepreneurship. There are various ways to make money with Bitcoin such as mining, speculation or running new businesses. All of these methods are competitive and there is no guarantee of profit. It is up to each individual to make a proper evaluation of the costs and the risks involved in any such project.</p>

<h3><a name="is-bitcoin-fully-virtual-and-immaterial">Is Bitcoin fully virtual and immaterial?</a></h3>
<p>Bitcoin is as virtual as the credit cards and online banking networks people use everyday. Bitcoin can be used to pay online and in physical stores just like any other form of money. Bitcoins can also be exchanged in physical form such as the <a href="https://www.casascius.com/">Casascius coins</a>, but paying with a mobile phone usually remains more convenient. Bitcoin balances are stored in a large distributed network, and they cannot be fraudulently altered by anybody. In other words, Bitcoin users have exclusive control over their funds and bitcoins cannot vanish just because they are virtual.</p>

<h3><a name="is-bitcoin-anonymous">Is Bitcoin anonymous?</a></h3>
<p>Bitcoin is designed to allow its users to send and receive payments with an acceptable level of privacy as well as any other form of money. However, Bitcoin is not anonymous and cannot offer the same level of privacy as cash. The use of Bitcoin leaves extensive public records. <a href="/en/protect-your-privacy">Various mechanisms</a> exist to protect users' privacy, and more are in development. However, there is still work to be done before these features are used correctly by most Bitcoin users.</p>
<p>Some concerns have been raised that private transactions could be used for illegal purposes with Bitcoin. However, it is worth noting that Bitcoin will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems. Bitcoin cannot be more anonymous than cash and it is not likely to prevent criminal investigations from being conducted. Additionally, Bitcoin is also designed to prevent a large range of financial crimes.</p>

<h3><a name="what-happens-when-bitcoins-are-lost">What happens when bitcoins are lost?</a></h3>
<p>When a user loses his wallet, it has the effect of removing money out of circulation. Lost bitcoins still remain in the block chain just like any other bitcoins. However, lost bitcoins remain dormant forever because there is no way for anybody to find the private key(s) that would allow them to be spent again. Because of the law of supply and demand, when fewer bitcoins are available, the ones that are left will be in higher demand and increase in value to compensate.</p>

<h3><a name="can-bitcoin-scale-to-become-a-major-payment-network">Can Bitcoin scale to become a major payment network?</a></h3>
<p>The Bitcoin network can already process a much higher number of transactions per second than it does today. It is, however, not entirely ready to scale to the level of major credit card networks. Work is underway to lift current limitations, and future requirements are well known. Since inception, every aspect of the Bitcoin network has been in a continuous process of maturation, optimization, and specialization, and it should be expected to remain that way for some years to come. As traffic grows, more Bitcoin users may use lightweight clients, and full network nodes may become a more specialized service. For more details, see the <a href="https://en.bitcoin.it/wiki/Scalability">Scalability</a> page on the Wiki.</p>

<h2><a name="legal">Legal</a></h2>

<h3><a name="is-bitcoin-legal">Is Bitcoin legal?</a></h3>
<p>To the best of our knowledge, Bitcoin has not been made illegal by legislation in any jurisdiction. However, some jurisdictions (such as Argentina) severely restrict or ban all foreign currency. Other jurisdictions (such as Thailand) may limit the licensing of certain entities such as Bitcoin exchanges.</p>
<p>Regulators from various jurisdictions are taking steps to provide individuals and businesses with rules on how to integrate this new technology with the formal, regulated financial system. For example, the Financial Crimes Enforcement Network (FinCEN), a bureau in the United States Treasury Department, issued non-binding guidance on how it characterizes certain activities involving virtual currencies.</p>
<ul>
  <li><a href="http://www.ecb.europa.eu/pub/pdf/other/virtualcurrencyschemes201210en.pdf">Virtual Currency Schemes - European Central Bank</a></li>
  <li><a href="http://www.fincen.gov/statutes_regs/guidance/pdf/FIN-2013-G001.pdf">Application of FinCEN’s Regulations to Persons Administering, Exchanging, or Using Virtual Currencies</a></li>
</ul>

<h3><a name="is-bitcoin-useful-for-illegal-activities">Is Bitcoin useful for illegal activities?</a></h3>
<p>Bitcoin is money, and money has always been used both for legal and illegal purposes. Cash, credit cards and current banking systems widely surpass Bitcoin in terms of their use to finance crime. Bitcoin can bring significant innovation in payment systems and the benefits of such innovation are often considered to be far beyond their potential drawbacks.</p>
<p>Bitcoin is designed to be a huge step forward in making money more secure and could also act as a significant protection against many forms of financial crime. For instance, bitcoins are completely impossible to counterfeit. Users are in full control of their payments and cannot receive unapproved charges such as with credit card fraud. Bitcoin transactions are irreversible and immune to fraudulent chargebacks. Bitcoin allows money to be secured against theft and loss using very strong and useful mechanisms such as backups, encryption, and multiple signatures.</p>
<p>Some concerns have been raised that Bitcoin could be more attractive to criminals because it can be used to make private and irreversible payments. However, these features already exist with cash and wire transfer, which are widely used and well-established. The use of Bitcoin will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems, and Bitcoin is not likely to prevent criminal investigations from being conducted. In general, it is common for important breakthroughs to be perceived as being controversial before their benefits are well understood. The Internet is a good example among many others to illustrate this.</p>

<h3><a name="can-bitcoin-be-regulated">Can Bitcoin be regulated?</a></h3>
<p>The Bitcoin protocol itself cannot be modified without the cooperation of nearly all its users, who choose what software they use. Attempting to assign special rights to a local authority in the rules of the global Bitcoin network is not a practical possibility. Any rich organization could choose to invest in mining hardware to control half of the computing power of the network and become able to block or reverse recent transactions. However, there is no guarantee that they could retain this power since this requires to invest as much than all other miners in the world.</p>
<p>It is however possible to regulate the use of Bitcoin in a similar way to any other instrument. Just like the dollar, Bitcoin can be used for a wide variety of purposes, some of which can be considered legitimate or not as per each jurisdiction's laws. In this regard, Bitcoin is no different than any other tool or resource and can be subjected to different regulations in each country. Bitcoin use could also be made difficult by restrictive regulations, in which case it is hard to determine what percentage of users would keep using the technology. A government that chooses to ban Bitcoin would prevent domestic businesses and markets from developing, shifting innovation to other countries. The challenge for regulators, as always, is to develop efficient solutions while not impairing the growth of new emerging markets and businesses.</p>

<h3><a name="what-about-bitcoin-and-taxes">What about Bitcoin and taxes?</a></h3>
<p>Bitcoin is not a fiat currency with legal tender status in any jurisdiction, but often tax liability accrues regardless of the medium used. There is a wide variety of legislation in many different jurisdictions which could cause income, sales, payroll, capital gains, or some other form of tax liability to arise with Bitcoin.</p>

<h3><a name="what-about-bitcoin-and-consumer-protection">What about Bitcoin and consumer protection?</a></h3>
<p>Bitcoin is freeing people to transact on their own terms. Each user can send and receive payments in a similar way to cash but they can also take part in more complex contracts. Multiple signatures allow a transaction to be accepted by the network only if a certain number of a defined group of persons agree to sign the transaction. This allows innovative dispute mediation services to be developed in the future. Such services could allow a third party to approve or reject a transaction in case of disagreement between the other parties without having control on their money. As opposed to cash and other payment methods, Bitcoin always leave a public proof that a transaction did take place, which can potentially be used in a recourse against businesses with fraudulent practices.</p>
<p>It is also worth noting that while merchants usually depend on their public reputation to remain in business and pay their employees, they don't have access to the same level of information when dealing with new consumers. The way Bitcoin works allows both individuals and businesses to be protected against fraudulent chargebacks while giving the choice to the consumer to ask for more protection when they are not willing to trust a particular merchant.</p>

<h2><a name="economy">Economy</a></h2>

<h3><a name="how-are-bitcoins-created">How are bitcoins created?</a></h3>
<p>New bitcoins are generated by a competitive and decentralized process called "mining". This process involves that individuals are rewarded by the network for their services. Bitcoin miners are processing transactions and securing the network using specialized hardware and are collecting new bitcoins in exchange.</p>
<p>The Bitcoin protocol is designed in such a way that new bitcoins are created at a fixed rate. This makes Bitcoin mining a very competitive business. When more miners join the network, it becomes increasingly difficult to make a profit and miners must seek efficiency to cut their operating costs. No central authority or developer has any power to control or manipulate the system to increase their profits. Every Bitcoin node in the world will reject anything that does not comply with the rules it expects the system to follow.</p>
<p>Bitcoins are created at a decreasing and predictable rate. The number of new bitcoins created each year is automatically halved over time until bitcoin issuance halts completely with a total of 21 million bitcoins in existence. At this point, Bitcoin miners will probably be supported exclusively by numerous small transaction fees.</p>

<h3><a name="why-do-bitcoins-have-value">Why do bitcoins have value?</a></h3>
<p>Bitcoins have value because they are useful as a form of money. Bitcoin has the characteristics of money (durability, portability, fungibility, scarcity, divisibility, and recognizability) based on the properties of mathematics rather than relying on physical properties (like gold and silver) or trust in central authorities (like fiat currencies). In short, Bitcoin is backed by mathematics. With these attributes, all that is required for a form of money to hold value is trust and adoption. In the case of Bitcoin, this can be measured by its growing base of users, merchants, and startups. As with all currency, bitcoin's value comes only and directly from people willing to accept them as payment.</p>

<h3><a name="what-determines-bitcoins-price">What determines bitcoin’s price?</a></h3>
<p>The price of a bitcoin is determined by supply and demand. When demand for bitcoins increases, the price increases, and when demand falls, the price falls. There is only a limited number of bitcoins in circulation and new bitcoins are created at a predictable and decreasing rate, which means that demand must follow this level of inflation to keep the price stable. Because Bitcoin is still a relatively small market compared to what it could be, it doesn't take significant amounts of money to move the market price up or down, and thus the price of a bitcoin is still very volatile.</p>
<p>Bitcoin price, 2011 to 2013:<br><img src="http://bitcoin.org/img/faq/price_chart.png" alt="chart"></p>

<h3><a name="can-bitcoins-become-worthless">Can bitcoins become worthless?</a></h3>
<p>Yes. History is littered with currencies that failed and are no longer used, such as the <a href="http://en.wikipedia.org/wiki/German_gold_mark">German Mark</a> during the Weimar Republic and, more recently, the <a href="http://en.wikipedia.org/wiki/Zimbabwean_dollar">Zimbabwean dollar</a>. Although previous currency failures were typically due to hyperinflation of a kind that Bitcoin makes impossible, there is always potential for technical failures, competing currencies, political issues and so on. As a basic rule of thumb, no currency should be considered absolutely safe from failures or hard times. Bitcoin has proven reliable for years since its inception and there is a lot of potential for Bitcoin to continue to grow. However, no one is in a position to predict what the future will be for Bitcoin.</p>

<h3><a name="is-bitcoin-a-bubble">Is Bitcoin a bubble?</a></h3>
<p>A fast rise in price does not constitute a bubble. An artificial over-valuation that will lead to a sudden downward correction constitutes a bubble. Choices based on individual human action by hundreds of thousands of market participants is the cause for bitcoin's price to fluctuate as the market seeks price discovery. Reasons for changes in sentiment may include a loss of confidence in Bitcoin, a large difference between value and price not based on the fundamentals of the Bitcoin economy, increased press coverage stimulating speculative demand, fear of uncertainty, and old-fashioned irrational exuberance and greed.</p>

<h3><a name="is-bitcoin-a-ponzi-scheme">Is Bitcoin a Ponzi scheme?</a></h3>
<p>A Ponzi scheme is a fraudulent investment operation that pays returns to its investors from their own money, or the money paid by subsequent investors, instead of from profit earned by the individuals running the business. Ponzi schemes are designed to collapse at the expense of the last investors when there is not enough new participants.</p>
<p>Bitcoin is a free software project with no central authority. Consequently, no one is in a position to make fraudulent representations about investment returns. Like other major currencies such as gold, United States dollar, euro, yen, etc. there is no guaranteed purchasing power and the exchange rate floats freely. This leads to volatility where owners of bitcoins can unpredictably make or lose money. Beyond speculation, Bitcoin is also a payment system with useful and competitive attributes that are being used by thousands of users and businesses.</p>

<h3><a name="doesnt-bitcoin-unfairly-benefit-early-adopters">Doesn't Bitcoin unfairly benefit early adopters?</a></h3>
<p>Some early adopters have large numbers of bitcoins because they took risks and invested time and resources in an unproven technology that was hardly used by anyone and that was much harder to secure properly. Many early adopters spent large numbers of bitcoins quite a few times before they became valuable or bought only small amounts and didn't make huge gains. There is no guarantee that the price of a bitcoin will increase or drop. This is very similar to investing in an early startup that can either gain value through its usefulness and popularity, or just never break through. Bitcoin is still in its infancy, and it has been designed with a very long-term view; it is hard to imagine how it could be less biased towards early adopters, and today's users may or may not be the early adopters of tomorrow.</p>

<h3><a name="wont-the-finite-amount-of-bitcoins-be-a-limitation">Won't the finite amount of bitcoins be a limitation?</a></h3>
<p>Bitcoin is unique in that only 21 million bitcoins will ever be created. However, this will never be a limitation because bitcoins can be divided up to 8 decimal places ( 0.000 000 01 BTC ) and potentially even smaller units if that is ever required in the future. As the average transaction size decreases, transactions can be denominated in sub-units of a bitcoin, such as millibitcoins ( 1 mBTC or 0.001 BTC ).</p>

<h3><a name="wont-bitcoin-fall-in-a-deflationary-spiral">Won't Bitcoin fall in a deflationary spiral?</a></h3>
<p>The deflationary spiral theory says that if prices are expected to fall, people will move purchases into the future in order to benefit from the lower prices. That fall in demand will in turn cause merchants to lower their prices to try and stimulate demand, making the problem worse and leading to an economic depression.</p>
<p>Although this theory is a popular way to justify inflation amongst central bankers, it does not appear to always hold true and is considered controversial amongst economists. Consumer electronics is one example of a market where prices constantly fall but which is not in depression. Similarly, the value of bitcoins has risen over time and yet the size of the Bitcoin economy has also grown dramatically along with it. Because both the value of the currency and the size of its economy started at zero in 2009, Bitcoin is a counterexample to the theory showing that it must sometimes be wrong.</p>
<p>Notwithstanding this, Bitcoin is not designed to be a deflationary currency. It is more accurate to say Bitcoin is intended to inflate in its early years, and become stable in its later years. The only time the quantity of bitcoins in circulation will drop is if people carelessly lose their wallets by failing to make backups. With a stable monetary base and a stable economy, the value of the currency should remain the same.</p>

<h3><a name="isnt-speculation-and-volatility-a-problem-for-bitcoin">Isn't speculation and volatility a problem for Bitcoin?</a></h3>
<p>This is a chicken and egg situation. For bitcoin's price to stabilize, a large scale economy needs to develop with more businesses and users. For a large scale economy to develop, businesses and users will seek for price stability.</p>
<p>Fortunately, volatility does not affect the main benefits of Bitcoin as a payment system to transfer money from point A to point B. It is possible for businesses to convert bitcoin payments to their local currency instantly, allowing them to profit from the advantages of Bitcoin without being subjected to price fluctuations. Since Bitcoin offers many useful and unique features and properties, many users choose to use Bitcoin. With such solutions and incentives, it is possible that Bitcoin will mature and develop to a degree where price volatility will become limited.</p>

<h3><a name="what-if-someone-bought-up-all-the-existing-bitcoins">What if someone bought up all the existing bitcoins?</a></h3>
<p>Only a fraction of bitcoins issued to date are found on the exchange markets for sale. Bitcoin markets are competitive, meaning the price of a bitcoin will rise or fall depending on supply and demand. Additionally, new bitcoins will continue to be issued for decades to come. Therefore even the most determined buyer could not buy all the bitcoins in existence. This situation isn't to suggest, however, that the markets aren't vulnerable to price manipulation; it still doesn't take significant amounts of money to move the market price up or down, and thus Bitcoin remains a volatile asset thus far.</p>

<h3><a name="what-if-someone-creates-a-better-digital-currency">What if someone creates a better digital currency?</a></h3>
<p>That can happen. For now, Bitcoin remains by far the most popular decentralized virtual currency, but there can be no guarantee that it will retain that position. There is already a set of alternative currencies inspired by Bitcoin. It is however probably correct to assume that significant improvements would be required for a new currency to overtake Bitcoin in terms of established market, even though this remains unpredictable. Bitcoin could also conceivably adopt improvements of a competing currency so long as it doesn't change fundamental parts of the protocol.</p>

<h2><a name="transactions">Transactions</a></h2>

<h3><a name="why-do-i-have-to-wait-10-minutes">Why do I have to wait 10 minutes?</a></h3>
<p>Receiving a payment is almost instant with Bitcoin. However, there is a 10 minutes delay on average before the network begins to confirm your transaction by including it in a block and before you can spend the bitcoins you receive. A confirmation means that there is a consensus on the network that the bitcoins you received haven't been sent to anyone else and are considered your property. Once your transaction has been included in one block, it will continue to be buried under every block after it, which will exponentially consolidate this consensus and decrease the risk of a reversed transaction. Every user is free to determine at what point they consider a transaction confirmed, but 6 confirmations is often considered to be as safe as waiting 6 months on a credit card transaction.</p>

<h3><a name="how-much-will-the-transaction-fee-be">How much will the transaction fee be?</a></h3>
<p>Most transactions can be processed without fees, but users are encouraged to pay a small voluntary fee for faster confirmation of their transactions and to remunerate miners. When fees are required, they generally don't exceed a few pennies in value. Your Bitcoin client will usually try to estimate an appropriate fee when required.</p>
<p>Transaction fees are used as a protection against users sending transactions to overload the network. The precise manner in which fees work is still being developed and will change over time. Because the fee is not related to the amount of bitcoins being sent, it may seem extremely low (0.0005 BTC for a 1,000 BTC transfer) or unfairly high (0.004 BTC for a 0.02 BTC payment). The fee is defined by attributes such as data in transaction and transaction recurrence. For example, if you are receiving a large number of tiny amounts, then fees for sending will be higher. Such payments are comparable to paying a restaurant bill using only pennies. Spending small fractions of your bitcoins rapidly may also require a fee. If your activity follows the pattern of conventional transactions, the fees should remain very low.</p>

<h3><a name="what-if-i-receive-a-bitcoin-when-my-computer-is-powered-off">What if I receive a bitcoin when my computer is powered off?</a></h3>
<p>This works fine. The bitcoins will appear next time you start your wallet application. Bitcoins are not actually received by the software on your computer, they are appended to a public ledger that is shared between all the devices on the network. If you are sent bitcoins when your wallet client program is not running and you later launch it, it will download blocks and catch up with any transactions it did not already know about, and the bitcoins will eventually appear as if they were just received in real time. Your wallet is only needed when you wish to spend bitcoins.</p>

<h3><a name="what-does-synchronizing-mean-and-why-does-it-take-so-long">What does "synchronizing" mean and why does it take so long?</a></h3>
<p>Long synchronization time is only required with full node clients like Bitcoin-Qt. Technically speaking, synchronizing is the process of downloading and verifying all previous Bitcoin transactions on the network. For some Bitcoin clients to calculate the spendable balance of your Bitcoin wallet and make new transactions, it needs to be aware of all previous transactions. This step can be resource intensive and requires sufficient bandwidth and storage to accommodate the <a href="http://blockchain.info/charts/blocks-size">full size of the block chain</a>. For Bitcoin to remain secure, enough people should keep using full node clients because they perform the task of validating and relaying transactions.</p>

<h2><a name="mining">Mining</a></h2>

<h3><a name="what-is-bitcoin-mining">What is Bitcoin mining?</a></h3>
<p>Mining is the process of spending computing power to process transactions, secure the network, and keep everyone in the system synchronized together. It can be perceived like the Bitcoin data center except that it has been designed to be fully decentralized with miners operating in all countries and no individual having control over the network. This process is referred to as "mining" as an analogy to gold mining because it is also a temporary mechanism used to issue new bitcoins. Unlike gold mining, however, Bitcoin mining provides a reward in exchange for useful services required to operate a secure payment network. Mining will still be required after the last bitcoin is issued.</p>

<h3><a name="how-does-bitcoin-mining-work">How does Bitcoin mining work?</a></h3>
<p>Anybody can become a Bitcoin miner by running software with specialized hardware. Mining software listens for transactions broadcast through the peer-to-peer network and performs appropriate tasks to process and confirm these transactions. Bitcoin miners perform this work because they can earn transaction fees paid by users for faster transaction processing, and newly created bitcoins issued into existence according to a fixed formula.</p>
<p>For new transactions to be confirmed, they need to be included in a block along with a mathematical proof of work. Such proofs are very hard to generate because there is no way to create them other than by trying billions of calculations per second. This requires miners to perform these calculations before their blocks are accepted by the network and before they are rewarded. As more people start to mine, the difficulty of finding valid blocks is automatically increased by the network to ensure that the average time to find a block remains equal to 10 minutes. As a result, mining is a very competitive business where no individual miner can control what is included in the block chain.</p>
<p>The proof of work is also designed to depend on the previous block to force a chronological order in the block chain. This makes it exponentially difficult to reverse previous transactions because this requires the recalculation of the proofs of work of all the subsequent blocks. When two blocks are found at the same time, miners work on the first block they receive and switch to the longest chain of blocks as soon as the next block is found. This allows mining to secure and maintain a global consensus based on processing power.</p>
<p>Bitcoin miners are neither able to cheat by increasing their own reward nor process fraudulent transactions that could corrupt the Bitcoin network because all Bitcoin nodes would reject any block that contains invalid data as per the rules of the Bitcoin protocol. Consequently, the network remains secure even if not all Bitcoin miners can be trusted.</p>

<h3><a name="isnt-bitcoin-mining-a-waste-of-energy">Isn't Bitcoin mining a waste of energy?</a></h3>
<p>Spending energy to secure and operate a payment system is hardly a waste. Like any other payment service, the use of Bitcoin entails processing costs. Services necessary for the operation of currently widespread monetary systems, such as banks, credit cards, and armored vehicles, also use a lot of energy. Although unlike Bitcoin, their total energy consumption is not transparent and cannot be as easily measured.</p>
<p>Bitcoin mining has been designed to become more optimized over time with specialized hardware consuming less energy, and the operating costs of mining should continue to be proportional to demand. When Bitcoin mining becomes too competitive and less profitable, some miners choose to stop their activities. Furthermore, all energy expended mining is eventually transformed into heat, and the most profitable miners will be those who have put this heat to good use. An optimally efficient mining network is one that isn't actually consuming any extra energy. While this is an ideal, the economics of mining are such that miners individually strive toward it.</p>

<h3><a name="how-does-mining-help-secure-bitcoin">How does mining help secure Bitcoin?</a></h3>
<p>Mining creates the equivalent of a competitive lottery that makes it very difficult for anyone to consecutively add new blocks of transactions into the block chain. This protects the neutrality of the network by preventing any individual from gaining the power to block certain transactions. This also prevents any individual from replacing parts of the block chain to roll back their own spends, which could be used to defraud other users. Mining makes it exponentially more difficult to reverse a past transaction by requiring the rewriting of all blocks following this transaction.</p>

<h3><a name="what-do-i-need-to-start-mining">What do I need to start mining?</a></h3>
<p>In the early days of Bitcoin, anyone could find a new block using their computer's CPU. As more and more people started mining, the difficulty of finding new blocks increased greatly to the point where the only cost-effective method of mining today is using specialized hardware. You can visit <a href="http://www.bitcoinmining.com/">BitcoinMining.com</a> for more information.</p>

<h2><a name="security">Security</a></h2>

<h3><a name="is-bitcoin-secure">Is Bitcoin secure?</a></h3>
<p>The Bitcoin technology - the protocol and the cryptography - has a strong security track record, and the Bitcoin network is probably the biggest distributed computing project in the world. Bitcoin's most common vulnerability is in user error. Bitcoin wallet files that store the necessary private keys can be accidentally deleted, lost or stolen. This is pretty similar to physical cash stored in a digital form. Fortunately, users can employ sound <a href="/en/secure-your-wallet">security practices</a> to protect their money or use service providers that offer good levels of security and insurance against theft or loss.</p>

<h3><a name="hasnt-bitcoin-been-hacked-in-the-past">Hasn't Bitcoin been hacked in the past?</a></h3>
<p>The rules of the protocol and the cryptography used for Bitcoin are still working years after its inception, which is a good indication that the concept is well designed. However, <a href="http://bitcoin.org/en/alerts">security flaws</a> have been found and fixed over time in various software implementations. Like any other form of software, the security of Bitcoin software depends on the speed with which problems are found and fixed. The more such issues are discovered, the more Bitcoin is gaining maturity.</p>
<p>There are often misconceptions about thefts and security breaches that happened on diverse exchanges and businesses. Although these events are unfortunate, none of them involve Bitcoin itself being hacked, nor imply inherent flaws in Bitcoin; just like a bank robbery doesn't mean that the dollar is compromised. However, it is accurate to say that a complete set of good practices and intuitive security solutions is needed to give users better protection of their money, and to reduce the general risk of theft and loss. Over the course of the last few years, such security features have quickly developed, such as wallet encryption, offline wallets, hardware wallets, and multi-signature transactions.</p>

<h3><a name="could-users-collude-against-bitcoin">Could users collude against Bitcoin?</a></h3>
<p>It is not possible to change the Bitcoin protocol that easily. Any Bitcoin client that doesn't comply with the same rules cannot enforce their own rules on other users. As per the current specification, double spending is not possible on the same block chain, and neither is spending bitcoins without a valid signature. Therefore, It is not possible to generate uncontrolled amounts of bitcoins out of thin air, spend other users' funds, corrupt the network, or anything similar.</p>
<p>However, a majority of miners could arbitrarily choose to block or reverse recent transactions. A majority of users can also put pressure for some changes to be adopted. Because Bitcoin only works correctly with a complete consensus between all users, changing the protocol can be very difficult and requires an overwhelming majority of users to adopt the changes in such a way that remaining users have nearly no choice but to follow. As a general rule, it is hard to imagine why any Bitcoin user would choose to adopt any change that could compromise their own money.</p>

<h3><a name="is-bitcoin-vulnerable-to-quantum-computing">Is Bitcoin vulnerable to quantum computing?</a></h3>
<p>Yes, most systems relying on cryptography in general are, including traditional banking systems. However, quantum computers don't yet exist and probably won't for a while. In the event that quantum computing could be an imminent threat to Bitcoin, the protocol could be upgraded to use post-quantum algorithms. Given the importance that this update would have, it can be safely expected that it would be highly reviewed by developers and adopted by all Bitcoin users.</p>

<h2><a name="help">Help</a></h2>

<h3><a name="more-help">I'd like to learn more. Where can I get help?</a></h3>
<p>You can find more information and help on the <a href="/en/resources">resources</a> and <a href="/en/community">community</a> pages or on the <a href="https://en.bitcoin.it/wiki/FAQ">Wiki FAQ</a>.</p>


<script>
$(document).ready(function() {
	$('#content_table').ocp_content_table();
});
</script>

<?php

include(BASE_DIR . '/include/bottom_page.inc');

?>