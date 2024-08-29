var apiKey = "dc6b9565a0a688f13ac739a2e48d1b8d15ced2b9af90ff48";
var markers = [
  [10.801092673522257, 106.65753613061281],
  [10.792332294466744, 106.68106827635671],
  [10.779197282950259, 106.67892479671319],
  [10.775086207320971, 106.64820158848937],
];

var map = L.map("map").setView([10.779197282950259, 106.67892479671319], 14);
//add tile map layer
L.tileLayer(
  `https://maps.vietmap.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=${apiKey}`,
  {
    maxZoom: 19,
  }
).addTo(map);

//add markers
markers.map((marker) => {
  L.marker(marker).addTo(map);
});
//add route
this.route();
async function route() {
  var points = "";
  markers.map((marker) => {
    points += `point=${marker[0]},${marker[1]}&`;
  });
  var url = `https://maps.vietmap.vn/api/route?api-version=1.1&apikey=${apiKey}&${points}vehicle=car`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    addPolyline(json.paths[0]);
  } catch (error) {
    console.error(error.message);
  }
}
function addPolyline(data) {
  //draw polyline
  var polyline = L.Polyline.fromEncoded(data.points, {
    color: "#1168bf",
    weight: 6,
  }).addTo(map);
  console.log(polyline);
  //show info
  const instructions = data.instructions;
  convertData(instructions);
  console.log(instructions);
  
  var ul = document.getElementById("detail");
  instructions.map((step) => {
    const li = document.createElement("li");
    const strong = document.createElement('strong')
    const p = document.createElement('p')
    const img = document.createElement("img");
    const div = document.createElement("div");

    div.classList.add('flex-column');
    strong.textContent = step.text;
    p.textContent = step.distance +' ' +step.distancelabel;
    div.appendChild(strong)
    div.appendChild(p);
    img.src = step.icon;
    // Gán nội dung cho li
    li.appendChild(img)
    
    li.appendChild(div)
    // Thêm li vào ul
    ul.appendChild(li);
  });
  console.log(data);
}
function convertData(instructions) {
  var typeDirections = this.typeIcon();
    /*   if (res.distance >= 1000) {
        this.totalDistance.value = Number((res.distance / 1000).toFixed(2));
        this.totalDistance.label = "km";
    } else {
        this.totalDistance.value = Math.ceil(res.distance);
        this.totalDistance.label = "m";
    }
    this.totalTime = this.secondsToHms(res.time); */
  for (let instruction of instructions) {
    if (instruction.distance > 1000) {
      instruction.distance = (instruction.distance / 1000).toFixed(2);
      instruction.distancelabel = "km";
    } else {
      instruction.distance = Math.ceil(instruction.distance);
      instruction.distancelabel = "m";
    }
    for (let typeDirection of typeDirections) {
      if (instruction.sign == typeDirection.value) {
        instruction.icon = typeDirection.icon;
      }
    }
  }
}

function typeIcon() {
  return [
    {
      value: -98,
      des: "an U-turn without the knowledge if it is a right or left U-turn",
      vn: "Quay đầu xe",
      icon: "img/u_turn.png",
    },
    {
      value: -8,
      des: "a left U-turn",
      vn: "Rẽ trái",
      icon: "img/u_turn_left.png",
    },
    {
      value: -7,
      des: "keep left",
      vn: "Tiếp tục bên trái",
      icon: "img/keep_left.png",
    },
    {
      value: -6,
      des: "not yet used: leave roundabout",
      vn: "Rời khỏi bùng binh",
      icon: "img/continue.png",
    },
    {
      value: -3,
      des: "turn sharp left",
      vn: "Rẽ trái",
      icon: "img/sharp_left.png",
    },
    {
      value: -2,
      des: "turn left",
      vn: "Rẽ trái",
      icon: "img/left.png",
    },
    {
      value: -1,
      des: "turn slight left",
      vn: "Rẽ trái",
      icon: "img/slight_left.png",
    },
    {
      value: 0,
      des: "continue on street",
      vn: "Tiếp tục",
      icon: "img/continue.png",
    },
    {
      value: 1,
      des: "turn slight righ",
      vn: "Rẽ phải",
      icon: "img/slight_right.png",
    },
    {
      value: 2,
      des: "turn right",
      vn: "Rẽ phải",
      icon: "img/right.png",
    },
    {
      value: 3,
      des: "turn sharp right",
      vn: "Rẽ phải",
      icon: "img/sharp_right.png",
    },
    {
      value: 4,
      des: "the finish instruction before the last point",
      vn: "Hướng dẫn kết thúc trước điểm cuối cùng",
      icon: "img/finish.png",
    },
    {
      value: 5,
      des: "the instruction before a via point",
      vn: "Hướng dẫn trước một điểm qua",
      icon: "img/continue.png",
    },
    {
      value: 6,
      des: "the instruction before entering a roundabout",
      vn: "Hướng dẫn trước khi vào bùng binh",
      icon: "img/continue.png",
    },
    {
      value: 7,
      des: "keep right",
      vn: "Tiếp tục bên phải",
      icon: "img/right.png",
    },
    {
      value: 8,
      des: "a right U-turn",
      vn: "Rẽ phải",
      icon: "img/u_turn_right.png",
    },
  ];
}
