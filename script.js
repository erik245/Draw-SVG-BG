let width, height;
function drawCanvas(cls, width, height) {
	let canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	let ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#000";
	canvas.style.background = "#abc"
	ctx.lineWidth = 1;
	let sx, sy, ex, ey;
	let svg;
	let parser = new DOMParser();
	if (cls == 1) {
		sx = 170;
		sy = 210;
		ex = 1550;
		ey = 1000;
		svg = parser.parseFromString(xml1, "text/xml");
	} else if (cls == 2) {
		sx = 1000;
		sy = 500;
		ex = 2500;
		ey = 2000;
		svg = parser.parseFromString(xml2, "text/xml");
	} else if (cls == 3) {
		sx = 0;
		sy = 0;
		ex = 830;
		ey = 560;
		svg = parser.parseFromString(xml3, "text/xml");
	} else if (cls == 4) {
		sx = 400;
		sy = 400;
		ex = 1800;
		ey = 1100;
		svg = parser.parseFromString(xml4, "text/xml");
	} else if (cls == 5) {
		for (let x = 0; x <= width; x += 50) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
		}
		for (let y = 0; y <= height; y += 50) {
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
		}
		ctx.stroke();
		return;
	}
	let rat = width * (ey - sy) / height / (ex - sx);
	if (rat > 1) {
		let temp = (ey - sy) * (1 - 1 / rat) * 0.5;
		sy += temp;
		ey -= temp;
	} else {
		let temp = (ex - sx) * (1 - rat) * 0.5;
		sx += temp;
		ex -= temp;
	}
	let paths = svg.getElementsByTagName("path");

	let upper = false, axis = "x", a_i = -1;
	function convNum(num) {
		let ret = 0;
		if (a_i >= 0) {
			if (a_i  == 0) {
				ret = Number(num) * width / (ex - sx);
			} else if (a_i == 1) {
				ret = Number(num) * height / (ey - sy);
			} else if (a_i <= 4) {
				ret = Number(num);
			} else if (a_i == 5) {
				if (upper) {
					ret = (Number(num) - sx) * width / (ex - sx);
				} else {
					ret = Number(num) * width / (ex - sx);
				}
			} else {
				if (upper) {
					ret = (Number(num) - sy) * height / (ey - sy);
				} else {
					ret = Number(num) * height / (ey - sy);
				}
				a_i = -2;
			}
			a_i ++;
		} else if (axis == "x") {
			if (upper) {
				ret = (Number(num) - sx) * width / (ex - sx);
			} else {
				ret = Number(num) * width / (ex - sx);
			}
			axis = "y"
		} else {
			if (upper) {
				ret = (Number(num) - sy) * height / (ey - sy);
			} else {
				ret = Number(num) * height / (ey - sy);
			}
			axis = "x"
		}
		return Math.round(ret * 100) * 0.01;
	}
	for (let i = 0; i < paths.length; i++) {
		let d = paths[i].getAttribute("d");
		let d1 = "";
		let number = "";
		for (let c in d) {
			if (d[c] >= "0" && d[c] <= "9" || d[c] == "." && number.indexOf(".") < 0) {
				number += d[c];
			} else if (d[c] == "-") {
				if (number != "") {
					d1 += convNum(number);
				}
				number = "-";
			} else if (d[c] == ".") {
				if (number != "") {
					d1 += convNum(number);
				}
				number = ".";
				d1 += " ";
			} else {
				if (number != "") {
					d1 += convNum(number);
				}
				d1 += d[c];
				number = "";
				if (d[c] >= "A" && d[c] <= "Z") {
					axis = "x";
					if (d[c] == "A") {
						a_i = 0;
					} else {
						a_i = -1;
					}
					upper = true;
				} else if (d[c] >= "a" && d[c] <= "z") {
					axis = "x";
					if (d[c] == "a") {
						a_i = 0;
					} else {
						a_i = -1;
					}
					upper = false;
				}
			}
		}
		if (number != "") {
			d1 += convNum(number);
		}
		let p2d1 = new Path2D(d1);
		ctx.stroke(p2d1);
	}
}

width = window.innerWidth - 20;
height = window.innerHeight - 20;
let cls = 5;
drawCanvas(cls, width, height);

document.body.onresize = () => {
	width = window.innerWidth - 20;
	height = window.innerHeight - 20;
	drawCanvas(cls, width, height);
}

document.body.onclick = () => {
	cls ++;
	if (cls > 5) {
		cls = 1;
	}
	drawCanvas(cls, width, height);
}