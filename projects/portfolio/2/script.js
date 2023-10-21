function addElement( to, content) {

var logElem = document.querySelector(to);
logElem.innerHTML = content;

}

function addElements() {

addElement('#header_content','<img alt="Game logo" title="Game logo" id="game_logo" src="images/game_logo.png"> 			<div id="header_links"> 				<a href="#faq">FAQ</a> 				<a href="#news">NEWS</a> 				<a href="#download">DOWNLOAD</a> 			</div>');

addElement('footer','<div class="footer_block"> 				<h6>Explore more</h6> 				<a href="concepts.html">Concepts</a> 				<a href="trello.html">For media</a> 				<a href="media.html">Trello</a> 			</div> 			<div class="footer_block"> 			    <h6>Social networks</h6> 			    <a href="about:blank">YouTube</a> 			    <a href="about:blank">Diacord</a> 			    <a href="about:blank">GameJolt</a> 			</div> 			<div class="footer_block"> 			    <h6>legal information</h6> 			    <a href="privacy.html">Privacy policy</a> 			    <a href="agreement.html">User agreement</a> 			    <a href="cookie.html">Cookies policy</a> 			</div><hr style="width:100%;opacity:0.5;margin-top:150px;"><h6 id="scott">©2021 ScottGames. All characters belong to Scott Cawthon</h6>');

}