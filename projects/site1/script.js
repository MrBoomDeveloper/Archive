const firebaseConfig = {
	apiKey: "AIzaSyDJX6dqoObFPFs5069Cg9-KYfHMAA8SLm4",
	authDomain: "mrboomdev-site.firebaseapp.com",
	projectId: "mrboomdev-site",
	storageBucket: "mrboomdev-site.appspot.com",
	messagingSenderId: "1042598609424",
	appId: "1:1042598609424:web:0d6ea34900a3a5d56ac095",
	measurementId: "G-YJBTQVG69J"
};
firebase.initializeApp(firebaseConfig);

window.addEventListener('scroll', function() {
	if(pageYOffset > 50) {
		document.getElementById("header").className = "header-active";
	} else {
		document.getElementById("header").className = "";
	}
});

firebase.auth().onAuthStateChanged((user) => {
	headerItemsExist = document.getElementById("profile");
	if (user) {
		if(headerItemsExist) {
			document.getElementById("auth").remove();
		}
	} else {
		if(headerItemsExist) {
			document.getElementById("profile").remove();
		}
	}
});

function auth(create) {
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	if (email !== "" && password !== "") {
		if(create === "new") {
			firebase.auth().createUserWithEmailAndPassword(email, password)
  			.then((userCredential) => {
				window.location.href = "profile.html";
  			})
  			.catch((error) => {
    			var errorCode = error.code;
    			var errorMessage = error.message;
				alert(errorMessage);
  			});
		} else {
			firebase.auth().signInWithEmailAndPassword(email, password)
  			.then((userCredential) => {
				window.location.href = "profile.html"; 
  			})
  			.catch((error) => {
    			errorCode = error.code;
    			errorMessage = error.message;
				alert(errorMessage);
			});
		}	
	} else {
		alert("Пожалуйста, заполните все поля");
	}
}

function logOut() {
	firebase.auth().signOut().then(() => {
		window.location.href = "index.html";
	}).catch((error) => {
		alert(error);
	});
}

//Выживи до 6 утра в безумной пиццерии в роли охраника или успей его убить, играя за аниматроника.
//Предоставляет самые быстрые инструменты для создания приложений на всех типах устройств Android.
//Большой каталог аниме со множества сайтов. Удобный интерфейс и отсутствие какой либо рекламы.
//В свободное время создаю игры и приложения для мобильных устройств на операционной системе Android без использования пк.<br>
//Изучаю языки программирования Java и JavaScript. Могу вам создать на заказ приложение.<br>
//Есть опыт в создании: мобильных платформеров, новостных блогов, мобильных клиентов веб-приложений. Начал свою деятельность в 8 лет.
//Также ты можешь пообщаться с другими членами сервера.
//<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase.js"></script>
//<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
//<script src="script.js"></script>