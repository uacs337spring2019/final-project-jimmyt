/*Student: Jimmy Toler
  Homework #11 final project
  Class: CSc 337
  Term: Spring 2019
  Assignment description: this is the final project for csc 337,
  this program sells tickets to different locations, it also has the capability of
	creating new routes. this uses a graph to calculate the distance of the origin
	to the destination using a weighed graph.
*/
(function() {
	"use strict";
	//each node destination, price, time
	var phoenix = [["Tucson",15,120]];
	var tucson = [["Phoenix",15,120],["Yuma",20,180]]
	var yuma = [["Tucson",20,180]];
	var nodes = [["Tucson",tucson],["Phoenix", phoenix],["Yuma",yuma]];
	var visited = [];
	var origin;
	var destination;
	var time;
	var price;
	var originSel;
	var destinationSel;
	var prevtotal = 0;
	var prevtotalLength= 0;
	var currRoute =[];
	window.onload = function() {

		document.getElementById("loginScreen").style.display = "none";
		document.getElementById("adminScreen").style.display = "block";
		document.getElementById("routeScreen").style.display = "none";
		document.getElementById("sellMenu").style.display = "none";
		document.getElementById("enter").onclick = enterPage;
		document.getElementById("createRoute").onclick = createRoute;
		document.getElementById("cRoute").onclick =addRoutes;
		document.getElementById("press").onclick = enterPage;
		document.getElementById("Sell").onclick = sellTicket;
		document.getElementById("preview").onclick = preview;
	};
	function preview(){
		let selo = document.getElementById("sellOrigin");
		originSel = selo.options[selo.selectedIndex].value;
		let seld = document.getElementById("sellDestination");
		destinationSel = seld.options[seld.selectedIndex].value;
		currRoute = [];
		findRoute(originSel, destinationSel, 0);
		visited = [];
		findRouteLength(originSel, destinationSel, 0);
		visited = [];
		document.getElementById("ticket").innerHTML = "Total amount $"+ prevtotal+ "<br/> length: "+ prevtotalLength+" minutes";
		document.getElementById("ticket").innerHTML += "<br/>Route:<br/>";
		let i = 0;
		for (i = 0; i<currRoute.length; i++){
			document.getElementById("ticket").innerHTML += currRoute[i]+"<br/>";
		}
	}
	function sellTicket(){
		document.getElementById("adminScreen").style.display = "none";
		document.getElementById("adminScreen").style.display = "none";
		document.getElementById("nodes").innerHTML = "";
		document.getElementById("adminScreen").style.display = "none";
		document.getElementById("sellMenu").style.display = "block";
		document.getElementById("sellDestination").innerHTML = "";
		document.getElementById("sellOrigin").innerHTML = "";
		let i = 0;
		let len = nodes.length;
		for (i = 0; i<len; i++){
			let curr = document.createElement("option");
			curr.value = nodes[i][0];
			curr.innerHTML = nodes[i][0];
			document.getElementById("sellDestination").appendChild(curr);
		}
		len = nodes.length;
		for (i = 0; i<len; i++){
			let curr = document.createElement("option");
			curr.value = nodes[i][0];
			curr.innerHTML = nodes[i][0];
			document.getElementById("sellOrigin").appendChild(curr);
		}
	}
	function enterPage(){
		document.getElementById("sellMenu").style.display = "none";
		document.getElementById("adminScreen").style.display = "block";
		document.getElementById("routeScreen").style.display = "none";
		document.getElementById("loginScreen").style.display = "none";
		let user = document.getElementById("user").value;
		let password = document.getElementById("password").value;
		if (user == "admin" && password == "admin"){
			adminLogin();
		}
	}
	function adminLogin(){
		document.getElementById("adminScreen").style.display = "block";
		document.getElementById("loginScreen").style.display = "none";
	}

	function createRoute(){
		document.getElementById("adminScreen").style.display = "none";
		document.getElementById("routeScreen").style.display = "block";
		document.getElementById("nodes").innerHTML = "";
		let i = 0;
		let len = nodes.length;
		for (i = 0; i<len; i++){
			let curr = document.createElement("option");
			curr.value = nodes[i][0];
			curr.innerHTML = nodes[i][0];
			document.getElementById("nodes").appendChild(curr);
		}
	}
	function addRoutes(){
		let sel = document.getElementById("nodes");
		origin = sel.options[sel.selectedIndex].value;
		destination = document.getElementById("destination").value;
		price = parseInt(document.getElementById("price").value);
		time = parseInt(document.getElementById("time").value);
		addRoute(destination, origin, price, time);
		addRoute(origin, destination, price, time);
		createRoute();
		const jsonMessage = {name: parseNode(nodes)};
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},

			body : JSON.stringify(jsonMessage)
		};

		let url = "http://localhost:process.env.PORT";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				console.log(responseText);
			})
			.catch(function(error) {
				console.log(error);
			});
	}
	function addRoute(Destination, Origin, Price, Time){
		let found = false;
		let i = 0;
		let len = nodes.length;
		var newDestination = [];
		for (i = 0; i<len; i++){
			if (nodes[i][0] == Origin){
				newDestination = nodes[i][1];
				newDestination.push([Destination,Price, Time]);
				found = true;
				break
			}
		}
		if (found == false){
			newDestination.push([Destination,Price, Time]);
			nodes.push([Origin,newDestination]);
			}
	}
	function findRoute(curr, destination, total){
		if (!visitednode(curr)){
			currRoute.push(curr);
		}
		visited.push(curr);
		if (curr == destination){
			prevtotal = total;
			return total;
		}
		let len = nodes.length;
		let i = 0;
		let j = 0;
		var neighboors = [];
		for (i = 0; i<len; i++){
			if (nodes[i][0]== curr){
				neighboors = nodes[i][1];
				break;
			}
		}
		for (j = 0; j<neighboors.length; j++){
			if (neighboors[j][0]== destination){
				return findRoute(neighboors[j][0], destination, total+neighboors[j][1]);
			}
		}
		for (j = 0; j<neighboors.length; j++){
			var visitedroute = visitednode(neighboors[j][0]);
			if (visitedroute == false){
					return findRoute(neighboors[j][0], destination, total+neighboors[j][1]);
				}
			}
		currRoute.pop();
		return 0;
	}
	function findRouteLength(curr, destination, total){
		visited.push(curr);
		if (curr == destination){
			prevtotalLength = total;
			return total;
		}
		let len = nodes.length;
		let i = 0;
		let j = 0;
		var neighboors = [];
		for (i = 0; i<len; i++){
			if (nodes[i][0]== curr){
				neighboors = nodes[i][1];
				break;
			}
		}
		for (j = 0; j<neighboors.length; j++){
			if (neighboors[j][0]== destination){
				return findRouteLength(neighboors[j][0], destination, total+neighboors[j][2]);
			}
		}
		for (j = 0; j<neighboors.length; j++){
			var visitedroute = visitednode(neighboors[j][0]);
			if (visitedroute == false){
				if (findRouteLength(neighboors[j][0], destination, total+(neighboors[j][2])) == 0){
					continue;
				}
			}
		}
		return 0;
	}

	function visitednode(place){
		let i = 0;
		for (i = 0; i<visited.length; i++){
			if (place == visited[i]){
				return true;
			}
		}
		return false;
	}
	function checkStatus(response) {
				if (response.status >= 200 && response.status < 300) {
						return response.text();
				} else {
						return Promise.reject(new Error(response.status+": "+response.statusText));
				}
		}
		function parseNode(arr){
  		var rv = {};
  		for (var i = 0; i < arr.length; ++i)
    		rv[i] = arr[i];
  		return rv;
		}

}) ();
