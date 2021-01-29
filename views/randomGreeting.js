//Created a module that generates a random greeting that will be displayed on the home page//

var greetingArray = ["Hello!", "Bonjour!", "Hola!", "Guten Tag!", "Nin Hao!", "Konnichiwa!", "Anyoung Haseyo!" ];
var randNum = Math.floor(Math.random()*greetingArray.length);

export default function greeting() {
	return greetingArray[randNum];
}
