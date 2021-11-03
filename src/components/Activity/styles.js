export const styles = {

progress: {
	backgroundColor: "#343a40",
	borderRadius: 20,
	position: "relative",
	margin: 15,
	height: 30,
	width: "auto"
},

progressDone: {
	background: "linear-gradient(to left, #F2709C, #FF9472)",
	//	background: "linear-gradient(to left,#11A720, #FFC933, #FB590E, #D10000)",
	borderRadius: 20,
	color: "#fff",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	width: 0,
	opacity: 0,
	transition: "1s ease 0.3s"
},
noProgress: {
	color: "#fff",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100%"
}

}